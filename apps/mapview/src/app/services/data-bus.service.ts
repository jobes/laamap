import { Injectable, OnDestroy } from '@angular/core';
import { Position } from '@maplibre/ngx-maplibre-gl';
import { Store } from '@ngrx/store';
import { Map } from 'maplibre-gl';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { selectNavigationMinActivationSpeedKpH } from '../store/core/core.selectors';

@Injectable({
  providedIn: 'root',
})
export class DataBusService implements OnDestroy {
  geolocation$: Observable<Position | null>;
  mapMoved$: Observable<null>;
  navigationMinSpeedHit$: Observable<boolean>;

  private geolocationSubj$ = new BehaviorSubject(null as Position | null);
  private mapMovedSubj$ = new BehaviorSubject(null);
  private map?: Map;

  constructor(private readonly store: Store) {
    this.geolocation$ = this.geolocationSubj$.asObservable();
    this.mapMoved$ = this.mapMovedSubj$.asObservable();
    this.navigationMinSpeedHit$ = combineLatest([
      this.store.select(selectNavigationMinActivationSpeedKpH),
      this.geolocation$,
    ]).pipe(
      map(
        ([minSpeed, geolocation]) =>
          // minSpeed in KpH, coord speed in MpS
          minSpeed <= (geolocation?.coords.speed ?? 0) * 3.6
      )
    );
  }

  setGeoLocation(value: Position | null): void {
    this.geolocationSubj$.next(value);
  }

  setMap(map: Map): void {
    if (this.map) {
      this.map.off('move', this.moveListener);
    }
    this.map = map;
    this.map?.on('move', this.moveListener);
  }

  getMap(): Map | undefined {
    return this.map;
  }

  ngOnDestroy(): void {
    this.map?.off('move', this.moveListener);
  }

  private moveListener = () => {
    this.mapMovedSubj$.next(null);
  };
}
