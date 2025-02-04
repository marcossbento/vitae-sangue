import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HemocentroService } from '../../services/hemocentro.service';
import { RequisitionService } from '../../services/requisition.service';
import { UserAuthenticatedService } from '../../services/user-authenticated.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-requisition-form',
  templateUrl: './requisition-form.component.html',
  styleUrls: ['./requisition-form.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    RouterModule
  ],
})
export class RequisitionFormComponent implements OnInit {
  formGroup: FormGroup;
  currentStep: number = 0;
  hemocentros: any[] = [];
  selectedHemocentro: any;
  hemocomponentes: any[] = [
    { label: 'Hemácias', value: 'HEMACIAS' },
    { label: 'Plasma', value: 'PLASMA' },
    { label: 'Plaquetas', value: 'PLAQUETAS' },
  ];
  tiposAbo: any[] = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'AB', value: 'AB' },
    { label: 'O', value: 'O' },
  ];
  fatoresRh: any[] = [
    { label: 'Positivo', value: '+' },
    { label: 'Negativo', value: '-' },
  ];

  steps = [
    { label: 'Hemocentro', icon: 'pi pi-building', completed: false, formGroupName: 'dadosHemocentro'},
    { label: 'Detalhes da Requisição', icon: 'pi pi-info-circle', completed: false, formGroupName: 'dadosRequisicao' },
  ];

  constructor(
    private fb: FormBuilder,
    private hemocentroService: HemocentroService,
    private requisitionService: RequisitionService,
    private userAuthenticatedService: UserAuthenticatedService,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      dadosHemocentro: this.fb.group({
        hemocentro: ['', Validators.required]
      }),
      dadosRequisicao: this.fb.group({
        bolsas: this.fb.array([this.createBolsaFormGroup()])
      }),
    });
    
  }

  ngOnInit(): void {
    this.carregarHemocentros();
  }

  createBolsaFormGroup(): FormGroup {
    return this.fb.group({
      hemocomponente: ['', Validators.required],
      abo: ['', Validators.required],
      rh: ['', Validators.required],
      qtdRequirida: ['', Validators.required],
    });
  }

  get bolsas(): FormArray {
    return this.formGroup.get('dadosRequisicao.bolsas') as FormArray;
  }

  addBolsa(): void {
    this.bolsas.push(this.createBolsaFormGroup());
  }

  removeBolsa(index: number): void {
    this.bolsas.removeAt(index);
  }

  async carregarHemocentros() {
    var userAuthenticated = await this.userAuthenticatedService.getUserLogado();

    this.hemocentroService.getHemocentrosParceiros(userAuthenticated.estabelecimento.id).subscribe({
      next: (response) => {
        console.log(response);
        this.hemocentros = response || [];
      },
      error: (err) => console.error('Erro ao carregar:', err)
    });
  }

  private resetForm() {
    this.formGroup.reset();
    this.currentStep = 0;
    this.steps.forEach(step => step.completed = false);
    this.bolsas.clear();
    this.addBolsa();
  }

  nextStep() {
    const currentStepGroup = this.formGroup.get(this.steps[this.currentStep].formGroupName);

    if (currentStepGroup?.valid) {
      if (this.currentStep === this.steps.length - 1) {
        this.submitRequisition();
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

  private submitRequisition() {
    const formData = this.formGroup.value;
    
    const payload = {
      hemocentroId: formData.dadosHemocentro.hemocentro.id,
      situacao: "PENDENTE",
      bolsas: formData.dadosRequisicao.bolsas
    };

    this.requisitionService.createRequisicao(payload).subscribe({
      next: (response) => {
        console.log('Requisição criada com sucesso:', response);
        alert('Requisição salva com sucesso');
        this.resetForm();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Erro ao salvar requisição:', error);
        alert(`Erro: ${error.error.message || 'Falha na comunicação'}`);
      }
    });
  }
}