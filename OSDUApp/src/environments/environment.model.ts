interface AppSettings {
  appInsights: {
    instrumentationKey: string;
  };
  common: {
    entitlement_host: string;
    legal_host: string;
    storage_host: string;
    search_host: string;
    workflow_host: string;
    eds_workflow_host: string;
    schema_host: string;
  };
  eds: {
    acl: {
      owners: string[];
      viewers: string[];
    };
    legal: {
      legaltags: string[];
      otherRelevantDataCountries: string[];
    };
    Payload: {};
  };
  data_partition: string;
  idp: {
    auth_url: string;
    token_url: string;
    logout_uri: string;
    tenant_id: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
  };
  api_endpoints: {
    entitlement_endpoint: string;
    storage_endpoint: string;
    search_endpoint: string;
    legal_endpoint: string;
    schema_endpoint: string;
    osdu_connector_api_endpoint: string;
    file_endpoint: string;
    workflow_endpoint: string;
    graphAPI_endpoint: string;
  };
}

export interface Environment {
  production: boolean;
  name: string;
  mapboxKey: string;
  settings: AppSettings;
}
