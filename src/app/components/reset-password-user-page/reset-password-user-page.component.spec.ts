import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUserPageComponent } from './reset-password-user-page.component';

describe('ResetPasswordUserPageComponent', () => {
  let component: ResetPasswordUserPageComponent;
  let fixture: ComponentFixture<ResetPasswordUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetPasswordUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
