import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContentMarketingComponent } from './add-edit-content-marketing.component';

describe('AddEditContentMarketingComponent', () => {
  let component: AddEditContentMarketingComponent;
  let fixture: ComponentFixture<AddEditContentMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditContentMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditContentMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
