import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { indentProductList, ProRequestdata } from '../../Models/designationRoleMapping/designation-role-mapping.model';
import { ProductService } from '../../Services/product/product.service';
import { Vendor } from '../../Models/Vendor/vendor.model';
import { ProcurementQuotedataService } from '../../Services/procurementQuotedata/procurement-quotedata.service';

@Component({
  selector: 'app-upload-pdf',
  templateUrl: './upload-pdf.component.html',
  styleUrl: './upload-pdf.component.css'
})
export class UploadPdfComponent {
  pdfSrc: SafeResourceUrl[] = [];
  pdfFiles: File[] = []; // Array to hold the File objects
  currentSlideIndex: number = 0;

  quotes: number[] = [0, 0, 0]; // Array for the quotes
  ven1Price: number[] = [];
  ven2Price: number[] = [];
  ven3Price: number[] = [];
  leastPrice: number = 0;
  leastPricedVendorName: string = '';
  leastPricedVendorId: number = 0;
  qcHeadOfAcc: any[] = [];
  isWarningPopup: boolean = false;
  previousHeadofAccId: number | null = null;
  currentHeadOfAccId: number | null = null;
  selectedQuote: number | null = null; // Variable for the selected quote index

  // assignedVendor: FormGroup;
  comparisonQuoteForm: FormGroup;

  noVendor: boolean = false;
  isVendorSelected: boolean = false;
  storeVendorList: Vendor[] = [];
  selectedVendorId: number = 0;
  currentHeadIndex: number | null = null;

  selectedVendorName: {
    vendorId: number;
    name: string;
    isViewCloseIcon: boolean;
  }[] = [];
  isEnableUploadBtn: boolean = false;
  isEnableSearch: boolean = false;
  isToast: boolean = false;
  isSuccessToast: boolean = false;
  warningToastMsg: string = '';
  deleteToastMsg: string = '';
  // isViewCloseIcon: boolean = false;
  requestData: ProRequestdata | null = null;
  productHeadData: indentProductList[] = [];
  uniqueProductHeadData: indentProductList[] = [];
  filterProductHeadData: indentProductList[] = [];
  // productHeadData: { headOfAccName: string; headOfAccId: number }[] = [];

  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  proQuoteService = inject(ProcurementQuotedataService);

  reqId: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    // private request: RequestService,
    private fb: FormBuilder,
  ) {
    this.comparisonQuoteForm = this.fb.group({
      indentId: null,
      qcHeadOfAcc: this.fb.array([this.headOfAccDetailsArr()]),
    });
  }

  headOfAccDetailsArr() {
    return this.fb.group({
      headOfAccId: null,
      leastQuotedVendor: null,
      qcVendors: this.fb.array([this.comparisonVendors()]),
    });
  }

  comparisonVendors() {
    return this.fb.group({
      vendorId: null,
      quotePath: [],
      qcProducts: this.fb.array([this.quotationProductArr()]),
    });
  }

  quotationProductArr() {
    return this.fb.group({
      productId: null,
      quotedPrice: [],
    });
  }

  ngOnInit() {
    this.comparisonQuoteForm
      .get('qcHeadOfAcc')
      ?.valueChanges.subscribe((qcHeadOfAccArray) => {
        qcHeadOfAccArray.forEach((qcHeadGroup: any, headIndex: number) => {
          const qcVendorsArray = this.getQcVendorsArray(headIndex);

          qcVendorsArray.controls.forEach((vendorGroup, vendorIndex) => {
            vendorGroup
              .get('vendorId')
              ?.valueChanges.pipe(
                debounceTime(300),
                switchMap((searchTerm) => {
                  console.log(`vendor Name Changed for Index:`, searchTerm);
                  if (this.isVendorSelected) {
                    this.isVendorSelected = false;
                    return of([]);
                  }
                  this.noVendor = false;
                  this.storeVendorList = [];
                  if (
                    !searchTerm ||
                    !isNaN(searchTerm) ||
                    searchTerm.length < 3
                  ) {
                    return of([]);
                  }
                  return this.productService
                    .fetchLiveVendorDetails({ searchTerm })
                    .pipe(
                      catchError((error) => {
                        if (error.status === 404) {
                          console.log(
                            'error while fetching vendor data:',
                            error,
                          );
                          this.noVendor = true;
                        }
                        return of([]);
                      }),
                    );
                }),
              )
              .subscribe((response: Vendor[]) => {
                this.storeVendorList = response;
                console.log('fetching vendor data from backend:', response);

                this.isVendorSelected = false;
              });
          });
        });
      });

    this.requestData = this.proQuoteService.getData();
    if (this.requestData) {
      console.log('Received reqId:', this.requestData.reqId);
      console.log('Received Request No:', this.requestData.requestNo);
      console.log('Received productDetails:', this.requestData.productDetails);
      this.productHeadData = this.requestData.productDetails.map((p) => ({
        headOfAccName: p.headOfAccName,
        headOfAccId: p.headOfAccId,
        id: p.id,
        itemTotalPrice: p.itemTotalPrice,
        prdCode: p.prdCode,
        prdDescription: p.prdDescription,
        prdGstPct: p.prdGstPct,
        prdHsnCode: p.prdHsnCode,
        prdStatus: p.prdStatus,
        prdUnit: p.prdUnit,
        prdbrndName: p.prdbrndName,
        prdcatgName: p.prdcatgName,
        prdgrpName: p.prdgrpName,
        prdmdlName: p.prdmdlName,
        productId: p.productId,
        qty: p.qty,
        unitPrice: p.unitPrice,
      }));
      // console.log(headOfAccName);
    } else {
      console.log('No data found. Handle accordingly.');
    }
    console.log('this.requestData:', this.requestData);
    console.log('this.productHeadData:', this.productHeadData);

    this.uniqueProductHeadData = [
      ...new Map(
        this.productHeadData.map((item) => [item.headOfAccName, item]),
      ).values(),
    ];

    console.log('this.uniqueProductHeadData:', this.uniqueProductHeadData);

    this.isSuccessToast = true;
    this.deleteToastMsg = 'Step 1: Select Head of Account';
    setTimeout(() => {
      this.isSuccessToast = false;
    }, 3000);
  }

  getQcHeadOfAccArray(): FormArray {
    return this.comparisonQuoteForm.get('qcHeadOfAcc') as FormArray;
  }

  getQcVendorsArray(headIndex: number): FormArray {
    return this.getQcHeadOfAccArray()
      .at(headIndex)
      .get('qcVendors') as FormArray;
  }

  onSelectedVendor(vendor: Vendor, headOfAccIndex: number) {
    console.log('onSelectedVendor:', vendor);

    this.isVendorSelected = true;
    this.selectedVendorId = vendor.vendorId;

    const vendorExists = this.selectedVendorName.some(
      (v) => v.name === vendor.vendorName,
    );
    if (vendorExists) {
      this.isToast = true;
      this.warningToastMsg = 'Selected Vendor already exists';
      this.storeVendorList = [];
      setTimeout(() => {
        this.isToast = false;
      }, 3000);

      return;
    }

    if (this.selectedVendorName.length < 3) {
      this.selectedVendorName.push({
        vendorId: vendor.vendorId,
        name: vendor.vendorName,
        isViewCloseIcon: true,
      });
      this.isEnableUploadBtn = true;
      this.isEnableSearch = false;
      this.isSuccessToast = true;
      this.deleteToastMsg = `Upload ${vendor.vendorName} Quotation`;
      setTimeout(() => {
        this.isSuccessToast = false;
      }, 3000);
    }

    const qcHeadOfAccArray = this.comparisonQuoteForm.get(
      'qcHeadOfAcc',
    ) as FormArray;
    const qcVendorsArray = qcHeadOfAccArray
      .at(headOfAccIndex)
      .get('qcVendors') as FormArray;

    // Add a new vendor if less than 3 vendors are present
    if (qcVendorsArray.length < 3) {
      qcVendorsArray.push(this.comparisonVendors()); // Add new vendor form
    }

    // Update the last added vendor
    const vendorIndex = qcVendorsArray.length - 1;
    qcVendorsArray.at(vendorIndex).patchValue({
      vendorId: this.selectedVendorId,
    });

    this.storeVendorList = [];
  }

  // selectedHeadOfAcc(event: Event) {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const headOfAccId = Number(selectElement.value);
  //   console.log('headOfAccId:', headOfAccId);

  //   if (
  //     this.previousHeadofAccId !== null &&
  //     this.previousHeadofAccId !== headOfAccId
  //   ) {
  //     this.isSuccessToast = false;
  //     this.isWarningPopup = true;
  //     this.currentHeadOfAccId = headOfAccId;
  //   } else {
  //     this.isSuccessToast = true;
  //     this.deleteToastMsg = 'Step 2: Search Vendor Name';
  //     setTimeout(() => {
  //       this.isSuccessToast = false;
  //     }, 3000);
  //   }

  //   this.filterProductHeadData = this.productHeadData.filter(
  //     (pro: indentProductList) => {
  //       return pro.headOfAccId === headOfAccId;
  //     },
  //   );

  //   this.isEnableSearch = true;

  //   if (!headOfAccId) {
  //     this.isSuccessToast = false;
  //     this.isWarningPopup = true;
  //   }

  //   this.previousHeadofAccId = headOfAccId;

  //   // this.filterProductHeadData.length = 0;
  // }

  selectedHeadOfAcc(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const headOfAccId = Number(selectElement.value);

    console.log('Selected headOfAccId:', headOfAccId);

    this.comparisonQuoteForm.patchValue({
      qcHeadOfAcc: [
        {
          headOfAccId: headOfAccId,
          leastQuotedVendor: this.leastPricedVendorId,
        },
      ],
    });

    // If the selected headOfAccId is different from the previous one, show the popup
    if (
      this.previousHeadofAccId !== null &&
      this.previousHeadofAccId !== headOfAccId
    ) {
      this.isWarningPopup = true;
      this.currentHeadOfAccId = headOfAccId; // Store the new selection temporarily
      console.log('this.currentHeadOfAccId:', this.currentHeadOfAccId);
      console.log(
        'this.currentHeadOfAccId of type:',
        typeof this.currentHeadOfAccId,
      );
    } else {
      this.applyHeadOfAccId(headOfAccId);
    }
  }

  // Function to apply the selected Head of Account
  applyHeadOfAccId(headOfAccId: number) {
    this.previousHeadofAccId = headOfAccId; // Update previous selection
    this.isWarningPopup = false; // Hide the popup

    // Apply the filtered product head data
    this.filterProductHeadData = this.productHeadData.filter(
      (pro: indentProductList) => pro.headOfAccId === headOfAccId,
    );

    console.log('this.filterProductHeadData:', this.filterProductHeadData);

    const productIds = this.filterProductHeadData.map((item) => ({
      productId: item.productId,
    }));
    console.log("productIds:", productIds);
    // this.qcHeadOfAcc.forEach((head) => {
    //   head.qcVendors.forEach((vendor: { qcProducts: { productId: number; quotedPrice: number; }[]; }) => {
    //     vendor.qcProducts = productIds.map((id) => ({
    //       productId: id.productId,
    //       quotedPrice: 0,
    //     }));
    //   });
    // });

    // console.log('this.qcHeadOfAcc.:', this.qcHeadOfAcc);

    // Reset other data
    this.isSuccessToast = true;
    this.deleteToastMsg = 'Step 2: Search Vendor Name';
    setTimeout(() => {
      this.isSuccessToast = false;
    }, 3000);
    this.isEnableSearch = true;
    this.pdfSrc = [];
    this.selectedVendorName = [];
    this.pdfFiles = [];
  }

  clearPreviousQuotation() {
    this.pdfSrc = [];
    this.selectedVendorName = [];
    this.pdfFiles = [];
    this.currentHeadOfAccId = null;
    this.previousHeadofAccId = null;
    this.comparisonQuoteForm.reset();
    this.isEnableSearch = false;
    console.log('Previous quotation cleared!');
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    console.log('Selected Files:', files);
    console.log('Current pdfFiles:', this.pdfFiles);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('Processing File:', file);

      console.log(
        'this.pdfFiles.some(f => f.name === file.name)',
        this.pdfFiles.some(
          (f) => f.name.trim().toLowerCase() === file.name.trim().toLowerCase(),
        ),
      );

      const isFileAlreadyUploaded = this.pdfFiles.some(
        (f) => f.name === file.name,
      );
      console.log('Is file already uploaded:', isFileAlreadyUploaded);

      if (this.pdfFiles.some((f) => f.name === file.name)) {
        console.log(
          'this.pdfFiles.some(f => f.name === file.name)',
          this.pdfFiles.some((f) => f.name === file.name),
        );
        this.isToast = true;
        this.warningToastMsg =
          'System Detected the Selected PDF is already Uploaded';
        setTimeout(() => {
          this.isToast = false;
        }, 3000);
        return;
      }

      if (file) {
        const url = URL.createObjectURL(file);
        this.pdfSrc.push(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        this.pdfFiles.push(file); // Store the File object

        console.log('Updated pdfFiles:', this.pdfFiles);

        this.isEnableUploadBtn = false;
        this.isEnableSearch = true;

        const vendorToDisableCloseIcon = this.selectedVendorName.find(
          (v) => v.isViewCloseIcon,
        );
        console.log('vendorToDisableCloseIcon:', vendorToDisableCloseIcon);
        if (vendorToDisableCloseIcon) {
          vendorToDisableCloseIcon.isViewCloseIcon = false;
        }

        if (this.selectedVendorName.length < 3) {
          this.isSuccessToast = true;
          this.deleteToastMsg = 'Search Next Vendor Name';
          setTimeout(() => {
            this.isSuccessToast = false;
          }, 3000);
        }

        if (this.selectedVendorName.length === 3) {
          this.isSuccessToast = true;
          this.deleteToastMsg = 'Scroll Down to Comparison Table';
          setTimeout(() => {
            this.isSuccessToast = false;
          }, 3000);
        }
      }
    }
  }

  // showPreviousSlide(): void {
  //   if (this.currentSlideIndex > 0) {
  //     this.currentSlideIndex--;
  //   }
  //   console.log(this.pdfSrc);
  // }

  // showNextSlide(): void {
  //   if (this.currentSlideIndex < this.pdfSrc.length - 1) {
  //     this.currentSlideIndex++;
  //   }
  // }

  closepop(data: boolean) {
    this.currentHeadOfAccId = this.previousHeadofAccId;
    this.isWarningPopup = data;
  }

  removeVendor(vendorIndex: number) {
    this.selectedVendorName.splice(vendorIndex, 1);
    this.isEnableSearch = true;
    this.isEnableUploadBtn = false;
  }

  deleteSlide(index: number): void {
    console.log('index:', index);
    this.pdfSrc.splice(index, 1);
    this.pdfFiles.splice(index, 1);

    if (this.selectedVendorName && this.selectedVendorName.length > index) {
      this.selectedVendorName.splice(index, 1);
    }
    if (this.currentSlideIndex >= this.pdfSrc.length) {
      this.currentSlideIndex = this.pdfSrc.length - 1;
    }
  }

  uploadPdf(quoteData: any): void {
    console.log('quoteData:', quoteData);
    this.comparisonQuoteForm.patchValue({
      indentId: this.requestData?.reqId,
    });

    this.comparisonQuoteForm.patchValue({
      qcHeadOfAcc: [
        {
          leastQuotedVendor: this.leastPricedVendorId,
        },
        
      ],
    });
    console.log('getting comparisonQuoteForm:', this.comparisonQuoteForm.value);
    if (this.pdfFiles.length === 0) {
      console.error('No PDF files to upload');
      return;
    }

    const leastPriceIndex = this.quotes.indexOf(this.leastPrice);
    if (leastPriceIndex === -1) {
      console.error('No valid least price found');
      return;
    }

    const leastPricedFileName = this.pdfFiles[leastPriceIndex].name;

    const formData = new FormData();
    console.log(this.pdfFiles);
    console.log(leastPricedFileName);

    this.pdfFiles.forEach((file) => {
      formData.append('files', file, file.name);
    });

    // Append the least priced file name separately
    formData.append('leastPricedFileName', leastPricedFileName);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // this.request
    //   .uploadPdf(this.comparisonQuoteForm.value, leastPricedFileName)
    //   .subscribe(
    //     (response) => {
    //       console.log('Upload successful', response);
    //     },
    //     (error) => {
    //       console.error('Upload failed', error);
    //     },
    //   );
  }

  calculateVen1Price(index: number) {
    // this.ven1Price = this.ven1Price[index];
    console.log('ven 1 index:', index);
    this.ven1Price[index] = this.ven1Price[index] || 0;

    this.quotes[0] = this.ven1Price.reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
    this.updateLeastPrice();
  }

  calculateVen2Price(index: number) {
    console.log('ven 2 index:', index);
    this.ven2Price[index] = this.ven2Price[index] || 0;
    this.quotes[1] = this.ven2Price.reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
    this.updateLeastPrice();
  }

  calculateVen3Price(index: number) {
    console.log('ven 3 index:', index);
    this.ven3Price[index] = this.ven3Price[index] || 0;
    this.quotes[2] = this.ven3Price.reduce(
      (sum, value) => sum + (value || 0),
      0,
    );
    this.updateLeastPrice();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  preventPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  updateLeastPrice(): void {
    this.leastPrice = Math.min(
      ...this.quotes.filter((q) => q !== null && q !== undefined),
    );

    const leastPriceIndex = this.quotes.indexOf(this.leastPrice);
    if (leastPriceIndex === -1) {
      console.error('No valid least price found');
      return;
    }

    this.leastPricedVendorName = this.selectedVendorName[leastPriceIndex].name;
    console.log('leastPricedVendorName:', this.leastPricedVendorName);

    this.leastPricedVendorId =
      this.selectedVendorName[leastPriceIndex].vendorId;
    console.log('leastPricedVendorId:', this.leastPricedVendorId);
  }
}
