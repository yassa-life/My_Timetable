import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import EntryModal from './EntryModal';
import {
  IconPlus, IconEdit, IconTrash, IconMapPin, IconBook
} from './Icons';
import { DAYS, sortByTime, formatTime12 } from '../utils/timeUtils';
import { IllustrationEmptyTimetable, IllustrationWeekHero } from './Illustrations';
import ThreeWeekScene from './ThreeWeekScene';

const TimetableView = () => {
  const { entries, deleteEntry } = useTimetable();
  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All');

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

  const filteredDays = selectedDay === 'All' ? DAYS : [selectedDay];

  return (
    <div className="page timetable-page">
      {/* Hero banner */}
      <div className="tt-hero-banner">
        <div className="tt-hero-text">
          <h1 className="page-title">Weekly Timetable</h1>
          <p className="page-subtitle">{entries.length} total class{entries.length !== 1 ? 'es' : ''} scheduled</p>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleAdd}>
            <IconPlus size={16} />
            Add Class
          </button>
        </div>
        <div className="tt-hero-illustration">
          <IllustrationWeekHero className="week-hero-svg" />
        </div>
      </div>

      {/* Day filter tabs */}
      <div className="day-tabs">
        <button
          className={`day-tab ${selectedDay === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedDay('All')}
        >
          All Days
        </button>
        {DAYS.map((d) => (
          <button
            key={d}
            className={`day-tab ${selectedDay === d ? 'active' : ''}`}
            onClick={() => setSelectedDay(d)}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <IllustrationEmptyTimetable width={200} />
          <h2>No classes scheduled</h2>
          <p>Start building your timetable by adding your first class.</p>
          <button className="btn btn-primary" onClick={handleAdd}>
            <IconPlus size={16} />
            Add First Class
          </button>
        </div>
      ) : (
        <div className="timetable-days">
          {filteredDays.map((day) => {
            const dayEntries = sortByTime(entries.filter((e) => e.day === day));
            return (
              <div key={day} className="day-section">
                <div className="day-header">
                  <h2 className="day-name">{day}</h2>
                  <span className="day-count">{dayEntries.length} class{dayEntries.length !== 1 ? 'es' : ''}</span>
                </div>
                {dayEntries.length === 0 ? (
                  <div className="day-empty">No classes</div>
                ) : (
                  <div className="day-entries">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="tt-entry">
                        <div
                          className="tt-color-bar"
                          style={{ background: entry.color || '#6366f1' }}
                        />
                        <div className="tt-time">
                          <span className="tt-start">{formatTime12(entry.startTime)}</span>
                          <span className="tt-end">{formatTime12(entry.endTime)}</span>
                        </div>
                        <div className="tt-info">
                          <h3 className="tt-subject">{entry.subject}</h3>
                          <div className="tt-meta-row">
                            {entry.lecturer && (
                              <span className="tt-chip">
                                <IconBook size={11} />{entry.lecturer}
                              </span>
                            )}
                            {entry.room && (
                              <span className="tt-chip">
                                <IconMapPin size={11} />{entry.room}
                              </span>
                            )}
                          </div>
                          {entry.notes && (
                            <p className="tt-notes">{entry.notes}</p>
                          )}
                        </div>
                        <div className="tt-actions">
                          <button
                            className="card-btn edit-btn"
                            onClick={() => handleEdit(entry)}
                            title="Edit"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className="card-btn delete-btn"
                            onClick={() => handleDelete(entry.id)}
                            title="Delete"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <EntryModal
          entry={editEntry}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TimetableView;
