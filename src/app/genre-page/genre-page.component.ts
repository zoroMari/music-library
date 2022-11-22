import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { GenresService } from '../genres.service';
import { IAlbumFav } from '../shared/album.model';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit, OnDestroy {
  private _sub!: Subscription;
  private _albumsFilteredChange = new Subject<IAlbumFav[]>();
  public currentItems: number = 0;
  public allItems: number = 0;
  private _page: number = 0;

  public albums!: Observable<IAlbumFav[]>;
  // public albumsAll: IAlbumFav[] = [];
  public albumsToShow!: IAlbumFav[];

  public noAlbums = false;
  public favoriteFilterOn = false;

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._sub = this._route.params.subscribe(
      (params: Params) => {
        this.genresService.activeGenre = params['genre'];
        this._initialization(this.genresService.activeGenre, 1);
      }
    )

    this._sub.add(this.genresService.albumsToShowByGenre.subscribe(
      (albums) => {
        this.albumsToShow = albums;
      }
    ))

    this._sub.add(this._albumsFilteredChange.subscribe(
      (albums) => {
        this.albumsToShow = albums
      }
    ))
  }


  // public handleOnSearch(value: string) {
  //   let newAlbumsArray: IAlbumFav[] = [];
  //   if (this.favoriteFilterOn) {
  //     newAlbumsArray = this.favoriteAlbums.filter((item) => {
  //       return (item.name).toLowerCase().includes(value.toLowerCase()) ||
  //       (item.artist.name).toLowerCase().includes(value.toLowerCase())
  //     });
  //   } else {
  //     newAlbumsArray = this.albumsAll.filter((item) => {
  //       return (item.name).toLowerCase().includes(value.toLowerCase()) ||
  //       (item.artist.name).toLowerCase().includes(value.toLowerCase())
  //     });
  //   }

  //   this.noAlbums = newAlbumsArray.length === 0;
  //   this._albumsFilteredChange.next(newAlbumsArray);
  // }

  public handleOnSearch(value: string) {}


  handleOpenFavorites(isFavorites: boolean) {
    this.favoriteFilterOn = isFavorites;
    this._router.navigate(['favorites'], { relativeTo: this._route });
  }

  handleCloseFavorites(isFavorites: boolean) {
    this._router.navigate(['./'], { relativeTo: this._route });
    this._initialization(this.genresService.activeGenre, 1);
    this.favoriteFilterOn = isFavorites;
  }

  private _checkIsFavortite(array: IAlbumFav[]) {
    const albumsWithFav: IAlbumFav[] = [];
    array.forEach((item) => {
      let isFavorite = this.genresService.favoriteAlbumsByGenre.getValue().find((itemFav) => {
        return item.name === itemFav.name && item.artist.name === itemFav.artist.name
      })

      if (!isFavorite) albumsWithFav.push(item);
      else albumsWithFav.push({...item, isFavorite: true});
    });

    this.genresService.albumsToShowByGenre.next(albumsWithFav);
  }

  private _initialization(genre: string, page: number) {
    const favoriteAlbums = this.genresService.getFavoriteAlbums(this.genresService.activeGenre);
    this.genresService.favoriteAlbumsByGenre.next(favoriteAlbums);
    this.albums = this.genresService.fetchAlbums(genre, page).pipe(
      map((albums) => {
        this._checkIsFavortite(albums);
        return this.genresService.albumsToShowByGenre.getValue();
      })
    );
    this.albums.subscribe(
      (albums: IAlbumFav[]) => {
        this.currentItems = +this.genresService.albumsInfo.getValue().perPage;
        this.currentItems = +this.genresService.albumsInfo.getValue().total;
        // this.albumsAll = albums;
        this.genresService.albumsToShowByGenre.next(albums);
      }
    )
  }

  public handlePageEvent(e: PageEvent) {
    this._sub.add(this._initialization(this.genresService.activeGenre, e.pageIndex + 1))
}

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
