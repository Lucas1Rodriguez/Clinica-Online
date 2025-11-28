import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';
import { MostrarSiRolDirective } from '../../directivas/directivaMostrarSiRol';
import { NoEnRutaDirective } from '../../directivas/directivaNoEnRuta';

@Component({
  selector: 'app-componente-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, MostrarSiRolDirective, NoEnRutaDirective],
  templateUrl: './componente-menu.html',
  styleUrl: './componente-menu.css',
})
export class ComponenteMenu implements OnInit{

  usuarioId: string | null = null;
  rolActual: 'paciente' | 'especialista' | 'admin' | null = null;

  constructor(private supabase: Supabase, private router: Router, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.supabase.restaurarSesion();

    this.supabase.usuarioId$.subscribe(id => {
      this.usuarioId = id;

      if (id) {
        this.cargarRol();
      } else {
        this.rolActual = null;
      }
    });

    this.supabase.rolActual$.subscribe(rol => {
      this.rolActual = rol;
    });

  }

  get estaLogueado() {
    return !!this.usuarioId;
  }

  async cargarRol() {
    if (!this.usuarioId) return;

    const { data: esp } = await this.supabase.getCliente()
      .from("especialistas")
      .select("id")
      .eq("id", this.usuarioId)
      .maybeSingle();

    if (esp) {
      this.rolActual = "especialista";
      this.supabase.rolActual$.next("especialista");
      return;
    }

    const { data: pac } = await this.supabase.getCliente()
      .from("usuarios")
      .select("id")
      .eq("id", this.usuarioId)
      .maybeSingle();

    if (pac) {
      this.rolActual = "paciente";
      this.supabase.rolActual$.next("paciente");
      return;
    }

    const { data: admin } = await this.supabase.getCliente()
      .from("admins")
      .select("id")
      .eq("id", this.usuarioId)
      .maybeSingle();

    if (admin) {
      this.rolActual = "admin";
      this.supabase.rolActual$.next("admin");
      return;
    }
  }

  EstaEnComponente(ruta: string): boolean {
    return this.router.url === ruta;
  }

    cerrarSesion() {
    this.supabase.cerrarSesion();
    this.router.navigate(['/login']);
  }

}
