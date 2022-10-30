import {SurveySchema} from '../../../../survey/survey.service';

const logo = {
  url: 'assets/union-logos/liunaLogo.png',
  width: '350px',
  height: '107px',
};

export const liunaVa: Partial<SurveySchema> = {
  toolbarStyle: { background: '#FC9721', color: 'white' },
  // surveyStyle: { background: 'linear-gradient(#4640ba, #16108a 40%)' },
  // backgroundStyle: { background: '#3d3d3c' },
  // foregroundStyle: { color: 'white' },
  logo,
};
