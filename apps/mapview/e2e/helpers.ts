import { Page } from '@playwright/test';

export function setGeolocation(
  page: Page,
  latitude: number,
  longitude: number,
  altitude: number,
  heading: number,
  speed: number,
) {
  page.evaluate(
    ([latitude, longitude, altitude, heading, speed]) => {
      (
        window as unknown as { globalLocationSuccessCallback: PositionCallback }
      ).globalLocationSuccessCallback({
        coords: {
          latitude,
          longitude,
          accuracy: 5,
          altitude,
          altitudeAccuracy: 5,
          heading,
          speed,
          toJSON: () => '{}',
        },
        toJSON: () => '{}',
        timestamp: Date.now(),
      });
    },
    [latitude, longitude, altitude, heading, speed],
  );
}

export async function geolocationStub(
  page: Page,
  latitude: number,
  longitude: number,
  altitude: number,
  heading: number,
  speed: number,
) {
  await page.addInitScript(() => {
    // Override the method to always return mock battery info.
    window.navigator.geolocation.watchPosition = (
      successCallback: PositionCallback,
    ) => {
      (
        window as unknown as { globalLocationSuccessCallback: PositionCallback }
      ).globalLocationSuccessCallback = successCallback;
      setTimeout(() => {
        successCallback({
          coords: {
            latitude,
            longitude,
            accuracy: 5,
            altitude,
            altitudeAccuracy: 5,
            heading,
            speed,
            toJSON: () => '{}',
          },
          toJSON: () => '{}',
          timestamp: Date.now(),
        });
      }, 10);

      return Math.floor(Math.random() * 1000);
    };
  });
}

export async function showClickPosition(page: Page) {
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

export function mockWakeLock(page: Page) {
  page.addInitScript(() => {
    (
      window.navigator as unknown as { wakeLock: { request: unknown } }
    ).wakeLock.request = async () => {
      return {
        release: async () => null,
      };
    };
  });
}

export async function navigateWithStubs(page: Page, url: string) {
  await geolocationStub(page, 47.957118, 18.186473, 150, 340, 0);
  await mockWakeLock(page);
  await page.goto(url);
  page.evaluate('document.body.style.zoom=1.5');
  await showClickPosition(page);
  await page.waitForLoadState('networkidle');
}
