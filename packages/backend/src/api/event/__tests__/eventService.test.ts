import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { Event, EventSchema, Registration, RegistrationSchema } from '../eventModel';
import { eventRepository } from '../eventRepository';
import { eventService } from '../eventService';

vi.mock('src/api/event/eventRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('userService', () => {
  const mockEvents: Event[] = [
    {
      id: '81bf99f8-a052-4851-9f94-fe8329305308',
      title: 'Test Event1',
      description: 'Test Event1 Description',
      videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      flyerLink: 'https://www.google.com/',
      date: '2025-01-01T00:00:00Z',
      location: 'Beirut',
      speakerName: 'Linus Torvalds',
      speakerDescription: 'Creator of Linux',
      speakerProfileUrl: 'https://torvalds-family.blogspot.com/',
      typeId: 1,
      tags: 'Linux, Open Source',
      postedAt: '2024-08-06T17:29:38.379Z',
      createdAt: '2024-08-06T17:29:38.379Z',
      updatedAt: '2024-08-06T17:29:38.379Z',
    },
    {
      id: '81bf99f8-a052-4851-9f94-fe8329305309',
      title: 'Test Event2',
      description: 'Test Event2 Description',
      videoLink: 'https://www.youtube.com/watch?v=ll-mQPDCn-U',
      flyerLink: 'https://www.google.com/',
      date: '2025-01-01T00:00:00Z',
      location: 'Beirut',
      speakerName: 'Danny Devito',
      speakerDescription: 'Actor',
      speakerProfileUrl: 'https://www.imdb.com/name/nm0000362/',
      typeId: 1,
      tags: 'Actor, Comedian, Danny Devito',
      postedAt: '2024-08-06T17:29:38.379Z',
      createdAt: '2024-08-06T17:29:38.379Z',
      updatedAt: '2024-08-06T17:29:38.379Z',
    },
  ].map((event) => EventSchema.parse(event));
  const mockRegistrations: Registration[] = [
    {
      id: 1,
      eventId: '81bf99f8-a052-4851-9f94-fe8329305308',
      userId: '81bf99f8-a052-4851-9f94-fe8329305308',
      userType: 'Attendee',
    },
    {
      id: 2,
      eventId: '81bf99f8-a052-4851-9f94-fe8329305308',
      userId: '81bf99f8-a052-4851-9f94-fe8329305309',
      userType: 'Speaker',
    },
  ].map((registration) => RegistrationSchema.parse(registration));

  describe('findAll', () => {
    it('return all events', async () => {
      // Arrange
      (eventRepository.findAllAsync as Mock).mockReturnValue({
        events: mockEvents,
        totalCount: mockEvents.length,
      });

      // Act
      const result = await eventService.findAll({
        pageIndex: 1,
        pageSize: 10,
        typeId: undefined,
        title: undefined,
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Events fetched successfully. Page 1 of 1');
      expect(result.responseObject).toEqual(mockEvents);
    });

    it('returns a not found error for no users found', async () => {
      // Arrange
      (eventRepository.findAllAsync as Mock).mockReturnValue({
        events: [],
        totalCount: 0,
      });

      // Act
      const result = await eventService.findAll({
        pageIndex: 1,
        pageSize: 10,
        typeId: undefined,
        title: undefined,
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No Events found');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for findAllAsync', async () => {
      // Arrange
      (eventRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.findAll({
        pageIndex: 1,
        pageSize: 10,
        typeId: undefined,
        title: undefined,
      });

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding events: $Database error');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns a user for a valid ID', async () => {
      // Arrange
      const testId = '81bf99f8-a052-4851-9f94-fe8329305308';
      const mockEvent = mockEvents.find((event) => event.id === testId);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const result = await eventService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Event found');
      expect(result.responseObject).toEqual(mockEvent);
    });

    it('handles errors for findByIdAsync', async () => {
      // Arrange
      const testId = '81bf99f8-a052-4851-9f94-fe8329305308';
      (eventRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain(`Error finding event with id ${testId}`);
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const testId = '81bf99f8-a052-4851-9f94-fe8329305307';
      (eventRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await eventService.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Event not found');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('create', () => {
    it('creates an event', async () => {
      // Arrange
      const newEvent = {
        title: 'Test Event3',
        description: 'Test Event3 Description',
        videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        flyerLink: 'https://www.google.com/',
        date: '2025-01-01T00:00:00Z',
        location: 'Beirut',
        speakerName: 'Linus Torvalds',
        speakerDescription: 'Creator of Linux',
        speakerProfileUrl: 'https://torvalds-family.blogspot.com/',
        typeId: 1,
        tags: 'Linux, Open Source',
      };

      const createdEvent = EventSchema.parse({
        ...newEvent,
        id: '81bf99f8-a052-4851-9f94-fe8329305310',
        postedAt: '2024-08-06T17:29:38.379Z',
        createdAt: '2024-08-06T17:29:38.379Z',
        updatedAt: '2024-08-06T17:29:38.379Z',
      });
      (eventRepository.createAsync as Mock).mockReturnValue(createdEvent);

      // Act
      const result = await eventService.create({
        body: newEvent,
      } as any); // the as any is used since zod is confused where it wants a date or a string but he types do check out

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Event created');
      expect(result.responseObject).toEqual(createdEvent);
    });

    it('handles errors for createAsync', async () => {
      // Arrange
      const newEvent = {
        title: 'Test Event3',
        description: 'Test Event3 Description',
        videoLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        flyerLink: 'https://www.google.com/',
        date: '2025-01-01T00:00:00Z',
        location: 'Beirut',
        speakerName: 'Linus Torvalds',
        speakerDescription: 'Creator of Linux',
        speakerProfileUrl: 'https://torvalds-family.blogspot.com/',
        typeId: 1,
        tags: 'Linux, Open Source',
      };
      (eventRepository.createAsync as Mock).mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.create({
        body: newEvent,
      } as any); // refer previous comment

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error creating event');
      expect(result.responseObject).toBeNull();
    });

    it('returns a bad request error for no event provided', async () => {
      // Arrange

      // Act
      const result = await eventService.create({
        body: null,
      } as any);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Event not provided');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('update', () => {
    it('updates an event', async () => {
      // Arrange
      const updatedEventData = {
        title: 'Test Event4',
      };

      const eventId = mockEvents[0].id;

      const updatedEvent = EventSchema.parse({
        ...mockEvents[0],
        date: mockEvents[0].date!.toISOString(),
        createdAt: mockEvents[0].createdAt!.toISOString(),
        updatedAt: mockEvents[0].createdAt!.toISOString(),
        postedAt: mockEvents[0].postedAt!.toISOString(),
        ...updatedEventData,
      });

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      vi.spyOn(eventRepository, 'updateAsync').mockImplementation((id: string, event: any) => {
        const eventToBeUpdated = mockEvents.find((event) => event.id === id);
        const updatedEvent = {
          ...eventToBeUpdated,
          ...event,
        };
        return updatedEvent;
      });

      // Act
      const result = await eventService.update(eventId, {
        body: updatedEventData,
      } as any);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Event updated');
      expect(result.responseObject).toEqual(updatedEvent);
    });

    it('handles errors for updateAsync', async () => {
      // Arrange
      const updatedEventData = {
        title: 'Test Event4',
      };

      const eventId = mockEvents[0].id;
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });
      vi.spyOn(eventRepository, 'updateAsync').mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.update(eventId, {
        body: updatedEventData,
      } as any);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error updating event');
      expect(result.responseObject).toBeNull();
    });

    it('returns a bad request error for no event provided', async () => {
      // Arrange
      const eventId = mockEvents[0].id;

      // Act
      const result = await eventService.update(eventId, {
        body: null,
      } as any);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Event not provided');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes an event', async () => {
      // Arrange
      const eventId = mockEvents[0].id;

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      vi.spyOn(eventRepository, 'deleteAsync').mockImplementation(() => {
        return null as any;
      });

      // Act
      const result = await eventService.delete(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Event deleted');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for deleteAsync', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });
      vi.spyOn(eventRepository, 'deleteAsync').mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.delete(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error deleting event');
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent ID', async () => {
      // Arrange
      const eventId = '88888888-8888-8888-8888-888888888888';
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation(() => {
        return null as any;
      });

      // Act
      const result = await eventService.delete(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Event not found');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('getRegistrations', () => {
    it('returns all registrations for an event', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      vi.spyOn(eventRepository, 'getRegistrationsAsync').mockImplementation((eventId: string) => {
        return mockRegistrations.filter((registration) => registration.eventId === eventId) as any;
      });
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      // Act
      const result = await eventService.getRegistrations(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Registrations found');
      expect(result.responseObject).toEqual(mockRegistrations);
    });

    it('handles errors for getRegistrationsAsync', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      vi.spyOn(eventRepository, 'getRegistrationsAsync').mockRejectedValue(new Error('Database error'));
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      // Act
      const result = await eventService.getRegistrations(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error finding registrations');
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for no registrations found', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      vi.spyOn(eventRepository, 'getRegistrationsAsync').mockImplementation(() => {
        return [] as any;
      });
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvents[0]);

      // Act
      const result = await eventService.getRegistrations(eventId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('No registrations found');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('newRegistration', () => {
    it('registers a user for an event', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';
      const userType = 'Attendee';

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      (eventRepository.getRegistrationByUserIdAndEventIdAsync as Mock).mockReturnValue(null);

      vi.spyOn(eventRepository, 'newRegisterationAsync').mockImplementation(
        (eventId: string, userId: string, userType: string) => {
          const registration = {
            id: 3,
            eventId,
            userId,
            userType,
          };
          mockRegistrations.push(RegistrationSchema.parse(registration));
          return RegistrationSchema.parse(registration) as any;
        }
      );

      // Act
      const result = await eventService.newRegisteration(eventId, userId, userType);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('User registered');
      expect(result.responseObject).toEqual({
        id: 3,
        eventId,
        userId,
        userType,
      });

      (eventRepository.getRegistrationsAsync as Mock).mockReturnValue(mockRegistrations);

      const getRegistrationsResult = await eventService.getRegistrations(eventId);
      expect(getRegistrationsResult.statusCode).toEqual(StatusCodes.OK);
      expect(getRegistrationsResult.success).toBeTruthy();
      expect(getRegistrationsResult.message).toContain('Registrations found');
      expect(getRegistrationsResult.responseObject).toEqual(mockRegistrations);

      mockRegistrations.pop();
    });

    it("doesn't register a user for an event if they are already registered", async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';
      const userType = 'Attendee';

      vi.spyOn(eventRepository, 'getRegistrationByUserIdAndEventIdAsync').mockImplementation(
        (eventId: string, userId: string) => {
          return mockRegistrations.find(
            (registration) => registration.eventId === eventId && registration.userId === userId
          ) as any;
        }
      );
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      // Act
      const result = await eventService.newRegisteration(eventId, userId, userType);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('User already registered');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for getRegistrationByUserIdAndEventIdAsync', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';
      const userType = 'Attendee';

      vi.spyOn(eventRepository, 'getRegistrationByUserIdAndEventIdAsync').mockRejectedValue(
        new Error('Database error')
      );
      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      // Act
      const result = await eventService.newRegisteration(eventId, userId, userType);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error registering user');
      expect(result.responseObject).toBeNull();
    });
  });

  describe('saveEvent', () => {
    it('saves an event for a user', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      vi.spyOn(eventRepository, 'saveEventAsync').mockImplementation(() => {
        return null as any;
      });

      // Act
      const result = await eventService.saveEvent(eventId, userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).toContain('Event saved');
      expect(result.responseObject).toBeNull();
    });

    it('handles errors for saveEventAsync', async () => {
      // Arrange
      const eventId = mockEvents[0].id;
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation((id: string) => {
        return mockEvents.find((event) => event.id === id) as any;
      });

      vi.spyOn(eventRepository, 'saveEventAsync').mockRejectedValue(new Error('Database error'));

      // Act
      const result = await eventService.saveEvent(eventId, userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Error saving event');
      expect(result.responseObject).toBeNull();
    });

    it('returns a not found error for non-existent event ID', async () => {
      // Arrange
      const eventId = '88888888-8888-8888-8888-888888888888';
      const userId = '81bf99f8-a052-4851-9f94-fe8329305308';

      vi.spyOn(eventRepository, 'findByIdAsync').mockImplementation(() => {
        return null as any;
      });

      // Act
      const result = await eventService.saveEvent(eventId, userId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).toContain('Event not found');
      expect(result.responseObject).toBeNull();
    });
  });
});
