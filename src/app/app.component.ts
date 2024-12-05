import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPageComponent } from "./components/login-page/login-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vitae-sangue';
}
