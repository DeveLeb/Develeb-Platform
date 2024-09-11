import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { eventRegistry } from 'src/api/event/eventRouter';
import { jobRegistry } from 'src/api/job/jobRouter';
import { resourceRegistry } from 'src/api/resources/resourceRouter';
import { tagsRegistry } from 'src/api/tags/tagsRouter';

import { healthCheckRegistry } from '../api/healthCheck/healthCheckRouter';
import { userRegistry } from '../api/user/userRouter';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    eventRegistry,
    jobRegistry,
    resourceRegistry,
    tagsRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  });
}
