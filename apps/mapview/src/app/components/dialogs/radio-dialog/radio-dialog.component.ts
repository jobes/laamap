import { Component, OnInit, computed, inject, model } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import * as turf from '@turf/turf';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { combineLatest, from, map } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import {
  IAirport,
  IAirportFrequency,
} from '../../../services/open-aip/airport.interfaces';
import { IAirspace } from '../../../services/open-aip/airspaces.interfaces';
import { radioFrequencyValidator } from '../../../services/validators/radio.validators';
import { radioActions } from '../../../store/actions/instrument.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-radio-dialog',
  templateUrl: './radio-dialog.component.html',
  styleUrls: ['./radio-dialog.component.scss'],
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class RadioDialogComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<RadioDialogComponent>);
  private readonly mapService = inject(MapService);
  private readonly fromGamepad = inject(MAT_DIALOG_DATA)?.fromGamepad;

  activeFreq = computed(
    () =>
      this.store.selectSignal(
        planeInstrumentsFeature.selectRadioActiveFreq,
      )() || 121.5,
  );
  activeFreqName = computed(
    () =>
      this.store.selectSignal(
        planeInstrumentsFeature.selectRadioActiveFreqName,
      )() || 'Emergency',
  );
  filterText = model<string>('');

  private location = this.store.selectSignal(mapFeature.selectGeoLocation);

  airports = toSignal(
    combineLatest({
      filterText: toObservable(this.filterText),
      airports: from(
        (
          this.mapService.instance.getSource('airportSource') as GeoJSONSource
        ).getData() as Promise<FeatureCollection<Point, IAirport>>,
      ),
    }).pipe(
      map(({ airports, filterText }) =>
        airports.features
          .filter((feature) => feature.properties?.frequencies?.length > 0)
          .map((feature) => {
            const icao = feature.properties.icaoCode
              ? ` (${feature.properties.icaoCode})`
              : '';
            return {
              name: `${feature.properties.name}${icao}`,
              frequencies: feature.properties.frequencies,
              location: feature.geometry,
            };
          })
          .filter(
            (airport) =>
              airport.name.toUpperCase().includes(filterText.toUpperCase()) ||
              airport.frequencies.some((frequency) =>
                frequency.name
                  ?.toUpperCase()
                  .includes(filterText.toUpperCase()),
              ),
          )
          .sort((a, b) => this.sortAirportFrequencies(a, b, filterText))
          .slice(0, 5),
      ),
    ),
  );

  airspaces = toSignal(
    combineLatest({
      filterText: toObservable(this.filterText),
      airspaces: from(
        (
          this.mapService.instance.getSource('airspacesSource') as GeoJSONSource
        ).getData() as Promise<FeatureCollection<Polygon, IAirspace>>,
      ),
    }).pipe(
      map(({ airspaces, filterText }) =>
        airspaces.features
          .filter((feature) => feature.properties?.frequencies?.length > 0)
          .filter((airspaces) =>
            airspaces.properties.name
              .toUpperCase()
              .includes(filterText.toUpperCase()),
          )
          .sort((a, b) => this.sortAirspaceFrequencies(a, b, filterText))
          .slice(0, 5),
      ),
    ),
  );

  favorites = toSignal(
    combineLatest({
      filterText: toObservable(this.filterText),
      radio: this.store.select(instrumentsFeature.selectRadio),
    }).pipe(
      map(({ filterText, radio }) =>
        radio.favorites
          .filter((fav) =>
            fav.name.toUpperCase().includes(filterText.toUpperCase()),
          )
          .slice(0, 5),
      ),
    ),
  );

  frequencyForm = new FormGroup({
    frequency: new FormControl(this.activeFreq(), {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(118),
        Validators.max(136.99),
        radioFrequencyValidator,
      ],
    }),
    name: new FormControl(this.activeFreqName(), {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  ngOnInit(): void {
    if (this.fromGamepad) {
      // focus first frequency in list, has to wait until dialog is fully opened, animation ended
      setTimeout(() => {
        const focusElm: HTMLInputElement | null =
          document.querySelector('[matListItemLine]');
        focusElm?.focus();
      }, 250);
    }
  }

  setFrequency(): void {
    if (this.frequencyForm.valid) {
      this.store.dispatch(
        radioActions.setFrequency(this.frequencyForm.getRawValue()),
      );
      this.dialogRef.close();
    }
  }

  setSelectedAirportFrequency(data: IAirportFrequency): void {
    this.store.dispatch(
      radioActions.setFrequency({
        frequency: +data.value,
        name: data.name,
      }),
    );
    this.dialogRef.close();
  }

  setSelectedFavoriteFrequency(data: {
    frequency: number;
    name: string;
  }): void {
    this.store.dispatch(
      radioActions.setFrequency({
        frequency: data.frequency,
        name: data.name,
      }),
    );
    this.dialogRef.close();
  }

  setSelectedAirspaceFrequency(
    name: string,
    data: { value: string; unit: 2; primary: boolean },
  ): void {
    this.store.dispatch(
      radioActions.setFrequency({
        frequency: +data.value,
        name: name,
      }),
    );
    this.dialogRef.close();
  }

  private sortAirportFrequencies(
    a: {
      name: string;
      frequencies: IAirportFrequency[];
      location: Point;
    },
    b: {
      name: string;
      frequencies: IAirportFrequency[];
      location: Point;
    },
    filterText: string,
  ): number {
    const gpsLocation = this.location();
    if (gpsLocation && !filterText) {
      // sort by distance
      const pointA = turf.point(a.location.coordinates);
      const pointB = turf.point(b.location.coordinates);
      const pointCurrent = turf.point([
        gpsLocation.coords.longitude,
        gpsLocation.coords.latitude,
      ]);
      const distanceA = turf.distance(pointCurrent, pointA);
      const distanceB = turf.distance(pointCurrent, pointB);
      if (distanceA < distanceB) {
        return -1;
      }
      if (distanceA > distanceB) {
        return 1;
      }
      return 0;
    }

    //sort alphabetically
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  private sortAirspaceFrequencies(
    a: Feature<Polygon, IAirspace>,
    b: Feature<Polygon, IAirspace>,
    filterText: string,
  ): number {
    const gpsLocation = this.location();
    if (gpsLocation && !filterText) {
      // sort by distance
      const pointCurrent = turf.point([
        gpsLocation.coords.longitude,
        gpsLocation.coords.latitude,
      ]);
      const distanceA = turf.pointToPolygonDistance(pointCurrent, a.geometry);
      const distanceB = turf.pointToPolygonDistance(pointCurrent, b.geometry);
      if (distanceA < distanceB) {
        return -1;
      }
      if (distanceA > distanceB) {
        return 1;
      }
      return 0;
    }

    //sort alphabetically
    const nameA = a.properties.name.toUpperCase();
    const nameB = b.properties.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
}
