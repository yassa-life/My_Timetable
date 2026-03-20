import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTimetable } from '../context/TimetableContext';
import {
  IconHome, IconGrid, IconCalendar, IconSun, IconMoon,
  IconDownload, IconImport
} from './Icons';
import { exportJSON, importJSON } from '../utils/storage';
import { extractAllGroups } from '../utils/htmlParser';
import HtmlImportModal from './HtmlImportModal';

const Navbar = () => {
  const { theme, toggleTheme, entries, importEntries } = useTimetable();
  const [htmlFileModal, setHtmlFileModal] = useState(null);

  const handleExport = () => exportJSON(entries);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.html,.htm';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        // Handle SLIIT HTML Timetable
        const reader = new FileReader();
        reader.onload = (event) => {
          const htmlContent = event.target.result;
          try {
            const groups = extractAllGroups(htmlContent);
            if (groups.length === 0) {
              alert('Could not detect any SLIIT groups in this HTML file.');
              return;
            }
            setHtmlFileModal({ htmlContent, groups });
          } catch (err) {
            alert('Failed to parse HTML file.');
          }
        };
        reader.readAsText(file);
      } else {
        // Handle normal JSON backup
        try {
          const data = await importJSON(file);
          if (window.confirm(`Import ${data.length} entries? This will replace current data.`)) {
            importEntries(data);
          }
        } catch (err) {
          alert('Failed to import JSON: ' + err.message);
        }
      }
    };
    input.click();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <IconCalendar size={22} />
          </div>
          <span className="brand-name">SLIIT<span className="brand-accent"> Timetable</span></span>
        </div>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <IconHome size={18} />
            <span>Today</span>
          </NavLink>
          <NavLink to="/timetable" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <IconGrid size={18} />
            <span>Timetable</span>
          </NavLink>
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={handleExport} title="Export backup (JSON)">
            <IconDownload size={18} />
          </button>
          <button className="icon-btn" onClick={handleImport} title="Import backup (JSON) or SLIIT Timetable (HTML)">
            <IconImport size={18} />
          </button>
          <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
        </div>
      </nav>

      {htmlFileModal && (
        <HtmlImportModal
          htmlContent={htmlFileModal.htmlContent}
          groups={htmlFileModal.groups}
          onClose={() => setHtmlFileModal(null)}
        />
      )}
    </>
  );
};

export default Navbar;
