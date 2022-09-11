import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NgxCsvService {
  public download(data: any[], columns: DataColumn[], filename: string): void {
    const csvData = this.convertToCsv(data, columns);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  private convertToCsv(data: any[], columns: DataColumn[]): string {
    const array = typeof data != 'object' ? JSON.parse(data) : data;
    let str = '';
    let row = '';
    for (let index in columns) {
      row += columns[index].title + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in columns) {
        const head = columns[index].field;
        const value = array[i][head];
        const srtValue = value === undefined || value === null ? '' : typeof value === 'string' ? value : JSON.stringify(value);
        if (srtValue.replace(/ /g, '').match(/[\s,"]/)) {
          line += '"' + srtValue.replace(/"/g, '""') + '"';
        } else {
          line += srtValue;
        }
        line += ',';
      }
      str += line + '\r\n';
    }
    return str;
  }
}

export interface DataColumn {
  title: string;
  field: keyof any;
}
