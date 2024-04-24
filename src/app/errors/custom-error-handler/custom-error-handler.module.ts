import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomErrorHandler } from './error-handler/custom-error-handler/custom-error-handler.component';
import { ErrorHandler, Injectable } from '@angular/core';


@NgModule({
  declarations: [
    CustomErrorHandler
  ],
  imports: [
    CommonModule,
    ErrorHandler,
    Injectable
  ]
})
export class CustomErrorHandlerModule { }
