import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Route } from "@angular/router";
import { Subscription } from "rxjs";
import { GenresService } from "src/app/genres.service";
import { IAlbumFav } from "src/app/shared/album.model";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.sass'],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  private _sub!: Subscription;

  public favoriteAlbums!: IAlbumFav[];
  public noFavAlbums = false;
  public noFavAlbumsBySearch = false;

  constructor(
    public genresService: GenresService,
  ) {}

  ngOnInit(): void {
    this.genresService.favoriteFilterOn = true;
    this.favoriteAlbums = this.genresService.getFavoriteAlbums(this.genresService.activeGenre);
    if (this.favoriteAlbums.length === 0 && !this.noFavAlbumsBySearch) this.noFavAlbums = true;
    this.noFavAlbumsBySearch = false;

    this._sub = this.genresService.favoriteAlbumsByGenre.subscribe(
      (favoriteAlbums) => {
        this.noFavAlbums = favoriteAlbums.length === 0 && !this.genresService.searchFilterOn;
        this.favoriteAlbums = favoriteAlbums;
        this.genresService.searchInFavorite(this.genresService.searchValue.getValue(), favoriteAlbums);
      }
    );

    this._sub.add(this.genresService.favoriteAlbumsBySearch.subscribe(
      (albums) => {
        if (this.genresService.searchFilterOn) {
          this.favoriteAlbums = albums;
          this.noFavAlbumsBySearch = this.favoriteAlbums.length === 0;
        }
      }
    ))
  }

  ngOnDestroy(): void {
    this.genresService.favoriteFilterOn = false;
    this._sub.unsubscribe();
  }
}
