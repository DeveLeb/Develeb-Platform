import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { CreateEventSchema, Event, UpdateEventSchema } from './eventModel';
import { eventRepository } from './eventRepository';

export const eventService = {
  findAll: async (): Promise<ServiceResponse<Event[] | null>> => {
    try {
      logger.info('Finding all events');
      const events = await eventRepository.findAllAsync();
      if (!events) {
        logger.info('No events found');
        return new ServiceResponse(ResponseStatus.Failed, 'No Events found', null, StatusCodes.NOT_FOUND);
      }
      logger.info('Events found');
      return new ServiceResponse<Event[]>(ResponseStatus.Success, 'Events found', events, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all events: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  findById: async (id: string): Promise<ServiceResponse<Event | null>> => {
    try {
      logger.info(`Finding event with id ${id}`);
      const event = await eventRepository.findByIdAsync(id);
      if (!event) {
        logger.info(`Event with id ${id} not found`);
        return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Event with id ${id} found`);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event found', event, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding event with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  create: async (event: CreateEventSchema): Promise<ServiceResponse<Event | null>> => {
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
  update: async (id: string, event: UpdateEventSchema): Promise<ServiceResponse<Event | null>> => {
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
