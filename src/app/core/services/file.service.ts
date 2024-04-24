import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { PatientExcelInterface } from 'src/app/reports/service/reports.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }


  saveBlob(res: PatientExcelInterface): void {
    const byteCharacters = atob(res.blob);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: res.type });
    const file = new File([blob], res.fileName, { type: res.type });
    saveAs(file);
  }

  isValidJson(str: string): boolean {
    try {
      return (!!str && JSON.parse(str))
    }
    catch(e){
      return false;
    }
  }
}
