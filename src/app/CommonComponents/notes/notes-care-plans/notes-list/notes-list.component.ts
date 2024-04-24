import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CaregiverDashboardService } from 'src/app/CareproviderDashboard/caregiver-dashboard.service';
import { CaregiverSharedService } from 'src/app/CareproviderDashboard/caregiver-shared.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { NoteShareDialogComponent } from '../../note-share-dialog/note-share-dialog.component';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() patientId: string;
  @Input() patientName: string;
  @Input() notesData: any[];
  @Input() defaultTemplate: any[];
  @Input() drawerToggle: MatDrawer;
  @Output() showOverlay = new EventEmitter();
  @Output() editedNoteData = new EventEmitter();
  @Output() submittedNoteData = new EventEmitter();
  @Output() addedTemplateFromNote = new EventEmitter();
  @Output() callNoteList = new EventEmitter();
  @Output() disableOverlay = new EventEmitter();
  @Output() notesClosed = new EventEmitter();
  @Output() addNotes = new EventEmitter();
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  newsText = new FormControl('', [
    Validators.minLength(5),
    Validators.maxLength(5000),
    Validators.required,
    this.noWhitespaceValidator,
  ]);
  showHoverIcons: number;
  @Input() addNotesButton: boolean;
  showHoverBoolean: boolean;
  isSubmitted = false;
  isSubmittedTemplate = false;
  editFlag: string;
  addToTemplate = false;
  share = false;
  personAdded = false;
  sharePatient = false;
  loadRes: boolean = true;
  loadResTemplate: boolean;
  p = 1;
  size = 5;
  roleid: any;
  userRole: string;
  details: any = [];
  branch: string;
  // addNotesButton = true;
  useTemplateButton = false;
  addTemplateButton = false;
  showTemplateDiv = false;
  noteDescriptionText: string;
  templateDescriptionText: string;
  editable = false;
  templateEditable = false;
  userId: string;
  username: string;
  fromDate: any;
  toDate: any;
  maxDate: Date = new Date();
  minDate;
  noteList: any = [];
  combinedList: any = [];
  sharedNoteList: any = [];
  unSharedNoteList: any = [];
  defaultNoteList: any = [];
  noteId: any = [];
  templateId: any = [];
  actualNotelist: any = [];
  noteArr: any = [];
  editedNoteArray: any = [];
  editedTemplateArray: any = [];
  templateEdit: any;
  displayedColumns: string[] = ['createdBy', 'actions'];
  changeDetectorRefs: ChangeDetectorRef[] = [];
  selectedOptionToShare: any = [];
  shareIcon = '';
  downloadIcon = 'assets/svg/Download.svg';
  currentUrl: string;
  notelink: string;
  observationStartTime = new Date().getTime();
  timeSpentDuration: any;
  subscription: Subscription;
  isReadMore = true;
  showTxt = 'Show More';
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('shareCheck') private myShareCheckbox: MatCheckbox;
  myShareCheckbox: MatCheckbox;
  public currentPatientId: string;
  osType: string;
  openVal: boolean;
  cpid: any;
  addPermission: string;
  sharedNames: any;
  notesDataContent: any;
  leavingComponent = false;
  constructor(
    private auth: AuthService,
    private service: CaregiverDashboardService,
    public caregiverSharedService: CaregiverSharedService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.leavingComponent = false;
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.userRole = user?.userDetails?.userRole;
    this.currentUrl = this.route['_routerState'].snapshot.url;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userId = localStorage.getItem('currentUserId');
    this.username = authDetails?.userDetails?.name;
    this.cpid = user?.userDetails['scopeId'];
    this.addPermission = localStorage.getItem('notesPermission');
  }

  ngOnInit(): void {
    this.leavingComponent = false;
    this.caregiverSharedService.drawerToggled.subscribe((res) => {
      if (res) {
        this.notesDataContent = [];
        this.loadRes = true;
        setTimeout(() => {
          this.filterNotes(0, 10);
          this.cancelNote();
        }, 100);
        const user = this.auth.authData;

        this.cpid = user?.userDetails['scopeId'];
        this.addPermission = localStorage.getItem('notesPermission');
      }
    });
    // this.editedNoteData.emit(true);
    if (
      localStorage.getItem('patientCreatedOn') &&
      localStorage.getItem('patientCreatedOn') !== 'undefined'
    ) {
      const createdDate: Date = new Date(
        localStorage.getItem('patientCreatedOn')
      );

      this.minDate = createdDate ? createdDate?.toISOString() : new Date();
    }
    // this.caregiverSharedService.triggeredloadNotes.subscribe((res) => {
    //   if (res) {
    //     this.loadRes = res;
    //   } else {
    //     this.loadRes = res;
    //   }
    // });
    this.osType = window.navigator.platform;

    this.currentPatientId = localStorage.getItem('patientId');
    if (this.notesData?.length) {
      this.notesData.map((ele) => {
        ele['showMore'] = false;
      });
    }
    if (this.defaultTemplate?.length) {
      this.defaultTemplate.map((ele) => {
        ele['showMore'] = false;
      });
    }
  }
  ngOnDestroy(): void {
    this.leavingComponent = true;
  }
  ngAfterViewInit(): void {
    this.filterNotes(0, 10);
  }

  filterNotes(pageNumber, pageSize) {
    this.loadRes = true;
    if (this.leavingComponent) {
      return;
    }

    this.service
      .filterNotes(localStorage.getItem('patientId'), pageNumber, pageSize)
      .subscribe((res) => {
        this.notesDataContent = res?.content;
        this.length = res?.totalElements;
        this.loadRes = false;
      });
  }
  handlePageEvent(event: PageEvent): void {
    // this.table.nativeElement.scrollIntoView();
    this.length = event.length;
    this.filterNotes(event.pageIndex, event.pageSize);
  }

  buttonChange(buttonType) {
    if (buttonType == 'addNote') {
      this.addNotesButton = false;
      this.useTemplateButton = true;
      this.addTemplateButton = false;
      this.showTemplateDiv = false;
      this.share = false;
      this.addToTemplate = false;
      this.editable = false;
      this.fromDate = '';
      this.toDate = '';
    } else if (buttonType == 'useTemplate') {
      this.addNotesButton = false;
      this.useTemplateButton = false;
      this.addTemplateButton = true;
      this.showTemplateDiv = true;
      this.fromDate = '';
      this.toDate = '';
    } else if (buttonType == 'addTemplate') {
      this.addNotesButton = false;
      this.useTemplateButton = false;
      this.addTemplateButton = false;
      this.showTemplateDiv = true;
    }
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  newsErr() {
    return this.newsText.hasError('maxlength')
      ? 'Max 5000 characters'
      : this.newsText.hasError('minlength')
      ? 'Enter minimum 5 characters'
      : this.newsText.hasError('required')
      ? 'Notes is required'
      : this.newsText.hasError('whitespace')
      ? 'Empty spaces are not allowed'
      : '';
  }
  toggleCheckbox(event, noteCheckbox) {
    if (this.newsText.valid) {
      this.openShare(event, noteCheckbox);
    }
  }
  loadShareList(flag) {
    this.sharedNames = [];
    this.service.getSharedNotesNames(flag).subscribe((res) => {
      this.sharedNames = res?.Receiverlist;
    });
  }
  loadShareIcon(flag) {
    let boo = false;
    // this.service.getSharedNotesNames(flag).subscribe((res) => {
    //   if (res?.Receiverlist.length) {
    //     boo = true;
    //   }
    // });
    return boo;
  }
  openShare(value, noteCheckbox): void {
    if (!this.share) {
      const content = {
        patientId: this.patientId,
        description: this.noteDescriptionText,
        senderId: this.userId,
        senderName: this.username,
      };
      const shareModalConfig: MatDialogConfig = {
        width: '350px',
        height: '362px',
        data: content,
        disableClose: true,
        panelClass: 'shareNotesDialog',
      };
      shareModalConfig.position = {
        // Adjust the top position as needed
        left: '62em', // Adjust the left position as needed
      };
      this.dialog
        .open(NoteShareDialogComponent, shareModalConfig)
        .afterClosed()
        .subscribe((e) => {
          if (e) {
            this.share = true;
            this.selectedOptionToShare = e;
            this.shareIcon = 'assets/svg/Share Icon Light blue.svg';
            var icon = document.querySelector('img[name=share-icon]');
            icon.setAttribute('src', this.shareIcon);
          } else {
            noteCheckbox.checked = false;
            this.share = false;
          }
        });
    }
  }
  hoverShareIcon() {
    this.shareIcon = 'assets/svg/Share Icon Dark Blue.svg';
  }
  hoverOutShareIcon() {
    this.shareIcon = 'assets/svg/Share Icon Light blue.svg';
  }
  createNote(addNoteDescription, ele) {
    this.addNotes.emit(false);

    this.username = localStorage.getItem('currentUserName');
    this.loadRes = true;
    if (!addNoteDescription) {
      this.loadRes = false;
      this.snackbarService.error('Enter note content');
      return;
    }
    if (addNoteDescription?.length < 5) {
      this.snackbarService.error('Enter atleast 5 characters');
      this.loadRes = false;
      return;
    } else if (addNoteDescription?.length > 5000) {
      this.snackbarService.error('Enter maximum 5000 characters');
      this.loadRes = false;
      return;
    }
    this.isSubmitted = true;
    this.noteArr = [];
    this.editedNoteArray = [];
    const notecontent = {
      patientId: this.patientId,
      patientName: this.patientName,
      description: addNoteDescription,
      senderId: this.userId,
      senderName: this.username,
      receiverId: this.userId,
      receiverName: this.username,
      shareToPatient: this.sharePatient,
      flag: this.randomStr(10, '12345abcde'),
    };
    if (!this.share && !this.addToTemplate) {
      notecontent['eShared'] = 0;
      notecontent['templateFlag'] = false;
      this.noteArr.push(notecontent);
    } else if (this.share && !this.addToTemplate) {
      const flagStr = this.randomStr(10, '12345abcde');
      this.selectedOptionToShare.forEach((e) => {
        const content = {
          patientId: this.patientId,
          patientName: this.patientName,
          description: addNoteDescription,
          senderId: this.userId,
          senderName: this.username,
          receiverId: e.requestFrom,
          receiverName: e?.firstName + ' ' + e?.lastName,
          flag: flagStr,
          eShared: 1,
          templateFlag: false,
          shareToPatient: false,
        };
        this.noteArr.push(content);
      });
      const noteSelf = {
        patientId: this.patientId,
        patientName: this.patientName,
        description: addNoteDescription,
        senderId: this.userId,
        senderName: this.username,
        receiverId: this.userId,
        eShared: 1,
        receiverName: this.username,
        shareToPatient: this.sharePatient,
        flag: flagStr,
      };
      this.noteArr.push(noteSelf);
    } else if (!this.share && this.addToTemplate) {
      notecontent['templateFlag'] = true;
      this.noteArr.push(notecontent);
    }

    if (ele == 'add') {
      const body = {
        patientNotes: this.noteArr,
      };

      this.service.createNotes(body).subscribe(
        (res) => {
          // this.fromDate = null;
          // this.toDate = null;
          this.addNotes.emit(true);
          this.loadRes = false;
          this.noteArr = [];
          this.isSubmitted = false;
          this.notesData.unshift(res[res?.length - 1]);
          // this.editedNoteData.emit(true);
          this.filterNotes(0, 10);
          if (this.addToTemplate && this.share) {
            this.snackbarService.success(
              'Note and template added and shared successfully'
            );
          } else if (this.addToTemplate && !this.share) {
            this.snackbarService.success(
              'Note and template added successfully'
            );
          } else if (this.sharePatient || this.share) {
            this.snackbarService.success('Note added and shared successfully');
          } else if (!this.sharePatient && !this.share) {
            this.snackbarService.success('Note added successfully');
          }

          this.addedTemplateFromNote.emit(true);
          this.cancelNote();
          this.changeDetectorRef.detectChanges();
          this.addNotesButton = true;
          this.useTemplateButton = false;
          this.newsText.markAsUntouched();
          this.noteDescriptionText = '';
          this.share = false;
          this.openVal = false;
          // this.fromDate = new Date();
          // this.toDate = new Date();
        },
        (err) => {
          this.noteArr = [];
          this.loadRes = false;
          this.isSubmitted = false;
          // this.snackbarService.error(err.error?.message);
        }
      );
    } else if (ele == 'edit') {
      let content = {};
      // this.noteId.forEach((e) => {
      content = {
        description: addNoteDescription,
        // ptNoteId: e,
        updatedOn: new Date(),
        flag: this.editFlag,
      };
      // })
      this.editedNoteArray.push(content);
      const body = {
        patientNotes: this.editedNoteArray,
        // commentDesc: addNoteDescription,
        // patientId: this.patientId,
      };
      this.service.editNotes(body).subscribe(
        () => {
          this.isSubmitted = false;
          this.loadRes = false;
          this.snackbarService.success('Note updated successfully');
          // this.editedNoteData.emit(true);
          this.filterNotes(0, 10);
          // this.submittedNoteData.emit(true);
          this.share = false;
          this.openVal = false;
          this.editable = false;
          this.cancelNote();
          this.changeDetectorRef.detectChanges();
          this.newsText.markAsUntouched();
          this.noteDescriptionText = '';
          this.fromDate = new Date();
          this.toDate = new Date();
        },
        (err) => {
          this.editedNoteArray = [];
          this.loadRes = false;
          this.isSubmitted = false;
          this.snackbarService.error(err.error?.message);
        }
      );
    }
  }
  randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
      ans += arr[Math.floor(Math.random() * arr?.length)];
    }
    return ans;
  }
  cancelNote() {
    this.addNotes.emit(true);
    this.sharePatient = false;
    this.editable = false;
    this.newsText.markAsUntouched();
    // this.addNotesButton = true;
    this.useTemplateButton = false;
    this.addToTemplate = false;
    this.share = false;
    this.showTemplateDiv = false;
    this.noteDescriptionText = '';
    this.selectedOptionToShare = [];
  }

  enableNoteEdit(ele) {
    this.addNotes.emit(false);
    this.editable = true;
    this.addNotesButton = false;
    this.useTemplateButton = true;
    this.addTemplateButton = false;
    this.noteDescriptionText = ele.description;
    if (ele.ptNoteId) {
      this.noteId = ele.ptNoteId.split(',');
    }
    this.editFlag = ele.flag;
  }

  deleteNotes(element, index, value) {
    if (value === 'notes') {
      const content = {
        noteId: [element.flag],
      };
      this.service.deleteNote(content).subscribe(() => {
        this.filterNotes(0, 10);
        // this.notesData.splice(index, 1);
        this.changeDetectorRef.detectChanges();
        this.snackbarService.success('Note deleted successfully');
        this.cancelNote();
      });
    } else if (value === 'templates') {
      this.service.deletetemplateNote(element.defaultNoteId).subscribe(() => {
        this.addedTemplateFromNote.emit(true);
        this.changeDetectorRef.detectChanges();
        this.snackbarService.success('Note deleted successfully');
      });
    }
  }

  trimString(text, length) {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  }
}
