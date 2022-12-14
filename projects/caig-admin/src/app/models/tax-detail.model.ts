export interface TaxDetail {
  addlamt: number;
  address: string;
  city: string;
  costShare: number;
  ctotBp: number;
  ctotLd: number;
  employeeId: number;
  employeeMc: number;
  employeeSs: number;
  fedAddlamt: number;
  fedTaxes: number;
  fedWh: number;
  firstName: string;
  lastName: string;
  mcWages: number;
  middleName: string;
  settlementCode: string;
  settlementId: number;
  spotBp: number;
  spotLd: number;
  ssWages: number;
  state: string;
  stateAddlamt: number;
  stateTaxes: number;
  stateWh: number;
  total: number;
  totalBp: number;
  totalLd: number;
  zip: string;
  paymentCount: number;
  donation: number;
  totalOwed: number;
  employerMc: number;
  employerSs: number;
  ssn?: string;
  payrollDate?: string;
}

export interface StateTaxDetail {
  settlementId: number;
  settlementCode: string;
  states: StateWithDetail[];
}

export interface StateWithDetail {
  state: string;
  totalBp: number;
  stateTaxes: number;
}
