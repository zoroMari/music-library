import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, Subscription } from "rxjs";
import { GenresService } from "src/app/genres.service";

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.sass'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  private _sub!: Subscription;
  @Input() badgeValue: number = 0;
  @Output() onCloseSearch = new EventEmitter<null>();
  @Output() onOpenFavorites = new EventEmitter<null>();
  @Output() onCloseFavorite = new EventEmitter<null>();

  constructor(
    private _router: Router,
    public genresService: GenresService,
  ) {}

  ngOnInit(): void {
    this.genresService.searchFilterOn = false;
    this.form = new FormGroup({
      search: new FormControl(''),
    });

    this._sub = this.form.controls['search'].valueChanges.pipe(debounceTime(500)).subscribe(
      (value) => {
        this.genresService.searchValue.next(value);
      }
    )
  }

  public handleBack() {
    this._router.navigate(['']);
    this.genresService.pageIndex.next(1);
  }

  public handleOpenFavorites() {
    this.genresService.favoriteFilterOn = true;
    this.onOpenFavorites.emit();
    this.form.reset();
  }

  public handleCloseFavorites() {
    this.genresService.favoriteFilterOn = false;
    this.onCloseFavorite.emit();
    this.form.reset();
  }

  public handleOnSearch() {
    this.genresService.searchFilterOn = true;
  }

  public handleCloseSearch() {
    this.onCloseSearch.emit();
    this.genresService.searchValue.next('');
    this.genresService.searchFilterOn = false;
    this.form.reset();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
