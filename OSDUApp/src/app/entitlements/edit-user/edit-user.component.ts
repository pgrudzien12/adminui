import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  userDetails;
  username;
  description;
  @Output() passEntryEdit: EventEmitter<any> = new EventEmitter();
  @ViewChild('myForm', { static: true }) myForm: ElementRef;
  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  closePopup() {
    this.activeModal.close();
  }
  requestSubmit() {
    const resetForm = <HTMLFormElement>document.getElementById('myForm');
    const data = {
      email: this.userDetails.email,
      name: resetForm.username.value,
      description: resetForm.description.value,
    };
    this.passEntryEdit.emit({ data: data });
    this.activeModal.close();
  }
}
