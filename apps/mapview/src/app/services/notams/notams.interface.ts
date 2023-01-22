import { LngLat } from 'maplibre-gl';

export interface INotamResponse {
  notamList: Array<{
    facilityDesignator: string;
    notamNumber: string;
    featureName: string;
    issueDate: string;
    startDate: string;
    endDate: string;
    source: string;
    sourceType: string;
    icaoMessage: string;
    traditionalMessage: string;
    plainLanguageMessage: string;
    traditionalMessageFrom4thWord: string;
    icaoId: string;
    accountId: string;
    airportName: string;
    procedure: boolean;
    userID: number;
    transactionID: number;
    cancelledOrExpired: boolean;
    digitalTppLink: boolean;
    status: string;
    contractionsExpandedForPlainLanguage: boolean;
    keyword: string;
    snowtam: boolean;
    digitallyTransformed: boolean;
    messageDisplayed: string;
    hasHistory: boolean;
    moreThan300Chars: boolean;
    showingFullText: boolean;
    locID: number;
    defaultIcao: boolean;
    crossoverTransactionID: number;
    crossoverAccountID: string;
    requestID: number;
    geometry?: string;
    mapPointer?: string;
  }>;
  startRecordCount: number;
  endRecordCount: number;
  totalNotamCount: number;
  filteredResultCount: number;
  criteriaCaption: string;
  searchDateTime: string;
  linkedLocationCaption: string;
  error: string;
  countsByType: Array<{
    name: string;
    value: number;
  }>;
  requestID: number;
}

export interface INotamParts {
  id: string;
  q: string;
  a: string;
  b: string;
  c: string;
  d?: string;
  e: string;
  f?: string;
  g?: string;
}

export interface INotamQParsed {
  fir: string;
  traffic: { instrument: boolean; visual: boolean; checklist: boolean };
  purpose: {
    immediateAttention: boolean;
    preFlightBriefing: boolean;
    flightOperation: boolean;
    miscellaneous: boolean;
    checklist: boolean;
  };
  scope: {
    aerodrome: boolean;
    enRoute: boolean;
    navigationWarning: boolean;
    checklist: boolean;
  };
  flightLevelLowerLimit: number;
  flightLevelUpperLimit: number;
  radius: number;
  position: LngLat;
  subjectIdentification: string;
  subjectCondition: string;
}

export interface INotamDecoded extends INotamQParsed {
  id: string;
  type: string;
  linkedNotam?: string;
  issuer: string;
  from: Date;
  to: Date;
  schedule?: string;
  msg: string;
  originalMsg: string;
  lowerLimit2?: string;
  upperLimit2?: string;
}

export type INotamDecodedResponse = Omit<INotamResponse, 'notamList'> & {
  notamList: Array<
    INotamResponse['notamList']['0'] & { decoded: INotamDecoded }
  >;
};
