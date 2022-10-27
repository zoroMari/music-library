import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenrePageComponent } from "./genre-page/genre-page.component";
import { GenresComponent } from "./genres/genres.component";

const routes: Routes = [
  { path: '', component: GenresComponent },
  { path: ':genre', component: GenrePageComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {

}
