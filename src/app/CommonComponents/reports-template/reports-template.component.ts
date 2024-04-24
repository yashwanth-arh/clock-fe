import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ReportsService,
  PatientExcelInterface,
} from 'src/app/reports/service/reports.service';
import { Subscription } from 'rxjs';
// import * as jsPDF from "jspdf";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
import { E } from '@angular/cdk/keycodes';
import { TitleCasePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reports-template',
  templateUrl: './reports-template.component.html',
  styleUrls: ['./reports-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TitleCasePipe],
})
export class ReportsTemplateComponent implements OnInit {
  sectionArray: any = [];
  patient_id: string;
  rDate: string;
  reportsDate: Date;
  public reports: any;
  fileName: string;
  claimMonthYear: string;

  @ViewChild('content') content: ElementRef;

  constructor(
    private route: ActivatedRoute,
    public reportService: ReportsService,
    private pipe: TitleCasePipe,
    public dialogRef: MatDialogRef<ReportsTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    // this.patient_id = this.route.snapshot.params['id'];
    this.patient_id = this.data;
    this.rDate = localStorage.getItem('reports_date');
    this.downloadReports(this.patient_id);
    this.reportsDate = new Date(localStorage.getItem('reports_date'));
    // this.onLoad();
    // this.makePdf();
  }

  download() {
    const element = document.getElementById('contentToConvert');
    const opt = {
      margin: 0.5,
      filename: this.fileName,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' },
      pagebreak: { mode: 'css', after: '.page-break' },
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();

    // window.close();
  }

  makePdf() {
    const firstId = document.getElementById('firstSection');
    this.sectionArray.push(firstId);
    const secondId = document.getElementById('secondSection');
    this.sectionArray.push(secondId);
    const data = document.getElementById('contentToConvert');
    html2canvas(firstId).then((canvas) => {
      // pdf.addPage();
      // pdf.addImage(imgData, 'PNG', 2, 0, pageWidth-4, 0);

      for (let i = 0; i < this.sectionArray.length; i++) {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt');
        const position = 0;
        pdf.addImage(
          this.sectionArray[i],
          'PNG',
          i,
          position,
          imgWidth,
          imgHeight
        );
        // var pagecount = Math.ceil(imgHeight / imgWidth);
        pdf.addPage();
        pdf.save('skill-set.pdf');
      }

      // if (pagecount > 0) {
      //   var j = 1;
      //   while (j != pagecount) {
      //     pdf.addPage();
      //     pdf.addImage(
      //       contentDataURL,
      //       'PNG',
      //       2,
      //       -(j * imgHeight),
      //       imgWidth - 4,
      //       0
      //     );
      //     j++;
      //   }
      // }
    });
  }

  generatePdf() {
    const element = document.getElementById('contentToConvert');
    element.style.pageBreakAfter = 'always';
    const elementId = 'contentToConvert';
    html2canvas(element).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');

      const doc = new jsPDF('p', 'mm');
      let position = 0;

      const imgWidth = doc.internal.pageSize.getWidth();
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let offsetTop = 10;
      if (offsetTop + imgHeight > doc.internal.pageSize.getHeight()) {
        offsetTop = 10;
        position = offsetTop;
      }

      doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const blob = doc.output('blob');
      window.open(URL.createObjectURL(blob));
      doc.save('file.pdf');
    });
  }
  downloadReports(patientId: string): void {
    this.reportService?.getPatientReports(patientId, this.rDate)?.subscribe((res) => {
        this.reports = res;

        this.reports.patient.firstName = this.pipe.transform(
          this.reports?.patient?.firstName
        );
        this.reports.patient.lastName = this.pipe.transform(
          this.reports?.patient?.lastName
        );
        this.fileName =
          this.reports.patient?.firstName +
          '_' +
          this.pipe.transform(this.reports.patient.lastName) +
          '_Reports' +
          '.pdf';
        localStorage.removeItem('reportDate');
        setTimeout(() => {
          this.download();
        }, 5000);
      });
  }

  getStatus(e) {
    switch (e.type) {
      case 'count':
        if (e.remainingValue === 0) {
          return ` ${e.criteria} readings completed`;
        } else {
          return `${e.remainingValue} readings remaining of total ${e.criteria} readings`;
        }
        break;
      case 'time':
        if (e.remainingValue === 0) {
          return ` ${e.criteria}/${e.criteria} Mins completed`;
        } else {
          return `${Math.floor(e.remainingValue)} Mins remaining of total  ${
            e.criteria
          } Mins`;
        }
        break;
      default:
        if (e.remainingValue === 0) {
          return ` ${e.criteria}/${e.criteria} Mins completed`;
        } else {
          return `${Math.floor(e.remainingValue)} Mins remaining of total  ${
            e.criteria
          } Mins`;
        }
        break;
    }
  }

  getMonthCount(month, year) {
    return new Date(year, month, 0).getDate();
  }

  onLoad(): any {
    if (this.reportsDate) {
      let _month;
      const reportD = this.reportsDate.getMonth() + 1;
      reportD === 1
        ? (_month = 'JAN')
        : reportD === 2
        ? (_month = 'FEB')
        : reportD === 3
        ? (_month = 'MAR')
        : reportD === 4
        ? (_month = 'APR')
        : reportD === 5
        ? (_month = 'MAY')
        : reportD === 6
        ? (_month = 'JUN')
        : reportD === 7
        ? (_month = 'JUL')
        : reportD === 8
        ? (_month = 'AUG')
        : reportD === 9
        ? (_month = 'SEP')
        : reportD === 10
        ? (_month = 'OCT')
        : reportD === 11
        ? (_month = 'NOV')
        : reportD === 12
        ? (_month = 'DEC')
        : '';

      if (
        this.getMonthCount(
          new Date().getMonth() + 1,
          new Date().getFullYear()
        ) == 30
      ) {
        this.claimMonthYear =
          _month + ' ' + new Date(this.reportsDate).getFullYear();
        if (this.reportsDate.getMonth() + 1 !== new Date().getMonth() + 1) {
          return `1st ${_month} to ${this.getMonthCount(
            this.reportsDate.getMonth() + 1,
            this.reportsDate.getFullYear()
          )} ${_month}`;
        } else {
          return `01-${reportD}-${this.reportsDate.getFullYear()} to ${this.getDaysInMonth(
            this.reportsDate.getMonth() + 1,
            this.reportsDate.getFullYear()
          )}-${reportD}-${this.reportsDate.getFullYear()}`;
        }
      } else if (
        this.getMonthCount(
          new Date().getMonth() + 1,
          new Date().getFullYear()
        ) == 31
      ) {
        this.claimMonthYear =
          _month + ' ' + new Date(this.reportsDate).getFullYear();
        if (this.reportsDate.getMonth() + 1 !== new Date().getMonth() + 1) {
          return `1st ${_month} to ${this.getMonthCount(
            this.reportsDate.getMonth() + 1,
            this.reportsDate.getFullYear()
          )} ${_month}`;
        } else {
          return `01-${reportD}-${this.reportsDate.getFullYear()} to ${this.getDaysInMonth(
            this.reportsDate.getMonth() + 1,
            this.reportsDate.getFullYear()
          )}-${reportD}-${this.reportsDate.getFullYear()}`;
        }
      } else if (
        this.getMonthCount(
          new Date().getMonth() + 1,
          new Date().getFullYear()
        ) == 28
      ) {
        this.claimMonthYear =
          _month + ' ' + new Date(this.reportsDate).getFullYear();
        return `01-${reportD}-${this.reportsDate.getFullYear()} to ${this.getDaysInMonth(
          this.reportsDate.getMonth() + 1,
          this.reportsDate.getFullYear()
        )}-${reportD}-${this.reportsDate.getFullYear()}`;
      } else if (
        this.getMonthCount(
          new Date().getMonth() + 1,
          new Date().getFullYear()
        ) == 29
      ) {
        this.claimMonthYear =
          _month + ' ' + new Date(this.reportsDate).getFullYear();
        return `01-${reportD}-${this.reportsDate.getFullYear()} to ${this.getDaysInMonth(
          this.reportsDate.getMonth() + 1,
          this.reportsDate.getFullYear()
        )}-${reportD}-${this.reportsDate.getFullYear()}`;
      } else {
      }
    }
  }
  subtractHours(date, hours, minutes) {
    date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() - minutes);
    return date;
  }
  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }
  getRecorded(value) {
    // 8 AM on June 20, 2022
    const date = new Date(value);
    const newDate = this.subtractHours(date, 5, 30);
    return newDate;
    // 6 AM on June 20, 2022

    // let sValue = value.split(' ');
    // let date = sValue[0];
    // let time = new Date(value);

    // let updatedVal = this.dateFormat.transform(
    //   new Date(value),
    //   'yyyy-MM-dd hh:mm'
    // );
    // return updatedVal;
  }
}
