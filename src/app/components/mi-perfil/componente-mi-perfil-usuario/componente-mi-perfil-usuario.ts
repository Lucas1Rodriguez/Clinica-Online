import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-componente-mi-perfil-usuario',
  imports: [CommonModule],
  templateUrl: './componente-mi-perfil-usuario.html',
  styleUrl: './componente-mi-perfil-usuario.css',
})
export class ComponenteMiPerfilUsuario {
  perfil: any = null;
  usuarioId!: string;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.usuarioId = user?.id ?? "";

    const { data } = await this.supabase.getCliente()
      .from("usuarios")
      .select("*")
      .eq("id", this.usuarioId)
      .single();

      this.perfil = data || {};

      if (!this.perfil.fotos) {
        this.perfil.fotos = [];
      }

      if (typeof this.perfil.fotos === 'object' && !Array.isArray(this.perfil.fotos)) {
        this.perfil.fotos = Object.values(this.perfil.fotos);
      }
      console.log("PERFIL COMPLETO:", this.perfil);
  }

}

