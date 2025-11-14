import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-registro',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './componente-registro.html',
  styleUrl: './componente-registro.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ComponenteRegistrar {

  mostrarBotones:boolean = true;

  constructor(private router: Router){
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.mostrarBotones = url === '/registro';

    });
  }

  registrarUsuario(){
    this.router.navigate(["registro/usuario"]);
  }

  registrarEspecialista(){
    this.router.navigate(["registro/especialista"]);
  }

  registrarAdmin(){
    this.router.navigate(["registro/admin"]);
  }

}
