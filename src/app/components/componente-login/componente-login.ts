import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './componente-login.html',
  styleUrl: './componente-login.css',
  animations: [
    trigger('fabList', [
      transition(':enter', [
        query('@fabItem', [
        ], { optional: true }),
        query('button.fab-item', [
          style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }),
          stagger(70, [
            animate('260ms cubic-bezier(.2,.8,.2,1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('button.fab-item', [
          stagger(-50, [
            animate('180ms ease', style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fabItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }),
        animate('260ms cubic-bezier(.2,.8,.2,1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('180ms ease', style({ opacity: 0, transform: 'translateY(8px) scale(0.95)' }))
      ])
    ])
  ]
})
export class ComponenteLogin {

  usuario: any = null;
  nombreUsuario: string | null = null;
  usuarioForm: FormGroup;
  usuariosDemo = [
  { nombre: 'Sebastian', mail: 'rojeso2635@fantastu.com', pass: 'Condor123', foto: '' },
  { nombre: 'Marcos', mail: 'wamejes759@wivstore.com', pass: '12345678', foto: '' },
  { nombre: 'Mario', mail: 'jolecor511@fantastu.com', pass: 'Contraseña1234', foto: '' },
  { nombre: 'Lorenzo', mail: 'lirodav141@wivstore.com', pass: 'Sanlorenzo1908', foto: '' },
  { nombre: 'Bartolome', mail: 'kemak23337@fantastu.com', pass: 'Barto12345', foto: '' },
  { nombre: 'Admin', mail: 'luks.rodriguez.03@gmail.com', pass: '12345678', foto: '' }
  ];
  fabAbierto = false;

  async ngOnInit() {
    try {
      const [usuarios, especialistas, admins] = await Promise.all([
        
        this.supabaseService.getCliente().from('usuarios').select('mail,fotos'),
        this.supabaseService.getCliente().from('especialistas').select('mail, fotos'),
        this.supabaseService.getCliente().from('admins').select('mail, fotos')
      ]);

      console.log('Usuarios:', usuarios.data);
      console.log('Especialistas:', especialistas.data);
      console.log('Admins:', admins.data);


      const todos = [
        ...(usuarios.data || []),
        ...(especialistas.data || []),
        ...(admins.data || [])
      ];

      this.usuariosDemo = this.usuariosDemo.map(u => {
        const encontrado = todos.find((db: any) => db.mail === u.mail);
        return {
          ...u,
          foto: encontrado?.fotos?.[0] ?? 'assets/iconos/user-placeholder.png'
        };
      });
    } catch (error) {
      console.error('Error cargando fotos:', error);
    }
  }


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private supabaseService: Supabase, private router: Router){

    this.usuarioForm = this.fb.group({
      mail: ['', [Validators.required,Validators.email]],
      contrasena: ['', [Validators.required, Validators.maxLength(15)]]
    });
  }


  async enviar() {
    if (this.usuarioForm.valid) {

      this.usuario = {
      mail: this.usuarioForm.value.mail,
      pass: this.usuarioForm.value.contrasena,
      nombre: this.usuariosDemo.find(u => u.mail === this.usuarioForm.value.mail)?.nombre ?? 'Usuario'
      };

      try {

        const datos = await this.supabaseService.obtenerUsuarioPorEmail(this.usuario.mail);

        if (datos?.rol === 'especialista' && !datos.habilitado) {
          Swal.fire('Acceso denegado', 'Tu cuenta de especialista está inhabilitada.', 'error');
          return;
        }

        const { error } = await this.supabaseService.login(this.usuario.mail, this.usuario.pass);
        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${this.usuario.nombre}!`,
          timer: 1200,
          showConfirmButton: false
        });

        this.router.navigateByUrl("/home");
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      Swal.fire('Error', 'No se pudo iniciar sesión.', 'error');
    }
    } else
    {
      const mail = this.usuarioForm.get('mail');
      const contrasena = this.usuarioForm.get('contrasena');
      
      const camposInvalidos = [mail, contrasena]
      .filter(campo => campo?.invalid);

      if (camposInvalidos.length > 1) {
        Swal.fire({
          title: '<strong>Formulario incompleto</strong>',
          html: 'Por favor, completa correctamente todos los campos.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      } else if (camposInvalidos.length === 1) 
      {
        const campo = camposInvalidos[0];
        let mensaje = '';
        switch (campo) {
          case mail:
            mensaje = 'El mail ingresado es incorrecto. Revisar haberlo escrito correctamente.';
            break;
          case contrasena:
            mensaje = 'La contraseña es incorrecta. Revisar haberla escrito correctamente.';
            break;
        }
        Swal.fire({
          title: '<strong>Campo inválido</strong>',
          html: mensaje,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });

      }

    }
  }


  toggleFab() {
    this.fabAbierto = !this.fabAbierto;
    this.cdr.detectChanges();
    console.log('FAB abierto:', this.fabAbierto);
  }

  async loginRapido(usuario: any) {
    try {

      const datos = await this.supabaseService.obtenerUsuarioPorEmail(usuario.mail);

      if (datos?.rol === 'especialista' && !datos.habilitado) {
        Swal.fire('Acceso denegado', 'Tu cuenta de especialista está inhabilitada.', 'error');
        return;
      }

      const { error } = await this.supabaseService.login(usuario.mail, usuario.pass);
      if (error) throw error;

      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido, ${usuario.nombre}!`,
        timer: 1200,
        showConfirmButton: false
      });

      this.router.navigateByUrl("/home");
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      Swal.fire('Error', 'No se pudo iniciar sesión.', 'error');
    }
  }

}
