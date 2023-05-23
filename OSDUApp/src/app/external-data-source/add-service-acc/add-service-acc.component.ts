import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { environment } from 'src/environments/environment';
import { grantTypes, scope, OAuth_flow } from '../../../config';

@Component({
  selector: 'app-add-service-acc',
  templateUrl: './add-service-acc.component.html',
  styleUrls: ['./add-service-acc.component.css'],
})
export class AddServiceAccComponent implements OnInit {
  originalOrder = (): number => {
    return 0;
  };

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  ServiceDetails;
  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';
  ngAuthProfileName = '';
  txtAccName = '';
  txtSecretManKey = '';
  txtAuthEndpoint = '';
  Type;
  btnLabel = '';
  grantTypes = grantTypes;
  schemetype_list = [];
  flowtype_list = [];
  scope = scope;
  OAuth_flow = OAuth_flow;

  ngAuthType = '0';
  ngCallbackUrl;
  ngAuthEndpoints;
  ngTokenEndpoints;
  ngClientId;
  ngClientSecret;
  ngScope = '';
  ngFlow = '0';
  ngSecretRepoUrl;
  ngAccToken;
  ngAPIKey;
  ngAudience;
  ngUsername;
  ngPassword;

  isAuthType: boolean;
  isBearerToken: boolean;
  isAPIKey: boolean;
  isAuthTypeSelected: boolean = false;
  isFlowTypeSelected: boolean = false;
  isFlowAuthCode: boolean;
  isFlowPassword: boolean;
  kind_value_schema: any;
  kind_value_flow: any;
  isScopes: boolean = false;
  isClientSecret: boolean = false;
  isUsername: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.kind_value_schema =
      environment.settings.data_partition +
      ':wks:reference-data--SecuritySchemeType:*';
    this.kind_value_flow =
      environment.settings.data_partition +
      ':wks:reference-data--OAuth2FlowType:*';
    if (this.Type == 'add') {
      this.btnLabel = 'Add';
    } else {
      this.btnLabel = 'Save';
      this.ngAuthProfileName = this.ServiceDetails.Name;
      this.txtAccName = this.ServiceDetails.AccountName;
      this.txtSecretManKey = this.ServiceDetails.SecretManagerKey;
      this.txtAuthEndpoint = this.ServiceDetails.TokenURL;
      this.ngSecretRepoUrl = this.ServiceDetails.SecretRepoUrl;
    }
    this.getAuthType();
  }

  getAuthType() {
    this.spinner.show();

    const data = {
      kind: this.kind_value_schema,
    };
    this.restService.getSchemeType(data).subscribe(
      (result) => {
        this.getFlowType();
        this.spinner.hide();
        this.schemetype_list = result['results'];
        if (this.Type != 'add') {
          this.ngAuthType = this.ServiceDetails.Type.slice(0, -1);
          this.onAuthTypeChange(this.ServiceDetails.Type.slice(0, -1));
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  getFlowType() {
    this.spinner.show();

    const data = {
      kind: this.kind_value_flow,
    };
    this.restService.getFlowType(data).subscribe(
      (result) => {
        this.spinner.hide();
        // console.log(result)
        this.flowtype_list = result['results'];
        if (this.Type != 'add') {
          this.ngFlow = this.ServiceDetails.Flow.slice(0, -1);
          this.onFlowChange(this.ngFlow);
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  closePopup() {
    this.activeModal.close();
  }

  onAuthTypeChange(val) {
    this.isAuthTypeSelected = true;
    if (val != 0) {
      if (val.includes('OAuth2')) {
        this.isAuthType = true;
        this.isBearerToken = false;
        this.isAPIKey = false;
      } else if (val.includes('Bearer')) {
        this.isAuthType = false;
        this.isBearerToken = true;
        this.isAPIKey = false;
      }
    }
  }

  onFlowChange(val) {
    this.isFlowTypeSelected = true;
    if (val.includes('AuthorizationCode')) {
      this.isFlowAuthCode = true;
      this.isFlowPassword = false;
      if (this.Type != 'add') {
        // this.ngCallbackUrl=this.ServiceDetails
      }
    } else if (val.includes('PasswordCredentials')) {
      this.isFlowPassword = true;
      if (this.Type != 'add') {
      }
    } else {
      this.isFlowAuthCode = false;
      this.isFlowPassword = false;
    }
    if (this.Type != 'add') {
      this.ngClientId = this.ServiceDetails['ClientID'];
      this.ngClientSecret = this.ServiceDetails['ClientSecretKey'];
      this.ngScope = this.ServiceDetails['ScopesKey'];
      this.ngAuthEndpoints = this.ServiceDetails['AuthorizationUrl'];
      this.ngCallbackUrl = this.ServiceDetails['CallbackUrl'];
      this.ngTokenEndpoints = this.ServiceDetails['TokenUrl'];
      this.ngUsername = this.ServiceDetails['UsernameKey'];
      this.ngPassword = this.ServiceDetails['PasswordKey'];
    }
  }

  requestSubmit() {
    let count = 0;
    // for (let element in this) {
    //   if (element.includes('txt')) {
    //     if (this[element].toString() === "") {
    //       count += 1;
    //     }
    //   }
    // }

    if (count > 0) {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please enter all the fields';
    } else {
      this.isError = false;
      this.isSuccess = true;
      let dataparams = {};
      if (this.ngAuthType.includes('OAuth2')) {
        if (this.ngFlow.includes('AuthorizationCode')) {
          dataparams = {
            Name: this.ngAuthProfileName,
            Type: this.ngAuthType + ':',
            Flow: this.ngFlow + ':',
            ScopesKey: this.ngAuthProfileName + '_Scopes',
            ClientID: this.ngClientId,
            ClientSecretKey: this.ngAuthProfileName + '_ClientSecret',
            SecretRepoUrl: this.ngSecretRepoUrl,
            CallbackUrl: this.ngCallbackUrl,
            AuthorizationUrl: this.ngAuthEndpoints,
            TokenUrl: this.ngTokenEndpoints,
          };
        } else if (this.ngFlow.includes('PasswordCredentials')) {
          dataparams = {
            Name: this.ngAuthProfileName,
            Type: this.ngAuthType + ':',
            Flow: this.ngFlow + ':',
            ScopesKey: this.ngAuthProfileName + '_Scopes',
            ClientID: this.ngClientId,
            ClientSecretKey: this.ngAuthProfileName + '_ClientSecret',
            UsernameKey: this.ngAuthProfileName + '_Username',
            PasswordKey: this.ngAuthProfileName + '_Password',
            SecretRepoUrl: this.ngSecretRepoUrl,
            TokenUrl: this.ngTokenEndpoints,
          };
        } else {
          dataparams = {
            Name: this.ngAuthProfileName,
            Type: this.ngAuthType + ':',
            Flow: this.ngFlow + ':',
            ScopesKey: this.ngAuthProfileName + '_Scopes',
            ClientID: this.ngClientId,
            ClientSecretKey: this.ngAuthProfileName + '_ClientSecret',
            SecretRepoUrl: this.ngSecretRepoUrl,
            TokenUrl: this.ngTokenEndpoints,
            Audience: this.ngAudience,
          };
        }
      } else if (this.ngAuthType.includes('Bearer')) {
        dataparams = {
          Name: this.ngAuthProfileName,
          Type: this.ngAuthType + ':',
          //"Flow":this.ngFlow+':',
          AccessTokenKey: this.ngAuthProfileName + '_access_token',
          SecretRepoUrl: this.ngSecretRepoUrl,
        };
      } else {
        dataparams = {
          Name: this.ngAuthProfileName,
          Type: this.ngAuthType + ':',
          //  "Flow":this.ngFlow+':',
          APIKeyKey: this.ngAuthProfileName + '_apikey',
          SecretRepoUrl: this.ngSecretRepoUrl,
        };
      }
      this.passEntry.emit({ data: dataparams });
      this.closePopup();
      // if(this.Type=='add'){
      //   this.successMessge="Service Account has been created successfully.";

      //   const data={
      //     "Name":this.ngAuthProfileName,
      //     "Type":this.ngAuthType,
      //     "AccName":this.txtAccName,
      //     "SecManKey":this.txtSecretManKey,
      //     "SerEndpoint":this.txtAuthEndpoint
      //   }
      //   this.passEntry.emit({ data: data });
      // }
      // else{
      //   this.successMessge="Service Account has been updated successfully.";
      //   const data={
      //     // "PreviousAccName":this.ServiceDetails[0].ServiceAccountName,
      //     "ServiceAccountName":this.ngAuthProfileName,
      //     "AccName":this.txtAccName,
      //     "SecManKey":this.txtSecretManKey,
      //     "SerEndpoint":this.txtAuthEndpoint
      //   }
      //   this.passEntry.emit({ data: data });
      // }
    }
  }

  editSecretKeys(type) {
    let tempstr = 'is' + type;
    this[tempstr] = true;
  }
}
