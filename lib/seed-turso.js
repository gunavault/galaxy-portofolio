const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log('🌌 Seeding Turso database...');

  await db.execute(`
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
    )
  `);

  const experiences = [
    ['Cyber Security Engineer', 'PT ALTO Network', 'Jakarta, Indonesia', 'Nov 2025', null, 1,
      'Led 3–5 concurrent cybersecurity projects worth up to Rp 1.7 Billion. Managed teams of 2–6, owned vendor selection, budget tracking, and reported directly to CTO. Implemented Splunk SIEM, FortiClient EMS, Wazuh SCA.',
      'work', 1],
    ['Software Engineer', 'PT ALTO Network', 'Jakarta, Indonesia', 'Nov 2024', 'Nov 2025', 0,
      'Designed end-to-end fraud operations architecture. Built case management system for 11 users, data pipeline processing 10,000 events/sec, and ISO8583 parser at 300MB/s. Improved data integrity by 20%.',
      'work', 2],
    ['Sales & Pre-Sales Consultant', 'Independent / Commission-Based', 'Indonesia', '2024', null, 1,
      'Independently sourcing enterprise clients for cybersecurity solutions. Conducting technical needs assessments and bridging complex security products with business requirements.',
      'work', 3],
    ['Internship — Information Technology', 'PT Perkebunan Nusantara III (Persero)', 'Indonesia', 'Sep 2023', 'Apr 2024', 0,
      'Built Flutter SOP compliance app used by 1,000+ daily users. Created GIS mapping app deployed across the entire PTPN Group nationwide.',
      'work', 4],
  ];

  for (const exp of experiences) {
    await db.execute({
      sql: `INSERT INTO experiences (title, company, location, start_date, end_date, is_current, description, type, order_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: exp,
    });
  }

  console.log('✅ Done! Seeded', experiences.length, 'experiences.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
