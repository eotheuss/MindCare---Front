export interface UsuarioDTO {
  nomeUsuario: string;
  senha: string;
  nomeCompleto: string;
  dataNascimento: string;
  genero: string;
  ativo: boolean;
  dataHoraAtivacao?: string | null;
  token?: string | null;
  userRole: string;
}
