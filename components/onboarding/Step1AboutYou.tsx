import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Avatar } from '../ui/Avatar';
import { Sparkles } from 'lucide-react';

interface Step1Props {
  fullName: string;
  department: string;
  year: string;
  bio: string;
  avatarUrl: string;
  onChange: (fields: Partial<{
    fullName: string;
    department: string;
    year: string;
    bio: string;
    avatarUrl: string;
  }>) => void;
  errors: Record<string, string>;
}

const DEPARTMENTS = [
  { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering (CSE)' },
  { value: 'Information Technology', label: 'Information Technology (IT)' },
  { value: 'Electronics & Communication', label: 'Electronics & Communication (ECE)' },
  { value: 'Electrical Engineering', label: 'Electrical Engineering (EE)' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering (ME)' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
  { value: 'Design & Interaction (UI/UX)', label: 'Design & Interaction (UI/UX)' },
  { value: 'Business & Management', label: 'Business & Management' },
  { value: 'Biotechnology', label: 'Biotechnology' },
];

const YEARS = [
  { value: '1st Year (Freshman)', label: '1st Year (Freshman)' },
  { value: '2nd Year (Sophomore)', label: '2nd Year (Sophomore)' },
  { value: '3rd Year (Junior)', label: '3rd Year (Junior)' },
  { value: '4th Year (Senior)', label: '4th Year (Senior)' },
  { value: 'Postgraduate / Masters', label: 'Postgraduate / Masters' },
];

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Aria',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Felix',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Luna',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Milo',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Nova',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Zane',
];

export const Step1AboutYou: React.FC<Step1Props> = ({
  fullName,
  department,
  year,
  bio,
  avatarUrl,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Personal Details</span>
          <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Step 1
          </span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Tell other students who you are, your academic focus, and what drives you.
        </p>
      </div>

      {/* Avatar Selection Section */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Profile Avatar
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar src={avatarUrl} name={fullName || 'Student'} size="xl" />

          <div className="flex-1 w-full space-y-2">
            <span className="text-xs text-slate-400 block">
              Choose an avatar preset or paste your custom image URL:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange({ avatarUrl: url })}
                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-slate-800 ${
                    avatarUrl === url
                      ? 'border-emerald-400 ring-2 ring-emerald-500/30 scale-105'
                      : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                      fullName || Math.random().toString()
                    )}`,
                  })
                }
                className="text-xs text-emerald-400 hover:text-emerald-300 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Randomize</span>
              </button>
            </div>
            <Input
              placeholder="Or paste an image link (e.g. https://...)"
              value={avatarUrl}
              onChange={(e) => onChange({ avatarUrl: e.target.value })}
              className="text-xs py-1.5"
            />
          </div>
        </div>
      </div>

      {/* Name Input */}
      <Input
        label="Full Name"
        placeholder="e.g. Alex Sharma"
        value={fullName}
        onChange={(e) => onChange({ fullName: e.target.value })}
        error={errors.fullName}
        required
      />

      {/* Academic Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Department / Major"
          placeholder="Select your department"
          options={DEPARTMENTS}
          value={department}
          onChange={(e) => onChange({ department: e.target.value })}
          error={errors.department}
          required
        />

        <Select
          label="Current Year of Study"
          placeholder="Select your current year"
          options={YEARS}
          value={year}
          onChange={(e) => onChange({ year: e.target.value })}
          error={errors.year}
          required
        />
      </div>

      {/* Bio Field */}
      <Textarea
        label="Short Bio"
        placeholder="Briefly introduce your interests, past projects, or what you enjoy collaborating on..."
        rows={3}
        maxLength={250}
        value={bio}
        onChange={(e) => onChange({ bio: e.target.value })}
        error={errors.bio}
        helperText="Keep it short and friendly for your campus peers."
      />
    </div>
  );
};
