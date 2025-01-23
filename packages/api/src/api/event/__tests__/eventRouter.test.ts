import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { Mock } from 'vitest';

import { ServiceResponse } from '../../../common/models/serviceResponse';
import { app } from '../../../server';
import { Event, EventSchema, Registration, RegistrationSchema } from '../eventModel';
import { eventRepository } from '../eventRepository';

vi.mock('src/api/event/eventRepository');
vi.mock('@/server', () => ({
  ...vi.importActual('@/server'),
  logger: {
    error: vi.fn(),
  },
}));

describe('Events API Endpoints', () => {
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

  describe('GET /events', () => {
    it('should return a list of events', async () => {
      (eventRepository.findAllAsync as Mock).mockReturnValue({
        events: mockEvents,
        totalCount: mockEvents.length,
      });

      // Act
      const response = await request(app).get('/events');
      const responseBody: ServiceResponse<Event[]> = response.body;

      // Assert
      responseBody.responseObject.forEach((responseEvent, index) => {
        compareEvents(mockEvents[index], responseEvent);
      });
    });

    it('should return a not found error for no events', async () => {
      (eventRepository.findAllAsync as Mock).mockReturnValue({
        events: [],
        totalCount: 0,
      });

      // Act
      const response = await request(app).get('/events');
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('No Events found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for invalid input', async () => {
      // Act
      const invalidInput = 'abc';
      const response = await request(app).get(`/events?pageSize=${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(
        'Invalid input: Must be a numeric value, Page size must be a positive number'
      );
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      (eventRepository.findAllAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });

      // Act
      const response = await request(app).get('/events');
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Error finding events: $Test Error');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return the number of pages when paginating', async () => {
      (eventRepository.findAllAsync as Mock).mockReturnValue({
        events: mockEvents,
        totalCount: mockEvents.length * 2,
      });

      // Act
      const response = await request(app).get('/events?pageSize=2&pageIndex=1');
      const responseBody: ServiceResponse<Event[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toEqual('Events fetched successfully. Page 1 of 2');
      expect(responseBody.responseObject.length).toEqual(2);
    });
  });

  describe('GET /events/:id', () => {
    it('should return an event by id', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse<Event> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      compareEvents(mockEvent, responseBody.responseObject);
    });

    it('should return a not found error for an event that does not exist', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Event not found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`Error finding event with id ${mockEvent.id}:, Test Error`);
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for an invalid id', async () => {
      const invalidId = 'abc';

      // Act
      const response = await request(app).get(`/events/${invalidId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid uuid');
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('POST /events', () => {
    it('should create an event', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.createAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).post('/events').send(mockEvent);
      const responseBody: ServiceResponse<Event> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      compareEvents(mockEvent, responseBody.responseObject);
    });

    it('should return a bad request for invalid input', async () => {
      // Act
      const invalidEvent = { ...mockEvents[0], date: 'abc' };
      const response = await request(app).post('/events').send(invalidEvent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid datetime');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      (eventRepository.createAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });

      // Act
      const response = await request(app).post('/events').send(mockEvents[0]);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Error creating event: Test Error');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for missing event data', async () => {
      // Act
      const eventToBeSent = { ...mockEvents[0] };
      delete eventToBeSent.date;
      const response = await request(app).post('/events').send(eventToBeSent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Required');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for a date in the past', async () => {
      // Act
      const eventToBeSent = { ...mockEvents[0], date: '2020-01-01T00:00:00Z' };
      const response = await request(app).post('/events').send(eventToBeSent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Date cannot be in the past');
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('PUT /events/:id', () => {
    it('should update an event', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);
      (eventRepository.updateAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).put(`/events/${mockEvent.id}`).send(mockEvent);
      const responseBody: ServiceResponse<Event> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      compareEvents(mockEvent, responseBody.responseObject);
    });

    it('should return a not found error for an event that does not exist', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app).put(`/events/${mockEvent.id}`).send(mockEvent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Event not found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for invalid input', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const invalidEvent = { ...mockEvent, date: 'abc' };
      const response = await request(app).put(`/events/${mockEvent.id}`).send(invalidEvent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`[
  {
    "code": "invalid_string",
    "validation": "datetime",
    "message": "Invalid datetime",
    "path": [
      "body",
      "date"
    ]
  }
]`);
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);
      (eventRepository.updateAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });

      // Act
      const response = await request(app).put(`/events/${mockEvent.id}`).send(mockEvent);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`Error updating event with id ${mockEvent.id}: Test Error`);
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete an event', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);
      (eventRepository.deleteAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app).delete(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toEqual('Event deleted');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a not found error for an event that does not exist', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app).delete(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Event not found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);
      (eventRepository.deleteAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });

      // Act
      const response = await request(app).delete(`/events/${mockEvent.id}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`Error deleting event with id ${mockEvent.id}: Test Error`);
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for an invalid id', async () => {
      const invalidId = 'abc';

      // Act
      const response = await request(app).delete(`/events/${invalidId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid uuid');
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('GET /events/:evenId/registrations', () => {
    it('should return a list of registrations for an event', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.getRegistrationsAsync as Mock).mockReturnValue(mockRegistrations);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}/registrations`);
      const responseBody: ServiceResponse<Registration[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toEqual('Registrations found');
      expect(responseBody.responseObject).toEqual(mockRegistrations);
    });

    it('should return a not found error for no registrations', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.getRegistrationsAsync as Mock).mockReturnValue([]);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}/registrations`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('No registrations found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      (eventRepository.getRegistrationsAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).get(`/events/${mockEvent.id}/registrations`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`Error finding registrations for event with id ${mockEvent.id}: Test Error`);
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for an invalid id', async () => {
      const invalidId = 'abc';

      // Act
      const response = await request(app).get(`/events/${invalidId}/registrations`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid uuid');
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('POST /events/:eventId/register/:userId', () => {
    it('should register a user for an event', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.newRegisterationAsync as Mock).mockReturnValue(mockRegistration);
      (eventRepository.getRegistrationByUserIdAndEventIdAsync as Mock).mockReturnValue(null);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);
      // TODO: add mock for finding user by id once implemented

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/register/${mockRegistration.userId}`);
      const responseBody: ServiceResponse<Registration> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toEqual('User registered');
      expect(responseBody.responseObject).toEqual(mockRegistration);
    });

    it('should return a conflict error for a user that is already registered', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.newRegisterationAsync as Mock).mockReturnValue(mockRegistration);
      (eventRepository.getRegistrationByUserIdAndEventIdAsync as Mock).mockReturnValue(mockRegistration);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/register/${mockRegistration.userId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('User already registered');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a not found error for an event that does not exist', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.newRegisterationAsync as Mock).mockReturnValue(mockRegistration);
      (eventRepository.getRegistrationByUserIdAndEventIdAsync as Mock).mockReturnValue(null);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/register/${mockRegistration.userId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Event not found');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.newRegisterationAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });
      (eventRepository.getRegistrationByUserIdAndEventIdAsync as Mock).mockReturnValue(null);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/register/${mockRegistration.userId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(
        `Error registering user with id ${mockRegistration.userId} for event with id ${mockEvent.id}: Test Error`
      );
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for an invalid id', async () => {
      const invalidId = 'abc';

      // Act
      const response = await request(app).post(`/events/${invalidId}/register/${invalidId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid uuid, Invalid uuid');
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe('POST /events/:eventId/save/:userId', () => {
    it('should save an event for a user', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.saveEventAsync as Mock).mockReturnValue(null);
      (eventRepository.getSavedEventByUserIdAndEventIdAsync as Mock).mockReturnValue(null);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/save/${mockRegistration.userId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toEqual('Event saved');
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a server error for an exception', async () => {
      const mockEvent = mockEvents[0];
      const mockRegistration = mockRegistrations[0];
      (eventRepository.saveEventAsync as Mock).mockImplementation(() => {
        throw new Error('Test Error');
      });
      (eventRepository.getSavedEventByUserIdAndEventIdAsync as Mock).mockReturnValue(null);
      (eventRepository.findByIdAsync as Mock).mockReturnValue(mockEvent);

      // Act
      const response = await request(app).post(`/events/${mockEvent.id}/save/${mockRegistration.userId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual(`Error saving event with id ${mockEvent.id}: Test Error`);
      expect(responseBody.responseObject).toBeNull();
    });

    it('should return a bad request for an invalid id', async () => {
      const invalidId = 'abc';

      // Act
      const response = await request(app).post(`/events/${invalidId}/save/${invalidId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toEqual('Invalid input: Invalid uuid, Invalid uuid');
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareEvents(mockEvent: Event, responseEvent: any) {
  if (!mockEvent || !responseEvent) {
    throw new Error('Invalid test data: mockEvent or responseEvent is undefined');
  }

  expect(responseEvent.id).toEqual(mockEvent.id);
  expect(responseEvent.title).toEqual(mockEvent.title);
  expect(responseEvent.description).toEqual(mockEvent.description);
  expect(responseEvent.videoLink).toEqual(mockEvent.videoLink);
  expect(responseEvent.flyerLink).toEqual(mockEvent.flyerLink);
  expect(new Date(responseEvent.date)).toEqual(mockEvent.date);
  expect(responseEvent.location).toEqual(mockEvent.location);
  expect(responseEvent.speakerName).toEqual(mockEvent.speakerName);
  expect(responseEvent.speakerDescription).toEqual(mockEvent.speakerDescription);
  expect(responseEvent.speakerProfileUrl).toEqual(mockEvent.speakerProfileUrl);
  expect(responseEvent.typeId).toEqual(mockEvent.typeId);
  expect(responseEvent.tags).toEqual(mockEvent.tags);
  expect(new Date(responseEvent.postedAt)).toEqual(mockEvent.postedAt);
  expect(new Date(responseEvent.createdAt)).toEqual(mockEvent.createdAt);
  expect(new Date(responseEvent.updatedAt)).toEqual(mockEvent.updatedAt);
}
