import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InitDetail } from 'lightgallery/lg-events';
import { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import { filter } from 'rxjs';

import { IAirport } from '../../services/open-aip/airport.interfaces';

@Component({
  templateUrl: './airport-dialog.component.html',
  styleUrls: ['./airport-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportDialogComponent {
  gallerySettings = {
    counter: false,
    plugins: [lgZoom],
  };
  private lightGallery?: LightGallery;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAirport,
    private dialogRef: MatDialogRef<AirportDialogComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    route.fragment.pipe(filter((fragment) => !fragment)).subscribe(() => {
      this.lightGallery?.closeGallery();
    });
  }

  galleryOpened(): () => void {
    return () => {
      this.dialogRef.disableClose = true;
      this.router.navigate([], {
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
