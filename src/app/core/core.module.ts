import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from './material.module';
import {DurationBetweenInMinutesPipe} from './pipe/duration-between.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    DurationBetweenInMinutesPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    DurationBetweenInMinutesPipe
  ]
})
export class CoreModule {}
