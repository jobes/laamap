import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Translation,
  TranslocoLoader,
  getBrowserLang,
} from '@jsverse/transloco';

export const languages = {
  en: 'en-US',
  sk: 'sk-SK',
};

export const activeLang = (JSON.parse(
  localStorage.getItem('settings.general') || '{}',
)?.language || getBrowserLang()) as string;

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private readonly baseHref = inject(APP_BASE_HREF);

  getTranslation(lang: string) {
    return this.http.get<Translation>(
      `${this.baseHref}public/i18n/${lang}.json`,
    );
  }
}
