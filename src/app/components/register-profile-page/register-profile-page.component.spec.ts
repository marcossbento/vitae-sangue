import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProfilePageComponent } from './register-profile-page.component';

describe('RegisterProfilePageComponent', () => {
  let component: RegisterProfilePageComponent;
  let fixture: ComponentFixture<RegisterProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterProfilePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
