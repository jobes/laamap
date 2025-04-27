import { Component, computed, inject, model } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import * as turf from '@turf/turf';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSONSource } from 'maplibre-gl';
import { combineLatest, from, map } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import {
  IAirport,
  IAirportFrequency,
} from '../../../services/open-aip/airport.interfaces';
import { radioActions } from '../../../store/actions/instrument.actions';
import { mapFeature } from '../../../store/features/map.feature';
import { planeInstrumentsFeature } from '../../../store/features/plane-instruments.feature';

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
export class RadioDialogComponent {
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<RadioDialogComponent>);
  private readonly mapService = inject(MapService);

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
          .sort((a, b) => this.sortFrequencies(a, b, filterText))
          .slice(0, 10),
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
        this.freqValidator,
      ],
    }),
    name: new FormControl(this.activeFreqName(), {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  setFrequency(): void {
    if (this.frequencyForm.valid) {
      this.store.dispatch(
        radioActions.setFrequency(this.frequencyForm.getRawValue()),
      );
      this.dialogRef.close();
    }
  }

  setSelectedFrequency(data: IAirportFrequency): void {
    this.store.dispatch(
      radioActions.setFrequency({
        frequency: +data.value,
        name: data.name,
      }),
    );
    this.dialogRef.close();
  }

  private sortFrequencies(
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

  private freqValidator(
    control: AbstractControl<number, number>,
  ): ValidationErrors | null {
    const value = control.value;
    if (+value === value) {
      const kHz = Math.round((value - Math.floor(value)) * 1000);
      if ((value * 1000) % 5 === 0 && (kHz + 5) % 25 !== 0) {
        return null;
      }
    }

    return {
      invalidFreq: true,
    };
  }
}
