import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";

import { GenrePageComponent } from "./genre-page.component";
import { NavigationComponent } from "./navigation/navigation.component";

@NgModule({
  declarations: [
    GenrePageComponent,
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: GenrePageComponent }
    ])
  ],
})
export class GenreModule {

}
