import {InteractionType, PublicClientApplication} from '@azure/msal-browser';
import {MsalGuardConfiguration, MsalInterceptorConfiguration} from '@azure/msal-angular';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
export const msalClient = new PublicClientApplication({
  auth: {
    clientId: 'd6a21459-7a95-4e6a-a26f-d437a0a952f8',
    authority: 'https://login.microsoftonline.com/a9cd138e-0dc6-477f-842a-305b2b42489a',
    redirectUri: window.location.origin, // @TODO - is this correct?
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: isIE,
  }
});
export const guardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Popup,
};
export const interceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Popup,
  protectedResourceMap: new Map()
};
