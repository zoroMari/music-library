import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GenreGuard } from "./genre-guard";
import { GenresComponent } from "./genres/genres.component";

const routes: Routes = [
  { path: '', component: GenresComponent },
  {
    path: ':genre',
    canActivate: [GenreGuard],
    loadChildren: () => import('./genre-page/genre-page.module').then(m => m.GenreModule)
  },
  { path: '**', redirectTo: '' },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {

}
