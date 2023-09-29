import { provideMockStore } from '@ngrx/store/testing';
import { of, repeat } from 'rxjs';

import { GamepadHandlerService } from '../../../services/gamepad-handler/gamepad-handler.service';
import {
  GamePadShortCutName,
  IGamePadActions,
} from '../../../services/gamepad-handler/gamepad-handler.types';
import { gamePadSettingsActions } from '../../../store/actions/settings.actions';
import { gamepadInitialState } from '../../../store/features/settings/gamepad.feature';
import { GamepadSettingsComponent } from './gamepad-settings.component';

describe(GamepadSettingsComponent.name, () => {
  it('test dispatch when focusing a field and simulate click on gamepad', () => {
    cy.mount(GamepadSettingsComponent, {
      providers: [
        provideMockStore({
          initialState: { 'settings.gamepad': gamepadInitialState },
        }),
        {
          provide: GamepadHandlerService,
          useValue: {
            settingMode: false,
            gamePadActive$: of([
              {
                index: 0,
                buttons: {
                  [10]: 1,
                },
              },
            ]).pipe(repeat({ delay: 200 })),
          },
        },
      ],
    }).then((wrapper) => {
      cy.spy(wrapper.component['store'], 'dispatch').as('storeDispatch');
    });

    cy.get('html').invoke('attr', 'style', 'overflow: auto');
    cy.get(
      '#mat-expansion-panel-header-0 > .mat-content > .mat-expansion-panel-header-title'
    ).click();
    cy.get(
      '#mat-expansion-panel-header-6 > .mat-content > .mat-expansion-panel-header-title'
    ).click();
    cy.get('#mat-input-26').should('have.value', 0); // init value
    cy.get('#mat-input-26').click();
    cy.get('#mat-input-26').should('have.value', 10); // value from gamepad

    const dispatchValue = Object.entries(gamepadInitialState.shortCuts).reduce(
      (res, val) => ({
        ...res,
        [val[0]]: {
          index: val[1].index,
          axes: val[1].axes,
          button: val[1].button,
          coefficient: val[1].coefficient,
          axesThreshold: val[1].axesThreshold,
        },
      }),
      {} as { [key in GamePadShortCutName]: IGamePadActions }
    );
    dispatchValue.mapClick.button = 10;

    cy.get('@storeDispatch').should(
      'have.been.calledWith',
      gamePadSettingsActions.setShortCuts({ value: dispatchValue })
    );
  });
});
