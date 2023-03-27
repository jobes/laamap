import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { MapHelperFunctionsService } from '../../services/map-helper-functions/map-helper-functions.service';
import { MapService } from '../../services/map/map.service';
import { selectLineDefinition } from '../../store/advanced-selectors';

@Component({
  selector: 'laamap-on-map-direction-line',
  templateUrl: './on-map-direction-line.component.html',
  styleUrls: ['./on-map-direction-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnMapDirectionLineComponent {
  ds$ = this.store.select(
    selectLineDefinition(this.mapService, this.mapHelperFunctionsService)
  );

  constructor(
    private readonly store: Store,
    private readonly mapHelperFunctionsService: MapHelperFunctionsService,
    private readonly mapService: MapService
  ) {}

  trackBy(index: number, value: number) {
    return value;
  }
}
