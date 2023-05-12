import { pool } from './connection'

export default function createTables() {
  pool.query(`CREATE TABLE IF NOT EXISTS cliente (
    cod_cliente varchar(36) not null unique,
    email varchar(50) not null unique,
    celular varchar(15) not null,
    primer_nombre varchar(15) not null,
    segundo_nombre varchar(15),
    primer_apellido varchar(15) not null,
    segundo_apellido varchar(15) not null,
    tipo_documento varchar(15) not null check(tipo_documento in('registro civil', 'targeta de identidad', 'cedula de ciudadania', 'cedula de extranjeria')),
    documento_identidad varchar(15) not null unique,
    PRIMARY KEY (cod_cliente)
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS paciente(
    cod_paciente varchar(36) not null unique,
    edad int not null,
    direccion varchar(15) not null,
    primer_nombre varchar(15) not null,
    segundo_nombre varchar(15),
    primer_apellido varchar(15) not null,
    segundo_apellido varchar(15) not null,
    tipo_documento varchar(15) not null check(tipo_documento in('registro civil', 'targeta de identidad', 'cedula de ciudadania', 'cedula de extranjeria')),
    documento_identidad varchar(15) not null unique,
    PRIMARY KEY (cod_paciente)
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS condicion_medica(
    cod_condicion_medica varchar(36) not null unique,
    cod_paciente varchar(36) not null,
    descripcion varchar(500) not null,
    PRIMARY KEY (cod_condicion_medica),
    FOREIGN KEY (cod_paciente) REFERENCES paciente(cod_paciente) ON DELETE CASCADE ON UPDATE CASCADE
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS enfermero(
    cod_enfermero varchar(36) not null unique,
    especialidad varchar(20) not null,
    titulo varchar(50) not null,
    email varchar(50) not null unique,
    celular varchar(15) not null unique,
    primer_nombre varchar(15) not null,
    segundo_nombre varchar(15),
    primer_apellido varchar(15) not null,
    segundo_apellido varchar(15) not null,
    tipo_documento varchar(15) not null check(tipo_documento in('registro civil', 'targeta de identidad', 'cedula de ciudadania', 'cedula de extranjeria')),
    documento_identidad varchar(15) not null unique,
    PRIMARY KEY (cod_enfermero)
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS cita(
    cod_cita varchar(36) not null unique,
    cod_enfermero varchar(36) not null,
    cod_cliente varchar(36) not null,
    cod_paciente varchar(36) not null,
    fecha date not null,
    hora time not null,
    razon_cita varchar(500) not null,
    dias int not null,
    PRIMARY KEY (cod_cita),
    FOREIGN KEY (cod_enfermero) REFERENCES enfermero(cod_enfermero),
    FOREIGN KEY (cod_cliente) REFERENCES cliente(cod_cliente),
    FOREIGN KEY (cod_paciente) REFERENCES paciente(cod_paciente)
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS extencion_cita(
    cod_extencion_cita varchar(36) not null unique,
    cod_cita varchar(36) not null,
    tiempo_extendido int not null,
    PRIMARY KEY (cod_extencion_cita),
    FOREIGN KEY (cod_cita) REFERENCES cita(cod_cita) ON DELETE CASCADE ON UPDATE CASCADE
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS visita(
    cod_visita varchar(36) not null unique,
    cod_cita varchar(36) not null,
    hora_entrada time not null,
    hora_salida time not null,
    PRIMARY KEY (cod_visita),
    FOREIGN KEY (cod_cita) REFERENCES cita(cod_cita) ON DELETE CASCADE ON UPDATE CASCADE
  )`)

  pool.query(`CREATE TABLE IF NOT EXISTS nota(
    cod_nota varchar(36) not null unique,
    cod_visita varchar(36) not null,
    contenido varchar(300) not null,
    PRIMARY KEY (cod_nota),
    FOREIGN KEY (cod_visita) REFERENCES visita(cod_visita) ON DELETE CASCADE ON UPDATE CASCADE
  )`)
}
