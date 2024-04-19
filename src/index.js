const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/a', (req, res) => {
  res.send('Hello World');
});

app.use('/user', userRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
