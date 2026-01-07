const express = require('express');
const app = express();
const port = 3000;
const authRoute = require('./routes/auth');
const connectDB = require('./db/conn');
const User = require('./models/user');
const recordRoute = require('./routes/recordop')
const userRoute = require('./routes/users')
const cors = require('cors');
const path = require('path');
require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

connectDB()
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use('/auth', authRoute);
app.use('/record', recordRoute);
app.use('/users', userRoute);

// Catch-all route for React Router
app.get('/*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});