import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { GenresService } from "./genres.service";

@Injectable({providedIn: 'root'})
export class GenreGuard implements CanActivate {
  constructor(
    private _genresService: GenresService,
    private _router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const genre = route.params['genre'];

    if (this._genresService.genres.find((item) => item.name === genre)) return true;
    else return this._router.createUrlTree(['']);
    ;
  }
}
