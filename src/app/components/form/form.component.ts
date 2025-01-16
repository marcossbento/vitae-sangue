// form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    InputTextModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  formGroup: FormGroup;
  currentStep: number = 0;
  
  steps = [
    { label: 'Dados iniciais', icon: 'pi pi-home', completed: false, formGroupName: 'dadosIniciais' },
    { label: 'Dados protocolares', icon: 'pi pi-file', completed: false, formGroupName: 'dadosProtocolares' },
    { label: 'Dados administrativos', icon: 'pi pi-user', completed: false, formGroupName: 'dadosAdministrativos' },
    { label: 'Dados x', icon: 'pi pi-cog', completed: false, formGroupName: 'dadosX' }
  ];
  
  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      dadosIniciais: this.fb.group({
        campo1: ['', Validators.required],
        campo2: ['', Validators.required]
      }),
      dadosProtocolares: this.fb.group({
        dadoProtocolar1: ['', Validators.required],
        dadoProtocolar2: ['', Validators.required],
        tipoHospital: ['', Validators.required]
      }),
      dadosAdministrativos: this.fb.group({
        campoAdmin1: ['', Validators.required],
        campoAdmin2: ['', Validators.required]
      }),
      dadosX: this.fb.group({
        campoX1: ['', Validators.required],
        campoX2: ['', Validators.required]
      })
    });
  }

  nextStep() {
    const currentStepGroup = this.formGroup.get(this.steps[this.currentStep].formGroupName);
    
    if (currentStepGroup?.valid) {
      this.steps[this.currentStep].completed = true;
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      }
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(index: number) {
    // Só permite navegar para steps já completados ou o próximo
    if (index < this.currentStep || 
        index === this.currentStep || 
        (index === this.currentStep + 1 && this.steps[this.currentStep].completed)) {
      this.currentStep = index;
    }
  }

  isStepValid(stepIndex: number): boolean {
    const stepGroup = this.formGroup.get(this.steps[stepIndex].formGroupName);
    return stepGroup?.valid || false;
  }

}
