import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../core/service/api';
import {ThemingService} from '../core/service/theming';
import {CoreModule} from '../core/core.module';
import {ProjectDto, ProjectVersionDto} from '../core/model/model';
import {interval, startWith, Subscription, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ProjectJobDetailComponent} from './project-job-details.component';
import {Status} from '../core/enums/status.enum';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private themingService = inject(ThemingService);
  private dialog = inject(MatDialog);

  private subscription!: Subscription;
  private jobDialogOpened = false;
  projectVersion: ProjectVersionDto | undefined;
  project: ProjectDto | undefined;
  loaded: boolean = false;


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    const versionId = this.route.snapshot.paramMap.get('vid');
    const jobId = this.route.snapshot.paramMap.get('jid');

    if (projectId && versionId) {
      this.subscription = this.apiService.getProject(projectId).pipe(
        switchMap(() => interval(15000).pipe(
          startWith(0),
          switchMap(() => this.apiService.getProject(projectId))
        ))
      ).subscribe(response => {
        this.project = response;
        this.projectVersion = response.versions?.find(v => v.id === Number(versionId));
        this.loaded = true;
        if(jobId && this.projectVersion && !this.jobDialogOpened) {
          const job = this.projectVersion.pipelines?.flatMap(p => p.jobs).find(j => j.id === Number(jobId));
          if(job) {
            this.openJobDialog(job);
            this.jobDialogOpened = true;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getStepStatusClass(status: Status | undefined): string {
    return this.themingService.getStepStatusClass(status);
  }

  getStepIcon(status: Status | undefined): string {
    return this.themingService.getStepIcon(status);
  }

  getStepLabel(status: Status | undefined): string {
    return this.themingService.getStepLabel(status as any);
  }

  openJobDialog(job: any): void {
    this.dialog.open(ProjectJobDetailComponent, {
      data: { job },
      width: '500px'
    });
  }

  openPipeline(url: string) {
    window.open(url, '_blank');
  }
}
