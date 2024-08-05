const baseURL = '.';

const mockEvents: Event[] = [
  {
    id: 1,
    date: '2024-08-15',
    description: 'Mock Event 1 Description',
    flyer_link: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    date: '2024-08-16',
    description: 'Mock Event 2 Description',
    flyer_link: 'https://via.placeholder.com/150'
  },
];

const mockEventById: { [key: number]: Event } = {
  1: {
    id: 1,
    date: '2024-08-15',
    description: 'Mock Event 1 Description',
    flyer_link: 'https://via.placeholder.com/150'
  },
  2: {
    id: 2,
    date: '2024-08-16',
    description: 'Mock Event 2 Description',
    flyer_link: 'https://via.placeholder.com/150'
  },
};

const isMock = true;

const getEvents = async (type?: string, tags?: string[], title?: string): Promise<Event[]> => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 1000);
    });
  }

  const query: { [key: string]: any } = {};
  if (type) query.type = type;
  if (tags && tags.length > 0) query.tags = tags.join(',');
  if (title) query.title = title;

  const queryString = new URLSearchParams(query).toString();

  const response = await fetch(`${baseURL}/events${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
};

const getEventById = async (eventId: string): Promise<Event> => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event = mockEventById[Number(eventId)];
        if (event) {
          resolve(event);
        } else {
          throw new Error('Event not found');
        }
      }, 1000);
    });
  }

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
};

const EventService = {
  getEvents,
  getEventById,
};

export default EventService;
