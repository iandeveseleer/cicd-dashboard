import {effect, Injectable, Renderer2, RendererFactory2, signal} from '@angular/core';
import {Status} from '../enums/status.enum';

export type ColorScheme = 'auto' | 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  private renderer: Renderer2;
  private readonly STORAGE_KEY = 'color-scheme';

  colorScheme = signal<ColorScheme>(this.getInitialColorScheme());

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    effect(() => {
      const scheme = this.colorScheme();
      this.applyColorScheme(scheme);
      localStorage.setItem(this.STORAGE_KEY, scheme);
    });
  }

  private getInitialColorScheme(): ColorScheme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as ColorScheme;
    return stored || 'auto';
  }

  private applyColorScheme(scheme: ColorScheme): void {
    const htmlElement = document.documentElement;

    this.renderer.removeClass(htmlElement, 'theme-light');
    this.renderer.removeClass(htmlElement, 'theme-dark');
    this.renderer.removeClass(htmlElement, 'theme-auto');

    this.renderer.addClass(htmlElement, `theme-${scheme}`);
  }

  setColorScheme(scheme: ColorScheme): void {
    this.colorScheme.set(scheme);
  }

  getStepStatusClass(status: Status | undefined): string {
    switch (status) {
      case Status.CREATED:
        return 'disabled';
      case Status.SUCCESS:
        return 'success';
      case Status.FAILED:
        return 'error';
      case Status.BYPASSED:
        return 'warning';
      case Status.CANCELLED:
      case Status.WAITING:
        return 'disabled';
      case Status.IN_PROGRESS:
        return 'info ongoing';
      default:
        return 'disabled';
    }
  }

  getStepIcon(status: Status | undefined): string {
    switch (status) {
      case Status.CREATED:
        return 'circle';
      case Status.SUCCESS:
        return 'check_circle';
      case Status.FAILED:
        return 'cancel';
      case Status.BYPASSED:
        return 'info';
      case Status.WAITING:
      case Status.IN_PROGRESS:
        return 'pending';
      case Status.CANCELLED:
        return 'remove_circle';
      default:
        return 'help';
    }
  }

  getStepLabel(status: Status | undefined): string {
    switch (status) {
      case Status.CREATED:
        return 'Created';
      case Status.SUCCESS:
        return 'Success';
      case Status.FAILED:
        return 'Failed';
      case Status.BYPASSED:
        return 'Ignored';
      case Status.WAITING:
        return 'Waiting';
      case Status.IN_PROGRESS:
        return 'In Progress';
      case Status.CANCELLED:
        return 'Canceled';
      default:
        return 'Unknown status';
    }
  }
}
