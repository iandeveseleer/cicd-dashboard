import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../core/service/api';
import {ThemingService} from '../core/service/theming';
import {CoreModule} from '../core/core.module';
import {interval, startWith, Subscription, switchMap} from 'rxjs';
import {PaginatedResult, ProjectDto} from '../core/model/model';
import {PageEvent} from '@angular/material/paginator';
import {Status} from '../core/enums/status.enum';

@Component({
  selector: 'app-global-view',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './global-view.component.html',
  styleUrls: ['./global-view.component.scss']
})
export class GlobalViewComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private themingService = inject(ThemingService);
  private subscription!: Subscription;
  paginatedProjects: PaginatedResult<ProjectDto> | undefined;
  projects: ProjectDto[] = [];
  loaded: boolean = false;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects() {
    this.subscription?.unsubscribe();
    this.subscription = interval(15000).pipe(
      startWith(0),
      switchMap(() => this.apiService.getProjects(this.pageIndex, this.pageSize))
    ).subscribe(response => {
      this.paginatedProjects = response;
      this.projects = this.paginatedProjects.items;
      this.hidePageSize = this.paginatedProjects.page.total_elements <= Math.min(...this.pageSizeOptions);
      this.showFirstLastButtons = this.paginatedProjects.page.total_elements > Math.max(...this.pageSizeOptions);
      this.pageSize = this.paginatedProjects.page.size;
      this.pageIndex = this.paginatedProjects.page.number;
      this.length = this.paginatedProjects.page.total_elements;
      this.loaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getStepStatusClass(status: Status | undefined): string {
    return this.themingService.getStepStatusClass(status);
  }

  getStepIcon(status: Status | undefined): string {
    return this.themingService.getStepIcon(status);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadProjects();
  }
}
