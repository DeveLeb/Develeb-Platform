import express from 'express';

import { getJobById, getJobs } from './jobService';

const router = express.Router();

router.route('/:id').get(getJobById);
router.route('/').get(getJobs);

export default router;
