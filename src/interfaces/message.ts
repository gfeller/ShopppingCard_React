export interface Message {
  show: boolean;
  text: string;
  severity: Severity;
}

export enum Severity {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}
