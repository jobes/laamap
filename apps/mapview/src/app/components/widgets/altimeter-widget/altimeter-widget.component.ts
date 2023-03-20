import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';

import {
  EHeightUnit,
  EReferenceDatum,
} from '../../../services/open-aip/airport.interfaces';
import { mapFeature } from '../../../store/map/map.feature';
import { instrumentsSettings } from '../../../store/settings/instruments/instruments.actions';
import { instrumentsFeature } from '../../../store/settings/instruments/instruments.feature';

const selectHeighSettings = createSelector(
  mapFeature.selectGeoLocation,
  instrumentsFeature.selectAltimeter,
  (geolocation, settings) => ({
    bgColor: settings.bgColor,
    textColor: settings.textColor,
    altitudeMeters: geolocation?.coords.altitude,
    altitudeObject: {
      value: geolocation?.coords.altitude ?? 0,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.msl,
    },
    gndHeightObject: {
      value: (geolocation?.coords.altitude ?? 0) - settings.gndAltitude,
      unit: EHeightUnit.meter,
      referenceDatum: EReferenceDatum.gnd,
    },
    types: settings.show,
    position: settings.position,
    hasAltitude: !!geolocation,
  })
);

@Component({
  selector: 'laamap-altimeter-widget',
  templateUrl: './altimeter-widget.component.html',
  styleUrls: ['./altimeter-widget.component.scss'],
})
export class AltimeterWidgetComponent {
  eHeightUnit = EHeightUnit;
  heighWithSettings$ = this.store.select(selectHeighSettings);

  private dragging = false;
  constructor(private readonly store: Store) {}

  dragStarted(): void {
    this.dragging = true;
  }
  dragEnded(
    originalPosition: { x: number; y: number },
    event: CdkDragEnd
  ): void {
    setTimeout(() => {
      this.dragging = false;
    }, 50);

    this.store.dispatch(
      instrumentsSettings.altimeterWidgetPositionMoved({
        position: {
          x: originalPosition.x + event.distance.x,
          y: originalPosition.y + event.distance.y,
        },
      })
    );
  }

  resetGnd(gndAltitude: number): void {
    if (this.dragging) {
      return;
    }

    this.store.dispatch(
      instrumentsSettings.altimeterManualGndAltitudeChanged({
        gndAltitude,
      })
    );
  }

  typeTrack(index: number, type: string): string {
    return type;
  }
}
