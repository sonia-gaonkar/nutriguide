import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStudyComponent } from './image-study.component';

describe('ImageStudyComponent', () => {
  let component: ImageStudyComponent;
  let fixture: ComponentFixture<ImageStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageStudyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
