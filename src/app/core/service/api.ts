import {inject, Injectable} from '@angular/core';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  EmbeddedResource,
  HalCollectionResponse,
  JobDto,
  PipelineDto,
  ProjectDto,
  ProjectVersionDto
} from '../model/model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() { }

  /** Get paginated list of projects.
   * @param page Page number (default: 0)
   * @param size Page size (default: 10)
   * @returns Observable of HalCollectionResponse containing ProjectDto
   */
  getProjects(page = 0, size = 10): Observable<HalCollectionResponse<ProjectDto>> {
    return this.http.get<HalCollectionResponse<ProjectDto>>(`/api/projects?page=${page}&size=${size}`).pipe();
  }

  getProject(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`/api/projects/${id}`);
  }

  getProjectVersions(projectId: string, page = 0, size = 10): Observable<HalCollectionResponse<ProjectVersionDto>> {
    return this.http.get<HalCollectionResponse<ProjectVersionDto>>(`/api/projects/${projectId}/versions?page=${page}&size=${size}`);
  }

  getLastPipeline(versionId: string): Observable<HalCollectionResponse<PipelineDto>> {
    return this.http.get<any>(`/api/versions/${versionId}/pipelines?sort=createdDate,desc&page=0&size=1`);
  }

  getPipelineJobs(pipelineId: string): Observable<HalCollectionResponse<JobDto>> {
    return this.http.get<any>(`/api/pipelines/${pipelineId}/jobs`);
  }

  /**
   * Get all projects with their versions, pipelines, and jobs populated.
   * @returns Observable of populated array
   */
  getPopulatedProjects(): Observable<any[]> {
    return this.getProjects().pipe(
      switchMap(projectsResponse => {
        console.log(projectsResponse);
        const projects = extractEntities(projectsResponse, 'projects');
        return forkJoin(projects.map(project =>
          this.getPopulatedProjectVersions(project)
        ));
      }),
      map(results => {
        return results;
      })
    );
  }

  getPopulatedProjectVersions(project: ProjectDto) {
    return this.getProjectVersions(project.id).pipe(
      switchMap(versionsResponse => {
        const versions = extractEntities(versionsResponse, 'versions');
        if (versions.length === 0) {
          return of({
            project: project,
            versions: [],
            pipelines: []
          });
        }
        return forkJoin(versions.map(version =>
          this.getPopulatedPipelines(version)
        )).pipe(
          map(versionResults => {
              project.versions = versionResults.map(vr => vr.version);
              return project;
            }
          ));
      })
    );
  }

  getPopulatedPipelines(version: ProjectVersionDto) {
    return this.getLastPipeline(version.id).pipe(
      switchMap(pipelineResponse => {
        const pipelines = extractEntities(pipelineResponse, 'pipelines');
        if (pipelines.length === 0) {
          return of({
            version: version
          });
        }
        const pipeline = pipelines[0];
        return this.getPipelineJobs(pipeline.id).pipe(
          map(jobsResponse => {
            pipeline.jobs = extractEntities(jobsResponse, 'jobs');
            version.pipelines = [pipeline];
            return {
              version: version
            };
          })
        );
      })
    );
  }

  getPopulatedProjectWithVersion(projectId: string, versionId: string): Observable<any> {
    return this.getProject(Number(projectId)).pipe(
      switchMap(project => {
        return this.getProjectVersions(projectId).pipe(
          switchMap(versionsResponse => {
            const versions = extractEntities(versionsResponse, 'versions');
            const version = versions.find(v => v.id.toString() === versionId.toString());
            if (!version) {
              return of({
                project: project,
                versions: []
              });
            }
            return this.getPopulatedPipelines(version).pipe(
              map(versionResult => {
                project.versions = [versionResult.version];
                return project;
              })
            );
          })
        );
      })
    );
  }
}

/**
 * Extract entities from a HAL response.
 * @param response Complete HAL response
 * @param resourceName resource name to extract
 * @returns Entity array
 */
export function extractEntities<T>(response: HalCollectionResponse<T>, resourceName: string): T[] {
  if (!response._embedded || !response._embedded[resourceName]) {
    return [];
  }
  return response._embedded[resourceName].map((embedded: EmbeddedResource<T>) => {
    const { _links, ...entity } = embedded;
    return entity as T;
  });
}
