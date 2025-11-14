import { Component } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-componente-mi-perfil-admin',
  imports: [CommonModule],
  templateUrl: './componente-mi-perfil-admin.html',
  styleUrl: './componente-mi-perfil-admin.css',
})
export class ComponenteMiPerfilAdmin {
  perfil: any = null;
  adminId!: string;

  constructor(private supabase: Supabase) {}

  async ngOnInit() {
    const user = await this.supabase.obtenerUsuario();
    this.adminId = user?.id ?? "";

    const { data } = await this.supabase.getCliente()
      .from("admins")
      .select("*")
      .eq("id", this.adminId)
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
