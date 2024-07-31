import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { CreateEventRequest, Event, UpdateEventRequest } from './eventModel';
import { eventRepository } from './eventRepository';

export const eventService = {
  findAll: async (filters: {
    pageIndex: number;
    pageSize: number;
    typeId?: number;
    title?: string;
  }): Promise<ServiceResponse<Event[] | null>> => {
    logger.info('Finding all events with filters:', JSON.stringify(filters));
    const { pageIndex, pageSize, typeId, title } = filters;
    const offset = (pageIndex - 1) * pageSize;
    try {
      const { events, totalCount } = await eventRepository.findAllAsync({
        limit: pageSize,
        offset,
        typeId,
        title,
      });
      if (events.length === 0) {
        logger.info('No events found');
        return new ServiceResponse(ResponseStatus.Failed, 'No Events found', null, StatusCodes.NOT_FOUND);
      }
      const totalPages = Math.ceil(totalCount / pageSize);
      const paginationInfo = {
        currentPage: pageIndex,
        pageSize,
        totalCount,
        totalPages,
      };

      const successMessage = `Events fetched successfully. Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;
      logger.info(successMessage);
      return new ServiceResponse<Event[]>(ResponseStatus.Success, successMessage, events, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding events: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<Event | null>> => {
    try {
      logger.info(`Finding event with id ${id}`);
      const event = await eventRepository.findByIdAsync(id);
      if (!event) {
        logger.info(`Event not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Event found with id ${id}`);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event found', event, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding event with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (event: CreateEventRequest): Promise<ServiceResponse<Event | null>> => {
    logger.info('Creating event with data:', JSON.stringify(event));
    if (!event) {
      return new ServiceResponse(ResponseStatus.Failed, 'Event not provided', null, StatusCodes.BAD_REQUEST);
    }
    try {
      const newEvent = await eventRepository.createAsync(event);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event created', newEvent, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  update: async (id: string, event: UpdateEventRequest): Promise<ServiceResponse<Event | null>> => {
    if (!event) {
      return new ServiceResponse(ResponseStatus.Failed, 'Event not provided', null, StatusCodes.BAD_REQUEST);
    }
    try {
      const updatedEvent = await eventRepository.updateAsync(id, event);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event updated', updatedEvent, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating event with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  delete: async (id: string): Promise<ServiceResponse<null>> => {
    try {
      await eventRepository.deleteAsync(id);
      return new ServiceResponse<null>(ResponseStatus.Success, 'Event deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting event with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  getRegistrations: async (eventId: string): Promise<ServiceResponse<any>> => {
    try {
      const registrations = await eventRepository.getRegistrationsAsync(eventId);
      return new ServiceResponse<any>(ResponseStatus.Success, 'Registrations found', registrations, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding registrations for event with id ${eventId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  newRegisteration: async (eventId: string, userId: string, userType: string): Promise<ServiceResponse<any>> => {
    try {
      const registrations = await eventRepository.newRegisterationAsync(eventId, userId, userType);
      return new ServiceResponse<any>(ResponseStatus.Success, 'Registered', registrations, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding registrations for event with id ${eventId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
