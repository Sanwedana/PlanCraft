import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, X, Clock, Bell, Volume2 } from 'lucide-react';

export const ClassroomTimerModal = ({ plan, onClose }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = plan.sections[currentSectionIndex];

  // Duration in seconds for current section
  const sectionDurationSec = (currentSection?.minutes || 1) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(sectionDurationSec);
  const [isRunning, setIsRunning] = useState(false);

  // Sync remaining seconds when section changes
  useEffect(() => {
    if (currentSection) {
      setSecondsRemaining(currentSection.minutes * 60);
      setIsRunning(false);
    }
  }, [currentSectionIndex, currentSection]);

  // Timer interval
  useEffect(() => {
    let timer = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsRemaining]);

  // Keyboard shortcut: Space to toggle play/pause, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < plan.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleResetCurrent = () => {
    setSecondsRemaining((currentSection?.minutes || 1) * 60);
    setIsRunning(false);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progressPercent = sectionDurationSec > 0
    ? ((sectionDurationSec - secondsRemaining) / sectionDurationSec) * 100
    : 0;

  const nextSection = plan.sections[currentSectionIndex + 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          title="Close timer (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-stone-100">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
            <Clock className="w-3.5 h-3.5" />
            <span>Classroom Mode · {plan.totalMinutes} min Total Class</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-stone-900 font-display">
            {plan.topic}
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-0.5">{plan.classLevel}</p>
        </div>

        {/* Section Step Tracker */}
        <div className="mt-5 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span className="font-mono text-[11px] uppercase tracking-wider">
            Phase {currentSectionIndex + 1} of {plan.sections.length}: <strong className="text-stone-900 font-sans">{currentSection.phase}</strong>
          </span>
          <span className="font-mono tabular-nums text-stone-700 font-semibold">
            Allocated: {currentSection.minutes} min
          </span>
        </div>

        {/* Current Section Name & Focus */}
        <div className="mt-2.5 bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            {currentSection.name}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {currentSection.objective}
          </p>
        </div>

        {/* Large Countdown Display */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <div
            className={`text-6xl sm:text-7xl font-bold font-mono tracking-tight tabular-nums transition-colors ${
              secondsRemaining === 0
                ? 'text-rose-600 animate-pulse'
                : secondsRemaining < 60
                ? 'text-amber-600'
                : 'text-stone-900'
            }`}
          >
            {timeFormatted}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-stone-100 rounded-full mt-4 overflow-hidden border border-stone-200">
            <div
              className={`h-full transition-all duration-300 ${
                secondsRemaining === 0 ? 'bg-rose-500' : 'bg-stone-900'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {secondsRemaining === 0 && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Section time elapsed. Transitioning to next phase.</span>
            </div>
          )}
        </div>

        {/* Teacher & Student quick action cues */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/80">
            <span className="font-mono text-[10px] uppercase font-bold text-stone-800 block mb-1">Teacher Move</span>
            <p className="text-stone-600 line-clamp-3 leading-relaxed">{currentSection.teacherAction}</p>
          </div>
          <div className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/80">
            <span className="font-mono text-[10px] uppercase font-bold text-stone-800 block mb-1">Student Action</span>
            <p className="text-stone-600 line-clamp-3 leading-relaxed">{currentSection.studentAction}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0}
            className="p-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            title="Previous Section"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Timer</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetCurrent}
            className="p-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 cursor-pointer transition-colors"
            title="Reset this section timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNextSection}
            disabled={currentSectionIndex >= plan.sections.length - 1}
            className="p-3 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl border border-stone-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            title="Next Section"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Next Section Preview & Keyboard Hint */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <div>
            {nextSection ? (
              <span>Up next: <strong className="text-stone-700">{nextSection.name}</strong> ({nextSection.minutes}m)</span>
            ) : (
              <span>Final stage of the class</span>
            )}
          </div>
          <span className="hidden sm:inline font-mono text-[11px]">Space = Play/Pause</span>
        </div>
      </div>
    </div>
  );
};
