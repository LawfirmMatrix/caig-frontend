import {SurveySchemaBase} from '../../../../survey/survey-data.service';

const logo = {
  url: 'assets/union-logos/nffe_logo.png',
  width: '247px',
  height: '118px',
};

export const nffeApg: Partial<SurveySchemaBase> = {
  toolbarStyle: { background: 'linear-gradient(#002e62, #194F85)', color: 'white' },
  backgroundStyle: { background: '#ccc' },
  foregroundStyle: { color: 'black' },
  logo,
};
