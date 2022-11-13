export interface Survey extends SurveyLocation {
  schemaId: number;
  estTime: string;
  locations: SurveyLocation[];
  url: string;
}

export interface SurveyLocation {
  id: string;
  name: string;
  shortcut?: string;
  respondentCount: number;
}
