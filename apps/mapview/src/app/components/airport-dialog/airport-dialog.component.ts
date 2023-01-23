import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAirport } from '../../services/open-aip/airport.interfaces';
import lgZoom from 'lightgallery/plugins/zoom';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { LightGallery } from 'lightgallery/lightgallery';
import { InitDetail } from 'lightgallery/lg-events';

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
