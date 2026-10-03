import React from 'react';
import { Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const PacingGuide = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
          The 10-Minute Teacher Prep Strategy
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-3xl leading-relaxed">
          When you have only 10 minutes between bells or before heading home, rapid lesson planning requires eliminating cognitive friction while preserving rigorous pedagogical architecture.
        </p>

        {/* 10-Min Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Clock className="w-4 h-4" />
              <span>Minutes 0 - 2: Define Target</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-stone-900 font-display">
              Input Core Parameters
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Identify your topic, select your class level, and set your bell schedule total minutes. PlanCraft calculates the exact minute breakdown automatically.
            </p>
          </div>

          <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Zap className="w-4 h-4" />
              <span>Minutes 3 - 6: Materials Prep</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-stone-900 font-display">
              Review Checklist & Handouts
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Use the generated Materials & Prep checklist to gather dry-erase markers, print your exit ticket slips, or queue up the classroom projector.
            </p>
          </div>

          <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <ShieldCheck className="w-4 h-4" />
              <span>Minutes 7 - 10: Mental Rehearsal</span>
            </div>
            <h3 className="mt-2 text-base font-bold text-stone-900 font-display">
              Anticipate Misconceptions
            </h3>
            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              Read the proactive misconceptions list and check your differentiation notes. You enter tomorrow’s period confident, organized, and on pace.
            </p>
          </div>
        </div>

        {/* Mathematical Exact Match Guarantee */}
        <div className="mt-8 p-5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Mathematical Exact-Match Guarantee
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
                Traditional percentage breakdowns frequently leave fractional minutes or off-by-one errors when multiplying (e.g. 45 × 15% = 6.75 minutes). PlanCraft applies the <strong>Hamilton-Hare Apportionment Method</strong>, allocating whole minutes with strict invariant verification:
              </p>
              <div className="mt-2.5 inline-block font-mono text-xs bg-white/80 border border-amber-300/80 text-amber-950 px-3 py-1.5 rounded-lg">
                ∑(section_minutes) ≡ total_minutes for all positive durations
              </div>
            </div>
          </div>
        </div>

        {/* Mid-Class Pacing Contingencies */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <h3 className="text-base font-bold text-stone-900 font-display mb-4">
            Mid-Class Pacing Contingencies: What to do when timing drifts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block text-sm mb-1">
                Running 5 Minutes Behind?
              </span>
              <p className="leading-relaxed">
                Condense Guided Practice into a rapid whole-group whiteboard check. Never skip the Formative Exit Ticket — it is your diagnostic compass for the next day.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 block text-sm mb-1">
                Running 5 Minutes Ahead?
              </span>
              <p className="leading-relaxed">
                Activate the section's Extension task: challenge students to explain a counter-scenario or teach their elbow partner the concept in reverse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
