import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var grecaptcha: any;
declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Component({
  selector: 'app-componente-registro-usuario',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './componente-registro-usuario.html',
  styleUrl: './componente-registro-usuario.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ComponenteRegistroUsuario {

  usuario: any = null;
  nombreUsuario: string | null = null;
  usuarioForm: FormGroup;
  previsualizarUrls: string[] = [];
  captchaToken: string | null = null;
  
  
  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (window['grecaptcha']) {
        grecaptcha.render('captcha-container', {
          sitekey: '6Lf9NRAsAAAAAKJToFYvxpKMMRZSXYILTyQglVx6',
          callback: (token: string) => {
            this.captchaToken = token;
          }
        });
        clearInterval(interval);
      }
    }, 300);
  }

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private supabaseService: Supabase, private router: Router){

    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      edad: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      dni: [null, [Validators.required, Validators.min(11111111),Validators.max(99999999)]],
      obraSocial: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      mail: ['', [Validators.required,Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      fotos: [[], [Validators.required, this.validarCantidadFotos(2)]]
    });
  }


  volver(){
    this.router.navigate(['/registro'], { queryParams: {}});
    this.usuarioForm.reset();
    this.captchaToken = null;
    this.previsualizarUrls = [];
  }

  async enviarUsuario() {
    if (!this.captchaToken || this.captchaToken.length < 20) {
      Swal.fire("Error", "Captcha inválido o no resuelto.", "error");
      return;
    }

    if (this.usuarioForm.valid) {

      const {nombre, apellido, edad, dni, obraSocial, mail, contrasena, fotos } = this.usuarioForm.value;

      try{

        const existente = await this.supabaseService.obtenerUsuarioPorEmail(mail);
        if (existente) {
          Swal.fire('Error', 'Este correo ya está registrado en el sistema.', 'error');
          return;
        }

        const { data, error } = await this.supabaseService.registrarse( mail, contrasena);

        if (error) throw error;

        const { error: insertError } = await this.supabaseService.getCliente()
          .from('usuarios')
          .insert({
            id: data.user?.id,
            nombre,
            apellido,
            edad,
            dni,
            obraSocial,
            mail,
            fotos
          });

        if (insertError) throw insertError;

        Swal.fire({
          title: '<strong>Usuario Registrado!</strong>',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
          });
        
          this.usuarioForm.reset();
          this.router.navigate(['/registro']);
          this.previsualizarUrls = [];
          grecaptcha.reset();
          this.captchaToken = null;
      }catch(error: any){
        console.error('Error en Supabase:', error);
        Swal.fire({
          title: '<strong>Error!</strong>',
          html: 'No se pudo registrar al usuario. Intenta nuevamente.</b>',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
          });
      }
    } else
    {
      const nombre = this.usuarioForm.get('nombre');
      const apellido = this.usuarioForm.get('apellido');
      const edad = this.usuarioForm.get('edad');
      const dni = this.usuarioForm.get('dni')
      const obraSocial = this.usuarioForm.get('obraSocial');
      const mail = this.usuarioForm.get('mail');
      const contrasena = this.usuarioForm.get('contrasena');
      const fotos = this.usuarioForm.get('fotos');


      const camposInvalidos = [nombre, apellido, edad, dni, obraSocial, mail, contrasena, fotos]
      .filter(campo => campo?.invalid);

      if (camposInvalidos.length > 1) {
        Swal.fire({
          title: '<strong>Formulario incompleto</strong>',
          html: 'Por favor, completa correctamente todos los campos obligatorios.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      } else if (camposInvalidos.length === 1) 
      {
        const campo = camposInvalidos[0];
        let mensaje = '';
        switch (campo) {
          case nombre:
            mensaje = 'El nombre debe contener entre 2 y 15 caracteres.';
            break;
          case apellido:
            mensaje = 'El apellido debe contener entre 2 y 15 caracteres.';
            break;
          case edad:
            mensaje = 'La edad debe estar entre 18 y 99 años.';
            break;
          case dni:
            mensaje = 'El dni tiene que tener 8 digitos.';
            break;
          case obraSocial:
            mensaje = 'La obra social debe contener entre 2 y 20 caracteres.';
            break;
          case mail:
            mensaje = 'Revisar que el mail ingresado esté escrito correctamente.';
            break;
          case contrasena:
            mensaje = 'La contraseña debe contener entre 2 y 15 caracteres.';
            break;
          case fotos:
            mensaje = 'Debe ingresar 2 fotos.';
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

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const archivos = Array.from(files).slice(0, 2);

    const base64Promises = archivos.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    this.previsualizarUrls = await Promise.all(base64Promises);
    this.usuarioForm.patchValue({ fotos: this.previsualizarUrls });

  }

  validarCantidadFotos(cantidad: number) {
    return (control: any) => {
      const files = control.value;
      if (!files || files.length !== cantidad) {
        return { cantidadIncorrecta: true };
      }
      return null;
    };
  }
}
