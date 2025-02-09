import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.css'
})
export class PdfComponent {
  pdfSrc: SafeResourceUrl[] = [];
  pdfFiles: File[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    console.log("files:", files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log("file:", file);
      if (file) {
        const url = URL.createObjectURL(file);
        console.log("url:", url);
        this.pdfSrc.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        console.log("this.pdfSrc:", this.pdfSrc);
        this.pdfFiles.push(file);
        console.log("this.pdfFiles:", this.pdfFiles);
      }
    }
  }
}
