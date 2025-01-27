import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../services/contract.service';

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
  user: any;
  cardItems: any[];

  selectedCard: string = '';
  tableData: any[] = [];
  tableColumns: any[] = [];

  constructor(private contractService: ContractService) {
    this.user = {
      name: 'Usuário'
    }

    this.cardItems = [
      { title: 'Contratos', pPhrase: 'os contratos', image: '../../assets/images/contratos.webp' },
      { title: 'Requisições de bolsas', pPhrase: 'as requisições de bolsa', image: '../../assets/images/bolsasDeSangue.webp' },
      { title: 'Envio de bolsas', pPhrase: 'os envios de bolsa', image: '../../assets/images/bolsasDeSangue.webp' }
    ];

  }

  ngOnInit(): void {
    this.loadContracts(); // Carrega contratos inicialmente
  }

  onCardClick(cardTitle: string): void {
    this.selectedCard = cardTitle;
    
    switch(cardTitle) {
      case 'Contratos':
        this.loadContracts();
        break;
      // Adicionar casos para os outros cards posteriormente
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
        
        this.updateTableColumns();
      },
      error: (err) => console.error('Erro ao carregar contratos:', err)
    });
  }

  private updateTableColumns(): void {
    this.tableColumns = [
      { field: 'requisitionType', header: 'Tipo de Requisição' },
      { field: 'requester', header: 'Requisitante' },
      { field: 'quantity', header: 'Quantidade (ml)' },
      { field: 'status', header: 'Situação' },
      { field: 'expiration', header: 'Vencimento' }
    ];
  }

}

