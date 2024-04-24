import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMarketingPageComponent } from './content-marketing-page.component';

describe('ContentMarketingPageComponent', () => {
  let component: ContentMarketingPageComponent;
  let fixture: ComponentFixture<ContentMarketingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentMarketingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentMarketingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
