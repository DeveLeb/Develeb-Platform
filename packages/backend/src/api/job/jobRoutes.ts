import express from 'express';

//import { deleteJobById, getJobById, patchJob, updateJob } from './jobService';

const router = express.Router();

router.route('/:id').get();

export default router;
