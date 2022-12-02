import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";

import { GenrePageComponent } from "./genre-page.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { SearchPipe } from "./search.pipe";
import { AlbumComponent } from "./album/album.component";

@NgModule({
  declarations: [
    GenrePageComponent,
    NavigationComponent,
    FavoritesComponent,
    AlbumComponent,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        component: GenrePageComponent,
        children: [
          { path: 'favorites', component: FavoritesComponent },
        ],
      },
    ])
  ],
})
export class GenreModule {

}
