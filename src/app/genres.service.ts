import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { IAlbumsFromAPI } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  public genres: IGenre[] = [
    { name: 'rock', title: 'Rock' },
    { name: 'electro', title: 'Electro' },
    { name: 'pop', title: 'Pop' },
    { name: 'hipHop', title: 'Hip-Hop' },
    { name: 'rAndB', title: 'R&B' },
    { name: 'indie', title: 'Indie' },
  ];

  public fetchGenre(genre: string) {
    return this._http
      .get<IAlbumsFromAPI>(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&api_key=${environment.keyForAPI}&format=json`)
      .pipe(map(
        (data: IAlbumsFromAPI) => data.albums.album
      ))
  }


}
