import {createFeatureSelector, createSelector} from '@ngrx/store';
import {EnumsState} from '../reducers';
import {EmployeeStatusFlat} from '../../../models/employee.model';

export const selectEnumsState = createFeatureSelector<EnumsState>('enums');

export const participationStatuses = createSelector(
  selectEnumsState,
  state => state.participationStatuses,
);

export const employeeStatuses = createSelector(
  selectEnumsState,
  state => state.employeeStatuses,
);

export const employeeStatusesFlat = createSelector(
  employeeStatuses,
  statuses => {
    if (!statuses) {
      return statuses;
    }
    const flattenedStatuses: EmployeeStatusFlat[] = [];
    const flattenStatuses = (es: EmployeeStatusFlat[], level = 0, parent?: EmployeeStatusFlat) => {
      es.forEach((status) => {
        flattenedStatuses.push({
          ...status,
          parentStatus: parent,
          displayName: '- '.repeat(level) + status.name,
        });
        if (status.subStatuses.length) {
          flattenStatuses(status.subStatuses, level + 1, status);
        }
      })
    };
    flattenStatuses(statuses);
    return flattenedStatuses;
  }
)

export const settlementStates = createSelector(
  selectEnumsState,
  state => state.settlementStates,
);

export const bueLocations = createSelector(
  selectEnumsState,
  state => state.bueLocations,
);

export const bueLocals = createSelector(
  selectEnumsState,
  state => state.bueLocals,
);

export const bueRegions = createSelector(
  selectEnumsState,
  state => state.bueRegions,
);

export const eventTypes = createSelector(
  selectEnumsState,
  state => state.eventTypes,
);
