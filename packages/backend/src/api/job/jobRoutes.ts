/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

import express from 'express';
import { deleteJobById, getJobById, patchJob, updateJob } from './jobService';

const router = express.Router();

router.route('/:id').get(getJobById);

export default router;
