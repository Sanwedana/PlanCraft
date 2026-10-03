import React from 'react';
import { Sparkles, Clock, BookOpen, GraduationCap, ChevronDown, Check, ArrowRight } from 'lucide-react';

const CLASS_LEVELS = [
  'Kindergarten & Early Childhood',
  'Elementary School (Grades 1-2)',
  'Elementary School (Grades 3-5)',
  'Middle School (Grades 6-8)',
  'High School (Grades 9-10)',
  'High School (Grades 11-12)',
  'Undergraduate / College',
  'Graduate & Professional Studies',
  'Adult & Continuing Education',
  'General / All Levels',
];

const QUICK_TOPICS = [
  { label: 'Photosynthesis', level: 'Middle School (Grades 6-8)', mins: '45' },
  { label: 'Quadratic Equations', level: 'High School (Grades 9-10)', mins: '50' },
  { label: 'Causes of the Cold War', level: 'High School (Grades 11-12)', mins: '60' },
  { label: 'Persuasive Writing', level: 'Elementary School (Grades 3-5)', mins: '40' },
  { label: 'Fraction Division', level: 'Elementary School (Grades 3-5)', mins: '30' },
];

const DURATION_PRESETS = ['15', '30', '45', '50', '60', '90'];

export const LessonForm = ({
  topic,
  setTopic,
  classLevel,
  setClassLevel,
  totalMinutes,
  setTotalMinutes,
  framework,
  setFramework,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-stone-300 transition-all"
    >
      {/* Header section with context indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-semibold block mb-1">
            Rapid Class Preparation Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
            Plan Tomorrow's Class in Under 10 Minutes
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-relaxed">
            Construct a mathematically exact, research-backed instructional plan with pedagogical phases and formative checkpoints.
          </p>
        </div>

        {/* 10-Minute Teacher Prep indicator */}
        <div className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50/80 border border-stone-200/90 px-3.5 py-2 rounded-xl shrink-0 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-amber-800" />
          <span>Teacher prep time: <strong className="font-semibold text-stone-900 font-mono">&lt; 10 min</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-6">
        {/* Topic Input */}
        <div className="md:col-span-5 space-y-1.5">
          <label htmlFor="topic-input" className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-700">
            01 · Lesson Topic or Standard <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <input
              id="topic-input"
              name="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Mitosis, Quadratic Equations, Cold War..."
              className="w-full pl-10 pr-3.5 py-2.5 text-sm text-stone-900 bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Quick topic inspiration pills */}
          <div className="pt-1.5 flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] text-stone-400 font-medium">Quick ideas:</span>
            {QUICK_TOPICS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setTopic(item.label);
                  setClassLevel(item.level);
                  setTotalMinutes(item.mins);
                }}
                className="text-[11px] text-stone-600 hover:text-amber-950 hover:bg-amber-50/80 px-2 py-0.5 rounded-md border border-stone-200/80 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Grade / Class Level Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label htmlFor="class-level-input" className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-700">
            02 · Target Grade / Class Level <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 z-10">
              <GraduationCap className="w-4 h-4" />
            </div>
            <select
              id="class-level-input"
              data-testid="class-level-select"
              name="classLevel"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm font-medium text-stone-900 bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all appearance-none cursor-pointer"
            >
              {/* If current value is custom or legacy, include it */}
              {classLevel && !CLASS_LEVELS.includes(classLevel) && (
                <option value={classLevel}>{classLevel}</option>
              )}
              {CLASS_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Quick Level Presets */}
          <div className="pt-1.5 flex items-center flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setClassLevel('Elementary School (Grades 3-5)')}
              className={`text-[11px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                classLevel.includes('Elementary')
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Elementary
            </button>
            <button
              type="button"
              onClick={() => setClassLevel('Middle School (Grades 6-8)')}
              className={`text-[11px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                classLevel.includes('Middle')
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Middle School
            </button>
            <button
              type="button"
              onClick={() => setClassLevel('High School (Grades 9-10)')}
              className={`text-[11px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                classLevel.includes('High')
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              High School
            </button>
            <button
              type="button"
              onClick={() => setClassLevel('Undergraduate / College')}
              className={`text-[11px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                classLevel.includes('College')
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              College
            </button>
          </div>
        </div>

        {/* Total Minutes Input */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="minutes-input" className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-700">
            03 · Total Class Minutes <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Clock className="w-4 h-4" />
            </div>
            <input
              id="minutes-input"
              name="minutes"
              data-testid="minutes-input"
              type="number"
              step="any"
              value={totalMinutes}
              onChange={(e) => setTotalMinutes(e.target.value)}
              placeholder="e.g. 45"
              className="w-full pl-10 pr-12 py-2.5 text-sm font-semibold tabular-nums text-stone-900 bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all font-mono"
            />
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-stone-400 font-mono pointer-events-none">
              mins
            </span>
          </div>

          {/* Quick preset buttons */}
          <div className="pt-1.5 flex items-center gap-1 overflow-x-auto">
            {DURATION_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTotalMinutes(p)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer tabular-nums ${
                  totalMinutes === p
                    ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-2xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pedagogical Framework Selection */}
      <div className="mt-7 pt-5 border-t border-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-700">
            04 · Select Instructional Architecture
          </label>
          <span className="text-xs text-stone-400">
            Governs how instructional minutes are apportioned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setFramework('direct_instruction')}
            className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer relative ${
              framework === 'direct_instruction'
                ? 'bg-amber-50/70 border-amber-500/80 text-stone-900 ring-2 ring-amber-500/20 shadow-2xs'
                : 'bg-stone-50/30 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-display">Direct Instruction</span>
              {framework === 'direct_instruction' && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 leading-snug">
              Hunter 5-Step: Hook, Direct Modeling, Guided Practice, Independent Mastery, Exit.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFramework('five_e')}
            className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer relative ${
              framework === 'five_e'
                ? 'bg-amber-50/70 border-amber-500/80 text-stone-900 ring-2 ring-amber-500/20 shadow-2xs'
                : 'bg-stone-50/30 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-display">5E Inquiry Model</span>
              {framework === 'five_e' && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 leading-snug">
              Bybee BSCS: Engage curiosity, Explore, Formalize Explanation, Elaborate, Evaluate.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFramework('workshop')}
            className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer relative ${
              framework === 'workshop'
                ? 'bg-amber-50/70 border-amber-500/80 text-stone-900 ring-2 ring-amber-500/20 shadow-2xs'
                : 'bg-stone-50/30 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-display">Workshop Model</span>
              {framework === 'workshop' && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 leading-snug">
              Targeted 10m Mini-Lesson + Extended Active Studio/Lab Work + Whole-Group Debrief.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setFramework('socratic')}
            className={`p-3.5 text-left rounded-xl border transition-all cursor-pointer relative ${
              framework === 'socratic'
                ? 'bg-amber-50/70 border-amber-500/80 text-stone-900 ring-2 ring-amber-500/20 shadow-2xs'
                : 'bg-stone-50/30 border-stone-200/80 text-stone-600 hover:border-stone-300 hover:bg-stone-50/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 font-display">Socratic Seminar</span>
              {framework === 'socratic' && <Check className="w-3.5 h-3.5 text-amber-700" />}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 leading-snug">
              Inquiry Dilemma, Text Evidence Mining, Student-Led Dialogue, Written Synthesis.
            </p>
          </button>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-stone-100">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Hamilton-Hare mathematical exactness · 0ms network latency · Session preserved</span>
        </div>

        <button
          id="generate-plan-btn"
          data-testid="generate-plan-btn"
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 active:scale-[0.99] rounded-xl shadow-xs transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Generate Lesson Plan</span>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </form>
  );
};
