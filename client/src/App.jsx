import React, { useState, useEffect, useRef } from 'react';
import EventCard from './components/EventCard';
import RegisterModal from './components/RegisterModal';
import AuthModal from './components/AuthModal';
import CreateEventModal from './components/CreateEventModal';

const AVAILABLE_SKILLS = [
  "React", "Node.js", "MongoDB", "Express", "Tailwind CSS", 
  "Python", "C++", "Algorithms", "Competitive Programming", "Machine Learning"
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'my-events'
  const [activeSkills, setActiveSkills] = useState(["React", "Node.js", "MongoDB", "Tailwind CSS"]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { name: "Guest User", email: "guest@eventhub.io", skills: [] };
  });

  const isAuthenticated = Boolean(localStorage.getItem('token'));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthSuccess = (data) => {
    if (data.user) {
      setUser(data.user);
      if (data.user.skills && data.user.skills.length > 0) {
        setActiveSkills(data.user.skills);
        loadDashboardData(data.user.skills);
        loadMyRegistrations();
        return;
      }
    }
    loadDashboardData(activeSkills);
    loadMyRegistrations();
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser({ name: "Guest User", email: "guest@eventhub.io", skills: [] });
    setActiveSkills([]);
    setMyEvents([]);
    setIsProfileMenuOpen(false);
    setActiveTab('dashboard');
    loadDashboardData([]);
  };

  const loadDashboardData = async (skillsToQuery) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // 1. Fetch raw event catalog
      const resAll = await fetch('http://localhost:5000/api/events');
      if (resAll.ok) {
        const dataAll = await resAll.json();
        setAllEvents(Array.isArray(dataAll) ? dataAll : []);
      } else {
        setAllEvents([]);
      }

      // 2. Fetch dynamically ranked events from MongoDB aggregation
      const queryString = skillsToQuery.length > 0 
        ? `?skills=${encodeURIComponent(skillsToQuery.join(','))}` 
        : '';

      const resRec = await fetch(`http://localhost:5000/api/events/recommended${queryString}`, {
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token || '' 
        }
      });

      if (resRec.ok) {
        const dataRec = await resRec.json();
        setRecommendedEvents(Array.isArray(dataRec) ? dataRec : []);
      } else {
        setRecommendedEvents([]);
      }
    } catch (err) {
      console.error('API sync error:', err);
      setAllEvents([]);
      setRecommendedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyRegistrations = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMyEvents([]);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/registrations/my', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setMyEvents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  useEffect(() => {
    loadDashboardData(activeSkills);
    if (isAuthenticated) {
      loadMyRegistrations();
    }
  }, [activeSkills]);

  const toggleSkill = (skill) => {
    setActiveSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRegisterSuccess = (eventId) => {
    const updateCount = (list) =>
      list.map((evt) =>
        evt._id === eventId ? { ...evt, registered_count: (evt.registered_count || 0) + 1 } : evt
      );
    setRecommendedEvents(updateCount);
    setAllEvents(updateCount);
    loadMyRegistrations();
  };

  const handleEventCreated = () => {
    loadDashboardData(activeSkills);
  };

  const safeRecommended = Array.isArray(recommendedEvents) ? recommendedEvents : [];
  const safeAll = Array.isArray(allEvents) ? allEvents : [];

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative min-h-screen bg-[#FBFBFA] text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* High-Impact Stripe Gradient Mesh */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] overflow-hidden">
        <div className="absolute -top-24 -left-12 w-[620px] h-[440px] bg-gradient-to-br from-violet-500/50 via-indigo-500/40 to-transparent blur-3xl rounded-full" />
        <div className="absolute -top-16 -right-10 w-[580px] h-[400px] bg-gradient-to-bl from-emerald-400/50 via-teal-400/40 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="h-6 w-6 rounded-md bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">E</div>
              <span className="font-bold tracking-tight text-sm text-zinc-900">EventHub</span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Dashboard
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => { setActiveTab('my-events'); loadMyRegistrations(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'my-events'
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  My Registrations
                  {myEvents.length > 0 && (
                    <span className="h-4 min-w-[16px] px-1 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
                      {myEvents.length}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="rounded-lg bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-colors"
                >
                  + Host Event
                </button>
                
                {/* Profile Circle with Interactive Dropdown Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center focus:outline-none cursor-pointer"
                    title="Account Profile"
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-emerald-400 transition-all">
                      {getUserInitials(user.name)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl z-50 animate-in fade-in duration-100">
                      {/* Identity Card */}
                      <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0">
                          {getUserInitials(user.name)}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{user.name}</h4>
                          <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[9px] font-semibold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Verified Candidate
                          </span>
                        </div>
                      </div>

                      {/* Active Stack Section */}
                      <div className="py-3 border-b border-zinc-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                          Indexed Skills ({activeSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {activeSkills.map((s) => (
                            <span key={s} className="text-[10px] font-medium bg-zinc-50 border border-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Menu Actions */}
                      <div className="pt-2 space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('my-events');
                            setIsProfileMenuOpen(false);
                            loadMyRegistrations();
                          }}
                          className="w-full flex items-center justify-between text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 px-2 py-1.5 rounded-lg transition-colors"
                        >
                          <span>My Registrations</span>
                          <span className="text-[10px] font-bold text-zinc-400 font-mono">
                            {myEvents.length} seats
                          </span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Sign In / Join
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 py-8 space-y-10">
        {activeTab === 'dashboard' ? (
          <>
            {/* Interactive Radar & Skill Selector */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Skill Intersect Engine
                  </span>
                  <h1 className="mt-1 text-2xl font-black text-zinc-900">Welcome, {user.name}</h1>
                  <p className="text-xs text-zinc-500">Toggle indexed skills below to trigger live database re-ranking.</p>
                </div>
                <span className="text-xs font-mono bg-zinc-900 text-white px-3 py-1.5 rounded-lg shrink-0">
                  Active Skills: {activeSkills.length}
                </span>
              </div>

              {/* Interactive Skill Pill Matrix */}
              <div className="mt-4 flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = activeSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      }`}
                    >
                      {skill} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 1: Ranked Recommendations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Algorithmic Recommendations</h2>
                  <p className="text-xs text-zinc-500">Ranked by MongoDB Atlas $setIntersection pipeline.</p>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {safeRecommended.length} Matched
                </span>
              </div>

              {loading ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400 font-mono">
                  Evaluating skill intersection pipeline...
                </div>
              ) : safeRecommended.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center">
                  <p className="text-xs font-medium text-zinc-500">
                    No upcoming competitions match your current active skill filters.
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Select additional technical skills above or browse the general catalog below.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {safeRecommended.slice(0, 3).map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      userSkills={activeSkills}
                      onSelect={() => { setSelectedEvent(event); setIsModalOpen(true); }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Explore All Competitions */}
            <section className="pt-4 border-t border-zinc-200/80">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-zinc-900">Explore All Competitions</h2>
                <p className="text-xs text-zinc-500">Complete catalog of upcoming hackathons and challenges.</p>
              </div>
              
              {loading ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400 font-mono">
                  Loading catalog...
                </div>
              ) : safeAll.length === 0 ? (
                <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
                  No events found in database.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {safeAll.map((event) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      userSkills={activeSkills}
                      onSelect={() => { setSelectedEvent(event); setIsModalOpen(true); }}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* View: My Registrations */
          <section>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
              <div>
                <h2 className="text-xl font-black text-zinc-900">Your Registered Competitions</h2>
                <p className="text-xs text-zinc-500">Verified seats locked in MongoDB Atlas for your account.</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white"
              >
                ← Back to Dashboard
              </button>
            </div>

            {myEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-zinc-800">No active registrations found.</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  You have not claimed a seat in any hackathon yet. Head back to the dashboard to find events matching your stack.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  Browse Matches
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myEvents.map((event) => (
                  <div key={event._id} className="relative">
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        Confirmed Seat
                      </span>
                    </div>
                    <EventCard
                      event={event}
                      userSkills={activeSkills}
                      onSelect={() => { setSelectedEvent(event); setIsModalOpen(true); }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        user={user}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
}