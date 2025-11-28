import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroments';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Supabase {

    private supabase: SupabaseClient;

    usuarioId$ = new BehaviorSubject<string | null>(null);
    rolActual$ = new BehaviorSubject<'paciente' | 'especialista' | 'admin' | null>(null);

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
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return { data, error };

        this.usuarioId$.next(data.user.id);
        
        const user = data.user;
        
        const datos = await this.obtenerUsuarioPorEmail(email);
        this.rolActual$.next(datos?.rol ?? null);

        await this.supabase
            .from('logs_ingresos')
            .insert({
            usuario_id: user.id,
            email: user.email,
            rol: datos?.rol ?? 'desconocido'
            });

        return { data, error: null };
    }

    async restaurarSesion() {
        const { data } = await this.supabase.auth.getSession();
        const usuario = data.session?.user || null;

        this.usuarioId$.next(usuario?.id ?? null);
    }

    async cerrarSesion() {
        await this.supabase.auth.signOut();
        this.usuarioId$.next(null);
        this.rolActual$.next(null);
    }
    
    async setUsuarioManual(usuarioId: string | null, rol: 'paciente'|'especialista'|'admin'|null) {
        this.usuarioId$.next(usuarioId);
        this.rolActual$.next(rol);
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

    async getHorariosEspecialista(id: string) {
        const { data, error } = await this.supabase
            .from('especialistas')
            .select('horarios')
            .eq('id', id)
            .single();

        return data?.horarios || [];
    }

    async agregarHorario(especialistaId: string, horario: any) {
        const horariosActuales = await this.getHorariosEspecialista(especialistaId);

        const nuevosHorarios = [...horariosActuales, horario];

        const { error } = await this.supabase
            .from('especialistas')
            .update({ horarios: nuevosHorarios })
            .eq('id', especialistaId);

        return error ? null : horario;
    }

    async eliminarHorario(especialistaId: string, index: number) {

        const horariosActuales = await this.getHorariosEspecialista(especialistaId);

        horariosActuales.splice(index, 1);

        await this.supabase
            .from('especialistas')
            .update({ horarios: horariosActuales })
            .eq('id', especialistaId);

        return true;
    }

    async obtenerTodosLosUsuarios() {
        try {
            const { data: pacientes } = await this.supabase.from('usuarios').select('*');
            const { data: especialistas } = await this.supabase.from('especialistas').select('*');
            const { data: admins } = await this.supabase.from('admins').select('*');

            const listaPacientes = (pacientes || []).map(p => ({
            ...p,
            rol: 'paciente',
            habilitado: true
            }));

            const listaEspecialistas = (especialistas || []).map(e => ({
            ...e,
            rol: 'especialista',
            idEspecialista: e.id,
            habilitado: e.habilitado
            }));

            const listaAdmins = (admins || []).map(a => ({
            ...a,
            rol: 'admin',
            habilitado: true
            }));

            return [...listaPacientes, ...listaEspecialistas, ...listaAdmins];

        } catch (error) {
            console.error("Error obteniendo usuarios", error);
            return [];
        }
    }

    async obtenerUsuarioPorEmail(email: string) {
        let { data: usuarios } = await this.supabase
            .from('usuarios')
            .select('*')
            .eq('mail', email)
            .limit(1);

        if (usuarios && usuarios.length > 0) {
            return { ...usuarios[0], rol: 'paciente' };
        }

        let { data: especialistas } = await this.supabase
            .from('especialistas')
            .select('*')
            .eq('mail', email)
            .limit(1);

        if (especialistas && especialistas.length > 0) {
            return { ...especialistas[0], rol: 'especialista' };
        }

        let { data: admins } = await this.supabase
            .from('admins')
            .select('*')
            .eq('mail', email)
            .limit(1);

        if (admins && admins.length > 0) {
            return { ...admins[0], rol: 'admin' };
        }

        return null;
    }


    async cambiarEstadoEspecialista(id: string, estado: boolean) {
        const result = await this.supabase
            .from('especialistas')
            .update({ habilitado: estado })
            .eq('id', id);

        return result;
    }

    async guardarHistoriaClinica(historia: any) {
        const { data, error } = await this.supabase
            .from('historial_clinico')
            .insert(historia);

        if (error) throw error;
        return data;
    }
    
    getHistoriaPorPaciente(id: string) {
        return this.supabase
            .from('historial_clinico')
            .select('*')
            .eq('paciente_id', id)
            .order('fecha', { ascending: false });
    }

    getHistoriaPorEspecialista(id: string) {
        return this.supabase
            .from('historial_clinico')
            .select('*')
            .eq('especialista_id', id)
    }

    getTodosLosHistoriales() {
        return this.supabase
            .from('historial_clinico')
            .select('*')
            .order('fecha', { ascending: false });
    }
    getHistoriaPorTurno(turnoId: string) {
        return this.supabase
            .from('historial_clinico')
            .select('*')
            .eq('turno_id', turnoId)
            .maybeSingle();
    }


    getPacientes() {
    return this.supabase
        .from('usuarios')
        .select('id,nombre,apellido,mail')
        .order('nombre', { ascending: true });
    }

    async getPacientePorId(id: string) {
        return this.supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();
    }

    getLogsIngresos() {
        return this.supabase
        .from("logs_ingresos")
        .select("*")
        .order("fecha", { ascending: false });
    }

}