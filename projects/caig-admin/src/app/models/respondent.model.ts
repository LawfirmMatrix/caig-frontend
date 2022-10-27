import {Employee} from './employee.model';
import {AttachedFile} from '../core/components/view-attached-files/view-attached-files.component';

export interface Respondent<T> {
  id: string;
  pdfId?: string;
  proposedMatches?: Employee[];
  whenSubmitted: string;
  progress: T;
  firstName: string;
  middleName?: string;
  lastName: string;
  notes?: string;
  employeeId?: number;
  employeeView?: Partial<Employee>;
  attachedFiles?: AttachedFile[];
}
