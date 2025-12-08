import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../core/service/api';
import {ThemingService} from '../core/service/theming';
import {CoreModule} from '../core/core.module';
import {Subscription} from 'rxjs';
import {ProjectDto, StepStatus} from '../core/model/model';

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
  projects: ProjectDto[] = [];
  loaded: boolean = false;

  ngOnInit(): void {
     this.subscription = this.apiService.getPopulatedProjects().subscribe(response => {
        this.projects = response;
        this.loaded = true;
     })
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getStepStatusClass(status: StepStatus): string {
    return this.themingService.getStepStatusClass(status);
  }

  getStepIcon(status: StepStatus): string {
    return this.themingService.getStepIcon(status);
  }
}
