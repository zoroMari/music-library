import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { favoriteAlbumsInStorage, IAlbum, IAlbumFav, IAlbumsFromAPI } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  private _favoriteAlbumsAll!: favoriteAlbumsInStorage;
  public favoriteAlbumsByGenreChanged = new Subject<IAlbumFav[]>();

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

  public getFavoriteAlbums(genre: string): IAlbumFav[] | [] {
    if (localStorage.getItem('favoriteAlbums')) {
      this._favoriteAlbumsAll = JSON.parse(localStorage.getItem('favoriteAlbums') as string);
      if (this._favoriteAlbumsAll.hasOwnProperty(genre)) {
        return this._favoriteAlbumsAll[genre];
      } else return [];
    } else return [];
  }

  public handleAddToFavorite(genre: string, album: IAlbumFav) {
    album.isFavorite = true;

    if (!localStorage.getItem('favoriteAlbums')) {
      localStorage.setItem(`favoriteAlbums`, JSON.stringify({}));
      this._favoriteAlbumsAll = JSON.parse(localStorage.getItem('favoriteAlbums') as string);
    }

    if (this._favoriteAlbumsAll[genre]) {
      this._favoriteAlbumsAll[genre].push(album);
    } else {
      this._favoriteAlbumsAll[genre] = [];
      this._favoriteAlbumsAll[genre].push(album);
    }

    localStorage.setItem(`favoriteAlbums`, JSON.stringify(this._favoriteAlbumsAll));

    this.favoriteAlbumsByGenreChanged.next(this.getFavoriteAlbums(genre));
  }

  public handleRemoveFromFavorite(genre: string, album: IAlbumFav) {
    album.isFavorite = false;

    const index: number = this._favoriteAlbumsAll[genre].findIndex((item) => {
      return item.name === album.name && item.artist.name === album.artist.name
    });

    if (index > -1) {
      this._favoriteAlbumsAll[genre].splice(index, 1);
      localStorage.setItem('favoriteAlbums', JSON.stringify(this._favoriteAlbumsAll));
      this.favoriteAlbumsByGenreChanged.next(this.getFavoriteAlbums(genre));
    }
  }
}
