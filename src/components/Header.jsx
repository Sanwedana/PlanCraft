import React from 'react';
import { Printer, RotateCcw, Play, FileDown } from 'lucide-react';

export const Header = ({
  hasPlan,
  onPrint,
  onExportPdf,
  onReset,
  onStartTimer,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-stone-900 font-display hover:text-amber-900 transition-colors"
          >
            PlanCraft
          </a>
          <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest uppercase text-stone-400 border-l border-stone-300 pl-3">
            Lesson Architecture
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'builder'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Lesson Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('frameworks')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'frameworks'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pedagogy Models
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pacing Strategy
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {hasPlan && (
            <>
              <button
                type="button"
                onClick={onStartTimer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200/80 border border-amber-300/80 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
                title="Launch in-class timer runner"
              >
                <Play className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                <span>Class Timer</span>
              </button>

              <button
                type="button"
                onClick={onExportPdf}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 hover:bg-stone-200/80 bg-stone-100 border border-stone-300 rounded-lg shadow-2xs transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
                title="Download clean print-ready PDF document"
              >
                <FileDown className="w-3.5 h-3.5 text-stone-700" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-white bg-stone-100/70 border border-stone-200 rounded-lg shadow-2xs transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
                title="Print lesson plan"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Print</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Reset to blank inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
