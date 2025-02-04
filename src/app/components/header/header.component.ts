import { Component, NgModule } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AvatarModule, AvatarGroupModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  user: any = {
    name: 'carregando...',
    nameFirstLetter: 'C',
  };

  private leaveTimer: any;
  showDropdown = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.getLoggedUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.user.nameFirstLetter = userData.name.charAt(0).toUpperCase();
      },
      error: () => {
        this.user.name = 'Erro ao carregar nome';
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  hideDropdown(): void {
    this.showDropdown = false;
  }

  onMouseLeave(): void {
    this.leaveTimer = setTimeout(() => {
      this.showDropdown = false;
    }, 300);
  }

  cancelLeave(): void {
    clearTimeout(this.leaveTimer);
  }

  logout(): void {
    // Limpar token e dados do usuário
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.clear();
    
    this.router.navigate(['/login']);
    
    this.hideDropdown();
  }
}