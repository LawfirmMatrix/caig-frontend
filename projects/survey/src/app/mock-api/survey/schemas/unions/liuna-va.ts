import {SurveySchema} from '../../../../survey/survey-data.service';

const logo = {
  url: 'assets/union-logos/liunaLogo.png',
  width: '350px',
  height: '107px',
};

export const liunaVa: Partial<SurveySchema> = {
  toolbarStyle: { background: '#FC9721', color: 'white' },
  logo,
};
