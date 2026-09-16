require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("./models/Course");
const Notice = require("./models/Notice");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_website";

const courses = [
  { name: "Computer Engineering", level: "Diploma", department: "Computer", duration: "3 Years", intake: 60, summary: "Programming, databases, networking and web/app development with lab-first teaching.", slug: "diploma-computer-engineering", order: 1 },
  { name: "Information Technology", level: "Diploma", department: "IT", duration: "3 Years", intake: 60, summary: "Systems administration, cloud basics, and software development fundamentals.", slug: "diploma-information-technology", order: 2 },
  { name: "Mechanical Engineering", level: "Diploma", department: "Mechanical", duration: "3 Years", intake: 60, summary: "Design, manufacturing and CAD/CAM with workshop-based practical training.", slug: "diploma-mechanical-engineering", order: 3 },
  { name: "Electrical Engineering", level: "Diploma", department: "Electrical", duration: "3 Years", intake: 60, summary: "Power systems, control, and industrial electrical maintenance.", slug: "diploma-electrical-engineering", order: 4 },
  { name: "Civil Engineering", level: "Diploma", department: "Civil", duration: "3 Years", intake: 60, summary: "Structural design, surveying, and construction management basics.", slug: "diploma-civil-engineering", order: 5 },
  { name: "Computer Engineering", level: "Degree", department: "Computer", duration: "4 Years", intake: 120, summary: "Full B.Tech program with electives in AI, data science and systems.", slug: "btech-computer-engineering", order: 6 },
];

const notices = [
  { title: "Admissions open for Diploma & B.Tech programs, 2026–27", category: "Admission", pinned: true },
  { title: "First-year merit list published", category: "Admission", pinned: true },
  { title: "Winter semester examination timetable released", category: "Exam", pinned: false },
  { title: "Annual technical fest — registrations open", category: "Event", pinned: false },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected. Seeding...");
  await Course.deleteMany({});
  await Notice.deleteMany({});
  await Course.insertMany(courses);
  await Notice.insertMany(notices);
  console.log("Seed complete.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
