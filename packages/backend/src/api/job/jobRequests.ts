export interface JobRequest {
  title: string;
  levelId: number;
  categoryId: number;
  typeId: number;
  location: string;
  description: string;
  compensation: string;
  applicationLink: string;
  isExternal: boolean;
  companyId: string;
  tags: string;
}
