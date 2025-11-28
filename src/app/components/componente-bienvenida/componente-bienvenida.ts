import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-componente-bienvenida',
  imports: [],
  templateUrl: './componente-bienvenida.html',
  styleUrl: './componente-bienvenida.css',
})
export class ComponenteBienvenida {

  constructor(private router: Router){}

  irALogin(){
    this.router.navigateByUrl("/login");
  }

  irARegistrar(){
    this.router.navigateByUrl("/registro");
  }


}
