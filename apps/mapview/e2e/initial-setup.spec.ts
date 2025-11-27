import { Page, expect, test } from '@playwright/test';

test.use({
  viewport: { width: 1920, height: 1080 },
  geolocation: { longitude: 18.186473, latitude: 47.957118 },
  permissions: ['geolocation'],
});

test('has title', async ({ page }) => {
  // eslint-disable-next-line playwright/no-networkidle
  await page.goto('/', { waitUntil: 'networkidle' });
  await showClickPosition(page);

  await expect(await page.locator('body')).toBeVisible();
  await page.locator('.maplibregl-ctrl-geolocate').click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'settings' }).click();
  await page.waitForTimeout(3000);
});

async function showClickPosition(page: Page) {
  await page.evaluate(() => {
    const circle = document.createElement('div');
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.backgroundColor = 'rgba(230, 154, 41, 0.9)';
    circle.style.borderRadius = '50%';
    circle.style.position = 'absolute';
    circle.style.zIndex = '10000';
    circle.style.pointerEvents = 'none';

    document.body.appendChild(circle);
    document.body.addEventListener('click', (e) => {
      circle.style.top = `${e.clientY - 10}px`;
      circle.style.left = `${e.clientX - 10}px`;
      circle.animate(
        [
          { transform: 'scale(4)', opacity: 1 },
          { transform: 'scale(0)', opacity: 0 },
        ],
        {
          duration: 2500,
          easing: 'ease-out',
          fill: 'forwards',
        },
      );
    });
  });
}
