import express from 'express';
import bodyParser from 'body-parser';
<<<<<<< HEAD
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
=======

const app = express();
app.use(bodyParser.json());
>>>>>>> main

app.get('/', (req, res) => {
  res.send('Hello World');
});

<<<<<<< HEAD
app.use('/user', userRoutes);

=======
>>>>>>> main
app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
