import { Component } from '@angular/core';

@Component({
  selector: 'app-pdfmake',
  templateUrl: './pdfmake.component.html',
  styleUrl: './pdfmake.component.css'
})
export class PdfmakeComponent {
  generatePDF() {
    const documentDefinition = {
      content: [
        { text: 'PURCHASE ORDER', style: 'header' },
        { text: 'Company: CLOUTE TECHNOLOGIES', style: 'subheader' },
        { text: 'Vendor: SUPREME COMPUTERS', style: 'subheader' },
        { text: 'Total: ₹5,34,775', style: 'total' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Item', 'Rate', 'Qty', 'Tax', 'Total'],
              ['HP Printer', '₹19,500', '2', '₹7,020', '₹46,020'],
              ['HP Laptop', '₹27,000', '11', '₹53,460', '₹3,50,460']
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        total: { fontSize: 12, bold: true, margin: [0, 10, 0, 10] }
      }
    };

    // pdfMake.createPdf(documentDefinition).open(); // Open PDF in a new tab
  }
}
