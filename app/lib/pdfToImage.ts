let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

/* export const pdfToImage = async (
  pdf: string | File | Blob
): Promise<string | undefined> => {
  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
  const pdfDoc = await pdfjsLib.PDFDocumentLoader.fromData(
    typeof pdf === 'string'
      ? Buffer.from(pdf, 'binary')
      : await pdf.arrayBuffer()
  );
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  await page.render({ canvasContext: ctx, viewport });
  return canvas.toDataURL('image/png');
}; */

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import('pdfjs-dist/build/pdf.mjs').then((lib) => {
    // Set the worker source to use local file
    lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 4 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create a File from the blob with the same name as the pdf
            const originalName = file.name.replace(/\.pdf$/i, '');
            const imageFile = new File([blob], `${originalName}.png`, {
              type: 'image/png',
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: '',
              file: null,
              error: 'Failed to create image blob',
            });
          }
        },
        'image/png',
        1.0
      ); // Set quality to maximum (1.0)
    });
  } catch (err) {
    return {
      imageUrl: '',
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
