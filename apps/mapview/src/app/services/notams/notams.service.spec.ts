import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LngLat } from 'maplibre-gl';

import { NotamsService } from './notams.service';

describe('NotamsService', () => {
  let service: NotamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(NotamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should decode notam', () => {
    const notam = `A2304/22 NOTAMN
    Q) LZBB/QFATT/IV/BO /A /000/999/4904N02014E005
    A) LZTT B) 2212290000 C) 2301112359
    E) TRIGGER NOTAM - PERM AIRAC AIP AMDT NR 241 WEF 29 DEC 2022:
    LZTT AD 2.3, AD 2-LZTT-2-1, AD 2-LZTT-2-3 - SELF BRIEFING
    TERMINALS CANCELLED
    LZTT AD 2.11 - PROVISION OF MET INFORMATION CHANGED.`;

    const decodedNotam = {
      fir: 'LZBB',
      subjectIdentification: 'FA',
      subjectCondition: 'TT',
      traffic: { checklist: false, instrument: true, visual: true },
      purpose: {
        checklist: false,
        flightOperation: true,
        immediateAttention: false,
        miscellaneous: false,
        preFlightBriefing: true,
      },
      scope: {
        aerodrome: true,
        checklist: false,
        enRoute: false,
        navigationWarning: false,
      },
      flightLevelLowerLimit: 0,
      flightLevelUpperLimit: 999,
      radius: 9260,
      position: new LngLat(20.14, 49.04),
      id: 'A2304/22',
      type: 'NOTAMN',
      linkedNotam: undefined,
      lowerLimit2: undefined,
      upperLimit2: undefined,
      schedule: undefined,
      issuer: 'LZTT',
      from: new Date('2022-12-29T00:00:00.000Z'),
      to: new Date('2023-01-11T23:59:00.000Z'),
      msg: `TRIGGER NOTAM - PERMANENT AIRAC AIP AMENDMENT NUMBER 241 EFFECTIVE FROM 29 DEC 2022:
    LZTT AD 2.3, AD 2-LZTT-2-1, AD 2-LZTT-2-3 - SELF BRIEFING
    TERMINALS CANCELLED
    LZTT AD 2.11 - PROVISION OF MET INFORMATION CHANGED.`,
      originalMsg: notam,
    };

    expect(service.decodeNotam(notam)).toEqual(decodedNotam);
  });
});
