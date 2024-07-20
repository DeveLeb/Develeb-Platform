import { count, eq } from 'drizzle-orm';
import { resource, resourceSaved, resourceViews } from 'src/db/schema';

import { db } from '../../db';
import { Resource, ResourceSchema } from './resourceModel';

export const resourceRepository = {
  findResourcesAsync: async (): Promise<Resource[]> => {
    const resources = await db.select().from(resource);
    return ResourceSchema.array().parse(resources[0]);
  },
  findResourceAsync: async (id: string): Promise<Resource | null> => {
    const foundResource = await db.select().from(resource).where(eq(resource.id, id)).limit(1);
    return ResourceSchema.parse(foundResource[0]) || null;
  },
  createResourceAsync: async (
    title: string,
    description: string,
    link: string,
    publish: boolean,
    type: string,
    tags: string
  ): Promise<Resource | null> => {
    const createdResource = await db
      .insert(resource)
      .values({
        title,
        description,
        link,
        publish,
        type,
        tags,
      })
      .returning();
    return ResourceSchema.parse(createdResource[0]) || null;
  },
  updateResourceAsync: async (
    id: string,
    title: string,
    description: string,
    link: string,
    publish: boolean,
    type: string,
    tags: string
  ): Promise<Resource | null> => {
    const updatedResource = await db
      .update(resource)
      .set({ title, description, link, publish, type, tags, updatedAt: new Date() })
      .where(eq(resource.id, id))
      .returning();
    return ResourceSchema.parse(updatedResource[0]) || null;
  },
  deleteResourceAsync: async (id: string): Promise<Resource | null> => {
    const deletedResource = await db.delete(resource).where(eq(resource.id, id)).returning();
    return ResourceSchema.parse(deletedResource[0]) || null;
  },
  findResourceTotalViewsAsync: async (id: string): Promise<number | null> => {
    const result = await db.select({ totalViews: count() }).from(resourceViews).where(eq(resourceViews.resourceId, id));
    return result[0].totalViews || null;
  },
  saveResourceAsync: async (resourceId: string, userId: string): Promise<Resource | null> => {
    const result = await db.insert(resourceSaved).values({ resourceId, userId, savedAt: new Date() });
    return ResourceSchema.parse(result[0]) || null;
  },
};
