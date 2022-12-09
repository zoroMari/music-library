import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { favoriteAlbumsInStorage, IAlbumFav, IAlbumsFromAPI, IAlbumInfo, IAlbumsFromAPIForSearchBySong } from "./shared/album.model";
import { IGenre } from "./shared/genre.model";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})
export class GenresService {
  constructor (
    private _http: HttpClient
  ) {}

  public isLoaded = new BehaviorSubject<boolean>(false);
  public favoriteFilterOn = false;
  public searchFilterOn = false;
  public searchValue = new BehaviorSubject<string>('');

  private _favoriteAlbumsAll: favoriteAlbumsInStorage = {};
  public albumsToShowByGenre = new BehaviorSubject<IAlbumFav[]>([]);
  public favoriteAlbumsByGenre = new BehaviorSubject<IAlbumFav[]>([]);
  public favoriteAlbumsBySearch = new BehaviorSubject<IAlbumFav[]>([]);
  public pageIndex = new BehaviorSubject<number>(1);

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

  public searchAlbums(genre: string, name: string, page: number): Observable<IAlbumFav[] | undefined> {
    return this._http
      .get<IAlbumsFromAPIForSearchBySong>(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${name}&page=${page}&api_key=${environment.keyForAPI}&format=json`)
      .pipe(
        tap(
          (data: IAlbumsFromAPIForSearchBySong) => {
            const perPage = data.results["opensearch:itemsPerPage"];
            const total = data.results["opensearch:totalResults"];

            this.albumsInfo.next({
              tag: '',
              page: '',
              perPage: perPage,
              totalPages: '',
              total: total,
            })
            return data
          }
        ),
        map(
          (data: IAlbumsFromAPIForSearchBySong) => {
            return data.results.albummatches?.album.map((item) => ({...item, isFavorite: false}))
          }
      ))
  }

  public searchInFavorite(name: string, albums: IAlbumFav[]) {
    if (!name) this.favoriteAlbumsBySearch.next(albums);
    else this.favoriteAlbumsBySearch.next(albums.filter((item) => {
      return item.name.toLowerCase().includes(name.toLowerCase())
      || item.artist?.name?.toLowerCase().includes(name.toLowerCase())
    }));
  }

}
