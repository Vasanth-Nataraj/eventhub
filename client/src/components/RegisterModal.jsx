import React, { useState } from 'react';

export default function RegisterModal({ event, user, isOpen, onClose, onRegisterSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !event) return null;

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    // Retrieve JWT token stored during login
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/registrations/${event._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setConfirmed(true);
      if (onRegisterSuccess) {
        onRegisterSuccess(event._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Direct Seat Confirmation
            </span>
            <h2 className="mt-2 text-lg font-bold text-zinc-900 leading-snug">
              {event.title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-sm font-bold p-1 rounded-md"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4">
          <p className="text-xs text-zinc-600 leading-relaxed">
            {event.description}
          </p>

          {/* Attendee Confirmation Snapshot */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Candidate Credential Binding
            </span>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Attendee Name:</span>
              <span className="font-semibold text-zinc-800">{user.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Verified Email:</span>
              <span className="font-mono text-zinc-700">{user.email}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Event Capacity:</span>
              <span className="font-mono font-medium text-zinc-700">
                {event.registered_count} / {event.capacity} seats filled
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {confirmed && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-700 font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Registration confirmed. Seat reserved in database.
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-lg"
          >
            Close
          </button>

          {!confirmed && (
            <button
              onClick={handleRegister}
              disabled={loading || event.registered_count >= event.capacity}
              className="rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? 'Locking Seat...' : 'Confirm Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}