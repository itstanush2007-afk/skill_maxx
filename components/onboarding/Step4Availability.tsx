import React from 'react';
import { Availability, AvailabilityMode } from '../../types/profile';
import { Calendar, Clock, Globe, MapPin, Sparkles } from 'lucide-react';

interface Step4Props {
  availability: Availability;
  onChange: (availability: Availability) => void;
  errors: Record<string, string>;
}

const DAYS_OF_WEEK = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];

const TIME_SLOTS = [
  { id: 'Morning (8:00 AM - 12:00 PM)', label: 'Morning', sub: '8:00 AM - 12:00 PM' },
  { id: 'Afternoon (1:00 PM - 5:00 PM)', label: 'Afternoon', sub: '1:00 PM - 5:00 PM' },
  { id: 'Evening (6:00 PM - 9:00 PM)', label: 'Evening', sub: '6:00 PM - 9:00 PM' },
  { id: 'Night Owl (9:00 PM - 12:00 AM)', label: 'Night Owl', sub: '9:00 PM - 12:00 AM' },
  { id: 'Flexible / Any Time', label: 'Flexible', sub: 'Open to negotiate' },
];

const MODES: { value: AvailabilityMode; title: string; desc: string; icon: any }[] = [
  {
    value: 'online',
    title: 'Online Only',
    desc: 'Google Meet, Zoom, or Discord voice sessions',
    icon: Globe,
  },
  {
    value: 'in-person',
    title: 'In-Person',
    desc: 'Campus library, cafeteria, or computer labs',
    icon: MapPin,
  },
  {
    value: 'hybrid',
    title: 'Either (Hybrid)',
    desc: 'Comfortable with both online and in-person meetups',
    icon: Sparkles,
  },
];

export const Step4Availability: React.FC<Step4Props> = ({
  availability,
  onChange,
  errors,
}) => {
  const toggleDay = (day: string) => {
    const currentDays = availability.preferred_days || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    onChange({ ...availability, preferred_days: updated });
  };

  const selectAllDays = () => {
    onChange({ ...availability, preferred_days: DAYS_OF_WEEK.map((d) => d.full) });
  };

  const selectWeekdays = () => {
    onChange({
      ...availability,
      preferred_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });
  };

  const selectWeekends = () => {
    onChange({
      ...availability,
      preferred_days: ['Saturday', 'Sunday'],
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="text-[11px] font-mono text-red-400 font-bold tracking-wider uppercase mb-1">
          // STEP 04 • SCHEDULE & COLLABORATION
        </div>
        <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center justify-between">
          <span>Availability & Schedule</span>
          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            PHASE 04
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          // DEFINE CALENDAR SLOTS, TIMESLOTS & INTERACTION PREFERENCES
        </p>
      </div>

      {/* 1. Preferred Days */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <span>Preferred Days <span className="text-red-400">*</span></span>
          </label>
          <div className="flex gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={selectWeekdays}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Weekdays
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={selectWeekends}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Weekends
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={selectAllDays}
              className="text-red-400 hover:text-red-300 transition-colors font-medium"
            >
              All Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 font-mono">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = (availability.preferred_days || []).includes(day.full);
            return (
              <button
                key={day.short}
                type="button"
                onClick={() => toggleDay(day.full)}
                className={`py-2 sm:py-3 px-1 rounded-xl border text-center transition-all select-none active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold border-red-500 shadow-sm shadow-red-500/20'
                    : 'bg-[#030712] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] sm:text-sm font-semibold">{day.short}</div>
                <div className="hidden sm:block text-[10px] opacity-75">{day.full.slice(0, 3)}</div>
              </button>
            );
          })}
        </div>
        {errors.preferred_days && (
          <p className="text-xs text-red-400 font-medium font-mono">{errors.preferred_days}</p>
        )}
      </div>

      {/* 2. Preferred Time */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Preferred Time Slot <span className="text-red-400">*</span></span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono">
          {TIME_SLOTS.map((slot) => {
            const isSelected = availability.preferred_time === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onChange({ ...availability, preferred_time: slot.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#030712] border-red-500/70 text-white shadow-sm shadow-red-500/10'
                    : 'bg-[#030712] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold flex items-center justify-between">
                  <span>{slot.label}</span>
                  {isSelected && <span className="text-red-400 text-xs font-bold">✓</span>}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{slot.sub}</p>
              </button>
            );
          })}
        </div>
        {errors.preferred_time && (
          <p className="text-xs text-red-400 font-medium font-mono">{errors.preferred_time}</p>
        )}
      </div>

      {/* 3. Preferred Mode */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>Interaction Mode <span className="text-red-400">*</span></span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = availability.mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => onChange({ ...availability, mode: m.value })}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#030712] border-red-500/70 shadow-md shadow-red-500/10 ring-1 ring-red-500/20'
                    : 'bg-[#030712] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase">
                      Selected
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{m.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-mono">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
