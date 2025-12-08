import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../core/service/api';
import {ThemingService} from '../core/service/theming';
import {CoreModule} from '../core/core.module';
import {ProjectDto, StepStatus} from '../core/model/model';
import {Subscription} from 'rxjs';

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

  private subscription!: Subscription;
  project: ProjectDto | undefined;
  loaded: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    const versionId = this.route.snapshot.paramMap.get('vid');

    if (projectId && versionId) {
      this.subscription = this.apiService.getPopulatedProjectWithVersion(projectId, versionId).subscribe(response => {
        this.project = response;
        console.log(response);
        this.loaded = true;
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getStepStatusClass(status: StepStatus): string {
    return this.themingService.getStepStatusClass(status);
  }

  getStepIcon(status: StepStatus): string {
    return this.themingService.getStepIcon(status);
  }
}
