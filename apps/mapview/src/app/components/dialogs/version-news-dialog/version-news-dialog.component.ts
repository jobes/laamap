import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import markdownit from 'markdown-it';

@Component({
  imports: [TranslocoModule, MatDialogModule, MatButtonModule],
  templateUrl: './version-news-dialog.component.html',
  styleUrls: ['./version-news-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionNewsDialogComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private data = inject(MAT_DIALOG_DATA) as { [language: string]: string }[];
  htmlLocalizedMsgs = signal<string[]>([]);

  ngOnInit(): void {
    const md = markdownit();
    this.htmlLocalizedMsgs.set(
      this.data
        .map((langData) => langData[this.transloco.getActiveLang()])
        .map((markDownMessage) => md.render(markDownMessage))
        .reverse(),
    );
  }

  restart(): void {
    window.location.reload();
  }
}
