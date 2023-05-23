import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-create-workflow',
  templateUrl: './create-workflow.component.html',
  styleUrls: ['./create-workflow.component.css'],
})
export class CreateWorkflowComponent {
  ngWorkflowName = '';
  ngDescription = '';

  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';

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
      workflowName: this.ngWorkflowName,
      description: this.ngDescription,
    };

    let count = 0;
    for (let element in this) {
      if (element.includes('ng')) {
        if (this[element] == null) {
          count += 1;
        } else {
          if (this[element].toString() == '') {
            count += 1;
          }
        }
      }
    }
    if (count > 0) {
      this.isSuccess = false;
      this.isError = true;
      this.errorMessge = 'Please enter all the fields.';
    } else {
      this.spinner.show();
      this.restService.postWorkFlowCreate(data).subscribe(
        () => {
          this.spinner.hide();

          this.isSuccess = true;
          this.isError = false;

          this.successMessge =
            'You have successfully created ' + this.ngWorkflowName + '.';

          resetForm.reset();
          this.ngWorkflowName == '';
          this.ngDescription = '';
        },
        (err) => {
          this.spinner.hide();
          this.isError = true;
          this.isSuccess = false;
          this.errorMessge = err;
          console.log(err);
        }
      );
    }
  }
}
