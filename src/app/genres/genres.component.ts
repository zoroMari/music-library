import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGenre } from '../shared/genre.model';
import { GenresService } from '../genres.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.sass']
})
export class GenresComponent implements OnInit {
  public genres!: IGenre[];

  constructor(
    private _router: Router,
    private _genresService: GenresService,
  ) { }

  ngOnInit(): void {
    this.genres = this._genresService.genres;
  }

  public handleOpenGenre(genre: string) {
    if (!this._genresService.genres.find((item) => item.name === genre)) return;
    this._router.navigate(['', genre], { queryParams: {page: this._genresService.pageIndex.getValue()} });
  }
}
