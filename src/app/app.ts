import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ComponenteMenu } from './components/componente-menu/componente-menu';


@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, ComponenteMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
