import { Component, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-update-snack-bar',
  templateUrl: './update-snack-bar.component.html',
  styleUrls: ['./update-snack-bar.component.css'],
})
export class UpdateSnackBarComponent implements OnDestroy {
  private _subs: Subscription[] = [];

  constructor(public updates: SwUpdate, private snackBar: MatSnackBar) {
    if (!this.updates.isEnabled) return;

    this.updates.activateUpdate();

    this._subs.push(
      this.updates.versionUpdates
        .pipe(
          filter((event) => event.type === 'VERSION_READY'),
          first()
        )
        .subscribe(this.prompt.bind(this))
    );

    this._subs.push(
      interval(60 * 60 * 1000).subscribe(() => updates.checkForUpdate())
    );
  }
  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }

  public prompt() {
    const snack = this.snackBar.open('An update is available', 'Update', {
      panelClass: 'snackPanel',
      verticalPosition: 'top',
    });
    snack.onAction().subscribe(this.update);
  }

  update() {
    window.location.reload();
  }
}
