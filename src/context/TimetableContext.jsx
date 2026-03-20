import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadEntries, saveEntries, loadTheme, saveTheme, generateId } from '../utils/storage';

const TimetableContext = createContext(null);

export const TimetableProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setEntries(loadEntries());
    setTheme(loadTheme());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  }, [theme]);

  const addEntry = useCallback((entry) => {
    const newEntry = { ...entry, id: generateId() };
    setEntries((prev) => {
      const updated = [...prev, newEntry];
      saveEntries(updated);
      return updated;
    });
    return newEntry;
  }, []);

  const updateEntry = useCallback((id, updates) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      saveEntries(updated);
      return updated;
    });
  }, []);

  const deleteEntry = useCallback((id) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const importEntries = useCallback((newEntries) => {
    const withIds = newEntries.map((e) => ({ ...e, id: e.id || generateId() }));
    setEntries(withIds);
    saveEntries(withIds);
  }, []);

  return (
    <TimetableContext.Provider
      value={{ entries, theme, toggleTheme, addEntry, updateEntry, deleteEntry, importEntries }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const ctx = useContext(TimetableContext);
  if (!ctx) throw new Error('useTimetable must be used within TimetableProvider');
  return ctx;
};
