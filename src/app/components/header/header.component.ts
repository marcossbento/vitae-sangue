import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
user: any = {
  name: 'carregando...',
  nameFirstLetter: 'C',

};

constructor (private userService: UserService) {}


ngOnInit() {
  this.userService.getLoggedUser().subscribe({
    next: (userData) => {
      this.user = userData;
    },
    error: () => {
      this.user.name = 'Erro ao carregar nome';
      this.user.email = 'Erro ao carregar email';
    }
  });
}
}
