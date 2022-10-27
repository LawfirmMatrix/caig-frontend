import {createReducer, on} from '@ngrx/store';
import {EnumsActions} from '../actions/action-types';
import {EmployeeStatus, EventType, ParticipationStatus} from '../../../models/employee.model';
import {Observable} from 'rxjs';

export interface EnumsState {
  employeeStatuses: EmployeeStatus[] | undefined;
  bueRegions: string[] | undefined;
  bueLocals: string[] | undefined;
  bueLocations: string[] | undefined;
  settlementStates: string[] | undefined;
  participationStatuses: ParticipationStatus[] | undefined;
  eventTypes: EventType[] | undefined;
}

export interface EnumDataService {
  employeeStatuses: () => Observable<EmployeeStatus[]>;
  bueRegions: () => Observable<string[]>;
  bueLocals: () => Observable<string[]>;
  bueLocations: () => Observable<string[]>;
  settlementStates: () => Observable<string[]>;
  participationStatuses: () => Observable<ParticipationStatus[]>;
  eventTypes: () => Observable<EventType[]>;
}

export const initialEnumsState: EnumsState = {
  employeeStatuses: undefined,
  bueRegions: undefined,
  bueLocals: undefined,
  bueLocations: undefined,
  settlementStates: undefined,
  participationStatuses: undefined,
  eventTypes: undefined,
};

export const enumsReducer = createReducer(
  initialEnumsState,
  on(EnumsActions.loadEnums, (state, action) => ({ ...state, [action.enumType]: undefined })),
  on(EnumsActions.enumsLoaded, (state, action) => ({ ...state, [action.enumType]: action.payload })),
);
