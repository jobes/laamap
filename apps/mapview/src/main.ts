/* eslint-disable no-console */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// eslint-disable-next-line @typescript-eslint/naming-convention
import LogRocket from 'logrocket';
import { isDevMode } from '@angular/core';
import { isPwa } from './app/helper';

if (!isDevMode()) {
  LogRocket.init('mnkoap/laamap');

  const airPlaneName = (JSON.parse(
    localStorage.getItem('settings.general') || '{}',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  )?.airplaneName ?? 'unknown') as string;
  LogRocket.identify(airPlaneName);
  console.log('PWA installed:', isPwa());
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
