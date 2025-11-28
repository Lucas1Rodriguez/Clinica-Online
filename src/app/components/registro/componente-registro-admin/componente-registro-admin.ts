import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-registro-admin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './componente-registro-admin.html',
  styleUrl: './componente-registro-admin.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ComponenteRegistroAdmin {

  usuario: any = null;
  nombreUsuario: string | null = null;
  adminForm: FormGroup;
  previsualizarUrls: string[] = [];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private supabaseService: Supabase, private router: Router){
    this.adminForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      edad: [null, [Validators.required, Validators.min(1), Validators.max(99)]],
      dni: [null, [Validators.required, Validators.min(11111111),Validators.max(99999999)]],
      mail: ['', [Validators.required,Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
      fotos: [[], [Validators.required, this.validarCantidadFotos(1)]]
    });
  }

  volver(){
    this.router.navigate(['/home']);
    this.adminForm.reset();
    this.previsualizarUrls = [];
  }


  async enviarAdmin() {
    if (this.adminForm.valid) {

      const {nombre, apellido, edad, dni, mail, contrasena, fotos } = this.adminForm.value;

      try{

        const existente = await this.supabaseService.obtenerUsuarioPorEmail(mail);
        if (existente) {
          Swal.fire('Error', 'Este correo ya está registrado en el sistema.', 'error');
          return;
        }

        const { data, error } = await this.supabaseService.registrarse( mail, contrasena);

        if (error) throw error;

        const { error: insertError } = await this.supabaseService.getCliente()
          .from('admins')
          .insert({
            id: data.user?.id,
            nombre,
            apellido,
            edad,
            dni,
            mail,
            fotos
          });

        if (insertError) throw insertError;

        Swal.fire({
          title: '<strong>Administrador Registrado!</strong>',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
          });
        
          this.adminForm.reset();
          this.router.navigate(['/registro']);
          this.previsualizarUrls = [];
      }catch(error: any){
        console.error('Error en Supabase:', error);
        Swal.fire({
          title: '<strong>Error!</strong>',
          html: 'No se pudo registrar al administrador. Intenta nuevamente.</b>',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
          });
      }
    } else
    {
      const nombre = this.adminForm.get('nombre');
      const apellido = this.adminForm.get('apellido');
      const edad = this.adminForm.get('edad');
      const dni = this.adminForm.get('dni')
      const mail = this.adminForm.get('mail');
      const contrasena = this.adminForm.get('contrasena');
      const fotos = this.adminForm.get('fotos');


      const camposInvalidos = [nombre, apellido, edad, dni, mail, contrasena, fotos]
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
          case mail:
            mensaje = 'Revisar que el mail ingresado esté escrito correctamente.';
            break;
          case contrasena:
            mensaje = 'La contraseña debe contener entre 2 y 15 caracteres.';
            break;
          case fotos:
            mensaje = 'Debe ingresar 1 foto.';
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

    const archivos = Array.from(files).slice(0, 1);

    const base64Promises = archivos.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    this.previsualizarUrls = await Promise.all(base64Promises);
    this.adminForm.patchValue({ fotos: this.previsualizarUrls });
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
