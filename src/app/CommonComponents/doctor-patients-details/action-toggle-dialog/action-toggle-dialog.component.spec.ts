import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionToggleDialogComponent } from './action-toggle-dialog.component';

describe('ActionToggleDialogComponent', () => {
  let component: ActionToggleDialogComponent;
  let fixture: ComponentFixture<ActionToggleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionToggleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionToggleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
