import {Portal} from './session.model';

export interface AppData {
  changes?: AppDataChanges;
  forceReloadDuration?: number;
  clearLocalStorage?: boolean;
}

export type AppDataChanges = { [key in Portal]?: AppDataChangePortal };

export type AppDataChangePortal = { [category: string]: string[] };
