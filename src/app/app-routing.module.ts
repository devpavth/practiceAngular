import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/crud/admin/admin.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { UploadPdfComponent } from './components/upload-pdf/upload-pdf.component';
import { ResponsiveComponent } from './components/responsive/responsive.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { GeneratePdfComponent } from './components/generate-pdf/generate-pdf.component';
import { PdfmakeComponent } from './components/pdfmake/pdfmake.component';

const routes: Routes = [
  { 
    path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) 
  },
  {
    path: 'pdf',
    component: PdfComponent
  },
  {
    path: 'uploadPdf',
    component: UploadPdfComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'responsive',
    component: ResponsiveComponent
  },
  {
    path: 'layout',
    component: LayoutComponent
  },
  {
    path: 'loader',
    component: SkeletonLoaderComponent
  },
  {
    path: 'pdfView',
    component: GeneratePdfComponent
  },
  {
    path: 'pdfmake',
    component: PdfmakeComponent
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
