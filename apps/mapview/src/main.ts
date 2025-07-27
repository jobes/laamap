import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import LogRocket from 'logrocket';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { isPwa } from './app/helper';

// eslint-disable-next-line @typescript-eslint/prefer-namespace-keyword, @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare module window {
  const google: typeof import('google-one-tap');
}

const generalSettings = JSON.parse(
  localStorage.getItem('settings.general') || '{}',
) as {
  loginToken: string;
  loginObject: { name: string; email: string };
};

const trafficSettings = JSON.parse(
  localStorage.getItem('settings.traffic') || '{}',
) as {
  regoOrLabel: string;
  deviceId: string;
};

const tokenData = JSON.parse(
  atob(generalSettings.loginToken?.split('.')?.[1] ?? '') || '{}',
) as { exp: number };

if (tokenData.exp < Date.now() / 1000) {
  // delete token if expired
  generalSettings.loginToken = '';
  generalSettings.loginObject = {
    name: '',
    email: generalSettings.loginObject.email, // leave unchanged to detect if user changed
  };
  localStorage.setItem('settings.general', JSON.stringify(generalSettings));
}

if (!isDevMode()) {
  LogRocket.init('mnkoap/laamap');
  const deviceId = trafficSettings?.deviceId;
  const airPlaneName = trafficSettings?.regoOrLabel ?? 'unknown';
  LogRocket.identify(deviceId, { name: airPlaneName });
  console.log('PWA installed:', isPwa());
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
