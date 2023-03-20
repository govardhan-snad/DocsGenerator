import { Component, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import * as PizZip from 'pizzip';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DocsGenerator';
  file: any;
  reader = new FileReader();
  fileContent: any | string | ArrayBuffer | null = null;
  myForm!: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],

      line1: ['', Validators.required],
      line2: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      salary: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\$?[0-9]+(\.[0-9]{1,2})?$/),
        ]),
      ],
      issueddate: ['', Validators.required],
      lastdate: ['', Validators.required],
      worklocation: ['', Validators.required],
      Issuername: ['', Validators.required],
      Designation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.getDocs();

    this.getOfferletter();
  }

  async getOfferletter() {
    this.fileContent = await this.http
      .get('assets/offer.docx', {
        responseType: 'arraybuffer',
      })
      .toPromise();
  }

  async onSubmit() {
    if (this.myForm.valid) {
      const data = this.myForm.value;
      data.issueddate =  this.formatDate(data.issueddate)
      data.lastdate =  this.formatDate(data.lastdate)

      console.log(data);
      // call function to generate document with data

      const templateFile = await fetch('assets/offer.docx');
      const templateBlob = await templateFile.blob();

      const doc = new Docxtemplater().loadZip(new PizZip(this.fileContent));

      // do something with the doc...

      doc.setData(data);
      let result = doc.render();
      console.log(result);

      const output = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      // fs.writeFileSync('Desktop/output_document.docx', output);
      console.log(output);
      // const blob = this.base64ToBlob(output);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(output);
      link.download = `${data.name}_offerletter.docx`;
      link.click();
    }
  }

  private formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileContent = reader.result;
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  }

  async generateDoc() {
    if (!this.fileContent) {
      return;
    }
    const templateFile = await fetch('assets/offer.docx');
    const templateBlob = await templateFile.blob();

    const doc = new Docxtemplater().loadZip(new PizZip(this.fileContent));

    // do something with the doc...
    const data = {
      name: 'Govardhan Reddy',
      line1: '4-79, Markook',
      line2: 'Markook',
      city: 'Siddipet',
      pincode: 502279,
      salary: '1,00,000',
      issueddate: this.formatDate(new Date()),
      lastdate: this.formatDate(new Date()),
      worklocation: 'Hyderabad',
      Issuername: 'Ravi Teja',
      Designation: 'SDE',
      // add other dynamic fields here
    };

    doc.setData(data);
    let result = doc.render();
    console.log(result);

    const output = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    // fs.writeFileSync('Desktop/output_document.docx', output);
    console.log(output);
    // const blob = this.base64ToBlob(output);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(output);
    link.download = `${data.name}_offerletter.docx`;
    link.click();
  }
}
