import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
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
  selector: 'app-care-plans-list',
  templateUrl: './care-plans-list.component.html',
  styleUrls: ['./care-plans-list.component.scss'],
})
export class CarePlansListComponent implements OnInit {
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
  @Input() dateProp: { toDate: Date; fromDate: Date };
  pageSizeOptions = [10, 25, 100];
  length = 0;
  pageIndex = 0;
  newsText = new FormControl('', [
    Validators.minLength(5),
    Validators.maxLength(5000),
    Validators.required,
    this.noWhitespaceValidator,
  ]);
  newsTitle = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(50),
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
  notesTitle: string;
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
  notesCpData: any;
  addPermission: string;
  // cpName: string;

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
    const user = this.auth.authData;
    this.roleid = user?.userDetails?.id;
    this.cpid = user?.userDetails['scopeId'];
    this.addPermission = localStorage.getItem('notesPermission');
    this.userRole = user?.userDetails?.userRole;
    this.currentUrl = this.route['_routerState'].snapshot.url;
    const authDetails = JSON.parse(localStorage.getItem('auth'));
    this.userId = localStorage.getItem('currentUserId');
    this.username = authDetails?.userDetails?.name;
  }

  ngOnInit(): void {
    // this.editedNoteData.emit(true);
    this.getCarePlanList(0, 10);
    this.getAllCarePlanByProviderId();
    this.cancelNote();
    const createdDate: Date = new Date(
      localStorage.getItem('patientCreatedOn')
    );
    this.minDate = createdDate.toISOString();
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
  handlePageEvent(event: PageEvent): void {
    // this.table.nativeElement.scrollIntoView();
    this.length = event.length;
    this.getCarePlanList(event.pageIndex, event.pageSize);
  }

  getCarePlanList(pageNumber, pageSize) {
    this.loadRes = true;
    this.service
      .getAllCarePlan(this.patientId, pageNumber, pageSize)
      .subscribe((res) => {
        this.loadRes = false;
        this.notesData = res.content;
        this.length = res?.totalElements;
      });
  }
  getAllCarePlanByProviderId() {
    this.loadRes = true;
    this.service.getAllCarePlanByProviderId(this.cpid).subscribe((res) => {
      this.loadRes = false;
      this.notesCpData = res;
    });
  }
  cpName(ele) {
    return ele?.fullName;
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
      ? 'Description is required'
      : this.newsText.hasError('whitespace')
      ? 'Empty spaces are not allowed'
      : '';
  }
  newsErrTitle() {
    return this.newsTitle.hasError('maxlength')
      ? 'Max 50 characters'
      : this.newsTitle.hasError('minlength')
      ? 'Enter minimum 3 characters'
      : this.newsTitle.hasError('required')
      ? 'Title is required'
      : this.newsTitle.hasError('whitespace')
      ? 'Empty spaces are not allowed'
      : '';
  }
  toggleCheckbox(event, noteCheckbox) {
    if (this.newsText.valid) {
      this.openShare(event, noteCheckbox);
    }
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
        height: '28vh',
        position: { right: '16vw', top: '33vh' },
        data: content,
        disableClose: true,
        panelClass: 'shareNotesDialog',
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
  createNote(title, description, ele) {
    this.loadRes = true;

    const body = {
      description: description,
      patientId: this.patientId,
      shareToPatient: this.sharePatient,
      title: title,
    };
    if (ele === 'add') {
      this.service.createCarePlan(body).subscribe((res) => {
        if (res) {
          if (this.sharePatient) {
            this.snackbarService.success(
              'Care plan added and shared successfully'
            );
          } else {
            this.snackbarService.success('Care plan added successfully');
          }
          this.addNotes.emit(true);
          this.loadRes = false;
          this.newsText.markAsUntouched();
          this.newsTitle.markAsUntouched();
          this.newsText.reset();
          this.newsTitle.reset();
          this.noteDescriptionText = '';
          this.notesTitle = '';
          this.sharePatient = false;
          this.editable = false;
          this.getCarePlanList(0, 10);
          this.getAllCarePlanByProviderId();
        }
        this.loadRes = false;
      });
    } else {
      this.service.updateCarePlan(body, this.noteId).subscribe((res) => {
        if (res) {
          this.addNotes.emit(true);
          this.loadRes = false;
          this.newsText.markAsUntouched();
          this.newsTitle.markAsUntouched();
          this.newsText.reset();
          this.newsTitle.reset();
          this.noteDescriptionText = '';
          this.notesTitle = '';
          this.editable = false;
          this.sharePatient = false;
          this.snackbarService.success('Care plan updated successfully');
          this.getCarePlanList(0, 10);
          this.getAllCarePlanByProviderId();
        }
        this.loadRes = false;
      });
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
    this.newsTitle.markAsUntouched();
    this.newsText.reset();
    this.newsTitle.reset();
    // this.addNotesButton = true;
    this.useTemplateButton = false;
    this.addToTemplate = false;
    this.share = false;
    this.showTemplateDiv = false;
    this.noteDescriptionText = '';
    this.notesTitle = '';
    this.selectedOptionToShare = [];
  }

  enableNoteEdit(ele) {
    this.addNotes.emit(false);
    this.editable = true;
    this.addNotesButton = false;
    this.useTemplateButton = true;
    this.addTemplateButton = false;
    this.noteDescriptionText = ele?.description;
    this.sharePatient = ele?.shareToPatient;
    this.notesTitle = ele?.title;
    if (ele?.id) {
      this.noteId = ele?.id;
    }
    this.editFlag = ele.flag;
  }
  enableUseCarePlan(ele) {
    this.addNotes.emit(false);
    this.editable = false;
    this.addNotesButton = false;
    this.noteDescriptionText = ele.description;
    this.notesTitle = ele.title;
    if (ele.id) {
      this.noteId = ele.id;
    }
    this.editFlag = ele.flag;
  }

  deleteNotes(element, index, value) {
    this.service.deleteCarePlan(element?.id).subscribe((res) => {
      if (res) {
        this.addNotes.emit(true);
        this.noteDescriptionText = '';
        this.notesTitle = '';
        this.snackbarService.success('Care plan deleted successfully');
        this.getCarePlanList(0, 10);
        this.getAllCarePlanByProviderId();
        this.cancelNote();
      }
    });
  }

  trimString(text, length) {
    return text?.length > length ? text.substring(0, length) + '...' : text;
  }
}
