const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');
const User = require('./models/User');

const sampleEvents = [
  {
    title: "Smart India Hackathon (SIH) 2026 - Software Edition",
    description: "National-level 36-hour hackathon tackling problem statements provided by central ministries, state departments, and industry partners.",
    date: new Date("2026-10-18T08:30:00Z"),
    capacity: 120,
    registered_count: 42,
    // Contains 3 exact matches for a high-priority match score
    tags: ["React", "Node.js", "MongoDB", "Python", "Problem Solving"],
    status: "upcoming"
  },
  {
    title: "Flipkart GRiD 8.0 - Software Development Track",
    description: "Flagship engineering campus challenge focused on real-world e-commerce problems, distributed systems, and scalable backend design.",
    date: new Date("2026-10-28T10:00:00Z"),
    capacity: 200,
    registered_count: 85,
    // Contains 2 exact matches (Node.js, Express)
    tags: ["Node.js", "Express", "System Design", "C++", "Algorithms"],
    status: "upcoming"
  },
  {
    title: "Microsoft Imagine Cup 2027 - Preliminary Round",
    description: "Global student developer competition to build production-ready startup MVPs leveraging Microsoft Azure and applied machine learning models.",
    date: new Date("2026-12-04T10:30:00Z"),
    capacity: 100,
    registered_count: 27,
    // Contains 2 exact matches (React, Tailwind CSS)
    tags: ["React", "Tailwind CSS", "Azure", "Machine Learning", "TypeScript"],
    status: "upcoming"
  },
  {
    title: "Tata Imagination Challenge 2026",
    description: "National student innovation challenge inviting functional prototypes and business solutions across technology, sustainability, and social impact.",
    date: new Date("2026-11-05T09:00:00Z"),
    capacity: 150,
    registered_count: 60,
    // Contains 1 exact match (React)
    tags: ["Product Design", "React", "AI", "Case Study"],
    status: "upcoming"
  },
  {
    title: "Google Solution Challenge 2027",
    description: "Annual hackathon tasking university students to build software projects resolving one or more of the United Nations 17 Sustainable Development Goals.",
    date: new Date("2027-01-12T09:00:00Z"),
    capacity: 150,
    registered_count: 19,
    // Contains 1 exact match (MongoDB)
    tags: ["MongoDB", "Google Cloud", "Mobile", "AI", "Open Source"],
    status: "upcoming"
  },
  {
    title: "ACM-ICPC Asia Regional Contest",
    description: "Multi-tiered collegiate algorithmic programming championship testing fast mathematical logic, data structures, and optimized execution.",
    date: new Date("2026-11-15T09:00:00Z"),
    capacity: 90,
    registered_count: 38,
    // Pure open track / competitive programming track (0 skill matches)
    tags: ["Competitive Programming", "C++", "Algorithms", "Data Structures"],
    status: "upcoming"
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas for seeding...");

    // Find the first registered user to assign as organizer
    let defaultOrganizer = await User.findOne();
    const organizerId = defaultOrganizer ? defaultOrganizer._id : new mongoose.Types.ObjectId();

    // Attach organizerId to all sample documents
    const preparedEvents = sampleEvents.map(evt => ({
      ...evt,
      organizerId: organizerId
    }));

    // Clear existing collection and insert verified competition records
    await Event.deleteMany({});
    await Event.insertMany(preparedEvents);

    console.log("Successfully seeded 6 official student hackathons and contests with valid schema references.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
}

seedDB();