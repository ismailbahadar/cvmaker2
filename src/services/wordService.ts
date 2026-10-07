import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { ResumeData } from '../types/resume';

export async function downloadResumeWord(
  data: ResumeData,
  filename: string = 'Resume.docx'
): Promise<void> {
  const {
    personalInfo,
    summary,
    careerObjective,
    experience,
    education,
    qualifications,
    skills,
    languages,
    certifications,
    projects,
    awards,
    references,
    customSections,
    customization,
  } = data;

  const isUrdu =
    customization?.font === 'Noto Nastaliq Urdu' ||
    customization?.language === 'ur' ||
    customization?.direction === 'rtl';

  const primaryHex = (customization?.primaryColor || '#1e3a8a').replace('#', '').toUpperCase();
  const fontName = isUrdu
    ? 'Jameel Noori Nastaleeq'
    : customization?.font === 'Georgia'
    ? 'Georgia'
    : customization?.font === 'Arial'
    ? 'Arial'
    : 'Calibri';

  const defaultAlign = isUrdu ? AlignmentType.RIGHT : AlignmentType.LEFT;

  const children: (Paragraph | Table)[] = [];

  // Helper for stylized section title
  const addSectionTitle = (title: string) => {
    children.push(
      new Paragraph({
        alignment: defaultAlign,
        spacing: { before: 260, after: 120 },
        border: {
          bottom: {
            color: primaryHex,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 14,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: primaryHex,
            font: fontName,
          }),
        ],
      })
    );
  };

  // 1. Candidate Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Curriculum Vitae',
          bold: true,
          size: 40, // 20pt
          color: primaryHex,
          font: fontName,
        }),
      ],
    })
  );

  // 2. Professional Designation / Title
  if (personalInfo.jobTitle) {
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: personalInfo.jobTitle.toUpperCase(),
            bold: true,
            size: 22, // 11pt
            color: '475569',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 3. Contact Information Bar
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(`Email: ${personalInfo.email}`);
  if (personalInfo.phone) contactParts.push(`Phone: ${personalInfo.phone}`);
  if (personalInfo.showWhatsapp && personalInfo.whatsapp) contactParts.push(`WhatsApp: ${personalInfo.whatsapp}`);
  if (personalInfo.city || personalInfo.country) {
    contactParts.push(`Location: ${[personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}`);
  }
  if (personalInfo.linkedIn) contactParts.push(`LinkedIn: ${personalInfo.linkedIn}`);
  if (personalInfo.portfolioUrl) contactParts.push(`Portfolio: ${personalInfo.portfolioUrl}`);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 19,
            color: '64748B',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 4. Biographical Particulars (Father Name & CNIC No)
  const bioParts: string[] = [];
  if (personalInfo.fatherName) bioParts.push(`Father Name: ${personalInfo.fatherName}`);
  if (personalInfo.cnic) bioParts.push(`CNIC No: ${personalInfo.cnic}`);
  if (personalInfo.dateOfBirth) bioParts.push(`Date of Birth: ${personalInfo.dateOfBirth}`);
  if (personalInfo.domicile) bioParts.push(`Domicile: ${personalInfo.domicile}`);
  if (personalInfo.religion) bioParts.push(`Religion: ${personalInfo.religion}`);
  if (personalInfo.maritalStatus) bioParts.push(`Marital Status: ${personalInfo.maritalStatus}`);

  if (bioParts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: bioParts.join('   |   '),
            bold: true,
            size: 20,
            color: '0F172A',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 5. Professional Summary
  if (summary) {
    addSectionTitle('Professional Summary');
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: summary,
            size: 21,
            color: '334155',
            font: fontName,
          }),
        ],
      })
    );
  }

  // Career Objective
  if (careerObjective) {
    addSectionTitle('Career Objective');
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: careerObjective,
            size: 21,
            color: '334155',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 6. Work Experience
  if (experience && experience.length > 0) {
    addSectionTitle('Work Experience');
    experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: exp.jobTitle,
              bold: true,
              size: 22,
              color: '0F172A',
              font: fontName,
            }),
            new TextRun({
              text: `  —  ${exp.company}${exp.location ? ` (${exp.location})` : ''}`,
              bold: true,
              size: 21,
              color: '475569',
              font: fontName,
            }),
            new TextRun({
              text: `\t${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate}`,
              italics: true,
              size: 20,
              color: '64748B',
              font: fontName,
            }),
          ],
        })
      );

      if (exp.description) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                color: '334155',
                font: fontName,
              }),
            ],
          })
        );
      }

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach((bullet) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  color: '334155',
                  font: fontName,
                }),
              ],
            })
          );
        });
      }
    });
  }

  // 7. Professional Qualifications & Teaching Diplomas (B.Ed, M.Ed)
  if (qualifications && qualifications.length > 0) {
    addSectionTitle('Professional Qualifications & Teaching Certifications');
    qualifications.forEach((q) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [
            new TextRun({
              text: q.qualification,
              bold: true,
              size: 22,
              color: '0F172A',
              font: fontName,
            }),
            new TextRun({
              text: `  |  ${q.institution}  (${q.year})`,
              size: 21,
              color: '475569',
              font: fontName,
            }),
            ...(q.grade ? [
              new TextRun({
                text: `  —  Grade: ${q.grade}`,
                italics: true,
                size: 20,
                color: '047857',
                font: fontName,
              })
            ] : []),
          ],
        })
      );
      if (q.description) {
        children.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: q.description,
                size: 19,
                color: '64748B',
                font: fontName,
              }),
            ],
          })
        );
      }
    });
  }

  // 8. Academic Education
  if (education && education.length > 0) {
    addSectionTitle('Academic Education');
    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 30 },
          children: [
            new TextRun({
              text: edu.degree,
              bold: true,
              size: 22,
              color: '0F172A',
              font: fontName,
            }),
            new TextRun({
              text: `  —  ${edu.institution}${edu.location ? ` (${edu.location})` : ''}`,
              size: 21,
              color: '475569',
              font: fontName,
            }),
            new TextRun({
              text: `\t${edu.startYear ? `${edu.startYear} – ` : ''}${edu.endYear}`,
              italics: true,
              size: 20,
              color: '64748B',
              font: fontName,
            }),
          ],
        })
      );
      if (edu.grade || edu.major) {
        children.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: [edu.major ? `Major: ${edu.major}` : '', edu.grade ? `Grade/Division: ${edu.grade}` : ''].filter(Boolean).join('  |  '),
                size: 20,
                color: '334155',
                font: fontName,
              }),
            ],
          })
        );
      }
    });
  }

  // 9. Skills & Competencies
  if (skills && skills.length > 0) {
    addSectionTitle('Skills & Competencies');
    const skillList = skills.map((s) => s.name).join('  •  ');
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: skillList,
            size: 21,
            color: '334155',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 10. Languages
  if (languages && languages.length > 0) {
    addSectionTitle('Languages');
    const langList = languages.map((l) => `${l.name} (${l.proficiency})`).join('   |   ');
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: langList,
            size: 21,
            color: '334155',
            font: fontName,
          }),
        ],
      })
    );
  }

  // 11. Certifications
  if (certifications && certifications.length > 0) {
    addSectionTitle('Certifications');
    certifications.forEach((c) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${c.name} — ${c.organization} (${c.issueDate})`,
              size: 20,
              color: '334155',
              font: fontName,
            }),
          ],
        })
      );
    });
  }

  // 12. Projects
  if (projects && projects.length > 0) {
    addSectionTitle('Projects');
    projects.forEach((p) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: p.title,
              bold: true,
              size: 21,
              color: '0F172A',
              font: fontName,
            }),
            ...(p.date ? [
              new TextRun({
                text: ` (${p.date})`,
                size: 19,
                color: '64748B',
                font: fontName,
              }),
            ] : []),
          ],
        })
      );
      if (p.description) {
        children.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: p.description,
                size: 20,
                color: '334155',
                font: fontName,
              }),
            ],
          })
        );
      }
    });
  }

  // 13. Honors & Awards
  if (awards && awards.length > 0) {
    addSectionTitle('Honors & Awards');
    awards.forEach((a) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${a.title} — ${a.organization}${a.date ? ` (${a.date})` : ''}`,
              size: 20,
              color: '334155',
              font: fontName,
            }),
          ],
        })
      );
    });
  }

  // 14. References
  if (references) {
    addSectionTitle('References');
    if (references.type === 'upon_request') {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'References available upon request.',
              italics: true,
              size: 20,
              color: '475569',
              font: fontName,
            }),
          ],
        })
      );
    } else if (references.list && references.list.length > 0) {
      references.list.forEach((r) => {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${r.name} — ${r.title}, ${r.organization}`,
                bold: true,
                size: 20,
                color: '0F172A',
                font: fontName,
              }),
              ...(r.phone ? [
                new TextRun({
                  text: `  |  Phone: ${r.phone}`,
                  size: 19,
                  color: '475569',
                  font: fontName,
                }),
              ] : []),
              ...(r.email ? [
                new TextRun({
                  text: `  |  Email: ${r.email}`,
                  size: 19,
                  color: '475569',
                  font: fontName,
                }),
              ] : []),
            ],
          })
        );
      });
    }
  }

  // 15. Custom Sections
  if (customSections && customSections.length > 0) {
    customSections.forEach((cs) => {
      addSectionTitle(cs.title);
      cs.entries.forEach((en) => {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({
                text: en.title,
                bold: true,
                size: 21,
                color: '0F172A',
                font: fontName,
              }),
              ...(en.date ? [
                new TextRun({
                  text: ` (${en.date})`,
                  size: 19,
                  color: '64748B',
                  font: fontName,
                }),
              ] : []),
            ],
          })
        );
        if (en.description) {
          children.push(
            new Paragraph({
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: en.description,
                  size: 20,
                  color: '334155',
                  font: fontName,
                }),
              ],
            })
          );
        }
      });
    });
  }

  // 13. Footer: Designed and developed by Ismail Bahadar
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 360, after: 100 },
      border: {
        top: {
          color: 'E2E8F0',
          space: 6,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: 'Designed and developed by Ismail Bahadar',
          size: 16, // 8pt
          color: '94A3B8',
          font: fontName,
          italics: true,
        }),
      ],
    })
  );

  // Create Document with A4 margins and metadata
  const doc = new Document({
    creator: personalInfo.fullName || 'Professional AI Resume & CV Builder',
    title: data.title || 'Curriculum Vitae',
    description: 'Generated by Professional AI Resume & CV Builder',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  // Pack to Blob and trigger download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
