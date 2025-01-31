import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { RequisitionService } from '../../services/requisition.service';
import { UserService } from '../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    TableModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    DetailDialogComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  user: any = { name: 'Carregando...' };
  cardItems: any[];

  selectedCard: string = '';
  tableData: any[] = [];
  tableColumns: any[] = [];

  // controle do dialog
  @ViewChild('detailDialog') detailDialog!: DetailDialogComponent;
  selectedItem: any;
  dialogTitle: string = '';
  dialogFields: { label: string, value: string }[] = [];

  constructor(private contractService: ContractService, private requisitionService: RequisitionService, private userService: UserService) {
    this.user = {
      name: 'Usuário'
    }

    this.cardItems = [
      { title: 'Contratos', createButtonTitle: ' contrato', pPhrase: 'os contratos', image: '../../assets/images/contratos.webp', link: '/form/contract' },
      { title: 'Requisições de bolsas', createButtonTitle: 'a requisição de bolsa', pPhrase: 'as requisições de bolsa', image: '../../assets/images/bolsasDeSangue.webp', link: '/form/requisition' },
      { title: 'Envio de bolsas', createButtonTitle: ' envio de bolsa', pPhrase: 'os envios de bolsa', image: '../../assets/images/bolsasDeSangue.webp', link: '' }
    ];

  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadContracts();
  }

  private loadUserData(): void {
    this.userService.getLoggedUser().subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: () => {
        this.user.name = 'Usuário';
      }
    });
  }

  onCardClick(cardTitle: string): void {
    this.selectedCard = cardTitle;

    switch (cardTitle) {
      case 'Contratos':
        this.loadContracts();
        break;
      case 'Requisições de bolsas':
        this.loadRequisicoes();
        break;
      // Adicionar caso para entrega de bolsas posrteriormente
    }
  }

  private loadContracts(): void {
    this.contractService.getContracts().subscribe({
      next: (response) => {
        this.tableData = response.content.map((contract: any) => ({
          id: contract.id,
          requisitionType: 'Contrato',
          requester: contract.hospital.nome,
          quantity: contract.quantidadeSangue,
          status: contract.situacao,
          expiration: contract.vencimento
        }));

        this.updateTableColumns('contratos');
      },
      error: (err) => console.error('Erro ao carregar contratos:', err)
    });
  }

  private loadRequisicoes(): void {
    this.requisitionService.getRequisicoes().subscribe({
      next: (response) => {
        this.tableData = response.content.map((requisicao: any) => ({
          id: requisicao.id,
          requisitionType: requisicao.tipo || 'Requisição de Bolsas',
          requester: requisicao.hospital?.nome || 'Não informado',
          quantidade: this.calculateTotalBags(requisicao.bolsas || []),
          componentes: this.getComponentsList(requisicao.bolsas || []),
          status: requisicao.situacao || 'Pendente',
          hemocentro: requisicao.hemocentro?.nome || 'Não definido',
          usuarioRequerido: requisicao.usuarioRequerido?.nome || 'Não informado',
          usuarioRequerimento: requisicao.usuarioRequerimento?.nome || 'Não informado'
        }));
        this.updateTableColumns('requisicoes');
      },
      error: (err) => console.error('Erro ao carregar requisições:', err)
    });
  }

  showDetails(rowData: any) {
    if (this.selectedCard === 'Contratos') {
      this.contractService.getContractById(rowData.id).subscribe({
        next: (contract) => {
          this.setDialogConfig(
            'Detalhes do Contrato',
            [
              { label: 'Hospital', value: 'hospital.nome' },
              { label: 'Quantidade', value: 'quantidadeSangue' },
              { label: 'Situação', value: 'situacao' },
              { label: 'Vencimento', value: 'vencimento' }
            ],
            contract
          );
        }
      });
    } else if (this.selectedCard === 'Requisições de bolsas') {
      this.requisitionService.getRequisitionById(rowData.id).subscribe({
        next: (requisition) => {
          // Calcula campos dinamicamente a partir dos dados da API
          const processedData = {
            ...requisition,
            quantidade: this.calculateTotalBags(requisition.bolsas || []),
            componentes: this.getComponentsList(requisition.bolsas || [])
          };
  
          this.setDialogConfig(
            'Detalhes da Requisição',
            [
              { label: 'Hospital', value: 'hospital.nome' },
              { label: 'Total de Bolsas', value: 'quantidade' },
              { label: 'Hemocomponentes', value: 'componentes' },
              { label: 'Hemocentro', value: 'hemocentro.nome' },
              { label: 'Usuário Requerido', value: 'usuarioRequerido.nome' },
              { label: 'Usuário Requerimento', value: 'usuarioRequerimento.nome' },
              { label: 'Situação', value: 'situacao' }
            ],
            processedData
          );
        }
      });
    }
  }

  private setDialogConfig(title: string, fields: any[], data: any) {
    this.dialogTitle = title;
    this.dialogFields = fields;
    this.selectedItem = data;
    this.detailDialog.showDialog();
  }

  private calculateTotalBags(bolsas: any[]): number {
    return bolsas.reduce((total, bolsa) => total + bolsa.qtdRequirida, 0);
  }

  private getComponentsList(bolsas: any[]): string {
    return bolsas.map(b => 
      `${b.hemocomponente} (Quantidade: ${b.qtdRequirida}, Tipo Sanguíneo: ${b.abo}${b.rh})`
    ).join(', ');
  }

  private updateTableColumns(dataType: string): void {
    if (dataType === 'contratos') {
      this.tableColumns = [
        { field: 'requisitionType', header: 'Tipo de Requisição' },
        { field: 'requester', header: 'Requisitante' },
        { field: 'quantity', header: 'Quantidade (ml)' },
        { field: 'status', header: 'Situação' },
        { field: 'expiration', header: 'Vencimento' }
      ];
    }
    else if (dataType === 'requisicoes') {
      this.tableColumns = [
        { field: 'requisitionType', header: 'Tipo' },
        { field: 'requester', header: 'Hospital' },
        { field: 'quantidade', header: 'Total de Bolsas' },
        { field: 'componentes', header: 'Hemocomponentes' },
        { field: 'status', header: 'Status' },
        { field: 'hemocentro', header: 'Hemocentro' }
      ];
    }
  }

}

