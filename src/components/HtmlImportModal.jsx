import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { parseSliitHtml } from '../utils/htmlParser';
import { IconClose, IconCheck, IconImport, IconSearch } from './Icons';

const HtmlImportModal = ({ htmlContent, groups, onClose }) => {
  const { importEntries } = useTimetable();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');

  const filteredGroups = groups.filter((g) =>
    g.toLowerCase().includes(search.toLowerCase())
  );

  const handleImport = () => {
    // Smart auto-select if only 1 option is filtered
    let target = selectedGroup;
    if (!target) {
      if (filteredGroups.length === 1) {
        target = filteredGroups[0];
      } else {
        setError('Please click on a specific group from the list first!');
        return;
      }
    }

    try {
      const entries = parseSliitHtml(htmlContent, target);
      if (
        window.confirm(
          `Successfully extracted ${entries.length} classes for ${target}.\n\nImporting this will REPLACE your current timetable. Proceed?`
        )
      ) {
        importEntries(entries);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to parse timetable.');
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Import SLIIT Timetable</h2>
          <button className="icon-btn" onClick={onClose}>
            <IconClose size={20} />
          </button>
        </div>

        <div className="modal-form">
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            We detected a SLIIT HTML Timetable file. Please search and select your specific group.
          </p>

          <div className="form-group full">
            <label><IconSearch size={14} /> Search your group (e.g. Y1.S2.WD.IT.14)</label>
            <input
              type="text"
              placeholder="Type to filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group full" style={{ marginTop: '10px' }}>
            <label>Select Group</label>
            <select
              size={6}
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setError('');
              }}
              style={{ padding: '8px', minHeight: '140px', cursor: 'pointer', outline: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            >
              {filteredGroups.length === 0 ? (
                <option disabled>No groups found...</option>
              ) : (
                filteredGroups.map((g) => (
                  <option key={g} value={g} style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                    {g}
                  </option>
                ))
              )}
            </select>
          </div>

          {error && <p className="ocr-error" style={{ marginTop: '8px' }}>{error}</p>}

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
            onClick={handleImport}
          >
            <IconImport size={16} /> Import {selectedGroup || (filteredGroups.length === 1 ? filteredGroups[0] : 'Classes')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HtmlImportModal;
