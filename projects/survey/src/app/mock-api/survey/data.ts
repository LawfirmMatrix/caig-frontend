import {SurveySchema} from '../../survey/survey-data.service';
import {schema2} from './schemas/nageva-martinsburg';
import {schema3} from './schemas/nageva-housekeeping';
import {schema4} from './schemas/liunava-overtime';
import {schema5} from './schemas/nffe-178-apg';

export const schemas: SurveySchema[] = [
  schema2,
  schema3,
  schema4,
  schema5,
].map((schema, index) => ({...schema, id: index + 2}));
