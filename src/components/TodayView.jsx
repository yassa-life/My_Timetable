import React, { useState, useEffect } from 'react';
import { useTimetable } from '../context/TimetableContext';
import EntryModal from './EntryModal';
import {
  IconClock, IconMapPin, IconBook, IconEdit, IconTrash,
  IconPlus, IconNote
} from './Icons';
import {
  getTodayName, sortByTime, isOngoing, isUpcoming, isPast,
  formatTime12, getProgress
} from '../utils/timeUtils';
import { IllustrationNoClasses, IllustrationTodayHero } from './Illustrations';
import ThreeHeroScene from './ThreeHeroScene';

const ClassCard = ({ entry, onEdit, onDelete }) => {
  const ongoing = isOngoing(entry);
  const upcoming = isUpcoming(entry);
  const past = isPast(entry);
  const progress = ongoing ? getProgress(entry) : 0;

  return (
    <div className={`class-card ${ongoing ? 'ongoing' : ''} ${upcoming ? 'upcoming' : ''} ${past ? 'past' : ''}`}>
      {ongoing && (
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="card-header">
        <div className="card-status">
          {ongoing && <span className="status-badge live"><span className="pulse-dot" />Live Now</span>}
          {upcoming && <span className="status-badge soon">Up Next</span>}
          {past && <span className="status-badge done">Completed</span>}
          {!ongoing && !upcoming && !past && <span className="status-badge upcoming2">Upcoming</span>}
        </div>
        <div className="card-actions">
          <button className="card-btn edit-btn" onClick={() => onEdit(entry)} title="Edit">
            <IconEdit size={14} />
          </button>
          <button className="card-btn delete-btn" onClick={() => onDelete(entry.id)} title="Delete">
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="subject-color" style={{ background: entry.color || '#6366f1' }} />
        <div className="card-content">
          <h3 className="subject-name">{entry.subject}</h3>
          {entry.lecturer && (
            <p className="card-meta">
              <IconBook size={13} />
              <span>{entry.lecturer}</span>
            </p>
          )}
          <p className="card-meta">
            <IconClock size={13} />
            <span>{formatTime12(entry.startTime)} — {formatTime12(entry.endTime)}</span>
          </p>
          {entry.room && (
            <p className="card-meta">
              <IconMapPin size={13} />
              <span>{entry.room}</span>
            </p>
          )}
          {entry.notes && (
            <p className="card-meta notes-meta">
              <IconNote size={13} />
              <span>{entry.notes}</span>
            </p>
          )}
        </div>
      </div>

      {ongoing && (
        <div className="ongoing-footer">
          <span>Progress: {Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};

const TodayView = () => {
  const { entries, deleteEntry } = useTimetable();
  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = getTodayName();
  const todayEntries = sortByTime(entries.filter((e) => e.day === today));

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) deleteEntry(id);
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditEntry(null);
    setShowModal(true);
  };

  const remaining = todayEntries.filter((e) => !isPast(e));

  return (
    <div className="page today-page">
      {/* Hero banner */}
      <div className="today-hero-banner">
        <div className="today-hero-text">
          <h1 className="page-title">
            <span className="day-highlight">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
            </span>
          </h1>
          <p className="page-subtitle">
            {currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleAdd}>
            <IconPlus size={16} />
            Add Class
          </button>
        </div>
        <div className="today-hero-illustration three-hero-wrap">
          <ThreeHeroScene height={160} />
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{todayEntries.length}</span>
          <span className="stat-label">Total Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{remaining.length}</span>
          <span className="stat-label">Remaining</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{todayEntries.length - remaining.length}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {todayEntries.some((e) => isOngoing(e)) && (
        <div className="section-label ongoing-label">
          <span className="pulse-dot" />
          Currently in Progress
        </div>
      )}

      {todayEntries.length === 0 ? (
        <div className="empty-state">
          <IllustrationNoClasses width={200} />
          <h2>No classes today</h2>
          <p>Enjoy your free day! Or add a class to start filling your schedule.</p>
          <button className="btn btn-primary" onClick={handleAdd}>
            <IconPlus size={16} />
            Add First Class
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {todayEntries.map((entry) => (
            <ClassCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <EntryModal
          entry={editEntry}
          defaultDay={today}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TodayView;
