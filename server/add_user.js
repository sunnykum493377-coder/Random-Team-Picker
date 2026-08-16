const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const Student = require('./models/Student');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log('Connected to MongoDB');
  const existingUser = await Student.findOne({ username: 'sunny' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('2024btcs178', 10);
    const newStudent = new Student({
      username: 'sunny',
      password: hashedPassword,
      name: 'Sunny',
      studentId: '2024btcs178',
      isAdmin: false
    });
    await newStudent.save();
    console.log('User created: username "sunny", password "2024btcs178"');
  } else {
    console.log('User already exists');
  }
  process.exit(0);
})
.catch(err => {
  console.error('Connection error:', err);
  process.exit(1);
});
