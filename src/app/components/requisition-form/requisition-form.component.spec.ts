import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionFormComponent } from './requisition-form.component';

describe('RequisitionFormComponent', () => {
  let component: RequisitionFormComponent;
  let fixture: ComponentFixture<RequisitionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequisitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
