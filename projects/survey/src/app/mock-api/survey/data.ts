import {SurveySchema} from '../../survey/survey.service';
import {schema2} from './schemas/nageva-martinsburg';
import {schema3} from './schemas/nageva-housekeeping';
import {schema4} from './schemas/liunava-overtime';

export const schemas: SurveySchema[] = [
  schema2,
  schema3,
  schema4,
];
