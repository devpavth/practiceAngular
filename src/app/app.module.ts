import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/crud/admin/admin.component';
import { StudentService } from './Services/student/student.service';
import { FormsModule } from '@angular/forms';
import { PdfComponent } from './components/pdf/pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UploadPdfComponent } from './components/upload-pdf/upload-pdf.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResponsiveComponent } from './components/responsive/responsive.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { GeneratePdfComponent } from './components/generate-pdf/generate-pdf.component';
import { PdfmakeComponent } from './components/pdfmake/pdfmake.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PdfComponent,
    UploadPdfComponent,
    ResponsiveComponent,
    LayoutComponent,
    SkeletonLoaderComponent,
    GeneratePdfComponent,
    PdfmakeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    StudentService,
    provideClientHydration()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
