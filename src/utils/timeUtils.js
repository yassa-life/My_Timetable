export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00',
];

export const getTodayName = () => {
  return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const isOngoing = (entry) => {
  const now = getCurrentTime();
  const start = timeToMinutes(entry.startTime);
  const end = timeToMinutes(entry.endTime);
  return now >= start && now < end;
};

export const isUpcoming = (entry) => {
  const now = getCurrentTime();
  const start = timeToMinutes(entry.startTime);
  return start > now && start - now <= 60;
};

export const isPast = (entry) => {
  const now = getCurrentTime();
  const end = timeToMinutes(entry.endTime);
  return now >= end;
};

export const formatTime12 = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

export const sortByTime = (entries) =>
  [...entries].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

export const getProgress = (entry) => {
  const now = getCurrentTime();
  const start = timeToMinutes(entry.startTime);
  const end = timeToMinutes(entry.endTime);
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};
