import { jsPDF } from 'jspdf';

/**
 * Exports a lesson plan object into a clean, publication-ready PDF document.
 * 100% client-side vector text rendering with page overflow calculation.
 */
export function exportLessonPlanToPdf(plan) {
  if (!plan) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;
  let pageNumber = 1;

  // Helper to check for page break
  const ensureSpace = (neededHeight) => {
    if (y + neededHeight > pageHeight - margin - 25) {
      addFooter(pageNumber);
      doc.addPage();
      pageNumber++;
      y = margin + 15;
      return true;
    }
    return false;
  };

  const addFooter = (pageNum) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = `PlanCraft · Rapid Lesson Architecture · ${plan.topic}`;
    doc.text(footerText, margin, pageHeight - 20);
    const pageStr = `Page ${pageNum}`;
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 20);
  };

  // --- HEADER BANNER ---
  // Top brand micro-label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 80, 20); // Warm amber
  doc.text('PLANCRAFT LESSON ARCHITECTURE', margin, y);
  y += 16;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);
  const titleLines = doc.splitTextToSize(plan.topic, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 26;

  // Subtitle Metadata Bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  const metaText = `Class Level: ${plan.classLevel}   |   Duration: ${plan.totalMinutes} Minutes   |   Framework: ${plan.framework.replace('_', ' ').toUpperCase()}`;
  doc.text(metaText, margin, y);
  y += 12;

  // Horizontal hairline divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.75);
  doc.line(margin, y, margin + contentWidth, y);
  y += 16;

  // --- ESSENTIAL QUESTION ---
  if (plan.essentialQuestion) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    const eqLines = doc.splitTextToSize(`Essential Question: "${plan.essentialQuestion}"`, contentWidth);
    doc.text(eqLines, margin, y);
    y += eqLines.length * 14 + 10;
  }

  // --- SWBAT LEARNING OBJECTIVE BOX ---
  ensureSpace(45);
  doc.setFillColor(250, 248, 245);
  doc.setDrawColor(225, 200, 160);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(130, 70, 10);
  doc.text('MEASURABLE LEARNING OUTCOME (SWBAT):', margin + 10, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const swbatLines = doc.splitTextToSize(plan.swbat, contentWidth - 20);
  doc.text(swbatLines, margin + 10, y + 26);
  y += 50;

  // --- INSTRUCTIONAL PHASES & TIME ALLOCATION ---
  ensureSpace(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text(`Instructional Stages (${plan.totalMinutes} min total - Exact Match)`, margin, y);
  y += 16;

  // Render each section
  plan.sections.forEach((section, index) => {
    // Estimate height needed for this section
    const estHeight = 85;
    ensureSpace(estHeight);

    // Section card box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(225, 225, 225);
    doc.roundedRect(margin, y, contentWidth, 78, 4, 4, 'FD');

    // Number & Phase
    doc.setFillColor(28, 25, 23);
    doc.roundedRect(margin + 8, y + 8, 20, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(index + 1).padStart(2, '0'), margin + 13, y + 19);

    // Section Phase Tag & Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(150, 80, 20);
    doc.text(`[${section.phase.toUpperCase()}]`, margin + 34, y + 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(25, 25, 25);
    doc.text(section.name, margin + 105, y + 19);

    // Duration Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(25, 25, 25);
    const durationStr = `${section.minutes} min`;
    doc.text(durationStr, margin + contentWidth - 55, y + 19);

    // Focus Objective
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const objLines = doc.splitTextToSize(`Focus: ${section.objective}`, contentWidth - 20);
    doc.text(objLines.slice(0, 1), margin + 10, y + 33);

    // Teacher & Student Split
    const halfWidth = (contentWidth - 28) / 2;

    // Teacher Move box
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin + 8, y + 40, halfWidth, 30, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text('TEACHER FACILITATION:', margin + 12, y + 49);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    const teacherLines = doc.splitTextToSize(section.teacherAction, halfWidth - 8);
    doc.text(teacherLines.slice(0, 2), margin + 12, y + 59);

    // Student Action box
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin + 12 + halfWidth, y + 40, halfWidth, 30, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text('ACTIVE STUDENT PARTICIPATION:', margin + 16 + halfWidth, y + 49);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    const studentLines = doc.splitTextToSize(section.studentAction, halfWidth - 8);
    doc.text(studentLines.slice(0, 2), margin + 16 + halfWidth, y + 59);

    y += 84;
  });

  y += 6;

  // --- MATERIALS & PREPARATION CHECKLIST ---
  ensureSpace(70);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(25, 25, 25);
  doc.text('Materials & Preparation Checklist', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  plan.materials.forEach((mat) => {
    ensureSpace(14);
    // Draw checkbox square
    doc.setDrawColor(150, 150, 150);
    doc.rect(margin, y - 7, 8, 8);
    if (mat.checked) {
      doc.setFont('helvetica', 'bold');
      doc.text('x', margin + 1.5, y);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(mat.text, margin + 14, y);
    y += 13;
  });

  y += 6;

  // --- COMMON MISCONCEPTIONS ---
  ensureSpace(55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(25, 25, 25);
  doc.text('Anticipated Student Misconceptions', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  plan.anticipatedMisconceptions.forEach((mis) => {
    ensureSpace(16);
    doc.setFillColor(180, 100, 20);
    doc.circle(margin + 3, y - 3, 2, 'F');
    const misLines = doc.splitTextToSize(mis, contentWidth - 14);
    doc.text(misLines, margin + 10, y);
    y += misLines.length * 11 + 2;
  });

  y += 6;

  // --- EXIT TICKET ---
  ensureSpace(45);
  doc.setFillColor(254, 251, 245);
  doc.setDrawColor(230, 210, 170);
  doc.roundedRect(margin, y, contentWidth, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(150, 70, 10);
  doc.text('FORMATIVE EXIT TICKET DIAGNOSTIC:', margin + 10, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  const exitLines = doc.splitTextToSize(plan.exitTicket, contentWidth - 20);
  doc.text(exitLines, margin + 10, y + 24);
  y += 44;

  // Add final page footer
  addFooter(pageNumber);

  // Filename sanitation
  const cleanTitle = plan.topic.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
  const filename = `Lesson_Plan_${cleanTitle}_${plan.totalMinutes}m.pdf`;

  // Download PDF file directly in browser
  doc.save(filename);
}
