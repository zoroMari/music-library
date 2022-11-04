import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GenresService } from '../genres.service';

@Component({
  selector: 'app-genre-page',
  templateUrl: './genre-page.component.html',
  styleUrls: ['./genre-page.component.sass']
})
export class GenrePageComponent implements OnInit {
  public albums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]

  constructor(
    private _genresService: GenresService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this._route.params.subscribe(
      (params: Params) => {
        const isGenre = () => {
          return this._genresService.genres.find((item) => {
            return item.name === params['genre'].toLowerCase();
          })
        }

        if (!isGenre()) {
          this._router.navigate(['/']);
        }
      }
    )

  }

}
