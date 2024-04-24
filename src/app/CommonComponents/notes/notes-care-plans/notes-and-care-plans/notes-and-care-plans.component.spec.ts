import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesAndCarePlansComponent } from './notes-and-care-plans.component';

describe('NotesAndCarePlansComponent', () => {
  let component: NotesAndCarePlansComponent;
  let fixture: ComponentFixture<NotesAndCarePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotesAndCarePlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesAndCarePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
