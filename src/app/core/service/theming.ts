import {Injectable} from '@angular/core';
import {StepStatus} from '../model/model';


@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  getStepStatusClass(status: StepStatus): string {
    switch (status) {
      case StepStatus.SUCCESS:
        return 'success';
      case StepStatus.FAILED:
        return 'error';
      case StepStatus.BYPASS:
        return 'warning';
      case StepStatus.CANCELLED:
        return 'disabled';
      case StepStatus.IN_PROGRESS:
        return 'info ongoing';
      default:
        return '';
    }
  }

  getStepIcon(status: StepStatus): string {
    switch (status) {
      case StepStatus.SUCCESS:
        return 'check_circle';
      case StepStatus.FAILED:
        return 'cancel';
      case StepStatus.BYPASS:
        return 'info';
      case StepStatus.IN_PROGRESS:
        return 'pending';
      case StepStatus.CANCELLED:
        return 'remove_circle';
      default:
        return 'info';
    }
  }
}
