import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-base-destroy",
  template: "",
})
export abstract class BaseDestroyCompoent implements OnDestroy {
  protected destroy$ = new Subject();
  constructor() {}



  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
