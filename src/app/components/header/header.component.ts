import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
user: any;

constructor () {
  this.user = {
    name: 'Usuário',
    nameFirstLetter: 'U',
    position: 'Estagiário',
  }

}

}
