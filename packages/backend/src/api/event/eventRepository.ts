import { and, eq, like, SQL, sql } from 'drizzle-orm';
import { db } from 'src/db';
import { event as eventSchema, jobType, userEventRegistration } from 'src/db/schema';

import { CreateEventRequest, Event, EventSchema, UpdateEventRequest } from '../event/eventModel';

export const eventRepository = {
  findAllAsync: async (filters: {
    limit: number;
    offset: number;
    typeId?: number;
    title?: string;
  }): Promise<{ events: Event[]; totalCount: number }> => {
    const conditions: SQL[] = [];

    if (filters.typeId) {
      conditions.push(eq(eventSchema.typeId, filters.typeId));
    }

    if (filters.title) {
      conditions.push(like(eventSchema.title, `%${filters.title}%`));
    }

    const baseQuery = db
      .select()
      .from(eventSchema)
      .leftJoin(jobType, eq(eventSchema.typeId, jobType.id))
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
    const events: any = await db.select().from(eventSchema).where(eq(eventSchema.id, id));
    if (!events) {
      return null;
    }
    return events[0];
  },

  createAsync: async (event: CreateEventRequest): Promise<Event> => {
    if (event.body.date) {
      if (new Date(event.body.date) < new Date()) {
        throw new Error('Cannot create an event in the past');
      }
    }

    const [createdEvent] = await db
      .insert(eventSchema)
      .values({
        ...event.body,
        date: new Date(event.body.date!),
        updatedAt: new Date(),
        createdAt: new Date(),
        postedAt: new Date(),
      })
      .returning();

    console.log('createdEvent', createdEvent);

    const parsedEvent = {
      ...createdEvent,
      date: createdEvent.date!.toISOString(),
      createdAt: createdEvent.createdAt!.toISOString(),
      updatedAt: createdEvent.updatedAt!.toISOString(),
      postedAt: createdEvent.postedAt!.toISOString(),
    };

    return EventSchema.parse(parsedEvent);
  },

  updateAsync: async (id: string, event: UpdateEventRequest): Promise<Event> => {
    const [updatedEvent] = await db
      .update(eventSchema)
      .set({
        ...event.body,
        updatedAt: new Date(),
      })
      .where(eq(eventSchema.id, id))
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

  deleteAsync: async (id: string): Promise<void> => {
    await db.delete(eventSchema).where(eq(eventSchema.id, id));
  },

  getRegistrationsAsync: async (eventId: string): Promise<any> => {
    const event = await db.select().from(eventSchema).where(eq(eventSchema.id, eventId));
    if (!event) {
      throw new Error('Event not found');
    }
    const registrations = await db
      .select()
      .from(userEventRegistration)
      .where(eq(userEventRegistration.eventId, eventId));
    return registrations;
  },

  newRegisterationAsync: async (eventId: string, userId: string, userType: string): Promise<void> => {
    await db
      .insert(userEventRegistration)
      .values({
        eventId,
        userId,
        userType,
      })
      .execute();
  },
};
