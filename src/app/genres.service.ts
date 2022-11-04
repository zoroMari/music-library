import { Injectable } from "@angular/core";
import { IGenre } from "./genre.model";

@Injectable({providedIn: 'root'})
export class GenresService {
  public genres: IGenre[] = [
    { name: 'rock', title: 'Rock' },
    { name: 'electro', title: 'Electro' },
    { name: 'pop', title: 'Pop' },
    { name: 'hipHop', title: 'Hip-Hop' },
    { name: 'rAndB', title: 'R&B' },
    { name: 'indie', title: 'Indie' },
  ];
}
