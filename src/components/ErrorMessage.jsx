import React from 'react';
import { AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

export const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <div
      id="error-message"
      data-testid="error-message"
      role="alert"
      aria-live="assertive"
      className="w-full bg-rose-50/95 border border-rose-200/90 text-rose-950 rounded-2xl p-5 shadow-xs transition-all animate-in fade-in duration-200"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-rose-100 rounded-xl shrink-0 mt-0.5 text-rose-700">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded">
              Validation Notice
            </span>
            <h3 className="text-sm font-bold text-rose-950 tracking-tight font-display">
              Invalid Class Duration Input
            </h3>
          </div>
          <p className="mt-1.5 text-sm text-rose-900 leading-relaxed font-medium">
            {message}
          </p>
          <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-800">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>Enter a positive number of minutes (e.g. 15, 30, 45, 60, 90) to construct your plan.</span>
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-xs font-semibold text-rose-700 hover:text-rose-950 hover:underline cursor-pointer"
              >
                Dismiss alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
