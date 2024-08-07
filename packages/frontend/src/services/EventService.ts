const baseURL = '.';

export interface Event {
  id: number;
  date: string;
  description: string;
  flyer_link: string;
}

const getEvents = async (
  type?: string,
  tags?: string[],
  title?: string,
  page: number = 1,
  per_page: number = 12
): Promise<{ events: Event[]; total: number }> => {
  try {
    const query: { [key: string]: any } = {
      page,
      per_page,
    };
    if (type) query.type = type;
    if (tags && tags.length > 0) query.tags = tags.join(',');
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
    return { events: data.events, total: data.total };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [], total: 0 };
  }
};

const getEventById = async (eventId: string): Promise<Event> => {
  try {
    const response = await fetch(`${baseURL}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

const EventService = {
  getEvents,
  getEventById,
};

export default EventService;
