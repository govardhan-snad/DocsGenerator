import { Component, OnInit } from '@angular/core';
import Docxtemplater from 'docxtemplater';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'DocsGenerator';
  file:any
  reader = new FileReader()

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

  onChange(event: any) {
    this.getDocs(event.target.files[0]);
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
      const doc = new Docxtemplater();
      doc.loadZip(this.file);
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
    };

  }
}
