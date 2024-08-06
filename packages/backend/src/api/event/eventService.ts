import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '../../common/models/serviceResponse';
import { logger } from '../../server';
import { Event } from './eventModel';
import { eventRepository } from './eventRepository';
import { CreateEventRequest, UpdateEventRequest } from './eventRequest';
import { RegisterationResponse } from './eventRespone';
// import { findByIdAsync } from '../user/userRepository'; // TODO: Uncomment this line when the findByIdAsync function is implemented

export const eventService = {
  findAll: async (filters: {
    pageIndex: number;
    pageSize: number;
    typeId?: number;
    title?: string;
  }): Promise<ServiceResponse<Event[] | null>> => {
    logger.info(`Finding all events with filters:, ${JSON.stringify(filters)}`);
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
      logger.info(`Event found`);
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
      logger.info(`Event created successfully with id:, ${newEvent.id}`);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event created', newEvent, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating event: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  update: async (id: string, updatedEventData: UpdateEventRequest): Promise<ServiceResponse<Event | null>> => {
    logger.info(`Updating event with id ${id}`);
    if (!updatedEventData) {
      logger.info('Event not provided');
      return new ServiceResponse(ResponseStatus.Failed, 'Event not provided', null, StatusCodes.BAD_REQUEST);
    }
    const event = await eventRepository.findByIdAsync(id);
    if (!event) {
      logger.info(`Event not found with id ${id}`);
      return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
    }
    try {
      logger.info(`Updating event with data: ${JSON.stringify(updatedEventData)}`);
      const updatedEvent = await eventRepository.updateAsync(id, updatedEventData);
      logger.info(`Event updated successfully with id ${id}`);
      return new ServiceResponse<Event>(ResponseStatus.Success, 'Event updated', updatedEvent, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error updating event with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  delete: async (id: string): Promise<ServiceResponse<null>> => {
    try {
      logger.info(`Deleting event with id ${id}`);
      const findEvent = await eventRepository.findByIdAsync(id);
      if (!findEvent) {
        logger.info(`Event not found with id ${id}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Event found: ${JSON.stringify}`);
      await eventRepository.deleteAsync(id);
      return new ServiceResponse(ResponseStatus.Success, 'Event deleted', null, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error deleting event with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  getRegistrations: async (eventId: string): Promise<ServiceResponse<RegisterationResponse[] | null>> => {
    logger.info(`Finding registrations for event with id ${eventId}`);
    try {
      const registrations = await eventRepository.getRegistrationsAsync(eventId);
      if (registrations.length === 0) {
        logger.info(`No registrations found for event with id ${eventId}`);
        return new ServiceResponse(ResponseStatus.Failed, 'No registrations found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Registrations found for event with id ${eventId}`);
      return new ServiceResponse<RegisterationResponse[]>(
        ResponseStatus.Success,
        'Registrations found',
        registrations,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error finding registrations for event with id ${eventId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  newRegisteration: async (
    eventId: string,
    userId: string,
    userType: string
  ): Promise<ServiceResponse<RegisterationResponse | null>> => {
    const registration = await eventRepository.getRegistrationByUserIdAndEventIdAsync(eventId, userId);
    if (registration) {
      logger.info(`User with id ${userId} already registered for event with id ${eventId}`);
      return new ServiceResponse(ResponseStatus.Failed, 'User already registered', null, StatusCodes.CONFLICT);
    }
    try {
      logger.info(`Registering user with id ${userId} for event with id ${eventId}`);
      const event = await eventRepository.findByIdAsync(eventId);
      if (!event) {
        logger.info(`Event not found with id ${eventId}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
      }
      logger.info(`Event found: ${JSON.stringify(event)}`);

      // TODO: Uncomment this code when the findByIdAsync function is implemented
      // const user = await findByIdAsync(userId);
      // if (!user) {
      //   logger.info(`User not found with id ${userId}`);
      //   return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
      // }
      const registrations = await eventRepository.newRegisterationAsync(eventId, userId, userType);
      logger.info(`User registered for event with id ${eventId}`);
      return new ServiceResponse<any>(ResponseStatus.Success, 'Registered', registrations, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error registering user with id ${userId} for event with id ${eventId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  saveEvent: async (eventId: string, userId: string): Promise<ServiceResponse<any>> => {
    logger.info(`Saving event with id ${eventId} as favorite for user with id ${userId}`);
    try {
      const event = await eventRepository.findByIdAsync(eventId);
      if (!event) {
        logger.info(`Event not found with id ${eventId}`);
        return new ServiceResponse(ResponseStatus.Failed, 'Event not found', null, StatusCodes.NOT_FOUND);
      }
      const savedEvent = await eventRepository.saveEventAsync(eventId, userId);
      logger.info(`Event saved as favorite for user with id ${userId}`);
      return new ServiceResponse<any>(ResponseStatus.Success, 'Event saved as favorite', savedEvent, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error saving event with id ${eventId}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};
