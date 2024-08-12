import { and, asc, count, eq, SQL, sql } from 'drizzle-orm';
import { resource, resourceSaved, resourceViews } from 'src/db/schema';

import { db } from '../../db';
import { Resource, ResourceSchema } from './resourceModel';
import { CreateResourceRequest, PutResourceRequest } from './resourceRequest';

export const resourceRepository = {
  findResourcesAsync: async (filters: {
    limit: number;
    offset: number;
    type?: string;
    title?: string;
  }): Promise<{ resources: Resource[]; totalCount: number }> => {
    const conditions: SQL[] = [];
    if (filters.type) {
      conditions.push(eq(resource.type, filters.type));
    }
    if (filters.title) {
      conditions.push(eq(resource.title, filters.title));
    }
    let baseQuery = db.select().from(resource);
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)).orderBy(asc(resource.createdAt)) as typeof baseQuery;
    }
    const [totalCountResult, resources] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(baseQuery.as('subquery')),
      baseQuery.limit(filters.limit).offset(filters.offset).execute(),
    ]);
    const parsedResources = resources.map((row) => {
      return ResourceSchema.parse(row);
    });
    return {
      resources: parsedResources,
      totalCount: Number(totalCountResult[0]?.count || 0),
    };
  },

  findResourceAsync: async (id: string): Promise<Resource | null> => {
    const foundResource = await db.select().from(resource).where(eq(resource.id, id)).limit(1);
    return ResourceSchema.parse(foundResource[0]) || null;
  },
  createResourceAsync: async (createResouce: CreateResourceRequest): Promise<Resource | null> => {
    const createdResource = await db
      .insert(resource)
      .values({
        ...createResouce,
      })
      .returning();
    return ResourceSchema.parse(createdResource[0]) || null;
  },
  updateResourceAsync: async (id: string, updateResource: PutResourceRequest): Promise<Resource | null> => {
    const updatedResource = await db
      .update(resource)
      .set({ ...updateResource, updatedAt: new Date() })
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
  findSavedResourcesAsync: async (userId: string): Promise<Resource[] | null> => {
    const result = await db
      .select()
      .from(resource)
      .leftJoin(resourceSaved, eq(resourceSaved.resourceId, resource.id))
      .where(eq(resourceSaved.userId, userId))
      .orderBy(asc(resource.createdAt));
    return result.length > 0 ? result.map((row) => ResourceSchema.parse(row.resource)) : null;
  },
};
