import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, Subscription } from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.sass'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  public form!: FormGroup;
  public favoriteisOpen = false;
  private _sub!: Subscription;
  @Input() badgeValue: number = 0;
  @Output() onSearch = new EventEmitter<string>();
  @Output() onOpenFavorites = new EventEmitter<boolean>();
  @Output() onCloseFavorite = new EventEmitter<boolean>();

  constructor(
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      search: new FormControl(''),
    });

    this._sub = this.form.controls['search'].valueChanges.pipe(debounceTime(200)).subscribe(
      (value) => {
        this.onSearch.emit(value)
      }
    )
  }

  public handleBack() {
    this._router.navigate([''])
  }

  public handleOpenFavorites() {
    this.favoriteisOpen = true;
    this.onOpenFavorites.emit(true);
    this.form.reset();
  }

  public handleCloseFavorites() {
    this.favoriteisOpen = false;
    this.onCloseFavorite.emit(false);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
