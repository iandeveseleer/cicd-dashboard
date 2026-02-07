import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LayoutComponent} from './core/layout/layout.component';
import {ThemingService} from './core/service/theming';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cicd-dashboard');
  private readonly themingService = inject(ThemingService);
}
