import React, { useState, useRef, useCallback } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { DAYS, TIME_SLOTS } from '../utils/timeUtils';
import {
  IconClose, IconCheck, IconClock,
  IconMapPin, IconBook, IconNote
} from './Icons';
import { IllustrationScan } from './Illustrations';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#ef4444', '#f97316',
];

const EntryModal = ({ entry, defaultDay, onClose }) => {
  const { addEntry, updateEntry } = useTimetable();
  const isEdit = !!entry;

  const [form, setForm] = useState({
    subject: entry?.subject || '',
    day: entry?.day || defaultDay || DAYS[0],
    startTime: entry?.startTime || '08:00',
    endTime: entry?.endTime || '09:00',
    room: entry?.room || '',
    lecturer: entry?.lecturer || '',
    notes: entry?.notes || '',
    color: entry?.color || COLORS[0],
  });

  const [ocr, setOcr] = useState({ loading: false, text: '', error: '' });
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);
  const modalRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    if (isEdit) {
      updateEntry(entry.id, form);
    } else {
      addEntry(form);
    }
    setSaved(true);
    setTimeout(onClose, 500);
  };

  const handleOCR = async (file) => {
    if (!file) return;
    setOcr({ loading: true, text: '', error: '' });
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      setOcr({ loading: false, text: text.trim(), error: '' });
      parseOCRText(text);
    } catch (err) {
      setOcr({ loading: false, text: '', error: 'OCR failed. Try a clearer image.' });
    }
  };

  const parseOCRText = (text) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const updates = {};

    // Extract time patterns like 8:00 AM - 10:00 AM or 08:00-10:00
    const timeMatch = text.match(/(\d{1,2})[:.]\d{2}\s*(?:AM|PM)?/gi);
    if (timeMatch && timeMatch.length >= 2) {
      const parseT = (s) => {
        const m = s.match(/(\d{1,2})[:.:](\d{2})\s*(AM|PM)?/i);
        if (!m) return null;
        let h = parseInt(m[1]);
        const min = m[2];
        if (m[3]) {
          if (m[3].toUpperCase() === 'PM' && h < 12) h += 12;
          if (m[3].toUpperCase() === 'AM' && h === 12) h = 0;
        }
        return `${h.toString().padStart(2, '0')}:${min}`;
      };
      const t1 = parseT(timeMatch[0]);
      const t2 = parseT(timeMatch[1]);
      if (t1) updates.startTime = t1;
      if (t2) updates.endTime = t2;
    }

    // Room: Look for standard SLIIT room formats (e.g., G1302, A405, B501, F301)
    const sliitRoomMatch = text.match(/\b([A-Z]\d{3,4})\b/);
    if (sliitRoomMatch) {
      updates.room = sliitRoomMatch[1];
    } else {
      const roomMatch = text.match(/(?:room|venue|hall|lab)[:\s]+([A-Z0-9-\/]+)/i);
      if (roomMatch) updates.room = roomMatch[1].trim();
    }

    // Subject: Look for SLIIT module codes (e.g., IT1160 - DM Practical, SE1020 - OOP)
    const moduleMatch = text.match(/([A-Z]{2}\d{4}\s*[-–]\s*[A-Za-z0-9\s,&]+?(?:Practical|Lecture|Tutorial|Workshop)?)(?:\n|$|\r)/i);
    if (moduleMatch) {
      updates.subject = moduleMatch[1].replace(/\n/g, ' ').trim();
    } else if (lines[0] && lines[0].length > 2) {
      updates.subject = lines[0]; // fallback
    }

    // Lecturer: Look for SLIIT titles (Ms., Mr., Dr.) followed by names
    const lecMatch = text.match(/((?:Ms\.|Mr\.|Dr\.)\s+[A-Za-z\s,&.]+)/i);
    if (lecMatch) {
      updates.lecturer = lecMatch[1].replace(/\n/g, ' ').trim();
    } else {
      const altLecMatch = text.match(/(?:lecturer|instructor|prof|dr\.?)[:\s]+([A-Za-z\s.]+)/i);
      if (altLecMatch) updates.lecturer = altLecMatch[1].trim().split('\n')[0];
    }

    // Day
    DAYS.forEach((day) => {
      if (text.toLowerCase().includes(day.toLowerCase())) updates.day = day;
    });

    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Class' : 'Add New Class'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <IconClose size={20} />
          </button>
        </div>

        {/* OCR Section */}
        <div className="ocr-section">
          <div
            className="ocr-drop"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleOCR(f);
            }}
          >
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleOCR(e.target.files[0])}
            />
            {ocr.loading ? (
              <div className="ocr-loading">
                <div className="spinner" />
                <span>Scanning image with OCR...</span>
              </div>
            ) : (
              <>
                <IllustrationScan width={52} />
                <span>Upload image for OCR auto-fill</span>
                <span className="ocr-hint">Click or drag &amp; drop a timetable photo</span>
              </>
            )}
          </div>
          {ocr.error && <p className="ocr-error">{ocr.error}</p>}
          {ocr.text && (
            <details className="ocr-text-details">
              <summary>View extracted text</summary>
              <pre className="ocr-text">{ocr.text}</pre>
            </details>
          )}
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group full">
              <label>Subject / Module Name *</label>
              <input
                type="text"
                value={form.subject}
                onChange={handleChange('subject')}
                placeholder="e.g. Software Engineering"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Day</label>
              <select value={form.day} onChange={handleChange('day')}>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label><IconClock size={13} /> Start Time</label>
              <select value={form.startTime} onChange={handleChange('startTime')}>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label><IconClock size={13} /> End Time</label>
              <select value={form.endTime} onChange={handleChange('endTime')}>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><IconBook size={13} /> Lecturer</label>
              <input
                type="text"
                value={form.lecturer}
                onChange={handleChange('lecturer')}
                placeholder="e.g. Dr. Perera"
              />
            </div>
            <div className="form-group">
              <label><IconMapPin size={13} /> Room / Venue</label>
              <input
                type="text"
                value={form.room}
                onChange={handleChange('room')}
                placeholder="e.g. Lab 3, A-204"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label><IconNote size={13} /> Notes</label>
              <textarea
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label>Color Label</label>
            <div className="color-picker">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                >
                  {form.color === c && <IconCheck size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`btn btn-primary ${saved ? 'saved' : ''}`}>
              {saved ? <><IconCheck size={16} /> Saved!</> : isEdit ? 'Update Class' : 'Add Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;
