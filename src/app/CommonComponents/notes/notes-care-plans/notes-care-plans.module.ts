import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesAndCarePlansComponent } from './notes-and-care-plans/notes-and-care-plans.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { CarePlansListComponent } from './care-plans-list/care-plans-list.component';
import { SharedModule } from 'src/app/branches/shareModule..module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
})
export class NotesCarePlansModule {}
