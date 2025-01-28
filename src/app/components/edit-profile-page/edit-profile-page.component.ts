import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { UserAuthenticatedService } from './../../services/user-authenticated.service';
import { EstablishmentService } from './../../services/establishment.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterModule,
      InputTextModule,
      FloatLabelModule,
      InputNumberModule,
      FormsModule,
      InputMaskModule,
      DropdownModule,
      HttpClientModule,
      MultiSelectModule,
      CheckboxModule,
    ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss'
})
export class EditProfilePageComponent {
  registerProfileForm!: FormGroup;

  estabelecimentoOptions: any[] = [ ];


  permissions = [
    'USUARIO', 'BOLSA_REQUISICAO', 'BOLSA_ENTREGA', 'CONTRATO',
    'BOLSA_DESCARTE', 'ESTABELECIMENTO', 'HEMOCENTRO', 'HISTORICO',
    'HOSPITAL', 'PERFIL', 'SOLICITACAO_ACESSO', 'BOLSA_UTILIZACAO'
  ];

  shouldShowEstabelecimento: boolean = false;

  profileId: any ;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private userAuthenticatedService: UserAuthenticatedService,
    private establishmentService: EstablishmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void  {
    const permissionControls: { [key: string]: any } = {};
    this.profileId = this.route.snapshot.paramMap.get('id');

    this.carregarEstabelecimentos()
    this.verificaPermisaso()
    this.permissions.forEach(permission => {
      permissionControls[`${permission}_visualizar`] = [false];
      permissionControls[`${permission}_criar`] = [false];
      permissionControls[`${permission}_editar`] = [false];
      permissionControls[`${permission}_deletar`] = [false];
      permissionControls[`${permission}_id`] = [null];
    });

    this.registerProfileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      estabelecimento: ['0'],
      ...permissionControls
    });

    if (this.profileId) {
      this.loadProfile(this.profileId);
    }
  }

  async verificaPermisaso() {
    var userAuthenticated = await this.userAuthenticatedService.getUserLogado()

    if (userAuthenticated.isAdmin) {
      this.shouldShowEstabelecimento = true;
    } else {
      this.shouldShowEstabelecimento = false;
    }

  }

  carregarEstabelecimentos() {
    this.establishmentService.getEstabelecimento().subscribe({
      next: (response) => {
        this.estabelecimentoOptions = response || [];
      },
      error: (err) => console.error('Erro ao carregar:', err)
    });
  }

  loadProfile(profileId: string): void {
    this.profileService.getProfile(profileId).subscribe({
      next: (profile) => {
        let selectedEstabelecimento = null;
        if (this.shouldShowEstabelecimento) {
          selectedEstabelecimento = this.estabelecimentoOptions.find(estab => estab.id === profile.estabelecimento.id) || null;
        }

        this.registerProfileForm.patchValue({
          nome: profile.nome,
          estabelecimento: selectedEstabelecimento,
          ...profile.permissoes.reduce((acc: any, perm: any) => {
            acc[`${perm.controller}_criar`] = perm.criacao;
            acc[`${perm.controller}_visualizar`] = perm.visualizacao;
            acc[`${perm.controller}_editar`] = perm.atualizacao;
            acc[`${perm.controller}_deletar`] = perm.deletar;
            acc[`${perm.controller}_id`] = perm.id;
            return acc;
          }, {}),

        });
      },
      error: (err) => {
        console.error('Erro ao carregar perfil para edição', err);
      },
    });
  }


  onSubmit(): void {
    console.log('Formulário de perfil enviado:', this.registerProfileForm.value);
    if (this.registerProfileForm.valid) {
      const requestBody = {
        id: this.profileId,
        nome: this.registerProfileForm.get('nome')?.value,
        estabelecimentoId: this.shouldShowEstabelecimento ? this.registerProfileForm.get('estabelecimento')?.value.id : 0,
        permissoes: this.permissions.map(permission => ({
          id: this.registerProfileForm.get(`${permission}_id`)?.value,
          controller: permission,
          criacao: this.registerProfileForm.get(`${permission}_criar`)?.value,
          visualizacao: this.registerProfileForm.get(`${permission}_visualizar`)?.value,
          atualizacao: this.registerProfileForm.get(`${permission}_editar`)?.value,
          deletar: this.registerProfileForm.get(`${permission}_deletar`)?.value
        }))
      };
      console.log(requestBody)
      this.profileService.updateProfile(requestBody).subscribe(
        (response) => {
          console.log('Perfil atualizado com sucesso:', response);
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Erro ao atualizar perfil:', error);
          alert('Erro ao atualizar o perfil. Por favor, tente novamente.');
        }
      );
    } else {
      Object.keys(this.registerProfileForm.controls).forEach((key) => {
        const control = this.registerProfileForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['home']);
  }
}
