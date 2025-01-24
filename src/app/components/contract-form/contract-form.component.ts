import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { HemocentroService } from '../../services/hemocentro.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    InputTextModule,
    RadioButtonModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule
  ],
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit{
  formGroup: FormGroup;
  currentStep: number = 0;
  hemocentros: any[] = [];
  selectedHemocentro: any;
  usuarioRequerido: any[]|undefined;
  
  steps = [
    { label: 'Hemocentro e usuário requeridos', icon: 'pi pi-home', completed: false, formGroupName: 'dadosRequeridos' },
    { label: 'Datas e quantidade', icon: 'pi pi-file', completed: false, formGroupName: 'dataQuantidade' }
  ];
  
  constructor(private fb: FormBuilder, private hemocentroService: HemocentroService) { 
    this.formGroup = this.fb.group({
      dadosRequeridos: this.fb.group({
        hemocentro: ['', Validators.required],
        usuarioRequerido: ['', Validators.required]
      }),
      dataQuantidade: this.fb.group({
        dataInicio: ['', Validators.required],
        dataVencimento: ['', Validators.required],
        quantidadeSangue: ['', Validators.required]
      }),
    });
  }

  ngOnInit(): void {
    this.carregarHemocentros(); // Carrega hemocentros ao inicializar
  }

  carregarHemocentros(): void {
    this.hemocentroService.getHemocentros().subscribe({
      next: (response) => {
        // Assume que o backend retorna "content" dentro da resposta paginada
        this.hemocentros = response.content || []; 
      },
      error: (err) => console.error('Erro ao carregar:', err)
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
