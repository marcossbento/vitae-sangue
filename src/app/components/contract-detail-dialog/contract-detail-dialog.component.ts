import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-contract-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './contract-detail-dialog.component.html',
  styleUrls: ['./contract-detail-dialog.component.scss']
})
export class ContractDetailDialogComponent {
  @Input() contractData: any;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}