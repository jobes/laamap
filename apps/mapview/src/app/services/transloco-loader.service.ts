import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

export const languages: { [key: string]: string } = {
  en: 'en-US',
  sk: 'sk-SK',
};

export const activeLang =
  [
    JSON.parse(localStorage.getItem('settings.general') || '{}')
      ?.language as string,
    ...(navigator?.languages?.map((lang) =>
      lang.split('-')[0]?.toLowerCase(),
    ) ?? []),
    navigator?.language?.split('-')[0]?.toLowerCase() ?? '',
  ].find((lang) => Object.keys(languages).includes(lang)) ?? 'en';

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
