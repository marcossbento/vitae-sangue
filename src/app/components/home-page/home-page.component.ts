import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

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
export class HomePageComponent {
user: any;
cardItems: any[];
requisition: any[];

constructor () {
  this.user = {
    name: 'Usuário'
  }

  this.cardItems = [
    {title: 'Contratos', pendingNumber: '4 contratos', image: '../../assets/images/contratos.jpg'},
    {title: 'Requisições de bolsas', pendingNumber: '6 requisições', image: '../../assets/images/bolsasDeSangue.jpg'},
    {title: 'Envio de bolsas', pendingNumber: '1 envio', image: '../../assets/images/bolsasDeSangue.jpg'}
  ];

  this.requisition = [
    {requisitionType: 'Contratos', requester: 'Hospital 1'},
    {requisitionType: 'Requisições de bolsas', requester: 'Hospital 2'},
    {requisitionType: 'Envio de bolsas', requester: 'Hospital 3'}
  ];

}

}

