/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { job } from 'src/drizzle/schema';
import { db } from '../../drizzle/db';
import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { logger } from 'src/server';
import { Job, JobSchema, JobPatchSchema, createJobSchema } from './jobModel';
import { z, ZodError } from 'zod';

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(500).json({ message: 'Job ID is required' });
    }

    const foundJob = await db.query.job.findFirst({
      where: eq(job.id, id),
    });

    if (!foundJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json(foundJob);
  } catch (error) {
    logger.error('Error fetching job', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    });
  }
};

export const deleteJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(500).json({ message: 'Job ID is required' });
    }

    const result = await db.delete(job).where(eq(job.id, id));
    if (result === undefined || result.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(204).json(result);
  } catch (error) {
    logger.error('Error deleting job', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: (error as Error).message,
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    if (!z.string().uuid().safeParse(jobId).success) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const jobData = JobSchema.parse(req.body);

    const updatedJob = await db
      .update(job)
      .set({
        ...jobData,
        updatedAt: new Date(),
      })
      .where(eq(job.id, jobId))
      .returning();

    if (updatedJob.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(updatedJob[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ error: 'Validation exception', msg: error.errors });
    } else {
      logger.error('Error updating job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const patchJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;

    if (!z.string().uuid().safeParse(jobId).success) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const jobPatchData = JobPatchSchema.parse(req.body);

    const existingJob = await db.select().from(job).where(eq(job.id, jobId));

    if (existingJob.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const updatedJobData = { ...jobPatchData, updatedAt: new Date() };

    const updatedJob = await db.update(job).set(updatedJobData).where(eq(job.id, jobId)).returning();

    res.status(200).json(updatedJob[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(422).json({ error: 'Validation exception', msg: error.errors });
    } else {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// export const getAllJobs = async (req: Request, res: Response) => {
//   try {
//     const { categoryId, levelId, companyName, popular } = req.query;

//     let query: PgSelect = db.select().from(job);
//     const conditions: SQL[] = [];

//     if (categoryId) {
//       conditions.push(eq(job.categoryId, categoryId as string));
//     }

//     if (levelId) {
//       conditions.push(eq(job.levelId, levelId as string));
//     }

//     if (companyName) {
//       conditions.push(eq(job.companyId,company.id));
//     }

//     if (conditions.length > 0) {
//       query = query.where(and(...conditions));
//     }

//     const jobResults = await query;

//     if (jobResults.length === 0) {
//       return res.status(404).json({ message: 'No jobs found' });
//     }

//     res.status(200).json(jobResults);
//   } catch (error) {}
// };

export const submitJobForApproval = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const jobData = createJobSchema.safeParse(req.body);

    if (!jobData.success) {
      return res.status(422).json({
        message: 'Validation error',
        errors: jobData.error.errors,
      });
    }
    const newJob = await db
      .insert(job)
      .values({
        title: jobData.data.title,
        levelId: jobData.data.level_id,
        categoryId: jobData.data.category_id,
        typeId: jobData.data.type_id,
        location: jobData.data.location,
        description: jobData.data.description,
        compensation: jobData.data.compensation,
        applicationLink: jobData.data.application_link,
        isExternal: jobData.data.is_external,
        companyId: jobData.data.company_id,
        tags: jobData.data.tags,
        isApproved: false,
      })
      .returning();

    res.status(202).json({
      message: 'Job submitted for approval',
      jobId: newJob[0].id,
    });
  } catch (error) {
    logger.error('Error submitting job for approval:', error);
    res.status(400).json({ message: 'Invalid input' });
  }
};

export const approveJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    if (!jobId) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const result = await db.update(job).set({ isApproved: true }).where(eq(job.id, jobId)).returning({ id: job.id });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job approved successfully',
      jobId: result[0].id,
    });
  } catch (error) {
    logger.error('Error approving job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const rejectedJob = await db.delete(job).where(eq(job.id, jobId)).returning();
    if (rejectedJob.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job rejected successfully', jobId: rejectedJob[0] });
  } catch (error) {
    logger.error('Error rejecting job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
