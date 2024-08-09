import { z } from 'zod';

import { RegistrationSchema, SaveEventSchema } from './eventModel';

export type RegisterationResponse = z.infer<typeof RegistrationSchema>;

export type SaveEventResponse = z.infer<typeof SaveEventSchema>;
