import React from 'react';

export default function EventCard({ event, userSkills = [], onSelect }) {
  const matchedTags = event.tags.filter(tag => userSkills.includes(tag));
  const matchPercentage = Math.min(
    Math.round((matchedTags.length / event.tags.length) * 100),
    100
  );
  
  const fillPercentage = Math.round((event.registered_count / event.capacity) * 100);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-zinc-300 hover:shadow-md">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">
              Hackathon
            </span>
            <h3 className="mt-1 text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors leading-snug">
              {event.title}
            </h3>
          </div>

          {/* Dynamic Date Stamp Block */}
          {(() => {
            const d = event.date ? new Date(event.date) : new Date();
            const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
            const day = d.getDate();
            return (
              <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 min-w-[48px] shrink-0">
                <span className="text-[9px] font-bold uppercase text-zinc-400">{month}</span>
                <span className="text-sm font-black text-zinc-800">{day}</span>
              </div>
            );
          })()}
        </div>

        {/* Match Percentage Badge */}
        {event.matchScore > 0 ? (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700">
              {matchPercentage}% Skill Match
            </span>
          </div>
        ) : (
          <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 border border-zinc-200">
            <span className="text-[11px] font-medium text-zinc-500">Open Track</span>
          </div>
        )}

        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Skill Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => {
            const isMatched = userSkills.includes(tag);
            return (
              <span
                key={tag}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  isMatched
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold"
                    : "bg-zinc-50 text-zinc-600 border border-zinc-200"
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* Capacity Progress Bar and Action Button */}
      <div className="mt-5 pt-3.5 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[11px] font-medium text-zinc-400">Capacity</span>
          <span className="text-[11px] font-mono font-semibold text-zinc-700">
            {event.registered_count} / {event.capacity} seats
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mb-4">
          <div 
            className="bg-zinc-800 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
          />
        </div>

        <button
            onClick={onSelect}
            className="w-full rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:scale-[0.99]"
            >
            View & Register
        </button>
      </div>
    </div>
  );
}