import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { favoriteAlbumsInStorage, IAlbumFav, IAlbumsFromAPI, IAlbumInfo } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  public isLoaded = new BehaviorSubject<boolean>(false);
  public favoriteFilterOn = false;

  private _favoriteAlbumsAll: favoriteAlbumsInStorage = {};
  public albumsToShowByGenre = new BehaviorSubject<IAlbumFav[]>([]);
  public favoriteAlbumsByGenre = new BehaviorSubject<IAlbumFav[]>([]);
  // public favoriteAlbums: IAlbumFav[] = [];
  public activeGenre!: string;
  public query: number = 0;
  public albumsInfo = new BehaviorSubject<IAlbumInfo>({
    tag: '',
    page: '',
    perPage: '',
    totalPages: '',
    total: '',
  });

  public genres: IGenre[] = [
    { name: 'rock', title: 'Rock' },
    { name: 'electro', title: 'Electro' },
    { name: 'pop', title: 'Pop' },
    { name: 'hipHop', title: 'Hip-Hop' },
    { name: 'rAndB', title: 'R&B' },
    { name: 'indie', title: 'Indie' },
  ];

  public fetchAlbums(genre: string, page: number) {
    return this._http
      .get<IAlbumsFromAPI>(`http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&page=${page}&api_key=${environment.keyForAPI}&format=json`)
      .pipe(
        tap(
          (data: IAlbumsFromAPI) => {
            this.albumsInfo.next(data.albums["@attr"]);
            return data
          }
        ),
        map(
          (data: IAlbumsFromAPI) => data.albums.album.map((item) => ({...item, isFavorite: false}))
      ))
  }

  public getFavoriteAlbums(genre: string): IAlbumFav[] | [] {
    if (localStorage.getItem('favoriteAlbums')) {
      this._favoriteAlbumsAll = JSON.parse(localStorage.getItem('favoriteAlbums') as string);
      if (this._favoriteAlbumsAll.hasOwnProperty(genre)) {
        this.favoriteAlbumsByGenre.next(this._favoriteAlbumsAll[genre]);

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

    this.favoriteAlbumsByGenre.next(this.getFavoriteAlbums(genre));
  }

  public handleRemoveFromFavorite(genre: string, album: IAlbumFav) {
    album.isFavorite = false;

    const index: number = this._favoriteAlbumsAll[genre].findIndex((item) => {
      return item.name === album.name && item.artist.name === album.artist.name
    });

    if (index > -1) {
      this._favoriteAlbumsAll[genre].splice(index, 1);
      localStorage.setItem('favoriteAlbums', JSON.stringify(this._favoriteAlbumsAll));
      this.favoriteAlbumsByGenre.next(this.getFavoriteAlbums(genre));
    }
  }
}
