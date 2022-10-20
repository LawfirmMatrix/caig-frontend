import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filesize'})
export class FileSizePipe implements PipeTransform {
  public transform(bytes: number) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
