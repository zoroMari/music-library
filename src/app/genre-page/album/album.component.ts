import { Component, Input } from "@angular/core";
import { GenresService } from "src/app/genres.service";
import { IAlbum, IAlbumFav } from "src/app/shared/album.model";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.sass'],
})
export class AlbumComponent {
  @Input() albumsToShow!: IAlbumFav[];
  @Input() activeGenre!: string;
  public hoverElement!: IAlbum | null;

  constructor(
    public genresService: GenresService,
  ) {}

  public imgStyles(album: IAlbumFav) {
    return {
      'background-image': `${this.getAlbumImg(album)}`,
      'background-color': '#000',
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover'
    }
  }

  public getAlbumImg(album: IAlbumFav) {
    return `url(${album.image[3]['#text']})`
  }

  handleAddToFavorite(album: IAlbumFav, activeGenre: string) {
    this.genresService.handleAddToFavorite(activeGenre, album);
  }

  handleRemoveFromFavorite(album: IAlbumFav, activeGenre: string) {
    this.genresService.handleRemoveFromFavorite(activeGenre, album);
  }
}
