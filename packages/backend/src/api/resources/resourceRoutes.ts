import express from 'express';

import {
  createResource,
  deleteResource,
  getResource,
  getResourceViews,
  saveResource,
  updateResource,
} from './resourceService';

const router = express.Router();

router.route('/').get().post(createResource);
router.route('/:id').get(getResource).put(updateResource).delete(deleteResource);
router.route('/:id/views').get(getResourceViews);
router.route('/:resourceId/save/:userId').post(saveResource);

export default router;
