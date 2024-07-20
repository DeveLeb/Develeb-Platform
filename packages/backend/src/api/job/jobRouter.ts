import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { GetCategorySchema, GetJobSchema, GetJobViews, JobCategorySchema, JobSchema } from './jobModel';
import { jobService } from './jobService';

export const jobRegistry = new OpenAPIRegistry();

jobRegistry.register('Job', JobSchema);

export const jobRouter: Router = (() => {
  const router = express.Router();

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs',
    tags: ['Job'],
    responses: createApiResponse(z.array(JobSchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const { pageIndex, pageSize, categoryId, levelId, companyName } = req.query;
    const serviceResponse = await jobService.findJobs({
      pageIndex: pageIndex as string,
      pageSize: pageSize as string,
      categoryId: categoryId as string,
      levelId: levelId as string,
      companyName: companyName as string,
    });
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{jobId}/save/{userId}',
    tags: ['Job'],
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:jobId/save/:userId', async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { jobId, userId } = req.params;
    const serviceResponse = await jobService.saveJob(jobId, userId);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: 'jobs/category',
    tags: ['Job'],
    responses: createApiResponse(z.array(JobCategorySchema), 'Success'),
  });

  router.get('/category', async (_req: Request, res: Response) => {
    const serviceResponse = await jobService.findCategories();
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const title = req.body.title;
    const serviceResponse = await jobService.createJobCategory(title);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/category/{categoryId}',
    tags: ['Job'],
    request: { params: GetCategorySchema.shape.params },
    responses: createApiResponse(JobCategorySchema, 'Success'),
  });

  router.get('/category/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryId = parseInt(id, 10);
    const serviceResponse = await jobService.findJobCategory(categoryId);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/category/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const categoryId = parseInt(id, 10);
    const title = req.body.title;
    const serviceResponse = await jobService.updateJobCategory(categoryId, title);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/category/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const categoryId = parseInt(id, 10);
    const serviceResponse = await jobService.deleteJobCategory(categoryId);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/level',
    tags: ['Job'],
    responses: createApiResponse(z.array(JobCategorySchema), 'Success'),
  });

  router.post('/level', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const title = req.body.title;
    const serviceResponse = await jobService.createJobLevel(title);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/level/{levelId}',
    tags: ['Job'],
    request: { params: GetCategorySchema.shape.params },
    responses: createApiResponse(JobCategorySchema, 'Success'),
  });

  router.get('/level/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const levelId = parseInt(id, 10);
    const serviceResponse = await jobService.findJoblevel(levelId);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/level/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const levelId = parseInt(id, 10);
    const title = req.body.title;
    const serviceResponse = await jobService.updateJobLevel(levelId, title);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/level/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const levelId = parseInt(id, 10);
    const serviceResponse = await jobService.deleteJobLevel(levelId);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/{id}/views',
    tags: ['Job'],
    responses: createApiResponse(GetJobViews, 'Success'),
  });

  router.get(':id/views', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const serviceResponse = await jobService.findJobTotalViews(id);
    handleServiceResponse(serviceResponse, res);
  });
  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/{id}',
    tags: ['Job'],
    request: { params: GetJobSchema.shape.params },
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await jobService.findJobById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await jobService.deleteJobById(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/:id', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const {
      title,
      levelId,
      categoryId,
      typeId,
      location,
      description,
      compensation,
      applicationLink,
      isExternal,
      companyId,
      tags,
      isApproved,
    } = req.body;
    const serviceResponse = await jobService.updateJob(
      id,
      title,
      levelId,
      categoryId,
      typeId,
      location,
      description,
      compensation,
      applicationLink,
      isExternal,
      companyId,
      tags,
      isApproved
    );
    handleServiceResponse(serviceResponse, res);
  });
  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{id}/approve',
    tags: ['Job'],
    request: { params: GetJobSchema.shape.params },
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:id/approve', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const serviceResponse = await jobService.approveJob(id);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{id}/reject',
    tags: ['Job'],
    request: { params: GetJobSchema.shape.params },
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:id/reject', async (req: Request, res: Response) => {
    if (req.user?.role.toLowerCase() !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const serviceResponse = await jobService.rejectJob(id);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
