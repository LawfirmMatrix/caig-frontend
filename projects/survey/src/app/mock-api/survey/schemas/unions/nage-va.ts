import {SurveySchema} from '../../../../survey/survey-data.service';

const logo = {
  url: 'assets/union-logos/nageLogo.gif',
  width: '132px',
  height: '139px',
};

export const nageVa: Partial<SurveySchema> = {
  toolbarStyle: { background: '#efca23', color: 'black' },
  backgroundStyle: { background: 'linear-gradient(#4640ba, #16108a 40%)' },
  foregroundStyle: { color: 'white' },
  logo,
};
