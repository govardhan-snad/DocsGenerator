import { Component, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import * as PizZip from 'pizzip';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DocsGenerator';
  file: any;
  reader = new FileReader();
  fileContent: string | ArrayBuffer | null = null;

  constructor() {}

  ngOnInit(): void {
    // this.getDocs();
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


      const doc = new Docxtemplater().loadZip(new PizZip(this.fileContent));
      // do something with the doc...
      const data = {
        name: 'John Doe',
        address: '123 Main Street',
        salary: '$100,000',
        issueddate: this.formatDate(new Date()),
        lastdate: this.formatDate(new Date()),
        worklocation: 'Hyderabad',
        Issuername: 'Mary',
        // add other dynamic fields here
      };




      doc.setData(data);
      let result = doc.render();
      console.log(result);

      const output = doc.getZip().generate({ type: 'nodebuffer' });
      // fs.writeFileSync('Desktop/output_document.docx', output);
      console.log(output);

  }

  getDocs(content: File) {
    // const content = fs.readFileSync('Desktop/offer.docx', 'binary');

    this.reader.readAsDataURL(content);
    this.reader.onload = () => {
      const fileContent = this.reader.result as string;
      // use the file content to insert into the template
      this.file = {
        myFileVariable: fileContent,
      };
    };
    const doc = new Docxtemplater();

    const data = {
      name: 'John Doe',
      address: '123 Main Street',
      salary: '$100,000',
      issueddate: this.formatDate(new Date()),
      lastdate: this.formatDate(new Date()),
      worklocation: 'Hyderabad',
      Issuername: 'Mary',
      // add other dynamic fields here
    };

    doc.setData(data);
    doc.render();
    const output = doc.getZip().generate({ type: 'nodebuffer' });
    // fs.writeFileSync('Desktop/output_document.docx', output);
    console.log(output);
  }
}
