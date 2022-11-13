import {AttachedFile} from '../core/components/view-attached-files/view-attached-files.component';

export interface Employee {
  id: number;
  settlementId: number;
  settlementCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  spotBp: number;
  ctotBp: number;
  costBp: number;
  attimpCost: number;
  spotLd: number;
  ctotLd: number;
  costLd: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  addressIsInvalid: boolean;
  phone: string;
  phoneWork: string;
  phoneWorkExt: string;
  phoneCell: string;
  phoneIsInvalid: boolean;
  email: string;
  emailIsInvalid: string;
  emailAlt: string;
  emailAltIsInvalid: boolean;
  ssn: string | null;
  deceased: boolean;
  stale: boolean;
  donation: number;
  fedAddlamt: number;
  fedExempt: boolean;
  fedSsExempt: boolean;
  fedMcExempt: boolean;
  stateRate: number;
  stateAddlamt: number;
  addlamt: number;
  stateExempt: boolean;
  estCostShare: number;
  estEffStateRate: number;
  estStateWh: number;
  estFedWh: number;
  estEmployerMc: number;
  estEmployeeMc: number;
  estEmployerSs: number;
  estEmployeeSs: number;
  estTotal: number;
  contacted: boolean;
  unsubscribed: boolean;
  loggedin: boolean;
  confirmed: boolean;
  initials: string;
  infopending: boolean;
  paid: boolean;
  notes: string;
  created: string;
  modified: string;
  paidDate: string;
  contactedDate: string;
  assignedDate: string;
  dataComplete: boolean;
  status: string;
  bueId: string;
  bueRegion: string;
  bueLocal: string;
  bueLocation: string;
  bueStartYear: string;
  bueStartQuarter: string;
  bueEndYear: string;
  bueEndQuarter: string;
  bueCurrent: boolean;
  bueUnionMember: boolean;
  jobTitle: string;
  series: number;
  grade: number;
  step: number;
  busCode: number;
  isExempt: boolean;
  annualRate: number;
  agencyId: number;
  agencyName: string;
  unionId: number;
  unionName: string;
  contacts: EmployeeEvent[];
  events: EmployeeEvent[];
  tags: EmployeeTag[];
  surveyResponses: SurveyResponse[];
  userId: number;
  username: string;
  participationStatus: ParticipationStatus;
  payments: EmployeePayment[];
  payPlan?: string;
  supervisorName?: string;
  supervisorEmail?: string;
  password?: string | null;
  attachedFiles?: AttachedFile[];
  name: string;
}

export enum ParticipationStatus {
  NoContact = 'No Contact',
  ContactImpossible = 'Contact Impossible',
  Uncooperative = 'Uncooperative',
  NotACandidate = 'Not a Candidate',
  CannotContinue = 'Cannot Continue',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface SurveyResponse {
  id: string;
  notes: string;
  surveyId: number;
  surveyName: string;
  progressMeter: number;
  latestProgress?: string;
  pdfId?: string;
  attachedFiles?: AttachedFile[];
}

export interface EmployeeTag {
  id: string;
  name: string;
}

export interface EventChange {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface EmployeePayment {
  addlamt: number;
  costShare: number;
  ctotBp: number;
  ctotLd: number;
  date: string;
  donation: number;
  employeeMc: number;
  employeeSs: number;
  employerMc: number;
  employerSs: number;
  fedAddlamt: number;
  fedWh: number;
  id: number;
  spotBp: number;
  spotLd: number;
  stateAddlamt: number;
  stateWh: number;
  status: string;
  total: number;
}

export interface EmployeeEvent {
  id: number;
  code: number;
  message: string;
  whenCreated: string;
  description: string;
  user: string;
  changes: EventChange[];
  relatedId?: string;
}

export interface EventType {
  code: number;
  codeWord: string;
  description: string;
}

export interface EmployeeEvent {
  id: number;
  code: number;
  message: string;
  whenCreated: string;
  description: string;
  user: string;
  changes: EventChange[];
  relatedId?: string;
}

export interface GeneralEvent extends EmployeeEvent {
  employeeName: string;
  employeeId: number;
}

export interface EmployeeStatus {
  name: string;
  subStatuses: EmployeeStatus[];
}

export interface EmployeeStatusFlat extends EmployeeStatus {
  displayName?: string;
  parentStatus?: EmployeeStatus;
}
