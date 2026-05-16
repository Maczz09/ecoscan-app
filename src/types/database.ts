export type NotificationType = 'RECORDATORIO' | 'META_ALCANZADA' | 'ALERTA_SISTEMA';

export interface Notification {
  id_notificacion: number;
  id_usuario: number;
  titulo: string;
  mensaje: string;
  tipo: NotificationType;
  leida: boolean;
  fecha_creacion: string;
}

export type EstadoCuenta = 'PENDIENTE' | 'VERIFICADO' | 'BLOQUEADO';

export type Rol = 'USER' | 'ADMIN_GROUP' | 'ADMIN' | 'AUDITOR';

export interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  fecha_creacion: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  estado_cuenta: EstadoCuenta;
  rol: Rol;
  id_rol?: number;
  fecha_registro: string;
  id_grupo?: number;
  grupo?: Grupo; // Relación opcional
}
