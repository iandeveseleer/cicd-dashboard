export interface ProjectDto {
  id: string;
  name: string;
  repositoryUrl?: string;
  versions?: ProjectVersionDto[];
}

export interface ProjectVersionDto {
  id: string;
  version: number;
  team: {
    id: string;
    name: string;
    channelUrl: string;
  };
  projectId: string;
  pipelines: PipelineDto[];
}

export interface PipelineDto {
  id: string;
  sha1: string;
  status: string;
  url: string;
  createdDate: string;
  jobs: JobDto[];
}

export interface JobDto {
  id: string;
  name: string;
  status: StepStatus;
  startDate: number;
  endDate: number;
  details: {
    log_url: string;
    duration: number;
    links: { [key: string]: string };
    testResults: {
      totalTests: number;
      passedTests: number;
      failedTests: number;
      skippedTests: number;
    };
    codeQuality: {
      coverage: number;
      duplications: number;
      criticalIssues: number;
      majorIssues: number;
      minorIssues: number;
    };
  };
}

export enum StepStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  BYPASS = 'BYPASS',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
}

export interface ResourceLinks {
  [key: string]: { href: string };
}

export interface EmbeddedResource<T> {
  _links: ResourceLinks;
  [key: string]: any;
}

export interface EmbeddedCollection<T> {
  [resourceName: string]: EmbeddedResource<T>[];
}

export interface CollectionLinks {
  self: { href: string };
  profile: { href: string };
}

export interface PageInfo {
  number: number;
  size: number;
  total_elements: number;
  total_pages: number;
}

export interface HalCollectionResponse<T> {
  _embedded: EmbeddedCollection<T>;
  _links: CollectionLinks;
  page: PageInfo;
}
