export interface Settlement {
  id: number;
  code: string;
  accountingRef: string;
  title: string;
  titleLong: string;
  type: keyof SettlementType;
  date: string;
  liabilityAmount: number;
  accruedInterestAmount: number;
  case: string;
  defendantName: string;
  defendantAddress1: string;
  defendantAddress2: string;
  defendantCity: string;
  defendantState: string;
  defendantZip: string;
  defendantAttorneyName: string;
  defendantAttorneyAddress1: string;
  defendantAttorneyAddress2: string;
  defendantAttorneyCity: string;
  defendantAttorneyState: string;
  defendantAttorneyZip: string;
  plaintiffName: string;
  plaintiffAddress1: string;
  plaintiffAddress2: string;
  plaintiffCity: string;
  plaintiffState: string;
  plaintiffZip: string;
  plaintiffAttorneyName: string;
  plaintiffAttorneyAddress1: string;
  plaintiffAttorneyAddress2: string;
  plaintiffAttorneyCity: string;
  plaintiffAttorneyState: string;
  plaintiffAttorneyZip: string;
  adminEmail: string;
  adminCc: string;
  adminPhone: string;
  adminFax: string;
  checkTemplate: string;
  formTemplate: string;
  taxformTemplate: string;
  paymentTimeframe: string;
  logoImage: string;
  bannerPrefix: string;
  stylePrefix: string;
  isPublic: boolean;
  isOpen: boolean;
  canDonate: boolean;
  textFrontpage: string;
  textIntro: string;
  textDonation: string;
  textOptout: string;
  textAgrmtIntro: string;
  textAgrmtContent: string;
  textAgrmtSpotBp: string;
  textAgrmtCtotBp: string;
  textAgrmtSpotLd: string;
  textAgrmtCtotLd: string;
  textEmailIntro: string;
  form1187Agency: string;
  form1187LaborOrg: string;
  form1187DuesAmount: string;
  form1187DuesFrequency: string;
  form1187LaborOrgShort: string;
  claimStartYear: number;
  claimStartQuarter: number;
  claimEndYear: number;
  claimEndQuarter: number;
  claimForm: string;
  claimRequestSupport: boolean;
  claimDeadlineDate: string;
  claimDeadlineTime: string;
  spotName: string;
  ctotName: string;
  bpName: string;
  ldName: string;
  attimpName: string;
  donationName: string;
  allowOptOut: boolean;
  allowSsExempt: boolean;
  eduesUrl: string;
  textSignup: string;
  textAttimpCalculation: string;
  textExpired: string;
}

export enum SettlementType {
  Distribution = 1,
  Claim,
  Registration,
  AdvancedClaim,
}
