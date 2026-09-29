import React, { useState } from "react";

// Sample events data (Backend connect pannum bodhu idhu database-la irundhu varum)
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "MongoDB Tech Odyssey Hackathon",
    date: "Oct 15, 2026",
    location: "Online / Main Hall",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    capacity: 100,
    registered: 42,
  },
  {
    id: 2,
    title: "React & Tailwind UI Workshop",
    date: "Oct 20, 2026",
    location: "Lab 3",
    tags: ["React", "UI/UX", "Tailwind"],
    capacity: 50,
    registered: 30,
  },
  {
    id: 3,
    title: "Node.js Backend Masterclass",
    date: "Nov 02, 2026",
    location: "Online",
    tags: ["Node.js", "Express", "API"],
    capacity: 80,
    registered: 65,
  },
];

// Master list of skills for selection
const ALL_SKILLS = [
  "React",
  "MongoDB",
  "Node.js",
  "Express",
  "Tailwind",
  "UI/UX",
  "API",
];

export default function App() {
  // 1. App-oda Gnabagangal (States)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState("skills"); // 'skills' or 'events'
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // Skill click panna add/remove panra function
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Event-ukku register panna button function
  const toggleRegister = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  // Match score calculate panra function (Intha skill evlo match aagudhu nu sollum)
  const calculateMatch = (eventTags) => {
    if (selectedSkills.length === 0) return 0;
    const matches = eventTags.filter((tag) => selectedSkills.includes(tag));
    return Math.round((matches.length / selectedSkills.length) * 100);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-6">
      {/* --- TOP HEADER BAR --- */}
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl font-black text-emerald-400 tracking-wider">
            EventHub
          </h1>
          <p className="text-xs text-zinc-400">Skill-Based Event Matcher</p>
        </div>

        {/* Page Switcher Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage("skills")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentPage === "skills"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            My Skills ({selectedSkills.length})
          </button>

          <button
            onClick={() => setCurrentPage("events")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              currentPage === "events"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            Find Events
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-4xl mx-auto">
        {/* SCREEN 1: SKILL SELECTOR */}
        {currentPage === "skills" && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-2">
              Ungaloda Skills Enna Enna?
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Keezhe irukkura skills-a click panni choose pannunga. Idha vechu
              dhaan ungalukku best events-a kaattuvom!
            </p>

            {/* Clickable Skill Chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              {ALL_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                      isSelected
                        ? "bg-emerald-400 text-black border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {skill} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage("events")}
              disabled={selectedSkills.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-center transition-all ${
                selectedSkills.length > 0
                  ? "bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-lg"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {selectedSkills.length > 0
                ? "Find Matched Events →"
                : "Atleast 1 Skill Choose Pannunga"}
            </button>
          </div>
        )}

        {/* SCREEN 2: MATCHED EVENTS FEED */}
        {currentPage === "events" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recommended Events for You</h2>
              <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
                Based on {selectedSkills.length} selected skills
              </span>
            </div>

            {/* Event Cards Grid */}
            <div className="grid gap-4">
              {SAMPLE_EVENTS.map((event) => {
                const matchScore = calculateMatch(event.tags);
                const isRegistered = registeredEvents.includes(event.id);

                return (
                  <div
                    key={event.id}
                    className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition-all"
                  >
                    <div>
                      {/* Match Badge */}
                      {matchScore > 0 && (
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          🔥 {matchScore}% Skill Match
                        </span>
                      )}

                      <h3 className="text-lg font-bold">{event.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        📅 {event.date} | 📍 {event.location}
                      </p>

                      {/* Event Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2.5 py-1 rounded-lg border ${
                              selectedSkills.includes(tag)
                                ? "bg-zinc-800 text-emerald-400 border-emerald-500/30 font-bold"
                                : "bg-zinc-950 text-zinc-500 border-zinc-800"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Register Button */}
                    <button
                      onClick={() => toggleRegister(event.id)}
                      className={`px-6 py-3 rounded-xl font-bold text-sm w-full md:w-auto transition-all ${
                        isRegistered
                          ? "bg-zinc-800 text-emerald-400 border border-emerald-500/30"
                          : "bg-emerald-500 hover:bg-emerald-400 text-black"
                      }`}
                    >
                      {isRegistered ? "Registered ✓" : "Register Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
