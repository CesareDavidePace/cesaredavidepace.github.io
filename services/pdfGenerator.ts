import jsPDF from 'jspdf';
import { AppData, Language } from '../types';

// Helper to add text and update Y position
const addText = (
  doc: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  fontSize: number = 10, 
  font: string = "helvetica", 
  style: string = "normal"
): number => {
  doc.setFont(font, style);
  doc.setFontSize(fontSize);
  
  const splitText = doc.splitTextToSize(text, 180); // Max width 180mm
  doc.text(splitText, x, y);
  return y + (splitText.length * (fontSize * 0.35 + 1)) + 2; // Return new Y position
};

const drawLine = (doc: jsPDF, y: number) => {
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, 195, y);
  return y + 8;
};

export const generateCV = (data: AppData, lang: Language, type: 'short' | 'long') => {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  yPos = addText(doc, data.profile.name.toUpperCase(), 15, yPos, 20, "helvetica", "bold");
  yPos = addText(doc, data.profile.role[lang], 15, yPos - 2, 12, "helvetica", "italic");
  doc.setFontSize(9);
  doc.text(`${data.profile.email} | ${data.profile.location}`, 15, yPos);
  yPos += 10;
  yPos = drawLine(doc, yPos);

  // About
  if (type === 'long') {
     yPos = addText(doc, "PROFILE", 15, yPos, 12, "helvetica", "bold");
     yPos = addText(doc, data.profile.about[lang], 15, yPos, 10, "helvetica", "normal");
     yPos += 5;
  }

  // History / Education
  yPos = addText(doc, type === 'short' ? "EDUCATION & EXPERIENCE" : "HISTORY", 15, yPos, 12, "helvetica", "bold");
  
  const historyItems = type === 'short' ? data.history.slice(0, 3) : data.history;

  historyItems.forEach(item => {
    // Check page break
    if (yPos > 270) { doc.addPage(); yPos = 20; }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(item.year, 15, yPos);
    
    doc.text(item.institution, 50, yPos);
    yPos += 5;
    
    doc.setFont("helvetica", "italic");
    doc.text(item.title[lang], 50, yPos);
    yPos += 5;

    if (type === 'long') {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100);
        const descLines = doc.splitTextToSize(item.description[lang], 140);
        doc.text(descLines, 50, yPos);
        doc.setTextColor(0);
        yPos += (descLines.length * 4) + 4;
    } else {
        yPos += 2;
    }
  });

  yPos += 5;
  if (yPos > 270) { doc.addPage(); yPos = 20; }

  // Projects (Only for long or if space permits in short - simplified for short)
  if (type === 'long') {
      yPos = addText(doc, "SELECTED PROJECTS", 15, yPos, 12, "helvetica", "bold");
      data.projects.forEach(proj => {
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        doc.setFont("helvetica", "bold");
        doc.text(proj.title[lang], 15, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        const desc = `${proj.description[lang]} [${proj.technologies.join(', ')}]`;
        yPos = addText(doc, desc, 15, yPos, 9);
        yPos += 2;
      });
      yPos += 5;
  }

  // Publications
  if (yPos > 260) { doc.addPage(); yPos = 20; }
  yPos = addText(doc, "PUBLICATIONS", 15, yPos, 12, "helvetica", "bold");
  
  const pubItems = type === 'short' ? data.publications.slice(0, 3) : data.publications;

  pubItems.forEach(pub => {
     if (yPos > 270) { doc.addPage(); yPos = 20; }
     const text = `[${pub.year}] ${pub.title}. ${pub.authors.join(', ')}. ${pub.venue}.`;
     yPos = addText(doc, text, 15, yPos, 9);
  });

  // Footer for Short CV if truncated
  if (type === 'short') {
      const footer = "Full CV and project portfolio available at website.";
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(footer, 105, 285, { align: 'center' });
  }

  doc.save(type === 'short' ? 'resume_short.pdf' : 'resume_extended.pdf');
};