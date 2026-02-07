import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MaterialModule} from './material.module';
import {DurationBetweenInMinutesPipe} from './pipe/duration-between.pipe';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    DurationBetweenInMinutesPipe
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    DurationBetweenInMinutesPipe
  ]
})
export class CoreModule {}
