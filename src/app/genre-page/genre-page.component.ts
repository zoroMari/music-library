import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, Subject, Subscription, tap } from 'rxjs';
import { GenresService } from '../genres.service';
import { IAlbumFav } from '../shared/album.model';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit, OnDestroy {
  private _sub!: Subscription;

  public currentItems: number = 0;
  public allItems: number = 0;
  public pageIndex: number = 1;

  public albums!: Observable<IAlbumFav[]>;
  public albumsToShow!: IAlbumFav[];

  public noAlbums = false;

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._sub = this._route.params.subscribe(
      (params: Params) => {
        this.genresService.activeGenre = params['genre'];
      }
    );

    this._sub.add(this._route.queryParams.subscribe(
      (params: Params) => {
        this.pageIndex = params['page'];
        this._initialization(this.genresService.activeGenre, this.pageIndex);
      }
    ))

    this._sub.add(this.genresService.albumsToShowByGenre.subscribe(
      (albums) => {
        this.albumsToShow = albums;
        this.genresService.isLoaded.next(true);
      }
    ))

    this._sub.add(this.genresService.searchValue.subscribe(
      (value) => {
        this.handleOnSearch(value)
      }
    ))
  }

  handleOpenFavorites() {
    if (this.genresService.searchFilterOn) {
      this.pageIndex = 1;
      this.genresService.searchFilterOn = false;
    }
    this._router.navigate(['./favorites'], { relativeTo: this._route });
  }

  handleCloseFavorites() {
    this._router.navigate(['./'], { relativeTo: this._route, queryParams: {page: this.pageIndex}});
    this._initialization(this.genresService.activeGenre,  this.pageIndex);
    this.genresService.searchFilterOn = false;
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
        this.genresService.albumsToShowByGenre.next(albums);
      }
    )
  }

  public handleOnSearch(value: string) {
    this.pageIndex = 1;
    if (this.genresService.favoriteFilterOn) this._searchLogicInFavorites(value);
    else this._searchLogic(value);
  }

  private _searchLogicInFavorites(value: string) {
    this.genresService.searchInFavorite(value, this.genresService.favoriteAlbumsByGenre.getValue())
  }

  private _searchLogic(value: string) {
    this.albums = this.genresService.searchAlbums(this.genresService.activeGenre, value, this.pageIndex).pipe(
      map((albums) => {
        if (!albums) return [];
        this._checkIsFavortite(albums);
        return this.genresService.albumsToShowByGenre.getValue();
      })
    );

    if (value) {
      this.albums.subscribe(
        (albums: IAlbumFav[]) => {
          this.currentItems = +this.genresService.albumsInfo.getValue().perPage;
          this.currentItems = +this.genresService.albumsInfo.getValue().total;
          this.genresService.albumsToShowByGenre.next(albums);

          if (!albums) return
          this.albumsToShow = albums;
        }
      )
    }
    else this._initialization(this.genresService.activeGenre, 1);
  }

  public handleOnCloseSearch() {
    this.genresService.searchFilterOn = false;
    this.pageIndex = 1;

    if (this.genresService.favoriteFilterOn) {
      this.genresService.searchInFavorite(
        this.genresService.searchValue.getValue(),
        this.genresService.getFavoriteAlbums(this.genresService.activeGenre
      ));
    } else this._router.navigate( [], { queryParams: { page: this.pageIndex } });
  }

  public handlePageEvent(e: PageEvent) {
    const page =  e.pageIndex + 1;
    this.pageIndex = page;

    if (this.genresService.searchFilterOn) this._searchLogic(this.genresService.searchValue.getValue());
    else this._router.navigate( [], { queryParams: { page: page } });
  }

  ngOnDestroy(): void {
    this.genresService.isLoaded.next(false);
    this._sub.unsubscribe()
  }
}
