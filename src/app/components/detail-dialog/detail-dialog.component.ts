import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent {
  @Input() data: any;
  @Input() dialogTitle: string = 'Detalhes';
  @Input() fields: { label: string, value: string }[] = [];
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  public getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o !== null && o !== undefined ? o[p] : null), obj) || '-';
  }
}