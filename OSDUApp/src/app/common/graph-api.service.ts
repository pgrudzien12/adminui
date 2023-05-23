import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { AzureUser } from 'src/app/models/azure-user';
import { environment } from 'src/environments/environment';

const unknownUser: AzureUser = {
  id: 'unknown',
  displayName: 'Unknown user',
  mail: '',
  type: 'user',
};

@Injectable({
  providedIn: 'root',
})
export class GraphApiService {
  constructor(private http: HttpClient) {}

  private _userCache = {};

  private readonly userFields = `id,displayName,mail`;
  private readonly appFields = 'appId,displayName';

  getUsers() {
    return this.http.get(
      `${environment.settings.api_endpoints.graphAPI_endpoint}users`
    );
  }

  getCurrentUser() {
    return this.http.get(
      `${environment.settings.api_endpoints.graphAPI_endpoint}me`
    );
  }

  getCurrentUserPhoto() {
    return this.http.get(
      `${environment.settings.api_endpoints.graphAPI_endpoint}me/photo/$value`,
      { responseType: 'blob' }
    );
  }

  getUsersAndAppsById(id: string): Observable<AzureUser> {
    if (this._userCache[id]) return of(this._userCache[id]);

    return this.getUserById(id).pipe(
      catchError(() => {
        return this.getApplicationById.bind(this)(id) as Observable<AzureUser>;
      }),
      tap((res) => {
        this._userCache[id] = res;
      })
    );
  }

  getUserById(id: string): Observable<AzureUser> {
    const params = new HttpParams().append('$select', this.userFields);
    return this.http
      .get(
        `${environment.settings.api_endpoints.graphAPI_endpoint}users/${id}`,
        {
          params,
        }
      )
      .pipe(map((res: any) => ({ ...res, type: 'user' })));
  }

  getUsersByString(search: string): Observable<AzureUser[]> {
    const params = new HttpParams()
      .append('$select', this.userFields)
      .append(
        '$filter',
        `startswith(displayName,'${search}') or startswith(mail,'${search}') or startswith(givenName,'${search}') or startswith(surname,'${search}')`
      );

    return forkJoin({
      byId: this.getUserById(search).pipe(
        map((res) => [res]),
        catchError(() => of([]))
      ),
      byString: this.http
        .get(`${environment.settings.api_endpoints.graphAPI_endpoint}users`, {
          params,
        })
        .pipe(
          map((res: any) => res.value.map((a) => ({ ...a, type: 'user' })))
        ),
    }).pipe(
      map((join: any) => {
        return [...join.byId, ...join.byString];
      })
    );
  }

  getUsersById(ids: string[]): Observable<AzureUser[]> {
    let params = new HttpParams();

    params = params.append('$select', this.userFields);

    const inlineIds = ids.map((id) => `'${id}'`).join(', ');

    params = params.append('$filter', `id in (${inlineIds})`);

    return this.http
      .get(`${environment.settings.api_endpoints.graphAPI_endpoint}users`, {
        params,
      })
      .pipe(map((res: any) => res.value));
  }

  getApplicationById(id: string): Observable<AzureUser> {
    const params = new HttpParams().append('$select', this.appFields);

    return this.http
      .get(
        `${environment.settings.api_endpoints.graphAPI_endpoint}servicePrincipals(appId='${id}')`,
        { params }
      )
      .pipe(
        map((res: any) => {
          return {
            id,
            displayName: res.displayName ?? 'No name application',
            type: 'application',
            mail: '',
          } as AzureUser;
        }),

        catchError(() => of(unknownUser))
      );
  }

  getApplicationByString(search: string): Observable<AzureUser[]> {
    const params = new HttpParams()
      .append(
        '$filter',
        `startswith(displayName,'${search}') OR appId eq '${search}'`
      )
      .append('$count', true)
      .append('$select', this.appFields);

    const headers = new HttpHeaders().set('ConsistencyLevel', 'eventual');

    return this.http
      .get(
        `${environment.settings.api_endpoints.graphAPI_endpoint}servicePrincipals`,
        {
          params,
          headers,
        }
      )
      .pipe(
        map((res: any) => {
          return res.value.map(
            (el) =>
              ({
                id: el.appId,
                displayName: el.displayName ?? 'No name application',
                type: 'application',
                mail: '',
              } as AzureUser)
          );
        })
      );
  }
}
