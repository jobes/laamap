import { Component, computed, inject, linkedSignal } from '@angular/core';
import { Store } from '@ngrx/store';

import { mapFeature } from '../../../store/features/map.feature';
import { instrumentsFeature } from '../../../store/features/settings/instruments.feature';

@Component({
  selector: 'laamap-compass',
  templateUrl: './compass.component.html',
  styleUrls: ['./compass.component.scss'],
  host: {
    '[style.transform]':
      '"scale("+settings().circleRelativeSize+", 0.75) translate("+settings().circleRelativePositionFromCenter+"%, 0%)"',
  },
})
export class CompassComponent {
  private readonly store = inject(Store);
  heading = computed(() =>
    (
      '000' +
      Math.round(this.store.selectSignal(mapFeature.selectHeading)() ?? 0)
    ).slice(-3),
  );
  settings = this.store.selectSignal(instrumentsFeature.selectCompass);
  show = this.store.selectSignal(mapFeature.selectShowInstruments);

  relativeHeading = linkedSignal<number | null, number>({
    // heading that is not reset when not in 0 to 360 as animation would broke when airplane is spinning
    source: this.store.selectSignal(mapFeature.selectHeading),
    computation: (heading, previous) => {
      const prevVal = previous?.value ?? 0;
      const diff = (prevVal % 360) - (heading ?? 0);
      const deg = Math.abs(diff) > 180 ? 360 - Math.abs(diff) : Math.abs(diff); // shortest difference between current heading and previous heading on circle
      const sign =
        Math.abs(diff) > 180 ? (diff > 0 ? 1 : -1) : diff > 0 ? -1 : 1;
      return prevVal + sign * deg; // + or - ?
    },
  });
}
