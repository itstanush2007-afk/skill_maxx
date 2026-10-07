'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Sparkles,
  AlertCircle,
  Layers,
} from 'lucide-react';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SelectedSkill {
  skill_name: string;
  level: SkillLevel;
}

interface SkillSelectorProps {
  mode: 'teach' | 'learn';
  selectedSkills: SelectedSkill[];
  onChange: (skills: SelectedSkill[]) => void;
  error?: string;
  minRequired?: number;
}

interface SkillCatalogItem {
  name: string;
  category: 'dev' | 'ai' | 'design' | 'media' | 'business' | 'systems';
  icon?: string;
}

// Curated Master Catalog for campus students
const MASTER_CATALOG: SkillCatalogItem[] = [
  // Development
  { name: 'Python', category: 'dev' },
  { name: 'JavaScript', category: 'dev' },
  { name: 'React', category: 'dev' },
  { name: 'TypeScript', category: 'dev' },
  { name: 'Java', category: 'dev' },
  { name: 'C++', category: 'dev' },
  { name: 'DSA', category: 'dev' },
  { name: 'Next.js', category: 'dev' },
  { name: 'Node.js', category: 'dev' },

  // AI & Data
  { name: 'Machine Learning', category: 'ai' },
  { name: 'AI', category: 'ai' },
  { name: 'Deep Learning', category: 'ai' },
  { name: 'Data Science', category: 'ai' },
  { name: 'Computer Vision', category: 'ai' },

  // Design
  { name: 'UI/UX', category: 'design' },
  { name: 'Figma', category: 'design' },
  { name: 'Product Design', category: 'design' },
  { name: 'Design Systems', category: 'design' },

  // Media & Creative
  { name: 'Video Editing', category: 'media' },
  { name: '3D Modeling', category: 'media' },
  { name: 'Motion Graphics', category: 'media' },

  // Business & Communication
  { name: 'Public Speaking', category: 'business' },
  { name: 'Marketing', category: 'business' },
  { name: 'Product Management', category: 'business' },

  // Systems & Tech
  { name: 'Cybersecurity', category: 'systems' },
  { name: 'Robotics', category: 'systems' },
  { name: 'Cloud & DevOps', category: 'systems' },
  { name: 'Linux', category: 'systems' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Popular' },
  { id: 'dev', label: 'Development' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'design', label: 'Design' },
  { id: 'systems', label: 'Systems & Security' },
  { id: 'business', label: 'Communication' },
];

/**
 * Intelligent normalization of skill capitalization
 */
export function normalizeSkillName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const knownMap: Record<string, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    js: 'JavaScript',
    typescript: 'TypeScript',
    ts: 'TypeScript',
    react: 'React',
    'react.js': 'React',
    reactjs: 'React',
    nextjs: 'Next.js',
    'next.js': 'Next.js',
    nodejs: 'Node.js',
    'node.js': 'Node.js',
    dsa: 'DSA',
    ai: 'AI',
    ml: 'Machine Learning',
    'machine learning': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'ui/ux': 'UI/UX',
    ui: 'UI/UX',
    ux: 'UI/UX',
    figma: 'Figma',
    'c++': 'C++',
    cpp: 'C++',
    'c#': 'C#',
    csharp: 'C#',
    java: 'Java',
    html: 'HTML',
    css: 'CSS',
    sql: 'SQL',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
    postgres: 'PostgreSQL',
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    aws: 'AWS',
    gcp: 'GCP',
    linux: 'Linux',
    git: 'Git',
    github: 'GitHub',
    graphql: 'GraphQL',
    tailwind: 'Tailwind CSS',
    tailwindcss: 'Tailwind CSS',
    'video editing': 'Video Editing',
    'public speaking': 'Public Speaking',
    marketing: 'Marketing',
    cybersecurity: 'Cybersecurity',
    robotics: 'Robotics',
  };

  const lower = trimmed.toLowerCase();
  if (knownMap[lower]) {
    return knownMap[lower];
  }

  // Fallback to intelligent Title Case
  return trimmed
    .split(' ')
    .map((word) => {
      if (word.length <= 1) return word.toUpperCase();
      // Keep acronyms like API, SDK uppercase
      if (word === word.toUpperCase() && word.length <= 4) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  mode,
  selectedSkills,
  onChange,
  error,
  minRequired = 1,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [duplicateAlert, setDuplicateAlert] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isTeachMode = mode === 'teach';

  // Config colors according to mode
  const theme = isTeachMode
    ? {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        activePill: 'bg-emerald-500 text-black font-semibold shadow-emerald-500/20',
        ring: 'focus:border-emerald-500/60 focus:ring-emerald-500/10',
        accentText: 'text-emerald-400',
        borderAccent: 'border-emerald-500/30',
        glow: 'from-emerald-500/10 to-transparent',
        levelLabel: 'Proficiency Level',
        descriptions: {
          beginner: 'Can teach fundamentals & guide basics',
          intermediate: 'Comfortable mentoring on projects',
          advanced: 'Mastery in system architecture & optimization',
        },
      }
    : {
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        activePill: 'bg-blue-500 text-white font-semibold shadow-blue-500/20',
        ring: 'focus:border-blue-500/60 focus:ring-blue-500/10',
        accentText: 'text-blue-400',
        borderAccent: 'border-blue-500/30',
        glow: 'from-blue-500/10 to-transparent',
        levelLabel: 'Desired Goal Level',
        descriptions: {
          beginner: 'Want to learn foundations & syntax',
          intermediate: 'Want to build independent projects',
          advanced: 'Aiming for production-grade expertise',
        },
      };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter master catalog
  const filteredSuggestions = useMemo(() => {
    return MASTER_CATALOG.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase().trim());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  // Check if a skill name is already selected
  const isSelected = (name: string) => {
    const target = name.toLowerCase().trim();
    return selectedSkills.some((s) => s.skill_name.toLowerCase().trim() === target);
  };

  const handleAddSkill = (rawName: string, defaultLevel: SkillLevel = 'intermediate') => {
    const normalized = normalizeSkillName(rawName);
    if (!normalized) return;

    if (isSelected(normalized)) {
      setDuplicateAlert(`"${normalized}" is already in your list.`);
      setTimeout(() => setDuplicateAlert(null), 3000);
      return;
    }

    setDuplicateAlert(null);
    onChange([...selectedSkills, { skill_name: normalized, level: defaultLevel }]);
    setQuery('');
    setIsDropdownOpen(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    onChange(
      selectedSkills.filter(
        (s) => s.skill_name.toLowerCase() !== skillName.toLowerCase()
      )
    );
  };

  const handleLevelChange = (skillName: string, level: SkillLevel) => {
    onChange(
      selectedSkills.map((s) =>
        s.skill_name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
      )
    );
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* 1. Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isTeachMode ? 'What can you teach or mentor in?' : 'What do you want to learn?'}
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}
            >
              {isTeachMode ? 'Mentorship Superpower' : 'Learning Goal'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isTeachMode
              ? 'Select skills you are confident explaining to peers.'
              : 'Choose topics you want matched study partners for.'}
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Selected:</span>
          <span
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono border ${
              selectedSkills.length >= minRequired
                ? `${theme.badge}`
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* 2. Interactive Search & Autocomplete Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (query.trim()) {
                  handleAddSkill(query);
                }
              } else if (e.key === 'Escape') {
                setIsDropdownOpen(false);
              }
            }}
            placeholder={
              isTeachMode
                ? 'Type to search or add custom skill (e.g. Next.js, Rust, Figma)...'
                : 'Search or add what you want to learn (e.g. DSA, Docker, UI/UX)...'
            }
            className={`w-full rounded-2xl bg-slate-900/90 border border-slate-800/90 py-3.5 pl-11 pr-28 text-sm text-white placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${theme.ring} shadow-inner`}
          />

          {/* Quick Actions Right Side */}
          <div className="absolute right-2 flex items-center gap-1.5">
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {query.trim() && !isSelected(query) ? (
              <button
                type="button"
                onClick={() => handleAddSkill(query)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${theme.activePill}`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </button>
            ) : (
              <span className="hidden sm:inline-block text-[10px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
                ↵ Enter
              </span>
            )}
          </div>
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isDropdownOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl p-2 max-h-64 overflow-y-auto space-y-1">
            {/* Custom add row if not in suggestions */}
            {!isSelected(query) && (
              <button
                type="button"
                onClick={() => handleAddSkill(query)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 flex items-center justify-between text-xs text-slate-200 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    +
                  </div>
                  <span>
                    Add custom skill: <strong className="text-white">"{normalizeSkillName(query)}"</strong>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300">
                  Click to add
                </span>
              </button>
            )}

            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => {
                const alreadySelected = isSelected(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={alreadySelected}
                    onClick={() => handleAddSkill(item.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      alreadySelected
                        ? 'opacity-40 cursor-not-allowed bg-slate-950/40 text-slate-400'
                        : 'hover:bg-slate-800 text-slate-200 cursor-pointer'
                    }`}
                  >
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {alreadySelected ? 'Already Added' : item.category}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No standard catalog match. You can still add "{normalizeSkillName(query)}" as a custom skill above!
              </div>
            )}
          </div>
        )}

        {/* Duplicate Warning Toast */}
        {duplicateAlert && (
          <div className="mt-2 flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{duplicateAlert}</span>
          </div>
        )}
      </div>

      {/* 3. Curated Popular Skills & Category Filter */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Suggested Campus Skills</span>
          </span>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-all shrink-0 select-none ${
                  activeCategory === cat.id
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pills Grid */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredSuggestions.map((skill) => {
            const added = isSelected(skill.name);
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => {
                  if (added) {
                    handleRemoveSkill(skill.name);
                  } else {
                    handleAddSkill(skill.name);
                  }
                }}
                className={`group text-xs px-3.5 py-2 rounded-xl border transition-all duration-150 flex items-center gap-2 select-none active:scale-95 ${
                  added
                    ? `${theme.badge} ring-1 ring-inset ${theme.borderAccent} font-semibold shadow-sm`
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    added ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {added ? <Check className="w-3 h-3 stroke-[3]" /> : '+'}
                </span>
                <span>{skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Skills with Interactive Proficiency Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Active {isTeachMode ? 'Teaching' : 'Learning'} Set</span>
          </label>
          <span className="text-[11px] text-slate-500">
            Click levels below to calibrate proficiency
          </span>
        </div>

        {selectedSkills.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-10 rounded-2xl border-2 border-dashed border-slate-800/80 bg-slate-950/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-500 shadow-inner">
              <Sparkles className="w-6 h-6 text-slate-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-300">
                No {isTeachMode ? 'teaching' : 'learning'} skills added yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Pick at least 1 skill from the curated suggestions above or enter custom skills to unlock campus matchmaking.
              </p>
            </div>
          </div>
        ) : (
          /* Selected Skill Cards Grid */
          <div className="grid grid-cols-1 gap-2.5">
            {selectedSkills.map((item) => (
              <div
                key={item.skill_name}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm group"
              >
                {/* Skill Name & Mode Marker */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${
                      isTeachMode
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {isTeachMode ? '⚡' : '🎯'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight truncate">
                      {item.skill_name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {theme.levelLabel}:{' '}
                      <span className={`capitalize font-semibold ${theme.accentText}`}>
                        {item.level}
                      </span>{' '}
                      <span className="text-slate-500">
                        • {theme.descriptions[item.level]}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Level Segmented Switch & Remove */}
                <div className="flex items-center gap-2 justify-between md:justify-end self-stretch md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  {/* Segmented Controller */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/90">
                    {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleLevelChange(item.skill_name, lvl)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-150 capitalize font-medium select-none ${
                          item.level === lvl
                            ? `${theme.activePill} text-xs font-semibold shadow-sm`
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title={theme.descriptions[lvl]}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skill_name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title={`Remove ${item.skill_name}`}
                    aria-label={`Remove ${item.skill_name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      </div>
    </div>
  );
};
