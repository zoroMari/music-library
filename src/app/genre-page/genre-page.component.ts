import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GenresService } from '../genres.service';
import { IAlbum } from '../shared/album.model';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit, OnDestroy {

  public albums!: Observable<IAlbum[]>;
  private _sub!: Subscription;

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._sub = this._route.params.subscribe(
      (params: Params) => {
        this.albums = this.genresService.fetchGenre(params['genre'])
      }
    )
  }

  public imgStyles(album: IAlbum) {
    return {
      'background-image': `${this.getAlbumImg(album)}`,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover'
    }
  }

  public getAlbumImg(album: IAlbum) {
    return `url(${album.image[3]['#text']})`
  }

  ngOnDestroy(): void {
      this._sub.unsubscribe();
  }
}
