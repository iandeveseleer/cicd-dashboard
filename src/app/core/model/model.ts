import {Status} from '../enums/status.enum';

export interface ProjectDto {
  id: string | number;
  name: string;
  repository_url: string;
  repository_id: number;
  versions: ProjectVersionDto[];
}

export interface ProjectVersionDto {
  id: string | number;
  version: number;
  team: {
    id: string | number;
    name: string;
    channel_url: string;
  };
  project_id: string | number;
  pipelines: PipelineDto[];
}

export interface PipelineDto {
  id: string | number;
  sha1: string;
  status: Status;
  url: string;
  created_date: string;
  jobs: JobDto[];
}

export interface TeamDto {
  id: string | number;
  channel_url: string;
  name: string;
}

export interface JobDto {
  id: string | number;
  name: string;
  status: Status;
  start_date: string;
  end_date: string;
  logs_url: string;
  details: {
    log_url: string;
    links: { [key: string]: string };
    test_results: {
      total_tests: number;
      passed_tests: number;
      failed_tests: number;
      skipped_tests: number;
    };
    code_quality: {
      coverage: number;
      duplications: number;
      critical_issues: number;
      major_issues: number;
      minor_issues: number;
    };
  };
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
  next: { href: string };
  prev: { href: string };
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

export interface PaginatedResult<T> {
  items: T[];
  links: CollectionLinks;
  page: PageInfo;
}

/**
 * Convertit une réponse HAL en une structure paginée simple { items, links, page }.
 * Supprime automatiquement la propriété interne `_links` de chaque entité embarquée.
 */
export function buildPaginatedResult<T>(response: HalCollectionResponse<T> | any, resourceName: string): PaginatedResult<T> {
  const items: T[] = [];
  if (response && response._embedded && response._embedded[resourceName]) {
    for (const embedded of response._embedded[resourceName]) {
      const { _links, ...entity } = embedded as any;
      items.push(entity as T);
    }
  }
  const links: CollectionLinks = (response && response._links) ? response._links : { self: { href: '' }, next: { href: '' }, prev: { href: '' }, profile: { href: '' } };
  const page: PageInfo = (response && response.page) ? response.page : { number: 0, size: items.length, total_elements: items.length, total_pages: 1 };
  return { items, links, page };
}
