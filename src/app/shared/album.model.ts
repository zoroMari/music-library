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
  '@attr': IAlbumInfo;
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

export interface IAlbumInfo {
  tag: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}

