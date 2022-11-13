import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm } from "@angular/forms";
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
  @Output() onOpenFavorites = new EventEmitter<void>();
  @Output() onCloseFavorite = new EventEmitter<void>();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
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
    this._router.navigate(['../'], {relativeTo: this._route})
  }

  public handleOpenFavorites() {
    this.favoriteisOpen = true;
    this.onOpenFavorites.emit();
    this._sub.unsubscribe();
    this.form.reset();
  }

  public handleCloseFavorites() {
    this.favoriteisOpen = false;
    this.onCloseFavorite.emit();
    this._sub.unsubscribe();
    this.form.reset();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
