export interface AppData {
  changes?: { [key: string]: string[] };
  forceReloadDuration?: number;
  clearLocalStorage?: boolean;
}
