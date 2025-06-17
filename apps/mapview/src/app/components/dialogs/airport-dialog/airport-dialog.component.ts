import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LightgalleryModule } from 'lightgallery/angular';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import { Subject, filter, takeUntil } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { DimensionPipe } from '../../../pipes/dimension/dimension.pipe';
import { IAirport } from '../../../services/open-aip/airport.interfaces';

@Component({
  templateUrl: './airport-dialog.component.html',
  styleUrls: ['./airport-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoModule,
    MatDialogModule,
    MatExpansionModule,
    LightgalleryModule,
    MatButtonModule,
    AltitudePipe,
    DimensionPipe,
  ],
})
export class AirportDialogComponent implements OnDestroy {
  data = inject<IAirport>(MAT_DIALOG_DATA);
  private dialogRef =
    inject<MatDialogRef<AirportDialogComponent>>(MatDialogRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  private readonly destroyer$ = new Subject();
  gallerySettings = {
    counter: false,
    plugins: [lgZoom],
    licenseKey: environment.galleryLicenseKey,
  };
  private lightGallery?: LightGallery;
  openAipKey = environment.openAipKey;

  constructor() {
    this.route.fragment
      .pipe(
        filter((fragment) => !fragment),
        takeUntil(this.destroyer$),
      )
      .subscribe({
        next: () => {
          this.lightGallery?.closeGallery();
        },
      });
  }

  galleryOpened(): () => void {
    return () => {
      this.dialogRef.disableClose = true;
      void this.router.navigate([], {
        fragment: `gallery_${Math.random()}`,
      });
    };
  }

  galleryClosed(): () => void {
    return () => {
      if (this.route.snapshot.fragment?.startsWith('gallery_')) {
        this.location.back();
      }
      this.dialogRef.disableClose = false;
    };
  }

  onInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  };

  ngOnDestroy(): void {
    this.destroyer$.next(null);
    this.destroyer$.complete();
  }
}
