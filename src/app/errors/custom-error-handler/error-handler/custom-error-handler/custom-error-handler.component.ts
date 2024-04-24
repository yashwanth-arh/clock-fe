

import { ErrorHandler, Injectable } from '@angular/core';

 

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Suppress or handle the error here
    // For example, you can choose not to do anything:
    // console.log('Error was intercepted:', error);
  }
  constructor(
  
  ) {
    
    
  }
  ngOnInit(): void {
  
   
  }
}