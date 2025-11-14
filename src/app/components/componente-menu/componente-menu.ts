import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-componente-menu',
  imports: [RouterLink, CommonModule],
  templateUrl: './componente-menu.html',
  styleUrl: './componente-menu.css',
})
export class ComponenteMenu implements OnInit{

 usuarioId: string | null = null;
  rolActual: 'paciente' | 'especialista' | 'admin' | null = null;

  constructor(private supabase: Supabase, private router: Router) {}

  async ngOnInit() {
    const session = await this.supabase.getSession();

    if (session?.user) {
      this.usuarioId = session.user.id;
    } else {
      const user = await this.supabase.obtenerUsuario();
      this.usuarioId = user?.id ?? null;
    }

    if (this.usuarioId) {
      console.log('Usuario logueado:', this.usuarioId);
      await this.cargarRol();
    }
  }

  get estaLogueado(): boolean {
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
      return;
    }

    const { data: pac } = await this.supabase.getCliente()
      .from("usuarios")
      .select("id")
      .eq("id", this.usuarioId)
      .maybeSingle();

    if (pac) {
      this.rolActual = "paciente";
      return;
    }

    const { data: admin } = await this.supabase.getCliente()
      .from("admins")
      .select("id")
      .eq("id", this.usuarioId)
      .maybeSingle();

    if (admin) {
      this.rolActual = "admin";
      return;
    }
  }

  async cerrarSesion() {
    await this.supabase.cerrarSesion();
    this.usuarioId = null;
    this.rolActual = null;
    this.router.navigate(['/login']);
  }
}
