import { and, count, eq, SQL, sql } from 'drizzle-orm';
import { resource, resourceSaved, resourceViews } from 'src/db/schema';

import { db } from '../../db';
import { Resource, ResourceSchema } from './resourceModel';

export const resourceRepository = {
  findResourcesAsync: async (conditions: SQL[], limit: number, offset: number): Promise<Resource[] | null> => {
    let baseQuery = db.select().from(resource);
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;
    }
    const result = await baseQuery.limit(limit).offset(offset).execute();
    let parsedResult: Resource[];
    if (Array.isArray(result)) {
      parsedResult = result.map((item) => ResourceSchema.parse(item));
    } else {
      parsedResult = [ResourceSchema.parse(result)];
    }
    return parsedResult || null;
  },
  findResourcesCountAsync: async (conditions: SQL[]): Promise<number> => {
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(resource);
    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }
    const result = await countQuery.execute();
    return result[0]?.count ?? 0;
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
