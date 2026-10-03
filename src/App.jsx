import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LessonForm } from './components/LessonForm';
import { PlanView } from './components/PlanView';
import { ErrorMessage } from './components/ErrorMessage';
import { ClassroomTimerModal } from './components/ClassroomTimerModal';
import { PedagogyGuide } from './components/PedagogyGuide';
import { PacingGuide } from './components/PacingGuide';
import { generateLessonPlan } from './utils/lessonGenerator';
import { exportLessonPlanToPdf } from './utils/pdfExport';
import {
  loadStoredLessonState,
  saveStoredLessonState,
  clearStoredLessonState,
} from './utils/storage';
import { Calendar, Sparkles, BookOpen, Calculator, Landmark, Feather } from 'lucide-react';

export default function App() {
  // Synchronous lazy initialization directly from localStorage
  const [initialState] = useState(() => loadStoredLessonState());
  const [topic, setTopic] = useState(initialState.topic);
  const [classLevel, setClassLevel] = useState(initialState.classLevel);
  const [totalMinutes, setTotalMinutes] = useState(initialState.totalMinutes);
  const [framework, setFramework] = useState(initialState.framework);
  const [plan, setPlan] = useState(initialState.plan);
  const [errorMessage, setErrorMessage] = useState(initialState.errorMessage);

  // Active view tab: 'builder' | 'frameworks' | 'guide'
  const [activeTab, setActiveTab] = useState('builder');

  // Classroom timer modal state
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Sync state to localStorage whenever any core state changes
  useEffect(() => {
    saveStoredLessonState({
      topic,
      classLevel,
      totalMinutes,
      framework,
      plan,
      errorMessage,
    });
  }, [topic, classLevel, totalMinutes, framework, plan, errorMessage]);

  // Main Generation Handler
  const handleGenerate = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Requirement 4: "Show a message, and no plan, if the minutes are empty, zero or negative."
    const rawVal = totalMinutes !== null && totalMinutes !== undefined ? String(totalMinutes) : '';
    const trimmedMinutes = rawVal.trim();

    if (!trimmedMinutes) {
      setErrorMessage('Total minutes cannot be empty. Please enter a positive class duration (e.g. 45).');
      setPlan(null);
      return;
    }

    const parsedMins = Number(trimmedMinutes);

    if (isNaN(parsedMins)) {
      setErrorMessage(`"${trimmedMinutes}" is not a valid number. Please enter positive class minutes.`);
      setPlan(null);
      return;
    }

    if (parsedMins <= 0) {
      setErrorMessage(`Total minutes must be greater than zero. Received ${parsedMins} min. Please enter a valid duration.`);
      setPlan(null);
      return;
    }

    // Valid positive minutes -> clear error message and generate plan
    setErrorMessage(null);

    const safeTopic = (topic && topic.trim()) || 'Classroom Lesson Topic';
    const safeLevel = (classLevel && classLevel.trim()) || 'Middle School (6-8)';

    const generated = generateLessonPlan(
      safeTopic,
      safeLevel,
      parsedMins,
      framework
    );

    setPlan(generated);
    setActiveTab('builder');
  };

  // Quick template loader for empty state
  const handleLoadTemplate = (tplTopic, tplLevel, tplMins, tplFramework) => {
    setTopic(tplTopic);
    setClassLevel(tplLevel);
    setTotalMinutes(String(tplMins));
    setFramework(tplFramework);
    setErrorMessage(null);
    const newPlan = generateLessonPlan(tplTopic, tplLevel, tplMins, tplFramework);
    setPlan(newPlan);
    setActiveTab('builder');
  };

  // Reset to initial empty state
  const handleReset = () => {
    if (window.confirm('Reset the lesson plan builder to blank state?')) {
      clearStoredLessonState();
      setTopic('');
      setClassLevel('Middle School (Grades 6-8)');
      setTotalMinutes('');
      setPlan(null);
      setErrorMessage(null);
      setActiveTab('builder');
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  const handleUpdatePlan = (updated) => {
    setPlan(updated);
  };

  return (
    <div className="min-h-screen bg-canvas-pattern flex flex-col font-sans text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Header
        hasPlan={!!plan}
        onPrint={handlePrint}
        onExportPdf={() => exportLessonPlanToPdf(plan)}
        onReset={handleReset}
        onStartTimer={() => setIsTimerOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-7">
        {/* Navigation Tabs for Mobile */}
        <div className="md:hidden flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl no-print border border-stone-300/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Lesson Builder
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('frameworks')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'frameworks'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pedagogy Models
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pacing Strategy
          </button>
        </div>

        {activeTab === 'builder' && (
          <div className="space-y-6">
            {/* Input Form Card */}
            <div className="no-print">
              <LessonForm
                topic={topic}
                setTopic={setTopic}
                classLevel={classLevel}
                setClassLevel={setClassLevel}
                totalMinutes={totalMinutes}
                setTotalMinutes={setTotalMinutes}
                framework={framework}
                setFramework={setFramework}
                onSubmit={handleGenerate}
              />
            </div>

            {/* Error Message Display (Requirement 4: Show a message, and no plan, if minutes empty, zero or negative) */}
            {errorMessage && (
              <ErrorMessage
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
              />
            )}

            {/* Generated Plan View (Requirement 2 & 3: button shows plan split into sections with own minutes adding up exactly) */}
            {plan && !errorMessage && (
              <PlanView
                plan={plan}
                onUpdatePlan={handleUpdatePlan}
                onStartTimer={() => setIsTimerOpen(true)}
                onPrint={handlePrint}
              />
            )}

            {/* Empty State when no plan is generated yet and no error */}
            {!plan && !errorMessage && (
              <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-display">
                  Your Class Architecture Starts Here
                </h3>
                <p className="mt-1.5 text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
                  Enter your topic, class level, and available minutes above, then click <strong>&quot;Generate Lesson Plan&quot;</strong> to construct your phased schedule.
                </p>

                {/* Instant Sample Starters for Quick Demonstration */}
                <div className="mt-8 pt-6 border-t border-stone-100 max-w-2xl mx-auto">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-3">
                    Or launch an instant sample plan:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleLoadTemplate(
                          'Photosynthesis & Energy Cycles',
                          'Middle School (Grades 6-8)',
                          45,
                          'direct_instruction'
                        )
                      }
                      className="p-3 bg-stone-50/80 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-display group-hover:text-amber-950">
                        <BookOpen className="w-4 h-4 text-amber-800" />
                        <span>Science (45m)</span>
                      </div>
                      <p className="mt-1 text-[11px] text-stone-500 leading-snug">
                        Photosynthesis & Cellular Energy
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleLoadTemplate(
                          'Quadratic Equations & Roots',
                          'High School (9-10)',
                          50,
                          'five_e'
                        )
                      }
                      className="p-3 bg-stone-50/80 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-display group-hover:text-amber-950">
                        <Calculator className="w-4 h-4 text-amber-800" />
                        <span>Math (50m)</span>
                      </div>
                      <p className="mt-1 text-[11px] text-stone-500 leading-snug">
                        Quadratic Factoring & Graphing
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleLoadTemplate(
                          'Origins of the Cold War',
                          'High School (11-12)',
                          60,
                          'socratic'
                        )
                      }
                      className="p-3 bg-stone-50/80 hover:bg-amber-50/60 border border-stone-200 hover:border-amber-300 rounded-xl text-left transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900 font-display group-hover:text-amber-950">
                        <Landmark className="w-4 h-4 text-amber-800" />
                        <span>History (60m)</span>
                      </div>
                      <p className="mt-1 text-[11px] text-stone-500 leading-snug">
                        Post-WWII Geopolitics & Ideology
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pedagogy Models */}
        {activeTab === 'frameworks' && (
          <PedagogyGuide
            onSelectFramework={(fw) => {
              setFramework(fw);
              setActiveTab('builder');
              if (plan) {
                const mins = Number(totalMinutes);
                if (mins > 0) {
                  const safeTopic = (topic && topic.trim()) || 'Classroom Lesson Topic';
                  const safeLevel = (classLevel && classLevel.trim()) || 'Middle School (6-8)';
                  const updated = generateLessonPlan(safeTopic, safeLevel, mins, fw);
                  setPlan(updated);
                }
              }
            }}
          />
        )}

        {/* Tab 3: Pacing Strategy */}
        {activeTab === 'guide' && <PacingGuide />}
      </main>

      {/* Classroom Live Timer Modal */}
      {isTimerOpen && plan && (
        <ClassroomTimerModal
          plan={plan}
          onClose={() => setIsTimerOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-stone-200/80 bg-white/60 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 font-display">PlanCraft</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Rapid Lesson Architecture for Educators</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400 font-mono text-[11px]">
            <span>Hamilton-Hare Apportionment</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>100% In-Browser Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
