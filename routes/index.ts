import express from 'express';
import { repoRoute } from './repo.route';
import { userRoute } from './user.route';

const app = express();

app.use('/repo', repoRoute);
app.use('/user', userRoute);

export { app as routes };
