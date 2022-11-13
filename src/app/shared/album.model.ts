export interface IAlbum {
  artist: {name: string}
  name: string;
  image: IAlbumImage[];
  url: string;
}
export interface IAlbumFav extends IAlbum {
  isFavorite: boolean;
}

export interface IAlbumsObject {
  album: IAlbum[];
}

export interface IAlbumsFromAPI {
  albums: IAlbumsObject;
}

export interface favoriteAlbumsInStorage {
  [genre: string]: IAlbumFav[];
}

interface IAlbumImage {
  '#text': string;
  size: string;
}

