import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseStatus, ServiceResponse } from 'src/common/models/serviceResponse';
import { z, ZodError } from 'zod';

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '../../common/utils/httpHandlers';
import { EventSchema, RegistrationSchema, SaveEventSchema } from '../event/eventModel';
import { eventService } from '../event/eventService';
import {
  CreateEventSchema,
  GetAllEventSchema,
  GetEventRequest,
  GetEventSchema,
  GetRegistrationSchema,
  RegisterEventSchema,
  SaveEventRequestSchema,
  UpdateEventSchema,
} from './eventRequest';

export const eventRegistry = new OpenAPIRegistry();

eventRegistry.register('Event', EventSchema);
eventRegistry.register('UserEventRegistration', RegistrationSchema);

export const eventRouter: Router = (() => {
  const router = express.Router();

  eventRegistry.registerPath({
    method: 'get',
    path: '/events',
    tags: ['Event'],
    responses: createApiResponse(z.array(EventSchema), 'Success'),
  });

  router.get('/', validateRequest(GetAllEventSchema), async (req: Request, res: Response) => {
    const { pageIndex, pageSize, typeId, title } = req.query as unknown as GetEventRequest;
    const serviceResponse = await eventService.findAll({
      pageIndex,
      pageSize,
      typeId,
      title,
    });
    handleServiceResponse(serviceResponse, res);
  });

  eventRegistry.registerPath({
    method: 'get',
    path: '/events/{id}',
    tags: ['Event'],
    responses: createApiResponse(z.array(EventSchema), 'Success'),
  });

  router.get('/:id', validateRequest(GetEventSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await eventService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  eventRegistry.registerPath({
    method: 'post',
    path: '/events',
    tags: ['Event'],
    request: {
      params: CreateEventSchema,
    },
    responses: createApiResponse(EventSchema, 'Success'),
  });

  router.post('/', validateRequest(CreateEventSchema), async (req: Request, res: Response) => {
    try {
      const parsedEvent = req.body;
      const serviceResponse = await eventService.create(parsedEvent);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      if (error instanceof ZodError) {
        const err = new ServiceResponse(ResponseStatus.Failed, error.message, null, StatusCodes.BAD_REQUEST);
        return handleServiceResponse(err, res);
      }
    }
  });

  eventRegistry.registerPath({
    method: 'put',
    path: '/events/{id}',
    tags: ['Event'],
    request: {
      params: CreateEventSchema,
    },
    responses: createApiResponse(EventSchema, 'Success'),
  });

  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const parsedEvent = UpdateEventSchema.parse(req);
      const serviceResponse = await eventService.update(id, parsedEvent);
      handleServiceResponse(serviceResponse, res);
    } catch (error) {
      if (error instanceof ZodError) {
        const err = new ServiceResponse(ResponseStatus.Failed, error.message, null, StatusCodes.BAD_REQUEST);
        return handleServiceResponse(err, res);
      }
    }
  });

  eventRegistry.registerPath({
    method: 'delete',
    path: '/events/{id}',
    tags: ['Event'],
    responses: createApiResponse(z.object({}), 'Success'),
  });

  router.delete('/:id', validateRequest(GetEventSchema), async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await eventService.delete(id);
    handleServiceResponse(serviceResponse, res);
  });

  eventRegistry.registerPath({
    method: 'get',
    path: '/events/{eventId}/registrations',
    tags: ['Event'],
    responses: createApiResponse(z.array(EventSchema), 'Success'),
  });

  router.get('/:eventId/registrations', validateRequest(GetRegistrationSchema), async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const serviceResponse = await eventService.getRegistrations(eventId);
    handleServiceResponse(serviceResponse, res);
  });

  eventRegistry.registerPath({
    method: 'post',
    path: '/events/{eventId}/register/{userId}',
    tags: ['Event'],
    responses: createApiResponse(z.array(RegistrationSchema), 'Success'),
  });

  router.post(
    '/:eventId/register/:userId',
    validateRequest(RegisterEventSchema),
    async (req: Request, res: Response) => {
      const eventId = req.params.eventId;
      const userId = req.params.userId;
      const userType = req.body.userType || 'Attendee';
      const serviceResponse = await eventService.newRegisteration(eventId, userId, userType);
      handleServiceResponse(serviceResponse, res);
    }
  );

  eventRegistry.registerPath({
    method: 'post',
    path: '/events/{eventId}/save/{userId}',
    tags: ['Event'],
    request: {
      params: SaveEventSchema,
    },
    responses: createApiResponse(SaveEventSchema, 'Success'),
  });

  router.post(
    '/:eventId/save/:userId',
    validateRequest(SaveEventRequestSchema),
    async (req: Request, res: Response) => {
      const eventId = req.params.eventId;
      const userId = req.params.userId;
      const serviceResponse = await eventService.saveEvent(eventId, userId);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
