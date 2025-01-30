import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';
import { RequisitionService } from '../../services/requisition.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    TableModule,
    CommonModule
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
          requisitionType: 'Requisição de Bolsas',
          requester: requisicao.hospital.nome,
          quantidade: this.calculateTotalBags(requisicao.bolsas),
          componentes: this.getComponentsList(requisicao.bolsas),
          status: requisicao.situacao,
          hemocentro: requisicao.hemocentro.nome
        }));
        
        this.updateTableColumns('requisicoes');
      },
      error: (err: any) => console.error('Erro ao carregar requisições:', err)
    });
  }

  private calculateTotalBags(bolsas: any[]): number {
    return bolsas.reduce((total, bolsa) => total + bolsa.qtdRequirida, 0);
  }

  private getComponentsList(bolsas: any[]): string {
    return bolsas.map(b => `${b.hemocomponente} (${b.qtdRequirida})`).join(', ');
  }

  private updateTableColumns(dataType: string): void {
    if(dataType === 'contratos') {
      this.tableColumns = [
        { field: 'requisitionType', header: 'Tipo de Requisição' },
        { field: 'requester', header: 'Requisitante' },
        { field: 'quantity', header: 'Quantidade (ml)' },
        { field: 'status', header: 'Situação' },
        { field: 'expiration', header: 'Vencimento' }
      ];
    }
    else if(dataType === 'requisicoes') {
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

