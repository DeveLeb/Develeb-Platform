import { EventType } from './EventType';
import { TagType } from './TagType';

export interface Event {
  id: string;
  title: string;
  description: string;
  videoLink: string;
  flyerLink: string;
  date: string;
  location: string;
  speakerName: string;
  speakerDescription: string;
  speakerProfileUrl: string;
  type: EventType;
  tags: TagType[];
  createdAt: string;
  updatedAt: string;
}

export interface EventQueryParams {
  page?: number;
  per_page?: number;
  type?: string;
  tags?: string;
  title?: string;
}
