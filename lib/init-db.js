const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_current INTEGER DEFAULT 0,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'work',
    order_index INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
  );
`);

// Seed experiences
const insertExp = db.prepare(`
  INSERT OR IGNORE INTO experiences (id, title, company, location, start_date, end_date, is_current, description, type, order_index)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const experiences = [
  [1, 'Cyber Security Engineer', 'PT ALTO Network', 'Jakarta, Indonesia', 'Nov 2025', null, 1,
    'Led 3–5 concurrent cybersecurity projects (Rp 1.7B value), managing teams of 2–6. Owned full project lifecycle including vendor selection, budget tracking, and executive reporting to CTO. Implemented Splunk SIEM, FortiClient EMS, Wazuh SCA.',
    'work', 1],
  [2, 'Software Engineer', 'PT ALTO Network', 'Jakarta, Indonesia', 'Nov 2024', 'Nov 2025', 0,
    'Designed end-to-end technical architecture for fraud operations. Built case management system for 11-person fraud team, data pipeline processing 10,000 events/sec, and ISO8583 parser handling 300MB/s I/O with 20% data integrity improvement.',
    'work', 2],
  [3, 'Sales & Pre-Sales Consultant', 'Independent / Commission-Based', 'Indonesia', '2024', null, 1,
    'Independently identify enterprise clients for cybersecurity solutions. Conduct technical needs assessments and bridge complex security products with client business requirements.',
    'work', 3],
  [4, 'Internship — Information Technology', 'PT Perkebunan Nusantara III (Persero)', 'Indonesia', 'Sep 2023', 'Apr 2024', 0,
    'Built Flutter SOP compliance app adopted by 1,000+ daily users. Created GIS mapping app adopted across the entire PTPN Group nationwide.',
    'work', 4],
];

for (const exp of experiences) {
  insertExp.run(...exp);
}

// Seed skills
const insertSkill = db.prepare(`INSERT OR IGNORE INTO skills (id, name, category, order_index) VALUES (?, ?, ?, ?)`);
const skills = [
  [1, 'Python', 'Languages', 1], [2, 'JavaScript', 'Languages', 2], [3, 'Go', 'Languages', 3],
  [4, 'PHP', 'Languages', 4], [5, 'Dart', 'Languages', 5],
  [6, 'Splunk SIEM', 'Security', 1], [7, 'FortiClient EMS', 'Security', 2],
  [8, 'Wazuh SCA', 'Security', 3], [9, 'CIS Hardening', 'Security', 4],
  [10, 'Next.js', 'Frameworks', 1], [11, 'Django', 'Frameworks', 2],
  [12, 'Laravel', 'Frameworks', 3], [13, 'Flutter', 'Frameworks', 4],
  [14, 'Docker', 'Tools', 1], [15, 'Kafka', 'Tools', 2],
  [16, 'Google Cloud', 'Tools', 3], [17, 'Linux', 'Tools', 4],
  [18, 'Project Management', 'Competencies', 1], [19, 'System Architecture', 'Competencies', 2],
  [20, 'Vendor Management', 'Competencies', 3], [21, 'Executive Reporting', 'Competencies', 4],
];
for (const skill of skills) insertSkill.run(...skill);

console.log('✅ Database initialized at', dbPath);
db.close();
