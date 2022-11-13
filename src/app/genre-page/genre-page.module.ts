import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";

import { GenrePageComponent } from "./genre-page.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { SearchPipe } from "./search.pipe";

@NgModule({
  declarations: [
    GenrePageComponent,
    NavigationComponent,
    SearchPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: GenrePageComponent }
    ])
  ],
})
export class GenreModule {

}
