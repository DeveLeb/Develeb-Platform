import { eq, ilike } from 'drizzle-orm';
import { db } from 'src/db';
import { tags } from 'src/db/schema';

import { Tag, TagSchema } from './tagsModel';

export const tagsRepository = {
  findAllTagsAsync: async (): Promise<Tag[] | null> => {
    const result = await db.select().from(tags);
    return TagSchema.array().parse(result);
  },

  findTagByIdAsync: async (id: number): Promise<Tag | null> => {
    const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
    return result.length > 0 ? TagSchema.parse(result[0]) : null;
  },

  findTagByNameAsync: async (name: string): Promise<Tag | null> => {
    const result = await db.select().from(tags).where(ilike(tags.name, name)).limit(1);
    return result.length > 0 ? TagSchema.parse(result[0]) : null;
  },

  createTagAsync: async (name: string): Promise<Tag | null> => {
    const result = await db.insert(tags).values({ name }).returning();
    return result.length > 0 ? TagSchema.parse(result[0]) : null;
  },

  deleteTagByIdAsync: async (id: number): Promise<Tag | null> => {
    const result = await db.delete(tags).where(eq(tags.id, id)).returning();
    return result.length > 0 ? TagSchema.parse(result[0]) : null;
  },

  updateTagAsync: async (id: number, name: string): Promise<Tag | null> => {
    const result = await db.update(tags).set({ name }).where(eq(tags.id, id)).returning();
    return result.length > 0 ? TagSchema.parse(result[0]) : null;
  },
};
