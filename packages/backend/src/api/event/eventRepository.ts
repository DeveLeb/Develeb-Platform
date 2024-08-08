import { and, eq, like, SQL, sql } from 'drizzle-orm';
import { db } from 'src/db';
import * as schema from 'src/db/schema';
import { z } from 'zod';

import { Event, EventSchema, RegistrationSchema, SaveEvent, SaveEventSchema } from '../event/eventModel';
import { CreateEventSchema, UpdateEventSchema } from './eventRequest';
import { RegisterationResponse } from './eventRespone';

export const eventRepository = {
  findAllAsync: async (filters: {
    limit: number;
    offset: number;
    typeId?: number;
    title?: string;
  }): Promise<{ events: Event[]; totalCount: number }> => {
    const conditions: SQL[] = [];

    if (filters.typeId) {
      conditions.push(eq(schema.event.typeId, filters.typeId));
    }

    if (filters.title) {
      conditions.push(like(schema.event.title, `%${filters.title}%`));
    }

    const baseQuery = db
      .select()
      .from(schema.event)
      .leftJoin(schema.jobType, eq(schema.event.typeId, schema.jobType.id))
      .where(and(...conditions));

    const [totalCountResult, result] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(baseQuery.as('subquery')),
      baseQuery.limit(filters.limit).offset(filters.offset).execute(),
    ]);

    const parsedResult = result.map((row: any) => {
      const eventData = {
        ...row.event,
        date: row.event.date.toISOString(),
        createdAt: row.event.createdAt.toISOString(),
        updatedAt: row.event.updatedAt.toISOString(),
        postedAt: row.event.postedAt.toISOString(),
      };
      console.log('eventData', eventData);
      return EventSchema.parse(eventData);
    });

    return {
      events: parsedResult,
      totalCount: Number(totalCountResult[0].count),
    };
  },

  findByIdAsync: async (id: string): Promise<Event | null> => {
    const events: any = await db.select().from(schema.event).where(eq(schema.event.id, id));
    if (!events) {
      return null;
    }
    return events[0];
  },

  createAsync: async (event: z.infer<typeof CreateEventSchema.shape.body>): Promise<Event> => {
    if (event.date) {
      if (new Date(event.date) < new Date()) {
        throw new Error('Cannot create an event in the past');
      }
    }

    const [createdEvent] = await db
      .insert(schema.event)
      .values({
        ...event,
        date: new Date(event.date!),
        updatedAt: new Date(),
        createdAt: new Date(),
        postedAt: new Date(),
      })
      .returning();

    const parsedEvent = {
      ...createdEvent,
      date: createdEvent.date!.toISOString(),
      createdAt: createdEvent.createdAt!.toISOString(),
      updatedAt: createdEvent.updatedAt!.toISOString(),
      postedAt: createdEvent.postedAt!.toISOString(),
    };

    return EventSchema.parse(parsedEvent);
  },

  updateAsync: async (id: string, event: z.infer<typeof UpdateEventSchema.shape.body>): Promise<Event> => {
    const [updatedEvent] = await db
      .update(schema.event)
      .set({
        ...event,
        updatedAt: new Date(),
      })
      .where(eq(schema.event.id, id))
      .returning();

    const parsedEvent = {
      ...updatedEvent,
      date: updatedEvent.date!.toISOString(),
      createdAt: updatedEvent.createdAt!.toISOString(),
      updatedAt: updatedEvent.updatedAt!.toISOString(),
      postedAt: updatedEvent.postedAt!.toISOString(),
    };

    return EventSchema.parse(parsedEvent);
  },

  deleteAsync: async (id: string): Promise<Event | null> => {
    const result = await db.delete(schema.event).where(eq(schema.event.id, id));
    return result.length > 0 ? EventSchema.parse(result[0]) : null;
  },

  getRegistrationsAsync: async (eventId: string): Promise<RegisterationResponse[]> => {
    const event = await db.select().from(schema.event).where(eq(schema.event.id, eventId));
    if (!event) {
      throw new Error('Event not found');
    }
    const registrations = await db
      .select()
      .from(schema.userEventRegistration)
      .where(eq(schema.userEventRegistration.eventId, eventId));

    const parsedRegistrations = registrations.map((registration) => {
      return RegistrationSchema.parse(registration);
    });

    return parsedRegistrations;
  },

  newRegisterationAsync: async (eventId: string, userId: string, userType: string): Promise<RegisterationResponse> => {
    const registration = await db
      .insert(schema.userEventRegistration)
      .values({
        eventId,
        userId,
        userType,
      })
      .returning()
      .execute();

    return RegistrationSchema.parse(registration[0]);
  },

  getRegistrationByUserIdAndEventIdAsync: async (
    eventId: string,
    userId: string
  ): Promise<RegisterationResponse | null> => {
    const registration = await db
      .select()
      .from(schema.userEventRegistration)
      .where(and(eq(schema.userEventRegistration.eventId, eventId), eq(schema.userEventRegistration.userId, userId)));

    if (registration.length === 0) {
      return null;
    }

    return RegistrationSchema.parse(registration[0]);
  },

  getSavedEventByUserIdAndEventIdAsync: async (eventId: string, userId: string): Promise<SaveEvent | null> => {
    const registration = await db
      .select()
      .from(schema.eventSaved)
      .where(and(eq(schema.eventSaved.eventId, eventId), eq(schema.eventSaved.userId, userId)));

    if (registration.length === 0) {
      return null;
    }

    return SaveEventSchema.parse(registration[0]);
  },

  saveEventAsync: async (eventId: string, userId: string): Promise<SaveEvent> => {
    const savedEvent = await db
      .insert(schema.eventSaved)
      .values({
        eventId,
        userId,
        savedAt: new Date(),
      })
      .returning()
      .execute();

    return SaveEventSchema.parse(savedEvent[0]);
  },
};
