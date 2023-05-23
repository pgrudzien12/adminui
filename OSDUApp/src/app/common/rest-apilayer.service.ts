import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/common/error-handler.service';
import {
  OsduMember,
  OsduMemberWithAzureUser,
} from 'src/app/models/osdu-member.model';
import * as JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { GraphApiService } from './graph-api.service';
import { AzureUser } from '../models/azure-user';
import { OsduGroup } from '../models/osdu-group.model';
import { Helper } from './helper.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestAPILayerService {
  //----------- endpoint urls---------
  entitlement_endpoint_url =
    environment.settings.api_endpoints.entitlement_endpoint;
  storage_endpoint_url = environment.settings.api_endpoints.storage_endpoint;
  search_endpoint_url = environment.settings.api_endpoints.search_endpoint;
  legal_endpoint_url = environment.settings.api_endpoints.legal_endpoint;
  workflow_endpoint_url = environment.settings.api_endpoints.workflow_endpoint;
  schema_endpoint_url = environment.settings.api_endpoints.schema_endpoint;
  file_endpoint_url = environment.settings.api_endpoints.file_endpoint;
  osdu_connector_api_endpoint_url =
    environment.settings.api_endpoints.osdu_connector_api_endpoint;
  file_endpoint = environment.settings.api_endpoints.file_endpoint;

  // --------host points-------
  entitlementHost = environment.settings.common.entitlement_host;
  legalHost = environment.settings.common.legal_host;
  search_host = environment.settings.common.search_host;
  storage_host = environment.settings.common.storage_host;
  workflow_host = environment.settings.common.workflow_host;
  schema_host = environment.settings.common.schema_host;
  eds_workflow_host = environment.settings.common.eds_workflow_host;

  url_azure_ad_graph = 'https://graph.microsoft.com/v1.0/';

  httpOptions = {
    headers: new HttpHeaders({
      'data-partition-id': environment.settings.data_partition,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  httpOptions_file_api = {
    headers: new HttpHeaders({
      'data-partition-id': environment.settings.data_partition,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      accept: 'application/json',
    }),
  };

  httpOptions_token = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'gzip, deflate',
    }),
  };

  httpsOptions_entitlement = {
    headers: new HttpHeaders({
      'data-partition-id': environment.settings.data_partition,
      'Content-Type': 'application/json',
    }),
  };

  param: String = '';

  axios = require('axios').default;

  constructor(
    public http: HttpClient,
    private cmnSrvc: CommonService,
    public router: Router,
    private graphAPI: GraphApiService,
    private errorHandler: ErrorHandlerService
  ) {}

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  httpOptionsSample = {
    headers: new HttpHeaders({
      'data-partition-id': environment.settings.data_partition,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  //----------------------- Entitlement APIS------------------------

  getEntitlementGroups(): Observable<any> {
    this.param = 'groups';

    return this.http
      .get<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getMembersOfEntitlementGroups(group_email): Observable<any> {
    this.param = 'groups/' + group_email + '/members';
    return this.http
      .get<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  createEntitlementGroup(data) {
    this.param = 'groups';

    return this.http
      .post<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        data,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  addMemberGroup(data, groupmail) {
    this.param = 'groups/' + groupmail + '/members';

    return this.http
      .post<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        data,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  deleteGroup(group_mail) {
    this.param = 'groups/' + group_mail;
    return this.http
      .delete<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  deleteMemberGroup(group_mail, member_email) {
    this.param = 'groups/' + group_mail + '/members/' + member_email;

    return this.http
      .delete<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  createMember(emailmember) {
    const data = {
      email: emailmember,
      role: 'MEMBER',
    };
    return this.addMemberGroup(
      data,
      'users@' + environment.settings.data_partition + '.dataservices.energy'
    );
  }

  addMemberToUsersViewers(emailmember) {
    const data = {
      email: emailmember,
      role: 'MEMBER',
    };
    return this.addMemberGroup(
      data,
      'users.datalake.viewers@' +
        environment.settings.data_partition +
        '.dataservices.energy'
    );
  }

  addMemberToPrivilegeGroup(emailmember, privilegelevel) {
    const data = {
      email: emailmember,
      role: 'MEMBER',
    };
    if (privilegelevel == 'editor') {
      return this.addMemberGroup(
        data,
        'users.datalake.editors@' +
          environment.settings.data_partition +
          '.dataservices.energy'
      );
    } else {
      return this.addMemberGroup(
        data,
        'users.datalake.viewers@' +
          environment.settings.data_partition +
          '.dataservices.energy'
      );
    }
  }

  deleteMember(member_email) {
    this.param = 'members/' + member_email;

    return this.http
      .delete<any>(
        this.entitlement_endpoint_url + this.entitlementHost + this.param,
        this.httpsOptions_entitlement
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getUsersAccessRights(
    member_id,
    type: string = 'none'
  ): Observable<OsduGroup[]> {
    if (type === 'users') {
      type = 'user';
    }
    return this.http
      .get(
        `${this.entitlement_endpoint_url}${this.entitlementHost}members/${member_id}/groups`,
        {
          ...this.httpsOptions_entitlement,
          params: {
            type,
          },
        }
      )
      .pipe(
        map((res: any) => res.groups),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //------------------------- Azure AD connection graph users -------------------------------------------

  token_graphusers;
  http_token_graphusers = {
    headers: new HttpHeaders({}),
  };

  getAzureListUsers(): Observable<any> {
    this.param = 'users';

    return this.http
      .get<any>(
        this.url_azure_ad_graph + this.param,
        this.http_token_graphusers
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //------------------------- Legal APIs-------------------------------------------

  getLegalTagList(): Observable<any> {
    let params = new HttpParams();
    params = params.append('valid', true);

    return this.http
      .get<any>(this.legal_endpoint_url + this.legalHost + 'legaltags', {
        ...this.httpOptions,
        params,
      })
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getALegalTagDetails(legaltagName): Observable<any> {
    this.param = 'legaltags/' + legaltagName;

    return this.http
      .get<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getLegalTagDetailsMultiple(data): Observable<any> {
    this.param = 'legaltags:batchRetrieve';

    return this.http
      .post<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getLegalTagProperties() {
    this.param = 'legaltags:properties';

    return this.http
      .get<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  validateLegalTag(data) {
    this.param = 'legaltags:validate';

    return this.http
      .post<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }
  createLegalTag(data) {
    this.param = 'legaltags';

    return this.http
      .post<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  deleteLegalTag(legaltag) {
    this.param = 'legaltags/' + legaltag;
    return this.http
      .delete<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  updateLegalTag(data) {
    this.param = 'legaltags';
    return this.http
      .put<any>(
        this.legal_endpoint_url + this.legalHost + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //------------------------- Storage APIs-------------------------------------------

  getSchemaKindList(): Observable<any> {
    let params = new HttpParams();
    params = params.append('limit', 1000);

    return this.http
      .get<any>(this.schema_endpoint_url + this.schema_host + 'schema', {
        ...this.httpOptions,
        params,
      })
      .pipe(map(this.extractData));
  }

  getRecordFromStorageWithID(id) {
    const IDRegWithVersion =
      /^[\w\-\.]+:[\w\-\.]+\-\-[\w\.]+:[\w\-\.\:\%]+[^:]:[0-9]+$/;
    if (IDRegWithVersion.test(id)) {
      let id_version = id.split(':');
      return this.getSpecificRecordVersionFromStorageWithID(id_version);
    } else {
      return this.getLatestRecordVersionFromStorageWithID(id);
    }
  }

  getLatestRecordVersionFromStorageWithID(id): Observable<any> {
    this.param = 'records/' + encodeURIComponent(id);
    return this.http
      .get<any>(
        this.storage_endpoint_url + this.storage_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  deleteRecordFromStorageWithId(id: string): Observable<any> {
    return this.http
      .delete(
        `${this.storage_endpoint_url}${this.storage_host}records/${id}`,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler.errorHandler<any>()));
  }

  getSpecificRecordVersionFromStorageWithID(id_version): Observable<any> {
    let index = id_version.length - 1;
    this.param =
      'records/' +
      encodeURIComponent(id_version.slice(0, index).join(':')) +
      '/' +
      id_version.slice(index).join(':');
    return this.http
      .get<any>(
        this.storage_endpoint_url + this.storage_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getRecordVersionsFromStorageWithID(id): Observable<any> {
    this.param = 'records/versions/' + id;
    return this.http
      .get<any>(
        this.storage_endpoint_url + this.storage_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getListRecordsFromStorage(list_id: string[]): Observable<any> {
    this.param = 'query/records/';
    const jsonBody = {
      records: list_id.map((id) => Helper.getObjectIdWithoutVersion(id)),
    };

    return this.http
      .post<any>(
        this.storage_endpoint_url + this.storage_host + this.param,
        jsonBody,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  createOrUpdateRecords(objects_json): Observable<any> {
    this.param = 'records';
    let jsonBody = objects_json;

    return this.http
      .put<any>(
        this.storage_endpoint_url + this.storage_host + this.param,
        jsonBody,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //------------------------- Search APIs-------------------------------------------
  getDataFromSearch(data): Observable<any> {
    this.param = 'query';
    return this.http
      .post<any>(
        this.search_endpoint_url + this.search_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //------------------------- schema-service API-------------------------------------------

  getSchemaByKind(kind) {
    this.param = 'schema-service/v1/schema/' + kind;
    return this.http
      .get<any>(this.storage_endpoint_url + this.param, this.httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //--------------------------------- OSDU Connector API ----------------------------------------

  getAssociatedObjects(id): Observable<string[]> {
    this.param = 'search/associated/' + id;
    return this.http
      .post<any>(
        this.osdu_connector_api_endpoint_url + this.param,
        {},
        this.httpOptions
      )
      .pipe(
        map(
          (result: string[]) =>
            result.map((r) => (r.endsWith(':') ? r.slice(0, -1) : r)),
          catchError(this.errorHandler.errorHandler<any>())
        )
      );
  }

  getAllAssociatedObjects(id): Observable<any> {
    this.param = 'search/associated/all/' + id;
    return this.http
      .get<any>(
        this.osdu_connector_api_endpoint_url + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getObjectsByKind(kind): Observable<any> {
    this.param = 'search/kind/' + kind;

    return this.http
      .get<any>(
        this.osdu_connector_api_endpoint_url + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //--------------------------------- File Services----------------------------------------

  file_api_host = 'file/v2/';

  downloadURLObjectFile(dataset_id): Observable<any> {
    return this.http
      .get<any>(
        `${this.file_endpoint_url}${this.file_api_host}files/${dataset_id}/downloadURL`,
        this.httpOptions_file_api
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  downloadURLSignedDirect(downloadLink: string) {
    window.location.href = downloadLink;
  }

  downloadAsZip(urls, names): void {
    let count = 0;
    const zip = new JSZip();
    let dateStart = new Date();

    urls.forEach((url) => {
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          this.errorHandler.errorHandler()(err);
          throw err;
        }

        this.cmnSrvc.progressionBarDownloadValue =
          ((count + 1) / urls.length) * 100;
        this.cmnSrvc.progressionBarDownloadText =
          'Download of ' +
          names[count] +
          ' in progress ... -> [' +
          (count + 1) +
          '/' +
          urls.length +
          ']';
        zip.file(names[count], data, { binary: true });
        count++;

        if (count === urls.length) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            const objectUrl: string = URL.createObjectURL(content);
            const link: any = document.createElement('a');

            let date = Date.now();
            link.download = 'package' + date + '.zip';
            link.href = objectUrl;
            link.click();
          });

          this.cmnSrvc.progressionBarDownloadText = '';
          let dateEnd = new Date();
          console.log(
            'Time in seconde : ',
            Math.abs((dateEnd.getTime() - dateStart.getTime()) / 1000)
          );
        }
      });
    });
  }

  //--------------------------------- Wellbore DDMS ----------------------------------------

  url_wellboreDDMS =
    'https://osdu.energy.azure.com/api/os-wellbore-ddms/ddms/v3/welllogs/osdu-opendes:work-product-component--WellLog:441b3c0e68644695a58066342c7d4632/data?describe=false&orient=split%27';
  getWellboreDataWithID(): Observable<any> {
    this.param = 'workflow';

    return this.http
      .get<any>(this.url_wellboreDDMS, this.httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //--------------------------------- Workflow Services----------------------------------------

  getWorkFlowList(): Observable<any> {
    this.param = 'workflow';
    return this.http
      .get<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getAWorkFlowDetail(name) {
    this.param = 'workflow/' + name;
    return this.http
      .get<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getAWorkFlowRun(name) {
    this.param = 'workflow/' + name + '/workflowRun';
    return this.http
      .get<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getAWorkFlowRunDetail(name, runid) {
    this.param = 'workflow/' + name + '/workflowRun/' + runid;
    return this.http
      .get<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  updateWorkFlowRunStatus(name, runid, data) {
    this.param = 'workflow/' + name + '/workflowRun/' + runid;

    return this.http
      .put<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  postWorkFlowCreate(data) {
    this.param = 'workflow';

    return this.http
      .post<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  deleteWorkflowNAme(workflow) {
    this.param = 'workflow/' + workflow;

    return this.http
      .delete<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  postTriggerWorkflowRun(name, data) {
    this.param = 'workflow/' + name + '/workflowRun';

    return this.http
      .post<any>(
        this.workflow_endpoint_url + this.workflow_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  //-----------------------------EDS-------------------------------------------------------

  getConnectionSourceRegistry(data) {
    this.param = 'query';
    return this.http
      .post<any>(
        this.search_endpoint_url + this.search_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getConnectionSourceDataJob(data) {
    this.param = 'query';
    return this.http
      .post<any>(
        this.search_endpoint_url + this.search_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  postConnectionSourceRegistry(data) {
    this.param = 'workflow/Osdu_ingest/workflowRun';

    return this.http
      .post<any>(
        this.workflow_endpoint_url + this.eds_workflow_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getSchemeType(data) {
    this.param = 'query';

    return this.http
      .post<any>(
        this.search_endpoint_url + this.search_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getFlowType(data) {
    this.param = 'query';
    return this.http
      .post<any>(
        this.search_endpoint_url + this.search_host + this.param,
        data,
        this.httpOptions
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  private filterMemberByString(
    members: OsduMember[],
    azureMembers: AzureUser[],
    search: string
  ) {
    return members
      .filter(
        (m) =>
          !Helper.isGroup(m) &&
          (m.email.toLowerCase().includes(search.toLowerCase()) ||
            azureMembers.find((user) => user.id === m.email))
      )
      .map((m) => ({
        ...m,
        azureUser: azureMembers.find((user) => user.id === m.email),
      }));
  }

  getMembersByString(
    group: string,
    search: string
  ): Observable<OsduMemberWithAzureUser[]> {
    return forkJoin({
      members: this.getMembersOfEntitlementGroups(group),
      azureUsers: this.graphAPI.getUsersByString(search),
      appUsers: this.graphAPI.getApplicationByString(search),
    }).pipe(
      map((res: any) => {
        const members = res.members.members ?? ([] as OsduMember[]);
        const azureUsers = res.azureUsers ?? ([] as AzureUser[]);
        const azureApps = res.appUsers ?? ([] as AzureUser[]);
        const mergedUsersFilteredFromAzure = [...azureUsers, ...azureApps];

        const filteredByUserMembers = this.filterMemberByString(
          members,
          mergedUsersFilteredFromAzure,
          search
        );

        const filteredById = members.filter(
          (m) =>
            m.email.includes(search) &&
            !filteredByUserMembers.find((f) => f.email === m.email)
        );

        return [...filteredByUserMembers, ...filteredById];
      })
    );
  }

  getUsersAppsAndGroupByString(
    search: string
  ): Observable<OsduMemberWithAzureUser[]> {
    return forkJoin({
      azureUsers: this.graphAPI.getUsersByString(search),
      azureApps: this.graphAPI.getApplicationByString(search),
      groups: this.getEntitlementGroups(),
    }).pipe(
      map((res: any) => {
        const azureUsers = res.azureUsers ?? ([] as AzureUser[]);
        const groups = res.groups.groups ?? ([] as OsduGroup[]);
        const azureApps = res.azureApps ?? ([] as AzureUser[]);

        const allAzure = [...azureUsers, ...azureApps];

        const filteredAzure = allAzure.map((a) => ({
          email: a.id,
          role: 'MEMBER',
          azureUser: a,
        }));

        const filteredGroups = groups
          .filter((g) => g.email.toLowerCase().includes(search.toLowerCase()))
          .map((g) => ({ email: g.email, role: 'MEMBER', azureUser: null }));

        return [...filteredAzure, ...filteredGroups];
      })
    );
  }
}
