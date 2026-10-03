import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  ListChecks,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Printer,
  Play,
  FileText,
  Sparkles,
  Sliders,
  ChevronRight,
  BookMarked,
  FileDown,
} from 'lucide-react';
import { exportLessonPlanToPdf } from '../utils/pdfExport';

export const PlanView = ({
  plan,
  onUpdatePlan,
  onStartTimer,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);

  const handleExportPdf = () => {
    try {
      setExportingPdf(true);
      exportLessonPlanToPdf(plan);
      setTimeout(() => setExportingPdf(false), 1200);
    } catch (err) {
      console.error('PDF export failed:', err);
      setExportingPdf(false);
    }
  };

  // Compute exact sum of section minutes
  const sumOfSectionMinutes = plan.sections.reduce((acc, s) => acc + s.minutes, 0);
  const isExactMatch = sumOfSectionMinutes === plan.totalMinutes;

  // Toggle material item
  const handleToggleMaterial = (matId) => {
    const updated = {
      ...plan,
      materials: plan.materials.map((m) =>
        m.id === matId ? { ...m, checked: !m.checked } : m
      ),
    };
    onUpdatePlan(updated);
  };

  // Adjust section minutes while maintaining the invariant
  const handleAdjustMinutes = (sectionIndex, delta) => {
    if (plan.sections.length <= 1) return;

    const currentMins = plan.sections[sectionIndex].minutes;
    const newMins = currentMins + delta;
    if (newMins < 1) return;

    let otherIndex = -1;
    let maxOtherMins = -1;
    for (let i = 0; i < plan.sections.length; i++) {
      if (i !== sectionIndex && plan.sections[i].minutes > 1) {
        if (delta > 0) {
          if (plan.sections[i].minutes > maxOtherMins) {
            maxOtherMins = plan.sections[i].minutes;
            otherIndex = i;
          }
        } else {
          otherIndex = i;
          break;
        }
      }
    }

    if (otherIndex === -1 && delta > 0) return;

    const newSections = [...plan.sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      minutes: newMins,
      percentage: Math.round((newMins / plan.totalMinutes) * 100),
    };

    if (otherIndex !== -1) {
      const counterMins = newSections[otherIndex].minutes - delta;
      newSections[otherIndex] = {
        ...newSections[otherIndex],
        minutes: counterMins,
        percentage: Math.round((counterMins / plan.totalMinutes) * 100),
      };
    }

    onUpdatePlan({
      ...plan,
      sections: newSections,
    });
  };

  // Copy plan as formatted Markdown
  const handleCopyMarkdown = () => {
    const markdown = `# Lesson Plan: ${plan.topic}
**Class Level:** ${plan.classLevel}
**Total Duration:** ${plan.totalMinutes} minutes
**Framework:** ${plan.framework.replace('_', ' ').toUpperCase()}

---

## Essential Question
${plan.essentialQuestion}

## Measurable Learning Objective (SWBAT)
${plan.swbat}

---

## Lesson Timeline & Phasing (${plan.totalMinutes} min total)
${plan.sections
  .map(
    (s, i) => `### ${i + 1}. ${s.name} (${s.minutes} min - ${s.phase})
- **Objective:** ${s.objective}
- **Teacher Action:** ${s.teacherAction}
- **Student Action:** ${s.studentAction}
- **Formative Check:** ${s.formativeCheck}
- **Support:** ${s.differentiation.support}
- **Extension:** ${s.differentiation.extension}
`
  )
  .join('\n')}

---

## Materials & Preparation
${plan.materials.map((m) => `- [${m.checked ? 'x' : ' '}] ${m.text}`).join('\n')}

## Common Misconceptions to Address
${plan.anticipatedMisconceptions.map((m) => `- ${m}`).join('\n')}

## Formative Exit Ticket
${plan.exitTicket}
`;

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="lesson-plan-container" data-testid="lesson-plan" className="space-y-6 animate-in fade-in duration-300">
      {/* Plan Header Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-mono">
              <span className="font-bold text-amber-900 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                {plan.classLevel}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-700">{plan.sections.length} Phased Stages</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="capitalize text-stone-700">{plan.framework.replace('_', ' ')}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-400">Created {plan.createdAt}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 font-display">
              {plan.topic}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 italic font-serif leading-relaxed">
              &ldquo;{plan.essentialQuestion}&rdquo;
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="no-print flex items-center flex-wrap gap-2.5 self-start">
            <button
              type="button"
              onClick={onStartTimer}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200/90 border border-amber-300/80 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
              <span>Launch Classroom Timer</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer"
              title="Copy as Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              id="export-pdf-btn"
              data-testid="export-pdf-btn"
              type="button"
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-stone-800 hover:text-stone-950 bg-stone-100/90 hover:bg-stone-200 border border-stone-300/90 rounded-xl shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              title="Download clean print-ready PDF file"
            >
              {exportingPdf ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span className="text-emerald-800">Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-stone-700" />
                  <span>Export PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer"
              title="Open browser print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Measurable Objective (SWBAT) */}
        <div className="mt-6 bg-[#faf9f6] border border-amber-200/60 rounded-xl p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="p-1.5 bg-amber-100/90 text-amber-950 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-950 block">
                Targeted Learning Outcome · Students Will Be Able To (SWBAT)
              </span>
              <p className="mt-1 text-sm font-medium text-stone-800 leading-relaxed">
                {plan.swbat}
              </p>
            </div>
          </div>
        </div>

        {/* Mathematical Exact Match Invariant Banner */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/80 border border-stone-200 rounded-xl p-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5 sm:mt-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-800">
                    Exact Time Apportionment:
                  </span>
                  <span
                    id="total-allocated-minutes"
                    data-testid="total-allocated-minutes"
                    className="text-xs font-mono font-bold text-stone-900 tabular-nums bg-white px-2 py-0.5 rounded border border-stone-200"
                  >
                    {sumOfSectionMinutes} / {plan.totalMinutes} minutes
                  </span>
                  {isExactMatch && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300/80">
                      100% Invariant Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 font-mono mt-1">
                  ∑(Phases): ({plan.sections.map((s) => `${s.minutes}m`).join(' + ')}) = {sumOfSectionMinutes}m exactly
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-stone-500 font-mono">
              <span>{plan.sections.length} instruction blocks</span>
            </div>
          </div>

          {/* Visual Distribution Timeline Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium">
              <span className="font-mono text-[11px] uppercase tracking-wider text-stone-600">Proportional Class Allocation</span>
              <span className="font-mono tabular-nums text-stone-700 font-semibold">{plan.totalMinutes} minutes total</span>
            </div>
            <div className="h-7 w-full bg-stone-100 rounded-lg overflow-hidden flex p-0.5 gap-0.5 border border-stone-200 shadow-2xs">
              {plan.sections.map((sec, idx) => {
                const widthPercent = (sec.minutes / plan.totalMinutes) * 100;
                const colors = [
                  'bg-stone-900 hover:bg-stone-800 text-stone-100',
                  'bg-amber-800 hover:bg-amber-900 text-amber-100',
                  'bg-stone-700 hover:bg-stone-600 text-stone-100',
                  'bg-amber-700 hover:bg-amber-800 text-white',
                  'bg-stone-800 hover:bg-stone-700 text-amber-200',
                ];
                const color = colors[idx % colors.length];

                return (
                  <div
                    key={sec.id}
                    style={{ width: `${Math.max(widthPercent, 4)}%` }}
                    className={`${color} h-full rounded transition-all cursor-pointer relative group flex items-center justify-between px-2 text-[11px] font-medium overflow-hidden`}
                    onClick={() => setActiveSectionId(sec.id)}
                    title={`${sec.name}: ${sec.minutes} minutes (${Math.round(widthPercent)}%)`}
                  >
                    <span className="truncate whitespace-nowrap text-[10px] uppercase font-mono font-semibold opacity-90 hidden sm:inline">
                      {sec.phase}
                    </span>
                    <span className="truncate whitespace-nowrap font-mono tabular-nums font-bold text-[11px]">
                      {sec.minutes}m
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline legend */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500">
              {plan.sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                  <span className="font-medium text-stone-700">{sec.phase}:</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">{sec.minutes} min</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phased Sections Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 font-display flex items-center gap-2">
            <span>Phased Instructional Stages</span>
            <span className="text-xs font-mono font-normal text-stone-500">
              ({plan.sections.length} phases · {plan.totalMinutes} min)
            </span>
          </h2>
          <span className="text-xs text-stone-400 hidden sm:inline font-mono">
            Fine-tune duration with + / - (rebalances automatically)
          </span>
        </div>

        <div className="space-y-3.5">
          {plan.sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              totalMinutes={plan.totalMinutes}
              isHighlighted={activeSectionId === section.id}
              onAdjustMinutes={(delta) => handleAdjustMinutes(index, delta)}
            />
          ))}
        </div>
      </div>

      {/* Materials & Preparation & Misconceptions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Materials Checklist */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-amber-800" />
              <span>Materials & Prep (10-Min Checklist)</span>
            </h3>
            <span className="text-xs font-mono text-stone-500">
              {plan.materials.filter((m) => m.checked).length} of {plan.materials.length} ready
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {plan.materials.map((mat) => (
              <li
                key={mat.id}
                onClick={() => handleToggleMaterial(mat.id)}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50/80 transition-colors cursor-pointer text-xs sm:text-sm text-stone-700 border border-transparent hover:border-stone-200"
              >
                <input
                  type="checkbox"
                  checked={mat.checked}
                  onChange={() => handleToggleMaterial(mat.id)}
                  className="mt-0.5 rounded border-stone-300 text-amber-900 focus:ring-amber-600/20 cursor-pointer h-4 w-4"
                />
                <span className={mat.checked ? 'text-stone-400 line-through' : 'font-medium text-stone-800'}>
                  {mat.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anticipated Misconceptions */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Anticipated Misconceptions</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">Proactive Cues</span>
          </div>

          <ul className="mt-4 space-y-3">
            {plan.anticipatedMisconceptions.map((mis, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0"></span>
                <span className="leading-relaxed">{mis}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-3.5 border-t border-stone-100">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Academic Vocabulary Targets:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {plan.vocabulary.map((v, i) => (
                <span
                  key={i}
                  className="text-xs font-mono text-stone-800 bg-stone-100/90 px-2.5 py-0.5 rounded-md border border-stone-200/70"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formative Exit Ticket Diagnostic */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Formative Exit Ticket Diagnostic</span>
          </h3>
          <span className="text-xs font-mono text-stone-400">Final 5-10 minutes</span>
        </div>
        <p className="mt-3.5 text-sm text-stone-800 font-medium bg-amber-50/60 border border-amber-200/70 p-4 rounded-xl leading-relaxed">
          {plan.exitTicket}
        </p>
      </div>

      {/* Teacher Reflection / Post-Lesson Notes */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs no-print">
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />
            <span>Teacher Running Notes & Reflection</span>
          </h3>
          <span className="text-xs text-stone-400 font-mono">Persisted in browser</span>
        </div>
        <textarea
          rows={3}
          value={plan.teacherNotes || ''}
          onChange={(e) => onUpdatePlan({ ...plan, teacherNotes: e.target.value })}
          placeholder="Add running notes on what worked well, which student groups need pull-aside support, or reminders for next period..."
          className="mt-3.5 w-full p-3.5 text-sm text-stone-800 bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-700 transition-all placeholder:text-stone-400"
        />
      </div>
    </div>
  );
};

const SectionCard = ({
  section,
  index,
  totalMinutes,
  isHighlighted = false,
  onAdjustMinutes,
}) => {
  const percentage = Math.round((section.minutes / totalMinutes) * 100);

  return (
    <div
      data-testid="lesson-section"
      className={`lesson-section bg-white border rounded-xl p-5 sm:p-6 transition-all print-page-break ${
        isHighlighted
          ? 'border-amber-500/80 ring-2 ring-amber-500/20 shadow-xs'
          : 'border-stone-200/85 hover:border-stone-300 shadow-2xs'
      }`}
    >
      {/* Top Header of Section: Phase, Name, Minutes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-white font-mono text-xs font-bold shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                {section.phase}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                {section.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Section's Own Minutes Display */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <div
              data-testid="section-minutes"
              className="section-minutes text-base font-mono font-bold text-stone-900 tabular-nums"
            >
              {section.minutes} min
            </div>
            <div className="text-[11px] text-stone-400 font-mono">
              {percentage}% of period
            </div>
          </div>

          {/* Minute Adjuster (+ / -) */}
          <div className="no-print flex items-center bg-stone-100/90 rounded-lg p-0.5 border border-stone-200">
            <button
              type="button"
              onClick={() => onAdjustMinutes(-1)}
              disabled={section.minutes <= 1}
              className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold text-stone-600 hover:text-stone-950 hover:bg-white rounded transition-colors disabled:opacity-25 disabled:pointer-events-none cursor-pointer"
              title="Decrease by 1 min (counterbalances with other sections)"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => onAdjustMinutes(1)}
              className="w-6 h-6 flex items-center justify-center text-xs font-mono font-bold text-stone-600 hover:text-stone-950 hover:bg-white rounded transition-colors cursor-pointer"
              title="Increase by 1 min (counterbalances with other sections)"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Section Objective */}
      <p className="mt-3.5 text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
        <strong className="text-stone-900 font-semibold font-mono text-[11px] uppercase tracking-wider">Objective Focus: </strong>
        {section.objective}
      </p>

      {/* Teacher Action & Student Action Dual Columns */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5 border-t border-stone-100">
        <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-3.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
            Teacher Facilitation Moves
          </span>
          <p className="text-xs text-stone-700 leading-relaxed">
            {section.teacherAction}
          </p>
        </div>

        <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-3.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-700 block mb-1.5">
            Active Student Participation
          </span>
          <p className="text-xs text-stone-700 leading-relaxed">
            {section.studentAction}
          </p>
        </div>
      </div>

      {/* Formative Check & Differentiation footer */}
      <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-600">
        <div>
          <span className="font-semibold text-stone-900">Formative Check: </span>
          <span>{section.formativeCheck}</span>
        </div>
        <div>
          <span className="font-semibold text-stone-900">Support Scaffolding: </span>
          <span>{section.differentiation.support}</span>
        </div>
      </div>
    </div>
  );
};
