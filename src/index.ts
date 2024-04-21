import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/user', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
