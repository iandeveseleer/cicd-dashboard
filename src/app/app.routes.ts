import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectDetailComponent} from './project-detail/project-detail.component';
import {GlobalViewComponent} from './global-view/global-view.component';
import {SettingsComponent} from './settings/settings.component';
import {ProjectCreateComponent} from './project-create/project-create.component';

export const routes: Routes = [
  { path: '', component: GlobalViewComponent},
  { path: 'projects', title: 'Global view', component: GlobalViewComponent },
  { path: 'projects/:id/version/:vid', component: ProjectDetailComponent },
  { path: 'projects/:id/version/:vid/job/:jid', component: ProjectDetailComponent },
  { path: 'create-project', title: 'Add New Project', component: ProjectCreateComponent },
  { path: 'settings', title: 'Settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
