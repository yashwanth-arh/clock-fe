import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PreviewImageComponent } from './preview-image.component';

describe('PreviewImageComponent', () => {
  let component: PreviewImageComponent;
  let fixture: ComponentFixture<PreviewImageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewImageComponent ],
      imports:[RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { image: 'https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-600w-338250266.jpg' }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set urlImg to the value from the route', () => {
    expect(component.urlImg).toEqual('https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-600w-338250266.jpg');
  });

  it('should display the image', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('img').src).toContain('https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-600w-338250266.jpg');
  });
  
});
