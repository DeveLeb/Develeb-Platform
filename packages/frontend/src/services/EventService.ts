import { Event, EventQueryParams } from '../types';
import { FetcherService } from './FetcherService';

export class EventService {
  fetcher: FetcherService;
  constructor() {
    this.fetcher = new FetcherService('/data'); // TODO Fix the url to backend url when the event api is merged into backend
  }
  async getEvents(
    type?: string,
    tagsFilter?: string[],
    title?: string,
    page: number = 1,
    perPage: number = 12
  ): Promise<{ events: Event[] }> {
    const query: EventQueryParams = {
      page,
      perPage,
      ...(type ? { type } : {}),
      ...(tagsFilter && tagsFilter.length > 0 ? { tags: tagsFilter.join(',') } : {}),
      ...(title ? { title } : {}),
    };

    const queryString = new URLSearchParams(query as Record<string, string>).toString();

    try {
      const data = await this.fetcher.get<Event[]>(`/events?${queryString}`);
      return { events: data };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch events');
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      const data = await this.fetcher.get<Event>(`/events/${eventId}`);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch events');
    }
  }
}
