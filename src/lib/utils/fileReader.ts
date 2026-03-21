import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

/**
 * Extract text from PDF with formatting preservation
 * Uses Y-coordinate analysis to detect line breaks
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  console.log('PDF loaded, pages:', pdf.numPages)
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()

    const items = textContent.items as any[]
    let lastY = -1
    let pageText = ''

    items.forEach((item) => {
      if ('str' in item && 'transform' in item) {
        const y = item.transform[5] // Y coordinate
        const text = item.str

        // Add newline if Y coordinate changed significantly
        if (lastY !== -1 && Math.abs(y - lastY) > 5) {
          pageText += '\n'
        }

        pageText += text + ' '
        lastY = y
      }
    })

    fullText += pageText.trim() + '\n\n'
  }

  console.log('Extracted text length:', fullText.length)
  return fullText.trim()
}

/**
 * Read text content from a file
 */
export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      console.log('Text loaded, length:', text.length)
      resolve(text)
    }
    reader.onerror = () => reject(new Error('Failed to read text file'))
    reader.readAsText(file)
  })
}
