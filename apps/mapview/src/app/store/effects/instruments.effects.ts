import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  filter,
  finalize,
  map,
  of,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

import { instrumentsEffectsActions } from '../actions/effects.actions';
import { mapFeature } from '../features/map.feature';
import { IPlaneInstruments } from '../features/plane-instruments.initial-state';
import { instrumentsFeature } from '../features/settings/instruments.feature';

@Injectable()
export class InstrumentsEffects {
  loadPlaneInstruments$ = createEffect(
    () => {
      return this.store.select(mapFeature.selectLoaded).pipe(
        filter((loaded) => loaded),
        take(1),
        switchMap(() =>
          this.store.select(instrumentsFeature.selectAirplaneInstrumentsUrl),
        ),
        filter((url) => !!url),
        switchMap((url) =>
          this.http.get<IPlaneInstruments>(`https://${url}/values`).pipe(
            tap((values) =>
              this.store.dispatch(
                instrumentsEffectsActions.planeInstrumentsValuesChanged({
                  values,
                }),
              ),
            ),
            map(() => url),
          ),
        ),
        switchMap((url) =>
          webSocket<{
            name: keyof IPlaneInstruments;
            value: string | number | null;
          }>(`wss://${url}/instruments`),
        ),
        tap((value) =>
          this.store.dispatch(
            instrumentsEffectsActions.planeInstrumentValueChanged(value),
          ),
        ),
        finalize(() =>
          this.store.dispatch(
            instrumentsEffectsActions.planeInstrumentsDisconnected(),
          ),
        ),
        retry({ delay: 1000 }),
        catchError(() => of(null)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly store: Store,
    private readonly http: HttpClient,
  ) {}
}
