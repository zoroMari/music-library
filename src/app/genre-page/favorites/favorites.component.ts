import { Component, OnDestroy, OnInit } from "@angular/core";
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

  constructor(
    public genresService: GenresService,
  ) {}

  ngOnInit(): void {
    this.favoriteAlbums = this.genresService.favoriteAlbumsByGenre.getValue();
    if (this.favoriteAlbums.length === 0) this.noFavAlbums = true;

    this._sub = this.genresService.favoriteAlbumsByGenre.subscribe(
      (favoriteAlbums) => {
        this.noFavAlbums = favoriteAlbums.length === 0;
        this.favoriteAlbums = favoriteAlbums;
      }
    );
  }

  ngOnDestroy(): void {
    this.genresService.favoriteFilterOn = false;
    this._sub.unsubscribe();
  }


}
