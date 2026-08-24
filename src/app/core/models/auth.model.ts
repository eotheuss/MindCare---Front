export interface DadosAutenticacao {
  nomeUsuario: string;
  senha: string;
}

export interface DadosTokenJWT {
  token: string;
  userRole: string;
}
