import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  buildPaginatedResult,
  HalCollectionResponse,
  JobDto,
  PaginatedResult,
  PipelineDto,
  ProjectDto,
  ProjectVersionDto,
  TeamDto
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
   * @param projection HAL projection to request (default: 'full')
   * @returns Observable of PaginatedResult containing ProjectDto
   */
  getProjects(page = 0, size = 10, projection = 'full'): Observable<PaginatedResult<ProjectDto>> {
    return this.http.get<any>(`/api/projects?projection=${projection}&page=${page}&size=${size}`).pipe(
      map((resp: HalCollectionResponse<ProjectDto> | any) => buildPaginatedResult<ProjectDto>(resp, 'projects'))
    );
  }

  getProject(id: string | number, projection = 'full'): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`/api/projects/${id}?projection=${projection}`);
  }

  getProjectVersions(projectId: string | number, page = 0, size = 10, projection = 'full'): Observable<PaginatedResult<ProjectVersionDto>> {
    return this.http.get<any>(`/api/projects/${projectId}/versions?projection=${projection}&page=${page}&size=${size}`).pipe(
      map((resp: HalCollectionResponse<ProjectVersionDto> | any) => buildPaginatedResult<ProjectVersionDto>(resp, 'versions'))
    );
  }

  getLastPipeline(versionId: string | number, projection = 'full'): Observable<PaginatedResult<PipelineDto>> {
    return this.http.get<any>(`/api/versions/${versionId}/pipelines?projection=${projection}&sort=createdDate,desc&page=0&size=1`).pipe(
      map((resp: HalCollectionResponse<PipelineDto> | any) => buildPaginatedResult<PipelineDto>(resp, 'pipelines'))
    );
  }

  getPipelineJobs(pipelineId: string | number, projection = 'full'): Observable<PaginatedResult<JobDto>> {
    return this.http.get<any>(`/api/pipelines/${pipelineId}/jobs?projection=${projection}`).pipe(
      map((resp: HalCollectionResponse<JobDto> | any) => buildPaginatedResult<JobDto>(resp, 'jobs'))
    );
  }

  getTeams(page = 0, size = 10, projection = 'full'): Observable<PaginatedResult<TeamDto>> {
    return this.http.get<any>(`/api/teams`).pipe(
      map((resp: HalCollectionResponse<TeamDto> | any) => buildPaginatedResult<TeamDto>(resp, 'teams'))
    );
  }

  createProject(projectData: any): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`/api/projects`, projectData);
  }

  createProjectVersion(projectVersionData: any): Observable<ProjectVersionDto> {
    return this.http.post<ProjectVersionDto>(`/api/versions`, projectVersionData);
  }

  searchRepository(pattern: string): Observable<any> {
    return this.http.get(`api/gitlab/projects/search?pattern=${pattern}`);
  }

  getProjectBranches(id: string | number): Observable<any> {
    return this.http.get(`/api/gitlab/projects/branches?id=${id}`);
  }

  findVersionsByRepository(repositoryId: string | number): Observable<PaginatedResult<ProjectVersionDto>> {
    return this.http.get(`/api/versions/search/findByProjectRepositoryId?repositoryId=${repositoryId}`)
      .pipe(map((resp: HalCollectionResponse<ProjectVersionDto> | any) => buildPaginatedResult<ProjectVersionDto>(resp, 'versions')));
  }
}
