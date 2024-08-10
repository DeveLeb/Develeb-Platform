type Event = {
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
  };