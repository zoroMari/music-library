import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
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

  public albums!: Observable<IAlbumFav[]>;
  public albumsToShow!: IAlbumFav[];

  public noAlbums = false;

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.noAlbums = false;

    this._sub = this._route.params.subscribe(
      (params: Params) => {
        this.genresService.activeGenre = params['genre'];
      }
    );

    this._sub.add(this._route.queryParams.subscribe(
      (params: Params) => {
        if (this.genresService.favoriteFilterOn) return;
        else {
          this.genresService.pageIndex.next(params['page']);
          this._initialization(this.genresService.activeGenre, this.genresService.pageIndex.getValue());
        }
      }
    ))

    this._sub.add(this.genresService.albumsToShowByGenre.subscribe(
      (albums) => {
        this.albumsToShow = albums;
        this.genresService.isLoaded.next(true);
        this.currentItems = +this.genresService.albumsInfo.getValue().perPage;
        this.allItems = +this.genresService.albumsInfo.getValue().total;
      }
    ))

    this._sub.add(this.genresService.searchValue.subscribe(
      (value) => {
        if (!this.genresService.searchFilterOn) return;
        else this._handleOnSearch(value)
      }
    ))
  }

  private _initialization(genre: string, page: number) {
    const favoriteAlbums = this.genresService.getFavoriteAlbums(this.genresService.activeGenre);
    this.genresService.favoriteAlbumsByGenre.next(favoriteAlbums);

    this.genresService.fetchAlbums(genre, page).pipe(
      tap((albums) => {
        this._checkIsFavortite(albums);
      })
    ).subscribe();
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

  handleOpenFavorites() {
    if (this.genresService.searchFilterOn) {
      this.genresService.searchFilterOn = false;
    }
    this._router.navigate(['./favorites'], { relativeTo: this._route, queryParamsHandling: 'preserve' });
  }

  handleCloseFavorites() {
    this._router.navigate(['./'], { relativeTo: this._route, queryParamsHandling: 'preserve' });
    this._initialization(this.genresService.activeGenre, this.genresService.pageIndex.getValue());
    this.genresService.searchFilterOn = false;
  }

  private _handleOnSearch(value: string) {
    this.genresService.pageIndex.next(1);
    if (this.genresService.favoriteFilterOn) this._searchLogicInFavorites(value);
    else this._searchLogic(value);
  }

  private _searchLogicInFavorites(value: string) {
    this.genresService.searchInFavorite(value, this.genresService.favoriteAlbumsByGenre.getValue())
  }

  private _searchLogic(value: string) {
    this.albums = this.genresService.searchAlbums(this.genresService.activeGenre, value, this.genresService.pageIndex.getValue()).pipe(
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

          if (this.albumsToShow.length === 0) this.noAlbums = true;
          else this.noAlbums = false;
        }
      )
    }
    else this._initialization(this.genresService.activeGenre, 1);
  }

  public handleOnCloseSearch() {
    this.genresService.searchFilterOn = false;
    this.genresService.pageIndex.next(1);
    this.noAlbums = false;

    if (this.genresService.favoriteFilterOn) {
      this.genresService.searchInFavorite(
        this.genresService.searchValue.getValue(),
        this.genresService.getFavoriteAlbums(this.genresService.activeGenre
      ));
    } else this._router.navigate( [], { queryParams: { page: this.genresService.pageIndex.getValue() } });
  }

  public handlePageEvent(e: PageEvent) {
    const page =  e.pageIndex + 1;
    this.genresService.pageIndex.next(page);
    if (this.genresService.searchFilterOn) this._searchLogic(this.genresService.searchValue.getValue());
    else if (this.genresService.favoriteFilterOn) return;
    else this._router.navigate( [], { queryParams: { page: page } });
  }

  ngOnDestroy(): void {
    this.genresService.isLoaded.next(false);
    this._sub.unsubscribe();
  }
}
