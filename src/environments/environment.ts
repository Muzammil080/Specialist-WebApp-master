// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,

    // authBaseUrl: 'https://prd.veemed.com/identity/connect/token',
    // authRevokeUrl: 'https://prd.veemed.com/identity/connect/revocation',
    // apiBaseUrl: 'https://prd.veemed.com/platform/api/',
    // hubConnection: 'https://prd.veemed.com/platform/',

    // authBaseUrl: 'https://dev-aws.veemed.com/identity/connect/token',
    // authRevokeUrl: 'https://dev-aws.veemed.com/identity/connect/revocation',
    // apiBaseUrl: 'http://localhost:51999/api/',
    // hubConnection: 'http://localhost:51999/',

    authBaseUrl: 'https://dev-aws.veemed.com/identity/connect/token',
    authRevokeUrl: 'https://dev-aws.veemed.com/identity/connect/revocation',
    apiBaseUrl: 'https://dev-aws.veemed.com/platform/api/',
    hubConnection: 'https://dev-aws.veemed.com/platform/',


    // authBaseUrl: 'https://prd.veemed.io/identity/connect/token',
    // authRevokeUrl: 'https://prd.veemed.io/identity/connect/revocation',
    // apiBaseUrl: 'https://prd.veemed.io/platform/api/',
    // hubConnection: 'https://prd.veemed.io/platform/',

    // authBaseUrl: 'https://stage-aws.veemed.com/identity/connect/token',
    // authRevokeUrl: 'https://stage-aws.veemed.com/identity/connect/revocation',
    // apiBaseUrl: 'https://stage-aws.veemed.com/platform/api/',
    // hubConnection: 'https://stage-aws.veemed.com/platform/',

    // authBaseUrl: 'https://qa-aws.veemed.com/identity/connect/token',
    // authRevokeUrl: 'https://qa-aws.veemed.com/identity/connect/revocation',
    // apiBaseUrl: 'https://qa-aws.veemed.com/platform/api/',
    // hubConnection: 'https://qa-aws.veemed.com/platform/',

    baseURL: '/',
    endpointsUrl : '/#/endpoints',

    pacsBaseUrl: 'https://pacsprd.veemed.com',
    // pacsUserName: 'Veemed',
    // pacsUserPassword: 'Veemed',
    device: 'web',
    grant_type: 'password',
    client_id: 'ro.web.client',
    client_secret: '36309193-9701-4f9a-9dc0-d9c82b879505'

    // scope:'API'
};
