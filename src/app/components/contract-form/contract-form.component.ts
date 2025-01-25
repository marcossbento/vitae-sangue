import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
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
import { MessagesModule } from 'primeng/messages';
import { ContractService } from '../../services/contract.service';


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
    InputNumberModule,
    MessagesModule
  ],
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit{
  formGroup: FormGroup;
  currentStep: number = 0;
  hemocentros: any[] = [];
  selectedHemocentro: any;
  
  steps = [
    { label: 'Hemocentro e usuário requeridos', icon: 'pi pi-home', completed: false, formGroupName: 'dadosRequeridos' },
    { label: 'Datas e quantidade', icon: 'pi pi-file', completed: false, formGroupName: 'dataQuantidade' }
  ];
  
  constructor(private fb: FormBuilder, private hemocentroService: HemocentroService, private contractService: ContractService, private messageService: MessagesModule) { 
    this.formGroup = this.fb.group({
      dadosRequeridos: this.fb.group({
        hemocentro: ['', Validators.required]
      }),
      dataQuantidade: this.fb.group({
        dataInicio: ['', Validators.required],
        dataVencimento: ['', Validators.required],
        quantidadeSangue: ['', Validators.required]
      }, { validators: this.createDateValidator() })
    });
  }

  ngOnInit(): void {
    this.carregarHemocentros(); // Carrega hemocentros ao inicializar
  }

  private createDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const startDate = group.get('dataInicio')?.value;
      const endDate = group.get('dataVencimento')?.value;
  
      if (startDate && endDate && startDate > endDate) {
        return { dateRange: true }; // Retorna um erro se a data de início for posterior
      }
      return null; // Válido
    };
  }

  carregarHemocentros(): void {
    this.hemocentroService.getHemocentros().subscribe({
      next: (response) => {
        this.hemocentros = response.content || []; 
      },
      error: (err) => console.error('Erro ao carregar:', err)
    });
  }

  private submitContract() {
    const formData = this.formGroup.value;

    const payload = {
      hemocentro: formData.dadosRequeridos.hemocentro.id,
      inicio: this.formatDate(formData.dataQuantidade.dataInicio),
      vencimento: this.formatDate(formData.dataQuantidade.dataVencimento),
      quantidadeSangue: formData.dataQuantidade.quantidadeSangue,
      situacao: "PENDENTE"
    };

    this.contractService.createContrato(payload).subscribe({
      next: (response) => {
        console.log('Contrato criado com sucesso:', response);
        alert('Contrato salvo com sucesso!'); // Feedback simples
        this.resetForm();
      },
      error: (error) => {
        console.error('Erro ao salvar contrato:', error);
        alert(`Erro: ${error.error.message || 'Falha na comunicação'}`);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private resetForm() {
    this.formGroup.reset();
    this.currentStep = 0;
    this.steps.forEach(step => step.completed = false);
  }

  nextStep() {
    const currentStepGroup = this.formGroup.get(this.steps[this.currentStep].formGroupName);
    
    if (currentStepGroup?.valid) {
      if (this.currentStep === this.steps.length - 1) {
        this.submitContract(); // Chama o método de envio no último passo
      } else {
        this.steps[this.currentStep].completed = true;
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
