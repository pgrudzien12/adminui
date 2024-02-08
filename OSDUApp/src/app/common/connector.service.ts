import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConnectorHealth } from '../models/connector.models';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ConnectorService {
  private static readonly OSDU_CONNECTOR_ENDPOINT =
    environment.settings.api_endpoints.osdu_connector_api_endpoint;

  private static readonly HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'data-partition-id': environment.settings.data_partition,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  constructor(
    private httpClient: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  getHealth(): Observable<ConnectorHealth> {
    return this.httpClient.get<ConnectorHealth>(
      `${ConnectorService.OSDU_CONNECTOR_ENDPOINT}health`
    );
  }

  getAssociatedObjects(id): Observable<string[]> {
    const param = 'search/associated/' + id;
    return this.httpClient
      .post<any>(
        ConnectorService.OSDU_CONNECTOR_ENDPOINT + param,
        {},
        ConnectorService.HTTP_OPTIONS
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
    const param = 'search/associated/all/' + id;
    return this.httpClient
      .get<any>(
        ConnectorService.OSDU_CONNECTOR_ENDPOINT + param,
        ConnectorService.HTTP_OPTIONS
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }

  getObjectsByKind(kind): Observable<any> {
    const param = 'search/v2/query';

    return this.httpClient
      .post<any>(
        ConnectorService.OSDU_CONNECTOR_ENDPOINT + param,
        {
          kind: kind,
        },
        ConnectorService.HTTP_OPTIONS
      )
      .pipe(
        map(this.extractData),
        catchError(this.errorHandler.errorHandler<any>())
      );
  }
}
