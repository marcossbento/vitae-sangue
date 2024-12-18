import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}

