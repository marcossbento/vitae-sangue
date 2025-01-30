import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDetailDialogComponent } from './contract-detail-dialog.component';

describe('ContractDetailDialogComponent', () => {
  let component: ContractDetailDialogComponent;
  let fixture: ComponentFixture<ContractDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
