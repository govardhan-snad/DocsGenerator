import * as fs from 'fs';
import { Component, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DocsGenerator';

  ngOnInit(): void {
    this.getDocs();
  }
  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  async getDocs() {
    const content = fs.readFileSync('Desktop/offer.docx', 'binary');
    const doc = new Docxtemplater();
    doc.loadZip(content);
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
    fs.writeFileSync('Desktop/output_document.docx', output);
    console.log('done');

  }
}
