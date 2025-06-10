const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
const Location = require('./models/Location');
const DenialReason = require('./models/DenialReason');
const VacationRequest = require('./models/VacationRequest');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vacation_app';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Employee.deleteMany({});
    await Location.deleteMany({});
    await DenialReason.deleteMany({});
    await VacationRequest.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password', 10);

    // Create Locations
    const locations = await Location.insertMany([
      { name: 'New York Office', address: '123 Broadway, New York, NY 10001' },
      { name: 'Los Angeles Office', address: '456 Sunset Blvd, Los Angeles, CA 90028' },
      { name: 'Chicago Office', address: '789 Michigan Ave, Chicago, IL 60611' },
      { name: 'Remote', address: 'Work from home' },
      { name: 'Austin Office', address: '321 Congress Ave, Austin, TX 78701' }
    ]);
    console.log('Created locations');

    // Create Denial Reasons
    const denialReasons = await DenialReason.insertMany([
      { 
        reason: 'Insufficient Notice', 
        description: 'Request submitted with less than required advance notice',
        active: true 
      },
      { 
        reason: 'Business Critical Period', 
        description: 'Request conflicts with busy season or important deadlines',
        active: true 
      },
      { 
        reason: 'Staffing Shortage', 
        description: 'Not enough coverage available during requested period',
        active: true 
      },
      { 
        reason: 'Previous Request Approved', 
        description: 'Employee already has approved vacation time in the same period',
        active: true 
      },
      { 
        reason: 'Training Period', 
        description: 'Employee is in training or onboarding phase',
        active: true 
      },
      { 
        reason: 'Other', 
        description: 'Reason not covered by standard categories',
        active: true 
      }
    ]);
    console.log('Created denial reasons');

    const admins = await Employee.insertMany([
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@company.com',
        password: hashedPassword,
        role: 'administrator'
      },
      {
        first_name: 'Js',
        last_name: 'Robertso',
        email: 'jsrobertso@gmail.com',
        password: hashedPassword,
        role: 'administrator'
      }
    ]);

    // Create Employees (Supervisors first)
    const supervisors = await Employee.insertMany([
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@company.com',
        password: hashedPassword,
        location_id: locations[0]._id, // New York
        role: 'supervisor'
      },
      {
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@company.com',
        password: hashedPassword,
        location_id: locations[1]._id, // Los Angeles
        role: 'supervisor'
      },
      {
        first_name: 'Jennifer',
        last_name: 'Rodriguez',
        email: 'jennifer.rodriguez@company.com',
        password: hashedPassword,
        location_id: locations[2]._id, // Chicago
        role: 'supervisor'
      }
    ]);
    console.log('Created supervisors');

    // Create Regular Employees
    const employees = await Employee.insertMany([
      {
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@company.com',
        password: hashedPassword,
        location_id: locations[0]._id,
        role: 'employee',
        supervisor_id: supervisors[0]._id
      },
      {
        first_name: 'Emma',
        last_name: 'Wilson',
        email: 'emma.wilson@company.com',
        password: hashedPassword,
        location_id: locations[0]._id,
        role: 'employee',
        supervisor_id: supervisors[0]._id
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        email: 'david.brown@company.com',
        password: hashedPassword,
        location_id: locations[1]._id,
        role: 'employee',
        supervisor_id: supervisors[1]._id
      },
      {
        first_name: 'Lisa',
        last_name: 'Davis',
        email: 'lisa.davis@company.com',
        password: hashedPassword,
        location_id: locations[1]._id,
        role: 'employee',
        supervisor_id: supervisors[1]._id
      },
      {
        first_name: 'Robert',
        last_name: 'Miller',
        email: 'robert.miller@company.com',
        password: hashedPassword,
        location_id: locations[2]._id,
        role: 'employee',
        supervisor_id: supervisors[2]._id
      },
      {
        first_name: 'Ashley',
        last_name: 'Garcia',
        email: 'ashley.garcia@company.com',
        password: hashedPassword,
        location_id: locations[2]._id,
        role: 'employee',
        supervisor_id: supervisors[2]._id
      },
      {
        first_name: 'James',
        last_name: 'Anderson',
        email: 'james.anderson@company.com',
        password: hashedPassword,
        location_id: locations[3]._id, // Remote
        role: 'employee',
        supervisor_id: supervisors[0]._id
      },
      {
        first_name: 'Maria',
        last_name: 'Martinez',
        email: 'maria.martinez@company.com',
        password: hashedPassword,
        location_id: locations[4]._id, // Austin
        role: 'employee',
        supervisor_id: supervisors[1]._id
      },
      {
        first_name: 'Christopher',
        last_name: 'Taylor',
        email: 'christopher.taylor@company.com',
        password: hashedPassword,
        location_id: locations[0]._id,
        role: 'employee',
        supervisor_id: supervisors[0]._id
      },
      {
        first_name: 'Amanda',
        last_name: 'Thomas',
        email: 'amanda.thomas@company.com',
        password: hashedPassword,
        location_id: locations[1]._id,
        role: 'employee',
        supervisor_id: supervisors[1]._id
      }
    ]);
    console.log('Created employees');

    // Create Vacation Requests with various statuses
    const allEmployees = [...supervisors, ...employees];
    
    const vacationRequests = await VacationRequest.insertMany([
      // Pending requests
      {
        employee_id: employees[0]._id, // John Smith
        start_date: new Date('2024-07-15'),
        end_date: new Date('2024-07-19'),
        days_requested: 5,
        reason: 'Family vacation to the beach',
        status: 'pending'
      },
      {
        employee_id: employees[2]._id, // David Brown
        start_date: new Date('2024-08-01'),
        end_date: new Date('2024-08-02'),
        days_requested: 2,
        reason: 'Wedding anniversary',
        status: 'pending'
      },
      {
        employee_id: employees[4]._id, // Robert Miller
        start_date: new Date('2024-09-10'),
        end_date: new Date('2024-09-20'),
        days_requested: 11,
        reason: 'European vacation',
        status: 'pending'
      },
      
      // Approved requests
      {
        employee_id: employees[1]._id, // Emma Wilson
        start_date: new Date('2024-06-01'),
        end_date: new Date('2024-06-07'),
        days_requested: 7,
        reason: 'Graduation ceremony',
        status: 'approved',
        supervisor_id: supervisors[0]._id,
        approval_date: new Date('2024-05-15')
      },
      {
        employee_id: employees[3]._id, // Lisa Davis
        start_date: new Date('2024-07-04'),
        end_date: new Date('2024-07-04'),
        days_requested: 1,
        reason: 'Independence Day celebration',
        status: 'approved',
        supervisor_id: supervisors[1]._id,
        approval_date: new Date('2024-06-20')
      },
      {
        employee_id: employees[6]._id, // James Anderson
        start_date: new Date('2024-08-15'),
        end_date: new Date('2024-08-25'),
        days_requested: 11,
        reason: 'Camping trip with family',
        status: 'approved',
        supervisor_id: supervisors[0]._id,
        approval_date: new Date('2024-07-01')
      },
      
      // Denied requests
      {
        employee_id: employees[5]._id, // Ashley Garcia
        start_date: new Date('2024-05-20'),
        end_date: new Date('2024-05-24'),
        days_requested: 5,
        reason: 'Personal matters',
        status: 'denied',
        supervisor_id: supervisors[2]._id,
        denial_reason_id: denialReasons[0]._id, // Insufficient Notice
        denial_comments: 'Request submitted only 3 days in advance. Please submit requests at least 2 weeks prior.',
        denial_date: new Date('2024-05-18')
      },
      {
        employee_id: employees[7]._id, // Maria Martinez
        start_date: new Date('2024-12-20'),
        end_date: new Date('2024-12-31'),
        days_requested: 12,
        reason: 'Holiday vacation',
        status: 'denied',
        supervisor_id: supervisors[1]._id,
        denial_reason_id: denialReasons[1]._id, // Business Critical Period
        denial_comments: 'Year-end is our busiest period. Please consider rescheduling to January.',
        denial_date: new Date('2024-05-10')
      },
      
      // Additional requests for variety
      {
        employee_id: employees[8]._id, // Christopher Taylor
        start_date: new Date('2024-10-15'),
        end_date: new Date('2024-10-18'),
        days_requested: 4,
        reason: 'Medical appointment and recovery',
        status: 'pending'
      },
      {
        employee_id: employees[9]._id, // Amanda Thomas
        start_date: new Date('2024-11-25'),
        end_date: new Date('2024-11-29'),
        days_requested: 5,
        reason: 'Thanksgiving week',
        status: 'approved',
        supervisor_id: supervisors[1]._id,
        approval_date: new Date('2024-05-20')
      }
    ]);
    console.log('Created vacation requests');

    // Display summary
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Locations: ${locations.length}`);
    console.log(`Denial Reasons: ${denialReasons.length}`);
    console.log(`Supervisors: ${supervisors.length}`);
    console.log(`Employees: ${employees.length}`);
    console.log(`Vacation Requests: ${vacationRequests.length}`);
    console.log('\nStatus breakdown:');
    console.log(`Pending: ${vacationRequests.filter(r => r.status === 'pending').length}`);
    console.log(`Approved: ${vacationRequests.filter(r => r.status === 'approved').length}`);
    console.log(`Denied: ${vacationRequests.filter(r => r.status === 'denied').length}`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();