import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroments';


@Injectable({
  providedIn: 'root'
})
export class Supabase {

    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        );
    }
    
    getCliente() {
        return this.supabase;
    }

    async registrarse(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({email, password});
        return { data, error };
    }

    async login(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    async cerrarSesion() {
        return await this.supabase.auth.signOut();
    }

    async obtenerUsuario() {
        const { data } = await this.supabase.auth.getUser();
        return data.user;
    }

    async obtenerPerfil(id: string) {
        const { data, error } = await this.supabase
            .from('Perfiles')
            .select('usuario,rol')
            
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error al obtener perfil:', error.message);
            return null;
        }
        console.log('Perfil obtenido:', data);
        return data?.usuario ?? null;   

    }

    async obtenerRol(id: string) {
        const { data, error } = await this.supabase
            .from('Perfiles')
            .select('rol')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error al obtener rol:', error.message);
            return null;
        }

        return data?.rol ?? null;
    }

    async getSession() {
        const { data } = await this.supabase.auth.getSession();
        return data.session;
    }

    insertarPerfil(id: string, usuario: string, correo: string) {
        return this.supabase
        .from('Perfiles')
        .insert([{ id, usuario, correo }]);
}
}