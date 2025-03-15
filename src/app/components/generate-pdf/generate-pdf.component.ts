import { Component, inject } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GetPdfDataService } from '../../Services/getPdfData/get-pdf-data.service';

@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrl: './generate-pdf.component.css'
})
export class GeneratePdfComponent {

  pdfService = inject(GetPdfDataService);
  purchaseOrderData: any;
  vendorList: any;
  branchList: any;
  headOfProduct: any[] = [];

  purchaseOrder = {
    company: {
      name: 'THE ASSOCIATION OF PEOPLE WITH DISABILITY',
      gst: '29AAGCC3235L1ZG',
      addressLine1: '1125, 21st A Cross, 14th Main Road,',
      addressLine2: 'Sector-3, HSR Layout',
      addressLine3: 'Bengaluru Urban, KARNATAKA, 560102',
      phone: '+91 8197999930',
      email: 'saigovind@cloute.co.in',
      website: 'www.cloute.co.in'
    },
    total: 534775,
    taxAmount: 81575.82,
    taxableAmount: 453199,
    roundOff: 0.18
  };

  fetchApi(){
    this.pdfService.fetchPdfData(47, 0).subscribe(
      (res) => {
        console.log("fetching pdf data:", res);
        this.purchaseOrderData = res;
        this.branchList = this.purchaseOrderData.indentBranch;

        console.log("this.branchList:", this.branchList);

        if (this.purchaseOrderData.headofAcc && this.purchaseOrderData.headofAcc.length > 0) {
          this.vendorList = this.purchaseOrderData.headofAcc.map((acc: any) => acc.assgndVendorData);
        } else {
          this.vendorList = []; // Ensure it's an empty array if no data exists
        }

        this.headOfProduct = this.purchaseOrderData.headofAcc.length > 0 ? this.purchaseOrderData.headofAcc[0].productDetailsDTOs : [];

        console.log("this.headOfProduct:", this.headOfProduct);
        console.log("this.vendorList:", this.vendorList);
      },
      (error) => {
        console.log("error while fetching pdf data:", error);
      }
    )
  }

  viewPDF() {
    const doc = new jsPDF();
    this.purchaseOrderData.headofAcc.forEach((head: any, index: any) => {
      if (index > 0) {
        // ✅ Add a new page after each Head of Account (Except first page)
        doc.addPage();
      }

      // Set font size
      doc.setFontSize(12);

      doc.setFont('helvetica', 'bold'); 

      // Set text color to green (RGB format)
      doc.setTextColor(80, 205, 90);  // LimeGreen (RGB: 50, 205, 50)

      // Align text to the left (x = 10 is left margin)
      // doc.text('PURCHASE ORDER', 10, 10);
      const text = "PURCHASE ORDER";
      const startX = 10;
      const startY = 10;
      const letterSpacing = 0.7;  // Adjust letter spacing as needed
      let currentX = startX;

      for (const char of text) {
        doc.text(char, currentX, startY);
        currentX += doc.getTextWidth(char) + letterSpacing;
      }

      doc.setFont('helvetica', 'normal');  
      doc.setTextColor(0, 0, 0);

      doc.setFontSize(8);
      const pageWidth = doc.internal.pageSize.width; // Get page width
      doc.text('ORIGINAL FOR RECIPIENT', pageWidth - 10, 10, { align: 'right' });


      // Company Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold'); 
      doc.text(`${this.purchaseOrder.company.name}`, 10, 20);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const gstText = `GSTIN ${this.purchaseOrder.company.gst}`;
      const gstWidth = doc.getTextWidth(gstText);

      const adjustedY = 25;

      // Left side: GSTIN
      doc.text(gstText, 10, adjustedY);

      // Right next to GSTIN: PAN (with spacing)
      const spacing = 3; // Adjust spacing as needed
      doc.text(`PAN AAGCC3235L`, 10 + gstWidth + spacing, adjustedY);

      doc.setFont('helvetica', 'normal'); 
      doc.setFontSize(9); 
      doc.text(`${this.purchaseOrder.company.addressLine1}`, 10, 29);
      doc.text(`${this.purchaseOrder.company.addressLine2}`, 10, 33);
      doc.text(`${this.purchaseOrder.company.addressLine3}`, 10, 37);
      const mobileLabel = "Mobile"; // Bold text
      const mobileValue = ` ${this.purchaseOrder.company.phone}`; // Normal text
      const emailLabel = "Email"; // Bold text
      const emailValue = ` ${this.purchaseOrder.company.email}`; // Normal text
      const websiteLabel = "Website";
      const websiteValue = ` ${this.purchaseOrder.company.website}`
      
      // Measure width for positioning
      doc.setFont('helvetica', 'bold');
      const mobileLabelWidth = doc.getTextWidth(mobileLabel);
      doc.text(mobileLabel, 10, 41);
      
      doc.setFont('helvetica', 'normal');
      doc.text(mobileValue, 10 + mobileLabelWidth, 41);
      
      // Add spacing and position Email
      const spacingBetween = 3; // Adjust space between Mobile & Email
      
      doc.setFont('helvetica', 'bold');
      const emailLabelWidth = doc.getTextWidth(emailLabel);
      doc.text(emailLabel, 10 + mobileLabelWidth + doc.getTextWidth(mobileValue) + spacingBetween, 41);
      
      doc.setFont('helvetica', 'normal');
      doc.text(emailValue, 10 + mobileLabelWidth + doc.getTextWidth(mobileValue) + spacingBetween + emailLabelWidth, 41);

      doc.setFont('helvetica', 'bold');
      const websiteLabelWidth = doc.getTextWidth(websiteLabel);
      doc.text(websiteLabel, 10, 45);
      
      doc.setFont('helvetica', 'normal');
      doc.text(websiteValue, 10 + websiteLabelWidth, 45);

      const purchaseOrderLabel = "Purchase Order #: ";
      const purchaseOrderValue = "CLTPUR2425-31";
      const purchaseOrderDateLabel = "Purchase Order Date: ";
      const purchaseOrderDateValue = "18 Feb 2025";
      const paymentByLabel = "Payment by: ";
      const paymentByValue = "18 Feb 2025";


      // Starting X position (below website)
      const startPOY = 52;
      let currentPOX = 10; // Left margin

      // Purchase Order #
      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderLabel, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderLabel) + 1; // Add spacing

      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderValue, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderValue) + 10; // Add spacing

      // Purchase Order Date
      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderDateLabel, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderDateLabel) + 1; // Add spacing

      doc.setFont('helvetica', 'bold');
      doc.text(purchaseOrderDateValue, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(purchaseOrderDateValue) + 10; // Add spacing

      // Payment by
      doc.setFont('helvetica', 'bold');
      doc.text(paymentByLabel, currentPOX, startPOY);
      currentPOX += doc.getTextWidth(paymentByLabel) + 1; // Add spacing

      doc.setFont('helvetica', 'bold');
      doc.text(paymentByValue, currentPOX, startPOY);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text("Vendor Details:", 10, 60); // Heading

      // Vendor Name
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      // Define positions
      const leftColumnX = 10;  // Left alignment for "Vendor Details"
      const rightColumnX = 73; // Aligns "Vendor Billing Address" under purchaseOrderDateLabel

      // Vendor Details Heading (Left Side)
      doc.text("Vendor Details:", leftColumnX, 60);

      // Vendor Billing Address Heading (Right Side)
      doc.text("Vendor Billing Address:", rightColumnX, 60);


      // Vendor Information (Left)
      doc.setFontSize(9);
      doc.text(`${head.assgndVendorData.vendorName}`, leftColumnX, 65);
      doc.text(`GSTIN: ${head.assgndVendorData.vdrGstNo}`, leftColumnX, 69);
      doc.setFont('helvetica', 'normal');
      doc.text(`${head.assgndVendorData.vdrEmail}`, leftColumnX, 73);


      // Vendor Billing Address (Right)
      doc.setFont('helvetica', 'normal');
      doc.text(`${head.assgndVendorData.vdrAdd1}`, rightColumnX, 65);
      doc.text(`${head.assgndVendorData.vdrAdd2}`, rightColumnX, 69);
      doc.text(`${head.assgndVendorData.vdrCity}, ${head.assgndVendorData.vdrState}, ${head.assgndVendorData.vdrPincode}`, rightColumnX, 73);
      // doc.text(`${this.vendorList[0].vdrCountry}`, rightColumnX, 77);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');

      const placeOfSupplyLabel = "Place of Supply:";
      const placeofSupplyX = 10;
      const placeofSupplyY = 80;


      doc.text(placeOfSupplyLabel, placeofSupplyX, placeofSupplyY);

      const placeOfSupplyWidth = doc.getTextWidth(placeOfSupplyLabel);
      const placeOfSupplySpacing = 38;

      const referenceLabel = "Reference:";
      const referenceX = placeofSupplyX + placeOfSupplyWidth + placeOfSupplySpacing;
      doc.text(referenceLabel, referenceX, placeofSupplyY);

      const referenceWidth = doc.getTextWidth(referenceLabel);
      const referenceSpacing = 1;

      doc.setFont('helvetica', 'normal');
      doc.text(`DELIVERY LOCATION: ${this.branchList.city}`, referenceX + referenceWidth + referenceSpacing, placeofSupplyY);


      // need to check
      doc.setFont('helvetica', 'bold');
      doc.text(`${this.branchList.gstNumber.slice(0,2)}-${this.branchList.state}`, 10, 84);



      const groupedProducts = this.headOfProduct.reduce((acc, item) => {
        if(!acc[item.headOfAccId]){
          acc[item.headOfAccId] = {name: item.headOfAccName, totalTaxable: 0, products: []};
        }
  
        const taxableValue = item.unitPrice * item.qty;
        acc[item.headOfAccId].totalTaxable += taxableValue;
        acc[item.headOfAccId].products.push({
          id: item.id,
          name: `${item.prdbrndName} - ${item.prdmdlName}\n${item.prdDescription.trim()}\nHSN: ${item.prdHsnCode}`,
          unitPrice: item.unitPrice.toFixed(2),
          qty: item.qty,
          taxableValue: taxableValue.toFixed(2),
          taxAmt: `${(taxableValue * (item.prdGstPct/100)).toFixed(2)} (${item.prdGstPct}%)`,
          totalAmount: (taxableValue + taxableValue * (item.prdGstPct/100)).toFixed(2)
        });
        return acc;
      }, {});
  
      // Table
      const finalY = 89;
      let serialNumber = 1;
  
      
      let grandTotalUnitPrice = 0;
      let grandTotalQty = 0;
      let grandTotalTaxable = 0;
      let grandTotalTaxAmt = 0;
      let grandTotalAmount = 0;

      let gstGroupedBreakdown: any = {};
  
      Object.values(groupedProducts).forEach((group: any, index) => {
        if(index > 0) {
          doc.addPage();
        }

        const sectionY = finalY + (index * 10) + (index * 50);
  
        doc.setLineWidth(0.5);
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(80, 205, 90);
        doc.rect(10, sectionY, doc.internal.pageSize.width - 24, 8, 'FD');
  
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(head.headOfAccName, doc.internal.pageSize.width / 2, sectionY + 5, { align: 'center' })


        const tableBody: any[][] = [];
  
        head.productDetailsDTOs.forEach((item: any) => {
          const unitPrice = item.unitPrice;
          const unitQty = item.qty;
          const taxableValue = item.unitPrice * item.qty;
          const taxAmt = taxableValue * (item.prdGstPct / 100);
          const totalAmount = taxableValue + taxAmt;
          const gstPercent = item.prdGstPct;

          tableBody.push([
            serialNumber++, 
            `${item.prdbrndName} - ${item.prdmdlName}\n${item.prdDescription.trim()}\nHSN: ${item.prdHsnCode}`,
            item.unitPrice.toFixed(2),
            item.qty,
            taxableValue.toFixed(2),
            `${taxAmt.toFixed(2)} (${item.prdGstPct}%)`,
            totalAmount.toFixed(2)
          ])
          
          grandTotalUnitPrice += unitPrice;
          grandTotalQty += unitQty;
          grandTotalTaxable += taxableValue;
          grandTotalTaxAmt += taxAmt;
          grandTotalAmount += totalAmount;

          if(!gstGroupedBreakdown[gstPercent]){
            gstGroupedBreakdown[gstPercent] = {
              taxAmt: 0
            }
          }
          gstGroupedBreakdown[gstPercent].taxAmt += taxAmt;
        });
  
        tableBody.push([
          {content: "Subtotal:", colSpan: 2, styles: {fontStyle: 'bold', halign: 'right'}},
          {content: `${grandTotalUnitPrice.toFixed(2)}`, styles: {fontStyle: 'bold'}},
          {content: `${grandTotalQty.toFixed(2)}`, styles: {fontStyle: 'bold'}},
          {content: `${grandTotalTaxable.toFixed(2)}`, styles: {fontStyle: 'bold'}},
          { content: `${grandTotalTaxAmt.toFixed(2)}`, styles: { fontStyle: 'bold' } }, 
          { content: `${grandTotalAmount.toFixed(2)}`, styles: { fontStyle: 'bold' } }
        ])

        autoTable(doc, {
          startY: finalY + 8,
          head: [['#', 'Item', 'Rate/Item', 'Qty', 'Taxable Value', 'Tax Amount', 'Amount']],
          body: tableBody,
          theme: 'grid',
          margin: {left: 10},
          headStyles: {
            fillColor: [240, 253, 244],
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [80, 205, 90]
          },
          styles: {
            lineWidth: 0.1,
            lineColor: [80, 205, 90]
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) { // "Item" column
              if (data.row.index >= 0) { // Ensure it's a valid row
                if (data.cell.text.length > 0) {
                  data.cell.styles.fontStyle = 'bold'; // Make full cell bold (temporary)
                }
              }
            }
          },
          didDrawCell: (data) => {
            if (data.row.section === 'head') {
              doc.setDrawColor(80, 205, 90); // Set border color (Green)
              doc.setLineWidth(0.75); // Adjust thickness if needed
              doc.line(
                data.cell.x, // X start
                data.cell.y + data.cell.height, // Y start (bottom of cell)
                data.cell.x + data.cell.width, // X end
                data.cell.y + data.cell.height // Y end (same as start)
              );
            }
          }
        });
    
      })
  
      
      // Correct way to get lastAutoTable position
      let summaryY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : finalY + 30;
      const pagePDFWidth = doc.internal.pageSize.width;
      const marginRight = 14;
  
      const alignRight = (text: string, y: number) => {
        const textWidth = doc.getTextWidth(text);
        doc.text(text, pagePDFWidth - textWidth - marginRight, y);
      }
  
      const lineHeight = 6;
      const branchStateCode = this.purchaseOrderData.indentBranch.gstNumber.substring(0, 2);
      const vendorStateCode = head.assgndVendorData.vdrGstNo.substring(0, 2);

      const totalMarginTop = 5;

      alignRight(`Taxable Amount: ${grandTotalTaxable.toFixed(2)}`, summaryY);
      summaryY += lineHeight; 

      Object.keys(gstGroupedBreakdown as Record<string, any>).forEach((gstPercent, index) => {
        const gst = gstGroupedBreakdown[gstPercent];

        let currentY = summaryY;

        if(branchStateCode === vendorStateCode){
          const cgst = (gst?.taxAmt / 2).toFixed(2);
          const sgst = (gst?.taxAmt / 2).toFixed(2);

          const halfGst = (parseFloat(gstPercent) / 2).toFixed(1);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          
          
          // Summary
          alignRight(`CGST ${halfGst}%: ${cgst}`, currentY);
          currentY += lineHeight; 

          alignRight(`SGST ${halfGst}%: ${sgst}`, currentY);
          currentY += lineHeight; 

          summaryY = currentY;
          
        }else{
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);

          alignRight(`IGST ${parseFloat(gstPercent).toFixed(1)}%: ${gst.taxAmt.toFixed(2)}`, summaryY);
          summaryY += lineHeight; 
        }

        
        
      })

      // summaryY += lineHeight;

      const totalAmountWithoutRoundOff = grandTotalAmount;
      const roundedTotalAmount = Math.round(totalAmountWithoutRoundOff);
      const roundOffValue = (roundedTotalAmount - totalAmountWithoutRoundOff).toFixed(2);

      alignRight(`Round Off: ${roundOffValue}`, summaryY); 

      const totalY = summaryY + lineHeight * 2;
      doc.setLineWidth(0.3);
      doc.line(pagePDFWidth - 60, totalY - 7, pagePDFWidth - 12, totalY - 7);
  
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      alignRight(`Total: ${roundedTotalAmount.toFixed(2)}`, totalY);

      
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
  
      const pageNumber = doc.internal.pages.length - 1;
      const totalPages = this.purchaseOrderData.headofAcc.length;

      // ✅ Page Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Page ${pageNumber} of ${totalPages}`, 90, doc.internal.pageSize.height - 10);
    })
   
    // Open PDF in new tab for preview
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
}

}
