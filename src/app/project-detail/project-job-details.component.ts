import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {DurationBetweenInMinutesPipe} from '../core/pipe/duration-between.pipe';

@Component({
  selector: 'app-job-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, DurationBetweenInMinutesPipe, DurationBetweenInMinutesPipe],
  template: `
    <h2 mat-dialog-title>{{ data.job.name }}</h2>
    <mat-dialog-content>
      @if(data.job.start_date) {
        @if(data.job.end_date) {
          <p>Duration: <strong>{{ data.job.end_date | durationBetweenInMinutes: data.job.start_date }}</strong></p>
        } @else {
          <p>On going</p>
        }
      } @else {
        <p>Pending</p>
      }
      @if (data.job.details !== undefined) {
        <div class="job-details">
          @if (data.job.details.code_quality !== undefined) {
            @if (data.job.details.code_quality.coverage !== undefined) {
              <p>Coverage: <strong>{{ data.job.details.code_quality.coverage }}</strong></p>
            }
            @if (data.job.details.code_quality.duplications !== undefined) {
              <p><strong>{{ data.job.details.code_quality.duplications }}</strong> duplications</p>
            }
          }
          @if (data.job.details.test_results !== undefined) {
            <p>Tests:
              @if(data.job.details.test_results.passed_tests !== undefined) {
                <strong>{{ data.job.details.test_results.passed_tests }}</strong> OK
              }
              @if(data.job.details.test_results.failed_tests !== undefined) {
                <strong>{{ data.job.details.test_results.failed_tests }}</strong> KO
              }
            </p>
          }
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (data.job.logs_url) {
        <button mat-button (click)="window.open(data.job.logs_url, '_blank')">Detailed Logs</button>
      }
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class ProjectJobDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  protected readonly window = window;
}
