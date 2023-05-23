import { Pipe, PipeTransform } from '@angular/core';
import { GraphApiService } from '../common/graph-api.service';
import { AzureUser } from '../models/azure-user';
import { Observable } from 'rxjs';

@Pipe({
  name: 'azureUser',
})
export class AzureUserPipe implements PipeTransform {
  constructor(private graphApi: GraphApiService) {}

  transform(id: string): Observable<AzureUser> {
    return this.graphApi.getUsersAndAppsById(id);
  }
}
