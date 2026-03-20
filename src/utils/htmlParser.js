import { generateId } from './storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function addHours(timeStr, hours) {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMins = h * 60 + m + hours * 60;
  return `${Math.floor(totalMins / 60).toString().padStart(2, '0')}:${(totalMins % 60).toString().padStart(2, '0')}`;
}

export function extractAllGroups(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const links = Array.from(doc.querySelectorAll('ul > li > ul > li > a'));
  return links.map((a) => a.textContent.trim());
}

export function parseSliitHtml(htmlString, targetGroupName) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // Find the anchor with the exact group name
  const links = Array.from(doc.querySelectorAll('ul > li > ul > li > a'));
  const groupLink = links.find((a) => a.textContent.trim() === targetGroupName);
  
  if (!groupLink) {
    throw new Error(`Group "${targetGroupName}" not found in the HTML file.`);
  }

  const tableId = groupLink.getAttribute('href').replace('#', '');
  const table = doc.getElementById(tableId);
  
  if (!table) {
    throw new Error(`Timetable for group "${targetGroupName}" not found.`);
  }

  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const activeSpans = [0, 0, 0, 0, 0, 0, 0]; // Accomodate weekend just in case
  const entries = [];
  
  rows.forEach((row) => {
    const yAxis = row.querySelector('.yAxis');
    if (!yAxis) return; 
    
    const startTime = yAxis.textContent.trim();
    // Only get immediate child TDs, avoiding nested table TDs
    const cells = Array.from(row.children).filter(
      (child) => child.tagName.toLowerCase() === 'td'
    );
    let tdIndex = 0;
    
    for (let dayIdx = 0; dayIdx < 5; dayIdx++) { // SLIIT HTML usually has 5 columns
      if (activeSpans[dayIdx] > 0) {
        activeSpans[dayIdx]--;
        continue;
      }
      
      const cell = cells[tdIndex++];
      if (!cell) break;
      
      const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
      activeSpans[dayIdx] = rowspan - 1;
      
      const rawText = cell.textContent.trim();
      if (rawText !== '---' && rawText !== '-x-' && rawText !== '') {
        const endTime = addHours(startTime, rowspan);
        const day = DAYS[dayIdx];
        
        // Nested sub-group table handling
        const subTable = cell.querySelector('table.detailed');
        if (subTable) {
          const subRows = Array.from(subTable.querySelectorAll('tr'));
          if (subRows.length >= 4) {
             const subGroups = Array.from(subRows[0].querySelectorAll('td')).map((td) => td.textContent.trim());
             const subjects = Array.from(subRows[1].querySelectorAll('td')).map((td) => td.textContent.trim());
             const lecturers = Array.from(subRows[2].querySelectorAll('td')).map((td) => td.textContent.trim());
             const rooms = Array.from(subRows[3].querySelectorAll('td')).map((td) => td.textContent.trim());
             
             for (let i = 0; i < subGroups.length; i++) {
                entries.push({
                   id: generateId() + '-' + i,
                   day,
                   startTime,
                   endTime,
                   subject: `${subjects[i]} (${subGroups[i]})`,
                   lecturer: lecturers[i],
                   room: rooms[i],
                   notes: `Extracted from sub-group ${subGroups[i]}`,
                   color: '#6366f1' 
                });
             }
          }
        } else {
          // Standard cell with <br/> or text nodes
          let lines = [];
          
          cell.childNodes.forEach((node) => {
            if (node.nodeType === 3) { // Text node
              const text = node.nodeValue.trim();
              if (text) lines.push(text);
            }
          });
          
          // E.g. "Y1.S1.WD.IT.01, Y1.S1.WD.IT.02" row on top happens frequently 
          if (lines[0] && (lines[0].includes('Y1.') || lines[0].includes('Y2.') || lines[0].includes('Y3.') || lines[0].includes('Y4.'))) {
            lines.shift(); // discard it
          }

          if (lines.length > 0) {
            entries.push({
              id: generateId(),
              day,
              startTime,
              endTime,
              subject: lines[0] || 'Unknown Subject',
              lecturer: lines[1] || '',
              room: lines.length > 2 ? lines[lines.length - 1] : '',
              notes: '',
              color: '#8b5cf6' 
            });
          }
        }
      }
    }
  });
  
  // Assign distinct colors based on module name
  const uniqueSubjects = [...new Set(entries.map((e) => e.subject.replace(/\(.*\)/, '').trim()))];
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#f97316'];
  const subjectColorMap = {};
  
  uniqueSubjects.forEach((sub, i) => {
    subjectColorMap[sub] = COLORS[i % COLORS.length];
  });
  
  // Apply colors to entries
  entries.forEach((e) => {
    const baseSub = e.subject.replace(/\(.*\)/, '').trim();
    e.color = subjectColorMap[baseSub] || COLORS[0];
  });

  return entries;
}
