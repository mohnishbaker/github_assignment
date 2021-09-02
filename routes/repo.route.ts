import express from 'express';
import repoController from '../controller/repo.controller';

const router = express.Router();

router.post('/repoSearch', repoController.repoSearch);

export { router as repoRoute };
