// // // backend/scripts/seedData.js
// // const mongoose = require("mongoose");
// // const User = require("../models/User");
// // const Profile = require("../models/Profile");
// // const Job = require("../models/Job");
// // const Application = require("../models/Application");
// // const bcrypt = require("bcryptjs");

// // mongoose.connect("mongodb://localhost/placement-portal", {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// // async function seedData() {
// //   try {
// //     // Clear existing data
// //     await User.deleteMany({});
// //     await Profile.deleteMany({});
// //     await Job.deleteMany({});
// //     await Application.deleteMany({});

// //     const hashedPassword = await bcrypt.hash("password123", 10);

// //     // Create admin first (no profile needed)
// //     const admin = await User.create({
// //       email: "admin@test.com",
// //       password: hashedPassword,
// //       role: "admin",
// //       verified: true,
// //     });

// //     // Create recruiters (no profile needed)
// //     const recruiters = await User.create([
// //       {
// //         email: "hr@googleinc.com",
// //         password: hashedPassword,
// //         role: "recruiter",
// //         company: "Google",
// //         verified: true,
// //       },
// //       {
// //         email: "careers@microsoft.com",
// //         password: hashedPassword,
// //         role: "recruiter",
// //         company: "Microsoft",
// //         verified: true,
// //       },
// //     ]);

// //     // Create student profiles first
// //     const profile1 = await Profile.create({
// //       name: "John Doe",
// //       rollNumber: "CS2024001",
// //       department: "Computer Science",
// //       cgpa: 8.5,
// //       batch: 2024,
// //       skills: ["JavaScript", "React", "Node.js"],
// //       education: [
// //         {
// //           institution: "Engineering College",
// //           degree: "B.Tech",
// //           year: 2024,
// //           score: 85,
// //         },
// //       ],
// //     });

// //     const profile2 = await Profile.create({
// //       name: "Jane Smith",
// //       rollNumber: "CS2024002",
// //       department: "Computer Science",
// //       cgpa: 9.0,
// //       batch: 2024,
// //       skills: ["Python", "Machine Learning", "Data Science"],
// //       education: [
// //         {
// //           institution: "Engineering College",
// //           degree: "B.Tech",
// //           year: 2024,
// //           score: 90,
// //         },
// //       ],
// //     });

// //     // Create students with profiles
// //     const student1 = await User.create({
// //       email: "cs2024001@college.com",
// //       password: hashedPassword,
// //       role: "student",
// //       verified: true,
// //       profile: profile1._id,
// //     });

// //     const student2 = await User.create({
// //       email: "cs2024002@college.com",
// //       password: hashedPassword,
// //       role: "student",
// //       verified: true,
// //       profile: profile2._id,
// //     });

// //     // Update profiles with user reference
// //     await Profile.findByIdAndUpdate(profile1._id, { user: student1._id });
// //     await Profile.findByIdAndUpdate(profile2._id, { user: student2._id });

// //     // Create jobs
// //     const jobs = await Job.create([
// //       {
// //         company: "Google",
// //         title: "Software Engineer",
// //         description: "Entry level software engineer position",
// //         requirements: ["JavaScript", "Python", "Data Structures"],
// //         eligibility: {
// //           departments: ["Computer Science"],
// //           minCGPA: 8.0,
// //           batch: 2024,
// //         },
// //         numberOfPositions: 5,
// //         applicationDeadline: new Date("2024-12-31"),
// //         status: "open",
// //         createdBy: recruiters[0]._id,
// //       },
// //       {
// //         company: "Microsoft",
// //         title: "Software Development Engineer",
// //         description: "SDE role",
// //         requirements: ["C++", "Data Structures", "System Design"],
// //         eligibility: {
// //           departments: ["Computer Science"],
// //           minCGPA: 8.0,
// //           batch: 2024,
// //         },
// //         numberOfPositions: 3,
// //         applicationDeadline: new Date("2024-12-31"),
// //         status: "open",
// //         createdBy: recruiters[1]._id,
// //       },
// //     ]);

// //     // Create applications
// //     await Application.create([
// //       {
// //         student: student1._id,
// //         job: jobs[0]._id,
// //         status: "applied",
// //         roundStatus: [
// //           {
// //             round: "Initial Application",
// //             status: "pending",
// //             date: new Date(),
// //           },
// //         ],
// //       },
// //       {
// //         student: student2._id,
// //         job: jobs[0]._id,
// //         status: "shortlisted",
// //         roundStatus: [
// //           {
// //             round: "Initial Application",
// //             status: "passed",
// //             date: new Date(),
// //           },
// //         ],
// //       },
// //     ]);

// //     console.log("Test data seeded successfully");
// //     process.exit(0);
// //   } catch (error) {
// //     console.error("Error seeding data:", error);
// //     process.exit(1);
// //   }
// // }

// // seedData();

// // backend/scripts/seedData.js
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const Profile = require("../models/Profile");
// const Job = require("../models/Job");
// const Application = require("../models/Application");
// const bcrypt = require("bcryptjs");

// mongoose.connect("mongodb://localhost/placement-portal", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function seedData() {
//   try {
//     // Clear existing data
//     await User.deleteMany({});
//     await Profile.deleteMany({});
//     await Job.deleteMany({});
//     await Application.deleteMany({});

//     const hashedPassword = await bcrypt.hash("password123", 10);

//     // Create admin
//     await User.create({
//       email: "admin@test.com",
//       password: hashedPassword,
//       role: "admin",
//       verified: true,
//     });

//     // Create recruiters
//     const googleRecruiter = await User.create({
//       email: "hr@googleinc.com",
//       password: hashedPassword,
//       role: "recruiter",
//       company: "Google",
//       verified: true,
//     });

//     const msRecruiter = await User.create({
//       email: "careers@microsoft.com",
//       password: hashedPassword,
//       role: "recruiter",
//       company: "Microsoft",
//       verified: true,
//     });

//     const techCorpRecruiter = await User.create({
//       email: "recruiter@techcorp.com",
//       password: hashedPassword,
//       role: "recruiter",
//       company: "Tech Corp",
//       verified: true,
//     });

//     // Create profiles first
//     const profile1 = new Profile({
//       name: "John Doe",
//       rollNumber: "CS2024001",
//       department: "Computer Science",
//       cgpa: 8.5,
//       batch: 2024,
//       skills: ["JavaScript", "React", "Node.js"],
//       education: [
//         {
//           institution: "Engineering College",
//           degree: "B.Tech",
//           year: 2024,
//           score: 85,
//         },
//       ],
//     });

//     const profile2 = new Profile({
//       name: "Jane Smith",
//       rollNumber: "CS2024002",
//       department: "Computer Science",
//       cgpa: 9.0,
//       batch: 2024,
//       skills: ["Python", "Machine Learning", "Data Science"],
//       education: [
//         {
//           institution: "Engineering College",
//           degree: "B.Tech",
//           year: 2024,
//           score: 90,
//         },
//       ],
//     });

//     const profile3 = new Profile({
//       name: "Bob Wilson",
//       rollNumber: "IT2024001",
//       department: "Information Technology",
//       cgpa: 8.2,
//       batch: 2024,
//       skills: ["Java", "Spring Boot", "MySQL"],
//       education: [
//         {
//           institution: "Engineering College",
//           degree: "B.Tech",
//           year: 2024,
//           score: 82,
//         },
//       ],
//     });

//     // Create students with profiles
//     const student1 = await User.create({
//       email: "cs2024001@college.com",
//       password: hashedPassword,
//       role: "student",
//       verified: true,
//       profile: profile1._id,
//     });

//     const student2 = await User.create({
//       email: "cs2024002@college.com",
//       password: hashedPassword,
//       role: "student",
//       verified: true,
//       profile: profile2._id,
//     });

//     const student3 = await User.create({
//       email: "it2024001@college.com",
//       password: hashedPassword,
//       role: "student",
//       verified: true,
//       profile: profile3._id,
//     });

//     // Set user reference in profiles and save
//     profile1.user = student1._id;
//     profile2.user = student2._id;
//     profile3.user = student3._id;

//     await profile1.save();
//     await profile2.save();
//     await profile3.save();

//     // Create jobs
//     const googleJob = await Job.create({
//       company: "Google",
//       title: "Software Engineer",
//       description: "Entry level software engineer position",
//       requirements: ["JavaScript", "Python", "Data Structures"],
//       eligibility: {
//         departments: ["Computer Science", "Information Technology"],
//         minCGPA: 8.0,
//         batch: 2024,
//       },
//       salary: {
//         ctc: 2000000,
//         breakup: "Base: 1500000, Stock: 300000, Bonus: 200000",
//       },
//       numberOfPositions: 5,
//       applicationDeadline: new Date("2024-12-31"),
//       status: "open",
//       createdBy: googleRecruiter._id,
//     });

//     const msJob = await Job.create({
//       company: "Microsoft",
//       title: "Software Development Engineer",
//       description: "SDE role focusing on cloud technologies",
//       requirements: ["C++", "Data Structures", "System Design"],
//       eligibility: {
//         departments: ["Computer Science"],
//         minCGPA: 8.0,
//         batch: 2024,
//       },
//       salary: {
//         ctc: 1800000,
//         breakup: "Base: 1400000, Stock: 200000, Bonus: 200000",
//       },
//       numberOfPositions: 3,
//       applicationDeadline: new Date("2024-12-31"),
//       status: "open",
//       createdBy: msRecruiter._id,
//     });

//     // Create applications
//     await Application.create([
//       {
//         student: student1._id,
//         job: googleJob._id,
//         status: "applied",
//         roundStatus: [
//           {
//             round: "Initial Application",
//             status: "pending",
//             date: new Date(),
//           },
//         ],
//       },
//       {
//         student: student2._id,
//         job: googleJob._id,
//         status: "shortlisted",
//         roundStatus: [
//           {
//             round: "Initial Application",
//             status: "passed",
//             date: new Date(),
//           },
//         ],
//       },
//     ]);

//     console.log("Test data seeded successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding data:", error);
//     process.exit(1);
//   }
// }

// seedData();

const User = require("../models/User");
const Profile = require("../models/Profile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/placement-portal", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create admin
    await User.create({
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      verified: true,
    });

    // Create recruiters
    const googleRecruiter = await User.create({
      email: "hr@googleinc.com",
      password: hashedPassword,
      role: "recruiter",
      company: "Google",
      verified: true,
    });

    const msRecruiter = await User.create({
      email: "careers@microsoft.com",
      password: hashedPassword,
      role: "recruiter",
      company: "Microsoft",
      verified: true,
    });

    const techCorpRecruiter = await User.create({
      email: "recruiter@techcorp.com",
      password: hashedPassword,
      role: "recruiter",
      company: "Tech Corp",
      verified: true,
    });

    // Create profiles first
    const profile1 = new Profile({
      name: "John Doe",
      rollNumber: "CS2024001",
      department: "Computer Science",
      cgpa: 8.5,
      batch: 2024,
      skills: ["JavaScript", "React", "Node.js"],
      education: [
        {
          institution: "Engineering College",
          degree: "B.Tech",
          year: 2024,
          score: 85,
        },
      ],
      projects: [
        {
          title: "Project A",
          description: "Description of project A",
          technologies: ["React", "Node.js"],
          links: [
            { type: "GitHub", url: "https://github.com/johndoe/project-a" },
            { type: "Live", url: "https://project-a.com" },
          ],
        },
      ],
    });

    const profile2 = new Profile({
      name: "Jane Smith",
      rollNumber: "CS2024002",
      department: "Computer Science",
      cgpa: 9.0,
      batch: 2024,
      skills: ["Python", "Machine Learning", "Data Science"],
      education: [
        {
          institution: "Engineering College",
          degree: "B.Tech",
          year: 2024,
          score: 90,
        },
      ],
      projects: [
        {
          title: "Project B",
          description: "Description of project B",
          technologies: ["Python", "TensorFlow"],
          links: [
            { type: "GitHub", url: "https://github.com/janesmith/project-b" },
            { type: "Live", url: "https://project-b.com" },
          ],
        },
      ],
    });

    const profile3 = new Profile({
      name: "Bob Wilson",
      rollNumber: "IT2024001",
      department: "Information Technology",
      cgpa: 8.2,
      batch: 2024,
      skills: ["Java", "Spring Boot", "MySQL"],
      education: [
        {
          institution: "Engineering College",
          degree: "B.Tech",
          year: 2024,
          score: 82,
        },
      ],
      projects: [
        {
          title: "Project C",
          description: "Description of project C",
          technologies: ["Java", "Spring Boot"],
          links: [
            { type: "GitHub", url: "https://github.com/bobwilson/project-c" },
            { type: "Live", url: "https://project-c.com" },
          ],
        },
      ],
    });

    // Create students with profiles
    const student1 = await User.create({
      email: "cs2024001@college.com",
      password: hashedPassword,
      role: "student",
      verified: true,
      profile: profile1._id,
    });

    const student2 = await User.create({
      email: "cs2024002@college.com",
      password: hashedPassword,
      role: "student",
      verified: true,
      profile: profile2._id,
    });

    const student3 = await User.create({
      email: "it2024001@college.com",
      password: hashedPassword,
      role: "student",
      verified: true,
      profile: profile3._id,
    });

    // Set user reference in profiles and save
    profile1.user = student1._id;
    profile2.user = student2._id;
    profile3.user = student3._id;

    await profile1.save();
    await profile2.save();
    await profile3.save();

    // Create jobs
    const googleJob = await Job.create({
      company: "Google",
      title: "Software Engineer",
      description: "Entry level software engineer position",
      requirements: ["JavaScript", "Python", "Data Structures"],
      eligibility: {
        departments: ["Computer Science", "Information Technology"],
        minCGPA: 8.0,
        batch: 2024,
      },
      salary: {
        ctc: 2000000,
        breakup: "Base: 1500000, Stock: 300000, Bonus: 200000",
      },
      numberOfPositions: 5,
      applicationDeadline: new Date("2024-12-31"),
      status: "open",
      createdBy: googleRecruiter._id,
    });

    const msJob = await Job.create({
      company: "Microsoft",
      title: "Software Development Engineer",
      description: "SDE role focusing on cloud technologies",
      requirements: ["C++", "Data Structures", "System Design"],
      eligibility: {
        departments: ["Computer Science"],
        minCGPA: 8.0,
        batch: 2024,
      },
      salary: {
        ctc: 1800000,
        breakup: "Base: 1400000, Stock: 200000, Bonus: 200000",
      },
      numberOfPositions: 3,
      applicationDeadline: new Date("2024-12-31"),
      status: "open",
      createdBy: msRecruiter._id,
    });

    // Create applications
    await Application.create([
      {
        student: student1._id,
        job: googleJob._id,
        status: "applied",
        roundStatus: [
          {
            round: "Initial Application",
            status: "pending",
            date: new Date(),
          },
        ],
      },
      {
        student: student2._id,
        job: googleJob._id,
        status: "shortlisted",
        roundStatus: [
          {
            round: "Initial Application",
            status: "passed",
            date: new Date(),
          },
        ],
      },
    ]);

    console.log("Test data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
