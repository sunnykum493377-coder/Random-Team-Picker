const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-team-manager';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    // Clear existing students
    await Student.deleteMany({});
    console.log('✓ Cleared existing students');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new Student({
      username: 'admin',
      password: adminPassword,
      name: 'Administrator',
      studentId: 0,
      isAdmin: true
    });
    await admin.save();
    console.log('✓ Created admin user (username: admin, password: admin123)');
    
    // Create 75 students
    const students = [];
    for (let i = 1; i <= 75; i++) {
      const hashedPassword = await bcrypt.hash(`pass${i}`, 10);
      students.push({
        username: `student${i}`,
        password: hashedPassword,
        name: `Student ${i}`,
        studentId: i,
        isAdmin: false
      });
    }
    
    await Student.insertMany(students);
    console.log(`✓ Created ${students.length} students (student1-student75, password: pass1-pass75)`);
    
    console.log('\n✓ Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('  Admin: username=admin, password=admin123');
    console.log('  Students: username=student1, password=pass1 (student1-student75)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
