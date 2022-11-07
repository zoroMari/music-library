import { Pipe, PipeTransform } from "@angular/core";
import { IAlbum } from "../shared/album.model";

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform{
  transform(value: any, searchValue: string, propForFilter: string) {
    if (!value || value.length === 0 || searchValue) return value;

    const filteredAlbum = [];

    for (let item of value) {
      if ((item[propForFilter].toLowerCase()).includes(searchValue.toLowerCase())) {
        filteredAlbum.push(item);
      }
    }

    return filteredAlbum;
  }
}
