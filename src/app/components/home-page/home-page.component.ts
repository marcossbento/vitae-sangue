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
      { title: 'Usuarios', createButtonTitle: ' usuario', pPhrase: 'usuario', image: '../../assets/images/bolsasDeSangue.webp', link: '/user/create' }
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
      case 'Usuarios':
        this.loadUsuarios();
        break;
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
          expiration: contract.vencimento,
          actions: [
            { label: 'Aprovar', link: `/contrato/aprovar/${contract.id}`, styleClass: 'p-button-info' },
            { label: 'Negar', link: `/contrato/negar/${contract.id}`, styleClass: 'p-button-info' }
          ]
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
          usuarioRequerimento: requisicao.usuarioRequerimento?.nome || 'Não informado',
          actions: [
            { label: 'Aprovar', link: `/requisicao/aprovar/${requisicao.id}`, styleClass: 'p-button-info' },
            { label: 'Negar', link: `/requisicao/negar/${requisicao.id}`, styleClass: 'p-button-info' }
          ]
        }));
  
        this.updateTableColumns('requisicoes');
      },
      error: (err) => console.error('Erro ao carregar requisições:', err)
    });
  }  
  
  private loadUsuarios(): void {
    this.userService.geAlltUser().subscribe({
      next: (response) => {
        this.tableData = response.content.map((user: any) => ({
          id: user.id,
          nome: user.nome,
          cpf: user.cpf,
          email: user.email,
          perfil: user.perfil.nome,
          actions: [
            { label: 'Editar', link: `/user/edit/${user.id}`, styleClass: 'p-button-info' }
          ]
        }));
  
        this.updateTableColumns('usuario');
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
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
              { label: 'Vencimento', value: 'vencimento' },
              { label: 'Usuário Requerido', value: 'usuarioRequerido.nome' },
              { label: 'Usuário Requerimento', value: 'usuarioRequerimento.nome' }
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
    } else if (this.selectedCard === 'Usuarios') {
      this.userService.getUser(rowData.id).subscribe({
        next: (user) => {
          const formatPhones = (phones: any[]) => {
            return phones.map(phone => 
              `(${phone.ddd}) ${phone.numero}${phone.whatsapp ? ' (WhatsApp)' : ''} - ${phone.descricao}`
            ).join(', ');
          };
    
          const formatAddress = (endereco: any) => {
            return `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, CEP: ${endereco.cep}`;
          };
    
          const formatEstablishmentPhones = (phones: any[]) => {
            if (!phones || phones.length === 0) return 'Nenhum telefone cadastrado';
            return phones.map(phone => 
              `(${phone.ddd}) ${phone.numero}${phone.whatsapp ? ' (WhatsApp)' : ''} - ${phone.descricao}`
            ).join(', ');
          };
    
          var tipoEstabelecimento =  user.estabelecimento.hospital ? 'Hospital' : 'Hemocentro';

          const processedData = {
            ...user,
            enderecoCompleto: formatAddress(user.endereco),
            telefonesFormatados: formatPhones(user.telefones || []),
            estabelecimentoEndereco: user.estabelecimento ? formatAddress(user.estabelecimento.endereco) : '',
            estabelecimentoTelefones: user.estabelecimento ? formatEstablishmentPhones(user.estabelecimento.telefones) : '',
            tipoEstabelecimento
          };

    
          this.setDialogConfig(
            'Detalhes do Usuário',
            [
              // Informações Pessoais
              { label: 'Nome', value: 'nome' },
              { label: 'CPF', value: 'cpf' },
              { label: 'E-mail', value: 'email' },
              { label: 'Telefones', value: 'telefonesFormatados' },
              { label: 'Endereço', value: 'enderecoCompleto' },
              { label: 'Perfil', value: 'perfil.nome' },
              { label: 'Estabelecimento', value: 'estabelecimento.nome' },
              { label: 'E-mail do Estabelecimento', value: 'estabelecimento.email' },
              { label: 'Endereço do Estabelecimento', value: 'estabelecimentoEndereco' },
              { label: 'Telefones do Estabelecimento', value: 'estabelecimentoTelefones' },
              { label: 'Tipo', value: "tipoEstabelecimento" }
            ],
            processedData
          );
        },
        error: (error) => {
          console.error('Erro ao carregar detalhes do usuário:', error);
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
        { field: 'quantity', header: 'Quantidade' },
        { field: 'status', header: 'Situação' },
        { field: 'expiration', header: 'Vencimento' },
        { field: 'actions', header: 'Ações' } 
      ];
    }
    else if (dataType === 'requisicoes') {
      this.tableColumns = [
        { field: 'requisitionType', header: 'Tipo' },
        { field: 'requester', header: 'Hospital' },
        { field: 'quantidade', header: 'Total de Bolsas' },
        { field: 'componentes', header: 'Hemocomponentes' },
        { field: 'status', header: 'Status' },
        { field: 'hemocentro', header: 'Hemocentro' },
        { field: 'actions', header: 'Ações' }
      ];
    }
    else {
      this.tableColumns = [
        { field: 'nome', header: 'Nome' },
        { field: 'cpf', header: 'CPF' },
        { field: 'email', header: 'E-mail' },
        { field: 'perfil', header: 'Perfil' },
        { field: 'actions', header: 'Ações' }
      ];
    }
  }
  

}

