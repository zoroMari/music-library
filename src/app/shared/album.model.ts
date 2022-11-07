export interface IAlbum {
  name: string;
  image: IAlbumImage[];
}

export interface IAlbumsObject {
  album: IAlbum[];
}

export interface IAlbumsFromAPI {
  albums: IAlbumsObject;
}

interface IAlbumImage {
  '#text': string;
  size: string;
}

