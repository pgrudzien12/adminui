export const dashboardList = [
  {
    header: 'Project Overview',
    sideValues: [
      { name: 'Details', router: 'profile' },
      { name: 'Activity', router: 'profile' },
      { name: 'Releases', router: 'profile' },
    ],
  },
];
export const entitlementList = [
  {
    header: 'Entitlements',
    sideValues: [
      { name: 'Manage<wbr> Groups', router: 'entitlement/manage-groups' },
      {
        name: 'Manage <wbr>Group <wbr>Members',
        router: 'entitlement/manage-usersgroup',
      },
      { name: 'Manage <wbr>Members', router: 'entitlement/manage-users' },
      { name: 'Manage <wbr>Legal <wbr>Tags', router: 'legal-tags' },
    ],
  },
];
export const auditmetricList = [
  {
    header: 'Audit & Metrics',
    sideValues: [
      { name: 'Test1', router: 'profile' },
      { name: 'Test2', router: 'profile' },
    ],
  },
];
export const edsList = [
  {
    header: 'External Data Source',
    sideValues: [
      { name: 'Connected Source Registry', router: 'EDS/source' },
      { name: 'Connected Source Data Job', router: 'EDS/DataJob' },
    ],
  },
];
export const infoSecurityList = [
  {
    header: 'Information & Security',
    sideValues: [
      { name: 'Test1', router: 'profile' },
      { name: 'Test2', router: 'profile' },
    ],
  },
];
export const DataPlatformList = [
  {
    header: 'Data Platform',
    sideValues: [
      { name: 'Details', router: 'profile' },
      { name: 'Activity', router: 'profile' },
    ],
  },
];

export const groupPermissionList = [
  {
    id: '1',
    group: 'data',
    value: [
      { permid: '1', perm: 'viewers' },
      { permid: '2', perm: 'owners' },
    ],
  },
  {
    id: '2',
    group: 'service',
    value: [
      { permid: 1, perm: 'viewer' },
      { permid: 2, perm: 'editor' },
      { permid: 3, perm: 'admin' },
      { permid: 4, perm: 'owner' },
      { permid: 5, perm: 'creator' },
      { permid: 6, perm: 'user' },
    ],
  },
  {
    id: '3',
    group: 'users',
    value: [
      { permid: '1', perm: 'viewers' },
      { permid: '2', perm: 'editors' },
      { permid: '3', perm: 'admins' },
    ],
  },
];

export const groupList = groupPermissionList.map((g) => g.group);

export const roleList = [
  { id: 1, name: 'MEMBER' },
  { id: 2, name: 'OWNER' },
];
export const privilegeLevel = [
  { id: 1, name: 'viewer' },
  { id: 2, name: 'editor' },
];
export const eds_OSDUPlatformImplementation = [
  'Full OSDU Platform',
  'Wrapper/Facade',
];

//----- search help texts--------
export const search_dpd_helptxt =
  'The dropdown consists of the kind of record to query. The dropdown values are editable and searchable. Select a kind value and click on Search button to view the result.';
export const search_modifyFilter =
  'Click here to modify the search query filter. A field in the document can be searched by using <field-name>:<value>. If field is not defined, then it defaults to all queryable fields. By default, this link is disabled. It gets enabled only when data is available.';
export const search_filterOR1 =
  "To search if the Rig_Contractor field contains 'Ocean' or 'Drilling'. 'OR' is the default operator eg : 'query': 'data.Rig_Contractor:(Ocean OR Drilling)'";
export const search_filterAND1 =
  "For wildcard search where you want to search all Wellbores where WellId starts with 101, then select Field as Data.IndividualTypeProperties.WellID and then select one of the value from the second dropdown and remove the id value from the dropdown. Then select 'AND' operator, as soon as AND is selected a textbox appears where in you can add the wildcard value like 101?. eg:  'query': 'data.Data.IndividualTypeProperties.WellID:('srn:master-data/Well:' AND 101?)'";
export const search_filterOR2 =
  "eg: 'query': '(data.Data.IndividualTypeProperties.Operator: 'srn:master-data/Organisation:Statoil:') OR (data.Data.IndividualTypeProperties.ProjectTypeID: 'srn:reference-data/ProjectType:Acquisition:')'. In this case the API will return data when one of the conditions is satisfied.";
export const search_filterAND2 =
  " eg: 'query': '(data.Data.IndividualTypeProperties.Operator: 'srn:master-data/Organisation:Statoil:') AND (data.Data.IndividualTypeProperties.ProjectTypeID: 'srn:reference-data/ProjectType:Acquisition:')'. In this case the API will return data when both the field values are available. Even if one of the condition is not satisfied then the result will be empty.";
export const search_filter_limit =
  'The maximum number of results to return from the given offset. If no limit is provided, then it will return 10 items. Max number of items which can be fetched by the query is 100.';
export const search_spatailfilter =
  'The below dropdown consists of all the SpatialmLocation filters like Coordinates,HorizontalCRSID,etc which can be edited and modified to make a Spatial Location Filter.';

export const search_legal_navigate =
  'Click on Legal Tag names to view Legal details.';
//--------- legal help texts----------------
export const legat_filter =
  'To Filter specific legal tags from the given legal tags list. Select any legal tag you want to view from the multiselectable dropdown list and then click on Filter button to view all the selected legal tag details.';

//------ dashboard help texts------------
export const managegroups_members_helptext =
  'Click on Manage Groups button to manage groups. Click on Manage Members button to manage members of a group. Click on Manage Legal Tags button to manage legal tags.';
export const searchdata_helptext = 'Click here to search for data.';
export const workflow_helptext =
  'Displays list of workflow names, its details and the workflow run details for each workflow. Currently this module is unavailable for users.';
export const eds_helptext =
  'Click here to manage External Data Sources. Currently we are just populating the mockup screens.';
export const dataloading_helptext =
  'Currently this module is unavailable for the users.';

//--------- manage users--------------
export const manageUsers_search_helptext =
  'Select a Group Email and then click on Search button to view the members of that group.';

// EDS Authorization Profile
export const grantTypes = ['OAuth2', 'Bearer Token', 'API Key'];
export const scope = ['openid', 'email'];
export const OAuth_flow = ['Authorization Code', 'Client Credentials'];

export const eds_connectionsource = [
  {
    id: 'osdu:master-data--ConnectedSourceRegistryEntry:4d41bfd3-7773-65d6-0ef1-g2a5y8e55621',
    kind: 'osdu:opendes:ConnectedSourceRegistryEntry:0.2.0',
    version: '1',
    acl: {
      owners: ['admins@some-company.com'],
      viewers: ['viewers@some-company.com'],
    },
    legal: {
      legaltags: ['USA', 'CA'],
    },
    createTime: '2020-12-16T11:46:20.163Z',
    createUser: 'someuser@some-company.com',
    modifyTime: '2021-01-16T11:46:20.163Z',
    modifyUser: 'someuser@some-company.com',
    data: {
      Name: 'Octagon Energy',
      Description: 'Provides seismic data.',
      FullOSDUImplementationIndicator: false,
      AgreementIDs: [
        'osdu:master-data--Agreement:6c60ceb0-3521-57b7-9bd8-e1d7c9f66230',
        'osdu:master-data--Agreement:9b60fgb3-5032-97d9-4ca2-g3h6e4e90678',
      ],
      ServiceAccounts: [
        {
          ServiceAccountName: 'octagon_dm_seismic',
          AccountName: '9dartlzu9nvcm2j32u88o2zf4s',
          SecretManagerKey: 'octagon_dm_client_secret',
          TokenURL:
            'https://idp.octagonenergy.com/.well-known/openid-configuration',
        },
        {
          ServiceAccountName: 'octagon_dm_well_bi',
          AccountName: '4gl89e3ali12vbawefg02e',
          SecretManagerKey: 'octagon_dm_well_bi_client_secret',
          TokenURL:
            'https://idp.octagonenergy.com/.well-known/openid-configuration',
        },
      ],
    },
  },
  {
    id: 'opendes:master-data--ConnectedSourceDataJob:772ec181-a23d-4b56-aa5c-b7a73685e73e',
    kind: 'osdu:opendes:ConnectedSourceRegistryEntry:0.2.0',
    version: '1',
    acl: {
      owners: ['admins@some-company.com'],
      viewers: ['viewers@some-company.com'],
    },
    legal: {
      legaltags: ['USA', 'CA'],
    },
    createTime: '2020-12-16T11:46:20.163Z',
    createUser: 'someuser@some-company.com',
    modifyTime: '2021-01-16T11:46:20.163Z',
    modifyUser: 'someuser@some-company.com',
    data: {
      Name: 'Test Source',
      Description: 'Source created for testing.',
      FullOSDUImplementationIndicator: true,
      AgreementIDs: [
        'osdu:master-data--Agreement:6c60ceb0-3521-57b7-9bd8-e1d7c9f66230',
        'osdu:master-data--Agreement:9b60fgb3-5032-97d9-4ca2-g3h6e4e90678',
      ],
      ServiceAccounts: [
        {
          ServiceAccountName: 'test_seismic',
          AccountName: '9dartlzu9nvcm2j32u88o2zf4s',
          SecretManagerKey: 'test_dm_client_secret',
          TokenURL:
            'https://idp.octagonenergy.com/.well-known/openid-configuration',
        },
        {
          ServiceAccountName: 'octagon_dm_well_bi',
          AccountName: '4gl89e3ali12vbawefg02e',
          SecretManagerKey: 'octagon_dm_well_bi_client_secret',
          TokenURL:
            'https://idp.octagonenergy.com/.well-known/openid-configuration',
        },
      ],
    },
  },
];

export const eds_datajob = {
  id: 'osdu:master-data--ConnectedSourceDataJob:9c95egb0-0103-72b9-1fe0-h3z2x4e22312',
  kind: 'osdu:opendes:ConnectedSourceDataJob:0.2.0',
  version: '1',
  acl: {
    owners: ['admins@some-company.com'],
    viewers: ['viewers@some-company.com'],
  },
  legal: {
    legaltags: ['USA', 'CA'],
  },
  createTime: '2020-12-16T11:46:20.163Z',
  createUser: 'someuser@some-company.com',
  modifyTime: '2021-01-16T11:46:20.163Z',
  modifyUser: 'someuser@some-company.com',
  data: {
    Name: 'Gulf of Mexico seismic',
    ConnectedSourceRegistryEntryID:
      'osdu:master-data--ConnectedSourceRegistryEntry:4d41bfd3-7773-65d6-0ef1-g2a5y8e55621',
    ActiveIndicator: true,
    FetchKind: 'octagon:octagon:seismic:1.0.0',
    Filter: '',
    ScheduleUTC: '0 13 * * 1',
    Workflows: [
      {
        Tag: 'FETCH',
        Handler: 'osdu_eds_fetch_ingest_dag',
        Parameters: [
          {
            Name: 'environment',
            Value: 'prod',
          },
          {
            Name: 'some_other_input_parameter',
            Value: '123',
          },
        ],
        URL: 'http://octagonenergy.com/osdu/api/search',
        ServiceAccountName: 'octagon_dm_seismic',
        LastSuccessfulRunDateUTC: '2021-01-14T11:46:20.163Z',
      },
      {
        Tag: 'DELIVERY',
        Handler: '',
        Parameters: [],
        URL: 'http://octagonenergy.com/osdu/api/fileDMS/getFileDeliveryInstructions',
        ServiceAccountName: 'octagon_dm_seismic',
        LastSuccessfulRunDateUTC: '2021-01-14T11:46:20.163Z',
      },
    ],
  },
};
