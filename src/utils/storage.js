const STORAGE_KEY = 'plancraft_lesson_planner_v1';

export const DEFAULT_STATE = {
  topic: 'Photosynthesis & Plant Energy Cycles',
  classLevel: 'Middle School (Grades 6-8)',
  totalMinutes: '45',
  framework: 'direct_instruction',
  plan: null,
  errorMessage: null,
};

export function loadStoredLessonState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      topic: typeof parsed.topic === 'string' ? parsed.topic : DEFAULT_STATE.topic,
      classLevel: typeof parsed.classLevel === 'string' ? parsed.classLevel : DEFAULT_STATE.classLevel,
      totalMinutes: typeof parsed.totalMinutes === 'string' || typeof parsed.totalMinutes === 'number'
        ? String(parsed.totalMinutes)
        : DEFAULT_STATE.totalMinutes,
      framework: parsed.framework || DEFAULT_STATE.framework,
      plan: parsed.plan || null,
      errorMessage: parsed.errorMessage || null,
    };
  } catch (err) {
    console.warn('Failed to load lesson plan state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveStoredLessonState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save lesson plan state to localStorage:', err);
  }
}

export function clearStoredLessonState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear lesson plan state from localStorage:', err);
  }
}
