import React from 'react';
import { ArrowRight } from 'lucide-react';

export const PedagogyGuide = ({ onSelectFramework }) => {
  const models = [
    {
      id: 'direct_instruction',
      title: 'Direct Instruction (Madeline Hunter 5-Step)',
      origin: 'Hunter & Rosenshine Educational Research',
      idealFor: 'Procedural mastery, STEM formulas, syntax, foundational grammar, step-by-step methodologies.',
      phases: [
        { name: 'Hook / Prior Knowledge', pct: '15%', desc: 'Ignite interest and activate existing schemas.' },
        { name: 'Direct Modeling (I Do)', pct: '25%', desc: 'Think-aloud modeling, unpacking pitfalls, visual decomposition.' },
        { name: 'Guided Practice (We Do)', pct: '30%', desc: 'Collaborative problem solving with real-time feedback loops.' },
        { name: 'Independent Practice (You Do)', pct: '20%', desc: 'Unassisted mastery demonstration with self-checks.' },
        { name: 'Closure / Exit Ticket', pct: '10%', desc: 'Formative diagnostic data collection for tomorrow.' },
      ],
    },
    {
      id: 'five_e',
      title: '5E Inquiry Model (Bybee BSCS)',
      origin: 'Biological Sciences Curriculum Study (BSCS)',
      idealFor: 'Scientific phenomena, experimental labs, data investigation, discovery-based learning.',
      phases: [
        { name: 'Engage', pct: '15%', desc: 'Discrepant event or puzzling phenomenon to surface prior models.' },
        { name: 'Explore', pct: '25%', desc: 'Hands-on manipulation and collaborative data collection without teacher lecturing.' },
        { name: 'Explain', pct: '25%', desc: 'Students present findings before teacher introduces formal scientific vocabulary.' },
        { name: 'Elaborate', pct: '20%', desc: 'Transfer knowledge to a novel, unfamiliar problem or context.' },
        { name: 'Evaluate', pct: '15%', desc: 'Metacognitive rubric assessment measuring conceptual shift.' },
      ],
    },
    {
      id: 'workshop',
      title: 'Reading & Writing Workshop Model',
      origin: 'Lucy Calkins & Donald Graves (Teachers College)',
      idealFor: 'Extended writing blocks, studio art, coding labs, research, self-directed project work.',
      phases: [
        { name: 'Focus Mini-Lesson', pct: '20%', desc: 'Brisk, high-impact demonstration of a single craft strategy (under 10 mins).' },
        { name: 'Studio Work Time & Conferences', pct: '60%', desc: 'Sustained deliberate practice with 1-on-1 teacher micro-coaching.' },
        { name: 'Debrief & Showcase', pct: '20%', desc: 'Sharing breakthroughs and formulating next-day writing goals.' },
      ],
    },
    {
      id: 'socratic',
      title: 'Socratic Seminar & Harkness Discussion',
      origin: 'Classical Dialogue & Harkness Method',
      idealFor: 'Literature critique, historical ethics, philosophical inquiry, civics debate, case studies.',
      phases: [
        { name: 'Framing & Initial Stance', pct: '15%', desc: 'Clarifying seminar ground rules and penning initial thesis backed by text.' },
        { name: 'Text Evidence Mining', pct: '25%', desc: 'Paired interrogation of primary texts and contradictory excerpts.' },
        { name: 'Student-Led Dialogue', pct: '45%', desc: 'Circle discussion where students speak directly without raising hands.' },
        { name: 'Individual Synthesis', pct: '15%', desc: 'Written meta-reflection on how arguments evolved today.' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
          Pedagogical Frameworks & Minute Apportionment
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-3xl leading-relaxed">
          PlanCraft uses research-backed pedagogical ratios combined with the Hamilton-Hare largest remainder algorithm. This guarantees that whether your period is 15, 45, or 90 minutes, every phase receives an integer number of minutes that sum up to exactly 100% of your available class time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {models.map((m) => (
            <div
              key={m.id}
              className="bg-stone-50/70 border border-stone-200 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    {m.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded shrink-0">
                    {m.phases.length} Phases
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{m.origin}</p>

                <p className="mt-3 text-xs text-stone-700">
                  <strong className="text-stone-900">Best applied to: </strong>
                  {m.idealFor}
                </p>

                <div className="mt-4 space-y-2 border-t border-stone-200/80 pt-3">
                  {m.phases.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="font-mono font-bold text-amber-900 shrink-0 w-8">
                        {p.pct}
                      </span>
                      <div>
                        <span className="font-semibold text-stone-800">{p.name}: </span>
                        <span className="text-stone-600">{p.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/80 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onSelectFramework(m.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Apply This Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
