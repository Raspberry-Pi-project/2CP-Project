import React, { createContext, useContext, useEffect, useRef } from 'react';

const QuizTimerContext = createContext();

export const useQuizTimer = () => useContext(QuizTimerContext);

const STORAGE_KEY = 'quizTimers';

export const QuizTimerProvider = ({ children }) => {
  const timersRef = useRef({}); // in-memory active timers

  // Load all stored timers from sessionStorage
  const loadStoredTimers = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveStoredTimers = (timers) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  };

  const startTimer = (quizId, durationInSeconds, onExpire) => {
    const startTime = Date.now();
    const timers = loadStoredTimers();

    timers[quizId] = { startTime, duration: durationInSeconds };
    saveStoredTimers(timers);

    scheduleTimer(quizId, startTime, durationInSeconds, onExpire);
  };

  const clearTimer = (quizId) => {
    const timers = loadStoredTimers();
    delete timers[quizId];
    saveStoredTimers(timers);

    if (timersRef.current[quizId]) {
      clearTimeout(timersRef.current[quizId].timeoutId);
      delete timersRef.current[quizId];
    }
  };

  const scheduleTimer = (quizId, startTime, duration, onExpire) => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = duration - elapsed;

    if (remaining <= 0) {
      clearTimer(quizId);
      alert(`Quiz ${quizId} has finished! Proceed to results.`);
      // Optionally, you can call onExpire immediately if the timer has already expired
      onExpire(quizId);
      return;
    }

    const timeoutId = setTimeout(() => {
      clearTimer(quizId);
      onExpire(quizId);
    }, remaining * 1000);

    timersRef.current[quizId] = { timeoutId, onExpire };
  };

  // Rehydrate timers on mount (after page reload or navigation)
  useEffect(() => {
    const storedTimers = loadStoredTimers();

    Object.entries(storedTimers).forEach(([quizId, { startTime, duration }]) => {
      // You might want to pass a generic callback (or lookup specific callbacks per quiz)
      scheduleTimer(quizId, startTime, duration, (qid) => {
        console.log(`Timer expired for quiz: ${qid}`);
        // You can trigger any API call to update quiz status here!
      });
    });
  }, []);

  return (
    <QuizTimerContext.Provider value={{ startTimer, clearTimer }}>
      {children}
    </QuizTimerContext.Provider>
  );
};
