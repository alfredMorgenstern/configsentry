export type Severity = 'low' | 'medium' | 'high';

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  message: string;
  service?: string;
  path?: string;
  suggestion?: string;
};

export type Report = {
  targetPath: string;
  findings: Finding[];
};
