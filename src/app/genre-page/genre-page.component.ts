import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { GenresService } from '../genres.service';
import { IAlbum } from '../shared/album.model';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit, OnDestroy {
  private _subParam!: Subscription;
  private _subAlbumsChange!: Subscription;
  private _subAlbums!: Subscription;

  public albums!: Observable<IAlbum[]>;
  public albumsArray: IAlbum[] = [];
  private _albumsChange = new Subject<IAlbum[]>();
  
  public hover = false;

  constructor(
    public genresService: GenresService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._subParam = this._route.params.subscribe(
      (params: Params) => {
        this.albums = this.genresService.fetchGenre(params['genre']);
        this.genresService.fetchGenre(params['genre']).subscribe(
          (albums) => this.albumsArray = albums
        )
      }
    )

    this._subAlbumsChange = this._albumsChange.subscribe(
      (albums) => this.albumsArray = albums
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

  public handleOnSearch(value: string) {
    this._subAlbums = this.albums.subscribe(
      (albums) => {
        const newAlbumsArray: IAlbum[] = albums.filter((item) => {
          return (item.name).toLowerCase().includes(value.toLowerCase())
        });
        this._albumsChange.next(newAlbumsArray);
      }
    )
  }

  public handleHoverGenre() {
    this.hover = true;
    console.log('TEST >>>', 'TEST');
  }

  ngOnDestroy(): void {
      this._subParam.unsubscribe();
      this._subAlbumsChange.unsubscribe();
      this._subAlbums.unsubscribe();
  }
}
