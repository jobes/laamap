import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { GamepadHandlerService } from '../../services/gamepad-handler/gamepad-handler.service';

@Component({
  selector: 'laamap-center-icon',
  templateUrl: './center-icon.component.html',
  styleUrls: ['./center-icon.component.scss'],
  standalone: true,
  imports: [MatIconModule],
  host: {
    '[style.visibility]': 'gamePadService.gamePadChangingViewVisibility()',
  },
})
export class CenterIconComponent {
  readonly gamePadService = inject(GamepadHandlerService);
}
