export interface IPatients {
  cod_paciente?: string
  edad: number
  direccion: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido: string
  tipo_documento: string
  documento_identidad: string
  condiciones_medicas?: Array<string>
}
