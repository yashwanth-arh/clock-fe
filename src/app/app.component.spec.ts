import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'CHC-FE'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CHC-FE');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    // expect(compiled.querySelector('.content span')?.textContent).toContain(
    //   'CHC-FE app is running!'
    // );
  });

  it('should set userRole and userId from local storage', () => {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        userDetails: {
          userRole: 'DOCTOR',
          scopeId: '1',
        },
      })
    );
    component.ngOnInit();
    expect(component.userRole).toEqual('DOCTOR');
    expect(component.userId).toEqual('1');
  });

  it('should emit notificationCountTrigger when receiving a push notification', () => {
    spyOn(component.notificationCountTrigger, 'emit');
    component.ngOnInit();
    const message = {
      notification: {
        title: 'Test Title',
        body: 'Test Body',
      },
    };
    component.pushNotificationService.currentMessage.next(message);
    expect(component.notificationCountTrigger.emit).toHaveBeenCalledWith(true);
  });

  it('should reset the idle state and close all modals on reset()', () => {
    spyOn(component.matDialog, 'closeAll');
    component.reset();
    expect(component.idleState).toEqual('Started');
    expect(component.timedOut).toEqual(false);
    expect(component.matDialog.closeAll).toHaveBeenCalled();
  });

  it('should open RedZoneDialog when receiving a High Alert push notification and userRole is DOCTOR', () => {
    spyOn(component, 'openRedZoneDialog');
    localStorage.setItem(
      'auth',
      JSON.stringify({
        userDetails: {
          userRole: 'DOCTOR',
          scopeId: '1',
        },
      })
    );
    component.ngOnInit();
    const message = {
      notification: {
        title: 'High Alert',
        body: 'Test Body',
      },
    };
    component.pushNotificationService.currentMessage.next(message);
    expect(component.openRedZoneDialog).toHaveBeenCalled();
  });

  it('should open a TimeoutDialog when going idle', () => {
    spyOn(component.matDialog, 'open');
    component.idleState = 'Not started.';
    component.idle.onIdleStart.next();
    expect(component.matDialog.open).toHaveBeenCalled();
  });
});
