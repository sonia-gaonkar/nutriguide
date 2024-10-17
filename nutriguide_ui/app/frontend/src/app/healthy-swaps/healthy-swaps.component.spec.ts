import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthySwapsComponent } from './healthy-swaps.component';

describe('HealthySwapsComponent', () => {
  let component: HealthySwapsComponent;
  let fixture: ComponentFixture<HealthySwapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthySwapsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HealthySwapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
