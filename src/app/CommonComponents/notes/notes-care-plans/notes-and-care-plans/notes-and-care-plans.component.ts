import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';

@Component({
  selector: 'app-notes-and-care-plans',
  templateUrl: './notes-and-care-plans.component.html',
  styleUrls: ['./notes-and-care-plans.component.scss'],
})
export class NotesAndCarePlansComponent implements OnInit {
  @Output() showOverlay = new EventEmitter();
  @Input() drawerToggle: MatDrawer;
  @Output() disableOverlay = new EventEmitter();
  @Output() notesClosed = new EventEmitter();
  @Input() patientId: string;
  @Input() patientName: string;
  @Input() notesData: any[];
  @Input() defaultTemplate: any[];
  @Output() editedNoteData = new EventEmitter();
  @Output() submittedNoteData = new EventEmitter();
  @Output() addedTemplateFromNote = new EventEmitter();
  @Output() callNoteList = new EventEmitter();
  fromDate: any;
  toDate: any;
  addNotesButton = true;
  selectedTabIndex: number = 0;
  maxDate: Date = new Date();
  minDate: Date;
  showAddButton: boolean = true;
  showAddPlanButton: boolean = true;
  addPermission: string;
  fromDateCarePlan: any;
  toDateCarePlan: any;
  datePlan: { fromDate: any; toDate: any };

  constructor(public caregiverSharedService: CaregiverSharedService) {}

  ngOnInit(): void {
    // this.fromDate = new Date();
    // this.toDate = new Date();

    this.caregiverSharedService.triggeredNoteCarePlan.subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.addPermission = localStorage.getItem('notesPermission');
        }, 100);
        this.selectedTabIndex = 0;
      }
    });
  }

  drawerToggleClose() {
    this.drawerToggle.toggle();
    const overlay = false;
    this.showOverlay.emit(overlay);
    this.addNotesButton = true;
    this.showAddPlanButton = true;
    this.showAddButton = true;
    this.disableOverlay.emit(false);
    this.notesClosed.emit(true);
    this.fromDate = '';
    this.toDate = '';
    this.caregiverSharedService.loadNotes(false);
    this.selectedTabIndex = 0;
    // window.location.reload();
  }

  startEvent(evt) {
    this.fromDate = '';
    this.fromDate = evt.value;
  }
  endEvent(evt) {
    this.toDate = '';
    this.toDate = evt.value;

    if (this.fromDate && this.toDate) {
      localStorage.setItem('notesFromDate', this.fromDate);
      localStorage.setItem('notesToDate', this.toDate);
      this.callNoteListTriger(true);
    } else if (!this.fromDate && this.toDate) {
      this.fromDate = null;
      this.fromDate = this.toDate;
      localStorage.setItem('notesFromDate', this.fromDate);
      localStorage.setItem('notesToDate', this.toDate);
      this.callNoteListTriger(true);
    }
  }
  startEventCarePlan(evt) {
    // this.fromDate = '';
    this.fromDateCarePlan = evt.value;
  }
  endEventCarePlan(evt) {
    this.toDate = '';
    this.toDateCarePlan = evt.value;
    this.datePlan = {
      fromDate: this.fromDateCarePlan,
      toDate: this.toDateCarePlan,
    };
    this.callNoteList.emit({
      fromDate: this.fromDateCarePlan,
      toDate: this.toDateCarePlan,
    });
    // if (this.fromDate && this.toDate) {
    //   localStorage.setItem('notesFromDate', this.fromDate);
    //   localStorage.setItem('notesToDate', this.toDate);
    //   this.callNoteListTriger(true);
    // } else if (!this.fromDate && this.toDate) {
    //   this.fromDate = null;
    //   this.fromDate = this.toDate;
    //   localStorage.setItem('notesFromDate', this.fromDate);
    //   localStorage.setItem('notesToDate', this.toDate);
    //   this.callNoteListTriger(true);
    // }
  }
  buttonChange(e) {
    this.showAddButton = e;
    this.buttonChangeEvent(e);
  }
  buttonChangePlan(e) {
    this.showAddPlanButton = e;
    this.buttonChangeEventPlans(e);
  }
  buttonChangeEvent(e) {
    this.showAddButton = e;
    this.fromDate = new Date(localStorage.getItem('notesFromDate'));
    this.toDate = new Date(localStorage.getItem('notesToDate'));
  }
  buttonChangeEventPlans(e) {
    this.showAddPlanButton = e;
    this.fromDate = new Date(localStorage.getItem('notesFromDate'));
    this.toDate = new Date(localStorage.getItem('notesToDate'));
  }
  disableOverlayNote(e) {
    this.disableOverlay.emit(false);
  }
  tabChange(e) {
    this.selectedTabIndex = e.index;
  }
  editedNoteDataTriger(e) {
    if (e) {
      this.editedNoteData.emit(true);
    }
  }
  callNoteListTriger(e) {
    if (e) {
      this.callNoteList.emit({ from: this.fromDate, to: this.toDate });
    }
  }
}
