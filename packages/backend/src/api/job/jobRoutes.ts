import express from 'express';

import {
  approveJob,
  createJobCategory,
  createJobLevel,
  deleteJobById,
  deleteJobCategory,
  deleteJobLevel,
  getCategories,
  getCategoryById,
  getJobById,
  getJobLevelById,
  getJobs,
  rejectJob,
  saveJob,
  submitJobForApproval,
  upadteJobCategory,
  updateJob,
  updateJobLevel,
} from './jobService';

const router = express.Router();

router.route('/').get(getJobs).post(submitJobForApproval);
router.route('/:id').get(getJobById).delete(deleteJobById).patch(updateJob);
router.route('/:id/approve').post(approveJob);
router.route('/:id/reject').post(rejectJob);
router.route(':id/save/:userId').post(saveJob);
router.route('/category').get(getCategories).post(createJobCategory);
router.route('/category/:categoryId').get(getCategoryById).put(upadteJobCategory).delete(deleteJobCategory);
router.route('/level').post(createJobLevel);
router.route('/level/:levelId').get(getJobLevelById).put(updateJobLevel).delete(deleteJobLevel);
export default router;
