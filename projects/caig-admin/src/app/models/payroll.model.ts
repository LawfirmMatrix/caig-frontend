export interface Payroll {
  id: number;
  memo: string;
  status: PayrollStatus;
  date: string;
  created: string;
  submitted: string;
  paymentCount: number;
  totalNet: number;
  payments: Payment[];
}

export interface Payment {
  spotBp: number;
  ctotBp: number;
  spotLd: number;
  ctotLd: number;
  costShare: number;
  fedWh: number;
  fedAddlamt: number;
  employerSs: number;
  employeeSs: number;
  employerMc: number;
  employeeMc: number;
  effStateRate: number;
  stateWh: number;
  stateAddlamt: number;
  addlamt: number;
  donation: number;
  total: number;
  status: PayrollStatus;
  date: string;
  employeeId: number;
  employeeFirstName: string;
  employeeMiddleName: string;
  employeeLastName: string;
  employeeAddress: string;
  employeePhone: string;
  employeeTotal: number;
  settlementId: number;
  settlementCode: string;
  amountPaid: number;
  amountPending: number;
  message: string;
  okToPay: boolean;
}

export enum PayrollStatus {
  Pending = 'Pending',
  Processed = 'Processed',
}
