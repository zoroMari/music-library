import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
  styleUrls: ['navigation.component.sass'],
})
export class NavigationComponent {

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  public handleSubmit(form: NgForm) {

  }

  public handleBack() {
    this._router.navigate(['../'], {relativeTo: this._route})
  }
}
