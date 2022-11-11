import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { IAlbum, IAlbumFav, IAlbumsFromAPI } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  private _favoriteAlbums: IAlbumFav[] = [];
  public favoriteAlbumsChanged = new Subject<IAlbumFav[]>();

  public genres: IGenre[] = [
    { name: 'rock', title: 'Rock' },
    { name: 'electro', title: 'Electro' },
    { name: 'pop', title: 'Pop' },
    { name: 'hipHop', title: 'Hip-Hop' },
    { name: 'rAndB', title: 'R&B' },
    { name: 'indie', title: 'Indie' },
  ];

  public fetchAlbums(genre: string) {
    return this._http
      .get<IAlbumsFromAPI>(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&api_key=${environment.keyForAPI}&format=json`)
      .pipe(map(
        (data: IAlbumsFromAPI) => data.albums.album.map((item) => ({...item, isFavorite: false}))
      ))
  }

  public get favoriteAlbums(): IAlbumFav[] | [] {
    if (localStorage.getItem('favoriteAlbums')) {
      return JSON.parse(localStorage.getItem('favoriteAlbums') as string);
    } else return [];
  }

  public handleAddToFavorite(album: IAlbumFav) {
    album.isFavorite = true;
    this._favoriteAlbums = this.favoriteAlbums;
    this._favoriteAlbums.push(album);
    localStorage.setItem('favoriteAlbums', JSON.stringify(this._favoriteAlbums));

    this.favoriteAlbumsChanged.next(this.favoriteAlbums);
  }

  public handleRemoveFromFavorite(album: IAlbumFav) {
    album.isFavorite = false;

    this._favoriteAlbums = this.favoriteAlbums;

    const index: number = this._favoriteAlbums.findIndex((item) => {
      return item.name === album.name && item.artist.name === album.artist.name
    });

    if (index > -1) {
      this._favoriteAlbums.splice(index, 1);
      localStorage.setItem('favoriteAlbums', JSON.stringify(this._favoriteAlbums));
      this.favoriteAlbumsChanged.next(this.favoriteAlbums);
    }
  }
}
