import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import LogRocket from 'logrocket';
import { isDevMode } from '@angular/core';

if (!isDevMode()) {
  LogRocket.init('mnkoap/laamap');

  const airPlaneName = (JSON.parse(
    localStorage.getItem('settings.general') || '{}',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  )?.airplaneName ?? 'unknown') as string;
  LogRocket.identify(airPlaneName);
}
/* eslint-disable no-console */
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
