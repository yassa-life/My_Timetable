const STORAGE_KEY = 'sliit_timetable_entries';
const THEME_KEY = 'sliit_timetable_theme';

export const loadEntries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveEntries = (entries) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const loadTheme = () => {
  return localStorage.getItem(THEME_KEY) || 'dark';
};

export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const exportJSON = (entries) => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sliit-timetable-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) resolve(data);
        else reject(new Error('Invalid format'));
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.readAsText(file);
  });
};

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
