import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { IAlbum, IAlbumsFromAPI } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  private _favoriteGenres: IAlbum[] = [];
  public favoriteGenresChanged = new Subject<IAlbum[]>();

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

  public get favoriteGenres(): IAlbum[] | [] {
    if (localStorage.getItem('favoriteGenres')) {
      this._favoriteGenres = JSON.parse(localStorage.getItem('favoriteGenres') as string);
      return this._favoriteGenres;
    } else return [];
  }

  public handleAddToFavorite(album: IAlbum) {
    this._favoriteGenres.push(album);
    localStorage.setItem('favoriteGenres', JSON.stringify(this._favoriteGenres));

    this.favoriteGenresChanged.next(this.favoriteGenres);
  }

  public handleRemoveFromFavorite(album: IAlbum) {
    const index: number = this._favoriteGenres.indexOf(album);
    if (index > -1) {
      this.favoriteGenres.splice(index, 1);
      localStorage.setItem('favoriteGenres', JSON.stringify(this._favoriteGenres));
      this.favoriteGenresChanged.next(this.favoriteGenres);
    }
  }





}
