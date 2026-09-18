/**
 * Isolated Print Utility for POS Thermal Printers & Laser/Inkjet A4 Printers
 * Compatible with TVS-E RP 3230 (80mm/3"), Epson, Munbyn, and Standard A4.
 * Uses an isolated hidden iframe to guarantee zero UI interference (no modal chrome, buttons, or backdrops).
 */

export function printIsolatedElement(elementId, options = {}) {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    console.error(`Print Error: Element with id "${elementId}" not found.`);
    window.print();
    return;
  }

  const {
    isThermal = false,
    thermalWidth = '80mm',
    title = 'Print Document'
  } = options;

  // Remove existing print iframe if present
  const existingIframe = document.getElementById('veloce-isolated-print-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'veloce-isolated-print-iframe';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-9999';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();

  const printStyles = isThermal
    ? `
      @page {
        size: ${thermalWidth} auto;
        margin: 0mm;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      html, body {
        width: ${thermalWidth};
        max-width: ${thermalWidth};
        margin: 0 auto;
        padding: 2mm 3mm;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: 'Courier New', Courier, monospace;
        font-size: 11px;
        line-height: 1.35;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print, button {
        display: none !important;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      img {
        max-width: 100%;
      }
    `
    : `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      html, body {
        width: 100%;
        margin: 0;
        padding: 0;
        background: #ffffff !important;
        color: #0f172a !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 13px;
        line-height: 1.45;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print, button {
        display: none !important;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
    `;

  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          ${printStyles}
        </style>
      </head>
      <body>
        <div class="print-container">
          ${sourceEl.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Give resources and fonts time to calculate layout
  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      console.error('Print execution failed:', err);
    } finally {
      // Clean up iframe after print dialog finishes
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2000);
    }
  }, 250);
}

export function printThermalReceipt(elementId = 'printable-thermal-bill', width = '80mm') {
  printIsolatedElement(elementId, {
    isThermal: true,
    thermalWidth: width,
    title: 'POS Thermal Bill'
  });
}

export function printA4Document(elementId = 'printable-a4-invoice', title = 'Tax Invoice') {
  printIsolatedElement(elementId, {
    isThermal: false,
    title
  });
}
