import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LightgalleryModule } from 'lightgallery/angular';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import { filter } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { AltitudePipe } from '../../../pipes/altitude/altitude.pipe';
import { DimensionPipe } from '../../../pipes/dimension/dimension.pipe';
import { IAirport } from '../../../services/open-aip/airport.interfaces';

@UntilDestroy()
@Component({
  templateUrl: './airport-dialog.component.html',
  styleUrls: ['./airport-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
export class AirportDialogComponent {
  gallerySettings = {
    counter: false,
    plugins: [lgZoom],
    licenseKey: environment.galleryLicenseKey,
  };
  private lightGallery?: LightGallery;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAirport,
    private dialogRef: MatDialogRef<AirportDialogComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    route.fragment
      .pipe(
        filter((fragment) => !fragment),
        untilDestroyed(this),
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
}
