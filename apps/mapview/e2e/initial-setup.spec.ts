import { expect, test } from '@playwright/test';

import mockData from './data.json';
import { navigateWithStubs, setGeolocation } from './helpers';

test.use({
  viewport: { width: 1920, height: 1080 },
  permissions: ['geolocation'],
});

test('has title', async ({ page }) => {
  await navigateWithStubs(page, '/');

  await expect(page.locator('body')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.locator('.maplibregl-ctrl-geolocate').click();

  let i = 0;
  for (const coord of mockData) {
    i++;
    setGeolocation(
      page,
      coord.latitude,
      coord.longitude,
      coord.altitude,
      coord.heading,
      coord.speed,
    );
    await page.waitForTimeout(1000);
    if (i > 10) break;
  }
});
