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

export interface Familia {
  id_familia: number;
  nombre_familia: string;
  id_tacho_asignado: number | null;
  puntos_grupales: number;
  fecha_creacion: string;
}

export interface Usuario {
  id_usuario: number;
  id_familia: number | null;
  nombre: string;
  email: string;
  estado_cuenta: EstadoCuenta;
  eco_puntos_personales: number;
  fecha_registro: string;
  familia?: Familia; // Optional relation
}
