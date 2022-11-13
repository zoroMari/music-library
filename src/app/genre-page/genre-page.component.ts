import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { GenresService } from '../genres.service';
import { IAlbum, IAlbumFav } from '../shared/album.model';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit, OnDestroy {
  public hoverElement!: IAlbum | null;
  private _sub!: Subscription;

  public activeGenre: string = '';
  public albums!: Observable<IAlbumFav[]>;
  public albumsToShow: IAlbumFav[] = [];
  public albumsAll: IAlbumFav[] = [];
  public favoriteAlbums: IAlbumFav[] = [];
  public noAlbums = false;
  public noFavAlbums = false;
  public favoriteFilterOn = false;

  private _albumsFilteredChange = new Subject<IAlbumFav[]>();

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.favoriteAlbums.length === 0) this.noFavAlbums = true;

    this._sub = this._route.params.subscribe(
      (params: Params) => {
        this.activeGenre = params['genre'];
        this.favoriteAlbums = this.genresService.getFavoriteAlbums(this.activeGenre);
        if (this.favoriteAlbums.length > 0) this.noFavAlbums = false;

        this.albums = this.genresService.fetchAlbums(params['genre']).pipe(
          map((albums) => {
            const albumsWithFav: IAlbumFav[] = [];

            albums.forEach((item) => {
              let isFavorite = this.favoriteAlbums.find((itemFav) => {
                return item.name === itemFav.name && item.artist.name === itemFav.artist.name
              })

              if (!isFavorite) albumsWithFav.push(item);
              else albumsWithFav.push({...item, isFavorite: true});
            });

            return albumsWithFav;
          })
        );
        this.albums.subscribe(
          (albums: IAlbumFav[]) => {
            this.albumsAll = albums;
            this.albumsToShow = albums;
          }
        )
      }
    )

    this._sub.add(this._albumsFilteredChange.subscribe(
      (albums) => {
        this.albumsToShow = albums
      }
    ))

    this._sub.add(this.genresService.favoriteAlbumsByGenreChanged.subscribe(
      (favoriteAlbums) => {
        this.noFavAlbums = favoriteAlbums.length === 0;
        this.favoriteAlbums = favoriteAlbums;
      }
    ))
  }

  public imgStyles(album: IAlbumFav) {
    return {
      'background-image': `${this.getAlbumImg(album)}`,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover'
    }
  }

  public getAlbumImg(album: IAlbumFav) {
    return `url(${album.image[3]['#text']})`
  }

  public handleOnSearch(value: string) {
    let newAlbumsArray: IAlbumFav[] = [];
    if (this.favoriteFilterOn) {
      newAlbumsArray = this.favoriteAlbums.filter((item) => {
        return (item.name).toLowerCase().includes(value.toLowerCase()) ||
        (item.artist.name).toLowerCase().includes(value.toLowerCase())
      });
    } else {
      newAlbumsArray = this.albumsAll.filter((item) => {
        return (item.name).toLowerCase().includes(value.toLowerCase()) ||
        (item.artist.name).toLowerCase().includes(value.toLowerCase())
      });
    }

    this.noAlbums = newAlbumsArray.length === 0;
    this._albumsFilteredChange.next(newAlbumsArray);
  }

  handleAddToFavorite(album: IAlbumFav) {
    this.genresService.handleAddToFavorite(this.activeGenre, album);
  }

  handleRemoveFromFavorite(album: IAlbumFav) {
    this.genresService.handleRemoveFromFavorite(this.activeGenre, album);

    if (this.favoriteFilterOn) this._albumsFilteredChange.next(this.favoriteAlbums);
  }

  handleOpenFavorites() {
    this.favoriteFilterOn = true;
    const newAlbumsArray: IAlbumFav[] = this.albumsAll.filter((item) => {
      return item.isFavorite === true;
    });

    this._albumsFilteredChange.next(newAlbumsArray);
  }

  handleCloseFavorites() {
    this.favoriteFilterOn = false;
    this._albumsFilteredChange.next(this.albumsAll);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
