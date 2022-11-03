export interface Survey extends SurveyLocation {
  schemaId: number;
  estTime: string;
  locations: SurveyLocation[];
}

export interface SurveyLocation {
  id: string;
  name: string;
  shortcut?: string;
  respondentCount: number;
}
