import * as fs from 'fs';
import { PDFParse } from 'pdf-parse';

/** Reads a PDF file and returns its page count and text (whitespace collapsed to single spaces) */
export async function readPdf(pdfPath: string): Promise<{ pages: number; text: string }> {
  const buffer = fs.readFileSync(pdfPath);
  if (buffer.subarray(0, 4).toString() !== '%PDF') {
    throw new Error(`File is not a valid PDF: ${pdfPath}`);
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return { pages: result.total, text: result.text.replace(/\s+/g, ' ') };
  } finally {
    await parser.destroy();
  }
}
