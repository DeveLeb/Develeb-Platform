import { Event, EventType, TagType } from '@/types';

const baseURL = '.';

const getEvents = async (
  type?: string,
  tagsFilter?: string[],
  title?: string,
  page: number = 1,
  per_page: number = 12
): Promise<{ events: Event[]; total: number }> => {
  const query: { [key: string]: any } = {
    page,
    per_page,
  };
  if (type) query.type = type;
  if (tagsFilter && tagsFilter.length > 0) query.tags = tagsFilter.join(',');
  if (title) query.title = title;

  const queryString = new URLSearchParams(query).toString();

  const response = await fetch(`${baseURL}/events?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  const data = await response.json();

  const typesResponse = await fetch(`${baseURL}/types`);
  const tagsResponse = await fetch(`${baseURL}/tags`);

  if (!typesResponse.ok || !tagsResponse.ok) {
    throw new Error('Failed to fetch types or tags');
  }

  const types: EventType[] = await typesResponse.json();
  const tagsList: TagType[] = await tagsResponse.json();

  const enrichedEvents = data.events.map((event: any) => ({
    ...event,
    type: types.find((type: EventType) => type.id === event.typeId),
    tags: event.tags.split(',').map((tagId: string) => tagsList.find((tag: TagType) => tag.id === parseInt(tagId))),
  }));

  return {
    events: enrichedEvents,
    total: data.total,
  };
};

const getEventById = async (eventId: string): Promise<Event> => {
  const response = await fetch(`${baseURL}/events/${eventId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  const event = await response.json();

  const typeResponse = await fetch(`${baseURL}/types/${event.typeId}`);
  const tagResponses = await Promise.all(event.tags.split(',').map((tagId) => fetch(`${baseURL}/tags/${tagId}`)));

  if (!typeResponse.ok || tagResponses.some((res) => !res.ok)) {
    throw new Error('Failed to fetch type or tags');
  }

  const type: EventType = await typeResponse.json();
  const tagsList: TagType[] = await Promise.all(tagResponses.map((res) => res.json()));

  return {
    ...event,
    type,
    tags: tagsList,
  };
};

export default {
  getEvents,
  getEventById,
};
