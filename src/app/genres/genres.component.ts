import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IGenre } from '../genre.model';
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
      this._router.navigate(['', genre])
  }
}
