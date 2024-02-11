import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Translation,
  TranslocoLoader,
  getBrowserLang,
} from '@ngneat/transloco';

export const languages = {
  en: 'en-US',
  sk: 'sk-SK',
};

export const activeLang = (JSON.parse(
  localStorage.getItem('settings.general') || '{}',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
)?.language || getBrowserLang()) as string;

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(
    private http: HttpClient,
    @Inject(APP_BASE_HREF) private readonly baseHref: string,
  ) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(
      `${this.baseHref}assets/i18n/${lang}.json`,
    );
  }
}
