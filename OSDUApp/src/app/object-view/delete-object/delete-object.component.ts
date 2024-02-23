import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Helper } from 'src/app/common/helper.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { SweetAlertOptions } from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import swal from 'sweetalert2';

@Component({
  selector: 'app-delete-object',
  templateUrl: './delete-object.component.html',
})
export class DeleteObjectComponent {
  @Input() id: string;

  @Output() deleted = new EventEmitter<any>();

  constructor(
    private apiService: RestAPILayerService,
    private snackBar: MatSnackBar
  ) {}

  get dialogParameters(): SweetAlertOptions {
    return Helper.warningSweetAlertConfirmConfig(
      `Are you sure you want to delete ${this.id} ?`
    );
  }

  delete() {
    this.apiService.deleteRecordFromStorageWithId(this.id).subscribe(
      () => {
        this.deleted.emit();
        this.snackBar.open(
          `${this.id} has been successfuly deleted`,
          null,
          Helper.snackBarSuccessConfig
        );
      },
      () => {
        swal.fire(
          Helper.errorSweetAlertConfig(
            'Sorry. This user is not authorized to perform this function.'
          )
        );
      }
    );
  }
}
