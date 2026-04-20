import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, LevelFormat, BorderStyle
} from 'docx';

const ACCENT = '1F4E79';
const LIGHT_GRAY = '666666';

function sectionHeader(text: string) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 1 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: ACCENT, font: 'Arial' })]
  });
}

function bullet(text: string) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: 'Arial' })]
  });
}

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM experiences ORDER BY order_index ASC');
    const experiences = result.rows as any[];

    const doc = new Document({
      numbering: {
        config: [{
          reference: 'bullets',
          levels: [{
            level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 480, hanging: 240 } } }
          }]
        }]
      },
      styles: {
        default: { document: { run: { font: 'Arial', size: 20 } } }
      },
      sections: [{
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
          }
        },
        children: [
          // NAME
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: 'GUNA DHARMA', bold: true, size: 44, font: 'Arial', color: ACCENT })]
          }),
          // CONTACT
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: 'Jakarta Selatan, Indonesia  •  gunadharma201@gmail.com  •  +6289516370731', size: 18, font: 'Arial', color: LIGHT_GRAY })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
            children: [new TextRun({ text: 'linkedin.com/in/gunadharma0408  •  gunaaax.framer.website', size: 18, font: 'Arial', color: LIGHT_GRAY })]
          }),

          // SUMMARY
          sectionHeader('Professional Summary'),
          new Paragraph({
            spacing: { before: 100, after: 100 },
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({
              text: 'Results-driven professional with 2+ years of experience managing high-value projects, leading cross-functional teams, and delivering business solutions in fast-paced enterprise environments. Proven ability to own projects end-to-end with direct exposure to C-level stakeholders and budgets up to Rp 1.7 Billion.',
              size: 20, font: 'Arial'
            })]
          }),

          // EXPERIENCE
          sectionHeader('Work Experience'),
          ...experiences.flatMap(exp => [
            new Paragraph({
              spacing: { before: 160, after: 40 },
              children: [
                new TextRun({ text: exp.title, bold: true, size: 22, font: 'Arial' }),
                new TextRun({ text: '  |  ', size: 22, font: 'Arial', color: LIGHT_GRAY }),
                new TextRun({ text: exp.company, bold: true, size: 22, font: 'Arial', color: ACCENT }),
              ]
            }),
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [new TextRun({
                text: `${exp.location}  •  ${exp.start_date} – ${exp.end_date || 'Present'}`,
                size: 20, font: 'Arial', color: LIGHT_GRAY, italics: true
              })]
            }),
            ...exp.description.split('\n').filter(Boolean).map((s: string) =>
              bullet(s.trim())
            ),
          ]),

          // SKILLS
          sectionHeader('Skills'),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Languages: ', bold: true, size: 20, font: 'Arial' }),
              new TextRun({ text: 'Python, JavaScript, Go, PHP, Dart', size: 20, font: 'Arial' }),
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Security: ', bold: true, size: 20, font: 'Arial' }),
              new TextRun({ text: 'Splunk SIEM, FortiClient EMS, Wazuh SCA, CIS Hardening, ISO 8583', size: 20, font: 'Arial' }),
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Tools & Platforms: ', bold: true, size: 20, font: 'Arial' }),
              new TextRun({ text: 'Docker, Kafka, Google Cloud, Linux, Git, Tableau, Power Automate', size: 20, font: 'Arial' }),
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Competencies: ', bold: true, size: 20, font: 'Arial' }),
              new TextRun({ text: 'Project Management, System Architecture, Vendor Management, Executive Reporting', size: 20, font: 'Arial' }),
            ]
          }),

          // EDUCATION
          sectionHeader('Education'),
          new Paragraph({
            spacing: { before: 160, after: 40 },
            children: [
              new TextRun({ text: "Bachelor's Degree, Informatics Engineering", bold: true, size: 22, font: 'Arial' }),
              new TextRun({ text: '  |  ', size: 22, font: 'Arial', color: LIGHT_GRAY }),
              new TextRun({ text: 'Universitas Logistik dan Bisnis Internasional (ULBI)', bold: true, size: 22, font: 'Arial', color: ACCENT }),
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: 'Aug 2020 – Aug 2024', size: 20, font: 'Arial', color: LIGHT_GRAY, italics: true })]
          }),

          // CERTIFICATIONS
          sectionHeader('Certifications'),
          bullet('Associate Google Cloud Architecture'),
          bullet('IT Support Google Specialization'),
          bullet('IT Security and Compliance'),
          bullet('Scrum Foundation Professional'),

          // LANGUAGES
          sectionHeader('Languages'),
          bullet('Indonesian — Native proficiency'),
          bullet('English — Professional working proficiency'),
        ]
      }]
    });

const buffer = await Packer.toBuffer(doc);
const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Guna_Dharma_CV.docx"',
      },
    });
  } catch (e: any) {
    console.error('CV generation error:', e?.message);
    return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
  }
}