import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { JobSchema } from './jobModel';
import {
  CreateJobCategoryRequest,
  CreateJobCategorySchema,
  CreateJobLevelRequest,
  CreateJobLevelSchema,
  CreateJobRequest,
  CreateJobSchema,
  DeleteJobCategoryRequest,
  DeleteJobCategorySchema,
  GetJobCategoryRequest,
  GetJobCategorySchema,
  GetJobsRequest,
  GetJobsSchema,
  PutJobCategoryRequest,
  PutJobCategorySchema,
  PutJobRequest,
  PutJobSchema,
  UpdateJobLevelRequest,
  UpdateJobLevelSchema,
} from './jobRequest';
import { GetJobViewsSchema, JobCategorySchema, JobLevelSchema } from './jobResponse';
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

  router.get('/', validateRequest(GetJobsSchema), async (req: Request, res: Response) => {
    const { pageIndex, pageSize, categoryId, levelId, companyName } = req.query as unknown as GetJobsRequest;
    const serviceResponse = await jobService.findJobs({
      companyName: companyName,
      categoryId: categoryId,
      levelId: levelId,
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/', validateRequest(CreateJobSchema), async (req: Request, res: Response) => {
    const createJobRequest = req.body as unknown as CreateJobRequest;
    const serviceResponse = await jobService.submitJobForApproval(createJobRequest, true);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{jobId}/save/{userId}',
    tags: ['Job'],
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:jobId/save/:userId', async (req: Request, res: Response) => {
    // TODO: implement auth
    const { jobId, userId } = req.params;
    const serviceResponse = await jobService.saveJob(jobId, userId);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/category',
    tags: ['Job'],
    responses: createApiResponse(z.array(JobCategorySchema), 'Success'),
  });

  router.get('/category', async (_req: Request, res: Response) => {
    const serviceResponse = await jobService.findCategories();
    handleServiceResponse(serviceResponse, res);
  });

  router.post('/category', validateRequest(CreateJobCategorySchema), async (req: Request, res: Response) => {
    // TODO: user auth
    const { title } = req.body as unknown as CreateJobCategoryRequest;
    const serviceResponse = await jobService.createJobCategory(title);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/category/{categoryId}',
    tags: ['Job'],
    request: { params: GetJobCategorySchema.shape.params },
    responses: createApiResponse(JobCategorySchema, 'Success'),
  });

  router.get('/category/:id', validateRequest(GetJobCategorySchema), async (req: Request, res: Response) => {
    const { id } = req.params as unknown as GetJobCategoryRequest;
    const serviceResponse = await jobService.findJobCategory(id);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/category/:id', validateRequest(PutJobCategorySchema), async (req: Request, res: Response) => {
    // TODO: auth
    const { id } = req.params as unknown as PutJobCategoryRequest['params'];
    const { title } = req.body as unknown as PutJobCategoryRequest['body'];
    const serviceResponse = await jobService.updateJobCategory(id, title);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/category/:id', validateRequest(DeleteJobCategorySchema), async (req: Request, res: Response) => {
    // TODO: auth
    const { id } = req.params as unknown as DeleteJobCategoryRequest;
    const serviceResponse = await jobService.deleteJobCategory(id);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/level',
    tags: ['Job'],
    responses: createApiResponse(z.array(JobCategorySchema), 'Success'),
  });

  router.post('/level', validateRequest(CreateJobLevelSchema), async (req: Request, res: Response) => {
    const { title } = req.body as unknown as CreateJobLevelRequest;
    const serviceResponse = await jobService.createJobLevel(title);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/level',
    tags: ['Job'],
    responses: createApiResponse(JobLevelSchema, 'Success'),
  });

  router.get('/level', async (req: Request, res: Response) => {
    const serviceResponse = await jobService.findJoblevels();
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/level/{levelId}',
    tags: ['Job'],
    request: { params: GetJobCategorySchema.shape.params },
    responses: createApiResponse(JobCategorySchema, 'Success'),
  });

  router.get('/level/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const levelId = parseInt(id, 10);
    const serviceResponse = await jobService.findJoblevel(levelId);
    handleServiceResponse(serviceResponse, res);
  });

  router.put('/level/:id', validateRequest(UpdateJobLevelSchema), async (req: Request, res: Response) => {
    const { id } = req.params as unknown as UpdateJobLevelRequest['params'];
    const { title } = req.body as unknown as UpdateJobLevelRequest['body'];
    const serviceResponse = await jobService.updateJobLevel(id, title);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/level/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const levelId = parseInt(id, 10);
    const serviceResponse = await jobService.deleteJobLevel(levelId);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/{id}/views',
    tags: ['Job'],
    responses: createApiResponse(GetJobViewsSchema, 'Success'),
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

  router.put('/:id', validateRequest(PutJobSchema), async (req: Request, res: Response) => {
    const { id } = req.params;
    const putJobObject = req.body as unknown as PutJobRequest;
    const serviceResponse = await jobService.updateJob(id, putJobObject);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{id}/approve',
    tags: ['Job'],
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:id/approve', async (req: Request, res: Response) => {
    // if (req.user?.role.toLowerCase() !== 'admin') {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
    const { id } = req.params;
    const serviceResponse = await jobService.approveJob(id);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'post',
    path: '/jobs/{id}/reject',
    tags: ['Job'],
    responses: createApiResponse(JobSchema, 'Success'),
  });

  router.post('/:id/reject', async (req: Request, res: Response) => {
    // if (req.user?.role.toLowerCase() !== 'admin') {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
    const { id } = req.params;
    const serviceResponse = await jobService.rejectJob(id);
    handleServiceResponse(serviceResponse, res);
  });

  jobRegistry.registerPath({
    method: 'get',
    path: '/jobs/{userId}/saved/jobs',
    tags: ['Job'],
    responses: createApiResponse(JobSchema, 'Success'),
  });
  router.get('/:userId/saved/jobs', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const serviceResponse = await jobService.findSavedJobs(userId);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
