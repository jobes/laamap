import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

import { instrumentsEffectsActions } from '../actions/effects.actions';
import { radioActions } from '../actions/instrument.actions';
import { mapFeature } from '../features/map.feature';
import { IPlaneInstruments } from '../features/plane-instruments.initial-state';
import { instrumentsFeature } from '../features/settings/instruments.feature';

@Injectable()
export class InstrumentsEffects {
  private readonly store = inject(Store);
  private readonly http = inject(HttpClient);
  private readonly actions$ = inject(Actions);
  private instrumentWebSocket = null as null | WebSocketSubject<{
    name: keyof IPlaneInstruments;
    value: string | number | null;
  }>;

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
        switchMap((url) => {
          this.instrumentWebSocket = webSocket(`wss://${url}/instruments`);
          return this.instrumentWebSocket;
        }),
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

  setRadioFrequency$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(radioActions.setFrequency),
        tap(({ frequency, name }) =>
          this.instrumentWebSocket?.next({
            name: 'radioActiveFreq',
            value: `${frequency}:${name}`,
          }),
        ),
      );
    },
    { dispatch: false },
  );
}
