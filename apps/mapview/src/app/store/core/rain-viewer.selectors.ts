import { createSelector } from '@ngrx/store';
import { map, pipe, startWith, switchMap, timer } from 'rxjs';

import { selectRadar } from './core.selectors';

function animationSpeedStepDuration(percentage: number): number {
  const durationMin = 10;
  const durationMax = 2000 - durationMin;
  const result =
    durationMax - (Math.log10(percentage + 1) / 2) * durationMax + durationMin;
  return result;
}

export const selectRadarUrlsTypeRadar = (tileSize: number) =>
  createSelector(selectRadar, (radar) =>
    [
      ...(radar.urls?.radar.past.map((item) => ({ ...item, past: true })) ??
        []),
      ...(radar.urls?.radar.nowcast.map((item) => ({
        ...item,
        past: false,
      })) ?? []),
    ].map((item) => ({
      ...(item as Omit<typeof item, 'path'>),
      url: `${radar.urls?.host ?? ''}${item.path}/${tileSize}/{z}/{x}/{y}/${
        radar.colorScheme
      }/${radar.smooth ? 1 : 0}_${radar.snow ? 1 : 0}.png`,
    }))
  );

export const selectRadarUrlsTypeSatellite = (tileSize: number) =>
  createSelector(
    selectRadar,
    (radar) =>
      radar.urls?.satellite.infrared
        .map((item) => ({ ...item, past: true }))
        .map((item) => ({
          ...(item as Omit<typeof item, 'path'>),
          url: `${radar.urls?.host ?? ''}${
            item.path
          }/${tileSize}/{z}/{x}/{y}/0/${radar.smooth ? 1 : 0}_0.png`,
        })) || []
  );

export const selectRadarUrlsTypeCoverage = createSelector(
  selectRadar,
  (radar) => [
    {
      opacity: radar.opacity / 100,
      url: `${radar.urls?.host ?? ''}/${radar.urls?.coverage ?? ''}`,
    },
  ]
);

export const selectRadarWithAnimation = (tileSize: number) =>
  pipe(
    map(
      (state: object) =>
        [selectRadarUrlsTypeRadar(tileSize)(state), selectRadar(state)] as const
    ),
    switchMap(([items, radar]) =>
      timer(0, animationSpeedStepDuration(radar.animationSpeed)).pipe(
        startWith(-1),
        map((interval) =>
          items.map((item, index) => ({
            ...item,
            visible:
              index === interval % items.length ||
              index === (interval - 1) % items.length,
            active: index === interval % items.length,
          }))
        ),
        switchMap((items) => radarAnimation(radar.opacity, items))
      )
    )
  );

const radarAnimation = (
  opacity: number,
  items: {
    visible: boolean;
    active: boolean;
    url: string;
    past: boolean;
    time: number;
  }[]
) =>
  timer(0, 50).pipe(
    map((animationInterval) =>
      items.map((layer) => ({
        url: layer.url,
        time: layer.time,
        past: layer.past,
        active: layer.active,
        opacity: !layer.visible
          ? 0
          : layer.active
          ? opacity / 100
          : Math.max(
              ((10 - (animationInterval ?? 0)) / 10) * opacity * 0.0075,
              0
            ),
      }))
    )
  );

export const selectSatelliteWithAnimation = (tileSize: number) =>
  pipe(
    map(
      (state: object) =>
        [
          selectRadarUrlsTypeSatellite(tileSize)(state),
          selectRadar(state),
        ] as const
    ),
    switchMap(([items, radar]) =>
      timer(0, animationSpeedStepDuration(radar.animationSpeed)).pipe(
        map((interval) =>
          items.map((item, index) => ({
            ...item,
            opacity:
              index === interval % items.length ? radar.opacity / 100 : 0,
            active: index === interval % items.length,
          }))
        )
      )
    )
  );
