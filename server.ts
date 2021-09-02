import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { routes } from './routes';
dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use('/', routes);
mongoose.connect(`${process.env.DATABASE_URL}`, () => {
  console.log('connected to mongoose...');
});
app.listen(PORT, () => {
  return console.log(`Listening to port ${PORT}`);
});
