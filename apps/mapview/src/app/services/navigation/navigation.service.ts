import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';

import { selectNavigationMinActivationSpeedKpH } from '../../store/core/core.selectors';
import { MapService } from '../map/map.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigationMinSpeedHit$ = combineLatest([
    this.store.select(selectNavigationMinActivationSpeedKpH),
    this.mapService.geolocation$,
  ]).pipe(
    map(
      ([minSpeed, geolocation]) =>
        // minSpeed in KpH, coord speed in MpS
        minSpeed <= (geolocation?.coords.speed ?? 0) * 3.6
    )
  );
  constructor(
    private readonly store: Store,
    private readonly mapService: MapService
  ) {}
}
