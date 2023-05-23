import json from '../config/config.json';
import { Environment } from './environment.model';

export const environment: Environment = json as Environment;

export const scopeProctedURLs: () => any = () => {
  const splittedScopes = environment.settings.idp.scope.split(' ');

  const osdu_api = Object.values(environment.settings.api_endpoints).map(
    (url) => [url, splittedScopes]
  );

  const graphAPI = [
    environment.settings.api_endpoints.graphAPI_endpoint,
    ['User.Read', 'User.ReadBasic.All', 'Application.Read.All'],
  ];

  return [...osdu_api, graphAPI];
};
