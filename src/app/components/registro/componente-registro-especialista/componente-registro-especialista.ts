import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-componente-registro-especialista',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './componente-registro-especialista.html',
  styleUrl: './componente-registro-especialista.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ComponenteRegistroEspecialista {

  usuario: any = null;
  nombreUsuario: string | null = null;
  previsualizarUrls: string[] = [];
  especialidades: string[] = ['Cardiología', 'Pediatría', 'Traumatología', 'Dermatología'];
  especialidadesSeleccionadas: string[] = [];
  especialistaForm: FormGroup;


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private supabaseService: Supabase, private router: Router){
    this.especialistaForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
        apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
        edad: [null, [Validators.required, Validators.min(18), Validators.max(99)]],
        dni: [null, [Validators.required, Validators.min(11111111),Validators.max(99999999)]],
        mail: ['', [Validators.required,Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
        especialidades: [[], [Validators.required]],
        nuevaEspecialidad: ['', [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
        fotos: [[], [Validators.required, this.validarCantidadFotos(1)]]
      });
  }

  
  volver(){
    this.router.navigate(['/registro']);
    this.especialistaForm.reset();
    this.previsualizarUrls = [];
  }

  async enviarEspecialista() {
    if (this.especialistaForm.valid) {

      const {nombre, apellido, edad, dni, mail, contrasena, especialidades, fotos } = this.especialistaForm.value;

      try{
        const { data, error } = await this.supabaseService.registrarse( mail, contrasena);

        if (error) throw error;

        const { error: insertError } = await this.supabaseService.getCliente()
          .from('especialistas')
          .insert({
            id: data.user?.id,
            nombre,
            apellido,
            edad,
            dni,
            mail,
            especialidades,
            fotos
          });

        if (insertError) throw insertError;

        Swal.fire({
          title: '<strong>Especialista Registrado!</strong>',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
          });
        
          this.especialistaForm.reset();
          this.router.navigate(['/registro']);
          this.previsualizarUrls = [];
      }catch(error: any){
        console.error('Error en Supabase:', error);
        Swal.fire({
          title: '<strong>Error!</strong>',
          html: 'No se pudo registrar al especialista. Intenta nuevamente.</b>',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
          });
      }
    } else
    {
      const nombre = this.especialistaForm.get('nombre');
      const apellido = this.especialistaForm.get('apellido');
      const edad = this.especialistaForm.get('edad');
      const dni = this.especialistaForm.get('dni')
      const mail = this.especialistaForm.get('mail');
      const contrasena = this.especialistaForm.get('contrasena');
      const especialidades = this.especialistaForm.get('especialidades');
      const fotos = this.especialistaForm.get('fotos');


      const camposInvalidos = [nombre, apellido, edad, dni, especialidades, mail, contrasena, fotos]
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
            mensaje = 'La edad debe estar entre 1 y 99 años.';
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
          case especialidades:
            mensaje = 'Debe elegir al menos una especialidad.';
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

  onCheckboxChange(event: any) {
    const value = event.target.value;
    const checked = event.target.checked;

    if (checked && !this.especialidadesSeleccionadas.includes(value)) {
      this.especialidadesSeleccionadas.push(value);
    } else if (!checked) {
      this.especialidadesSeleccionadas = this.especialidadesSeleccionadas.filter(e => e !== value);
    }

    this.especialistaForm.patchValue({ especialidades: this.especialidadesSeleccionadas });
  }

  agregarEspecialidad() {
    const control = this.especialistaForm.get('nuevaEspecialidad');
    const nueva = control?.value?.trim();

    if (!nueva) return;

    if (control?.invalid) {
      let mensaje = 'La especialidad debe tener entre 3 y 30 letras.';
      if (control.hasError('pattern')) {
        mensaje = 'La especialidad solo puede contener letras y espacios.';
      }

      Swal.fire({
        title: 'Especialidad invalida',
        text: mensaje,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (this.especialidades.includes(nueva)) {
      Swal.fire({
        title: 'Especialidad repetida',
        text: 'Esa especialidad ya existe.',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.especialidades = [...this.especialidades, nueva];

      this.especialidadesSeleccionadas = [...this.especialidadesSeleccionadas, nueva];

      this.especialistaForm.patchValue({
        especialidades: this.especialidadesSeleccionadas
      });

      control?.reset();

      this.cdr.detectChanges();

      Swal.fire({
        title: 'Especialidad agregada',
        text: `"${nueva}" se agregó correctamente.`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
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
    this.especialistaForm.patchValue({ fotos: this.previsualizarUrls });
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
