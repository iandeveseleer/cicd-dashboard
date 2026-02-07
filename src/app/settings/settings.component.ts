import {Component, inject} from '@angular/core';
import {ColorScheme, ThemingService} from '../core/service/theming';
import {CoreModule} from '../core/core.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CoreModule, MatButtonToggleModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private themingService = inject(ThemingService);

  selectedColorScheme = this.themingService.colorScheme();

  onColorSchemeChange(scheme: ColorScheme): void {
    this.themingService.setColorScheme(scheme);
    this.selectedColorScheme = scheme;
  }
}
