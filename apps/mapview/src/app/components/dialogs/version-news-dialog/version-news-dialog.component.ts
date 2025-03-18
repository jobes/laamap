import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NgxMarkdownItModule } from 'ngx-markdown-it';

@Component({
  imports: [
    TranslocoModule,
    MatDialogModule,
    NgxMarkdownItModule,
    MatButtonModule,
  ],
  templateUrl: './version-news-dialog.component.html',
  styleUrls: ['./version-news-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionNewsDialogComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private data = inject(MAT_DIALOG_DATA) as { [language: string]: string }[];
  markDownLocalizedMessages: string[] = [];

  ngOnInit(): void {
    this.markDownLocalizedMessages = this.data
      .map((langData) => langData[this.transloco.getActiveLang()])
      .reverse();
  }

  restart(): void {
    window.location.reload();
  }
}
