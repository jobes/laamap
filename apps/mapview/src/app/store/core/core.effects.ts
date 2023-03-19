/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { tap } from 'rxjs';

import { HeadingService } from '../../services/heading/heading.service';

@Injectable()
export class CoreEffects {
  heading$ = createEffect(
    () => {
      return this.headingService.heading$.pipe(
        tap((heading) =>
          document.documentElement.style.setProperty('--heading', `${heading}`)
        )
      );
    },
    { dispatch: false }
  );

  constructor(private readonly headingService: HeadingService) {}
}
