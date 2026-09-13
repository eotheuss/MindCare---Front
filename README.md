# MindCare Diary — Frontend (Angular)

Frontend em Angular do MindCare Diary: login, área do paciente (diário, relatórios,
prescrições, agendamento), área do profissional (lista de pacientes, ficha do
paciente) e área do administrador (dashboard por clínica, cadastro de clínica,
cadastro de usuários e agenda de consultas da clínica).
Consome a API REST do backend [mindcare-diary](https://github.com/ericaokamura/mindcare-diary).

## Pré-requisitos

- Node.js 18.13+ (testado com 18.17) e npm
- O backend [mindcare-diary](https://github.com/ericaokamura/mindcare-diary) rodando localmente na porta `8080`, com PostgreSQL configurado (veja o README daquele repositório)

## Como subir a aplicação

```bash
npm install
npm start
```

A aplicação sobe em [http://localhost:4200](http://localhost:4200).

Por padrão, o frontend chama a API em `http://localhost:8080` (veja
[`src/app/core/constants/api.constants.ts`](src/app/core/constants/api.constants.ts)).

### CORS no backend

O backend já está configurado para liberar `http://localhost:4200`
(`setAllowedOrigins(...)` em `SecurityConfiguration.java`). Se aparecer erro de CORS no
console do navegador, confira se essa configuração não foi revertida.

## Login: o usuário precisa ter `UserRole` = `ADMIN`

Depois de logado, o app redireciona o usuário de acordo com o `userRole` retornado por
`POST /login`:

| `userRole`     | Redireciona para  |
|----------------|--------------------|
| `ADMIN`        | `/admin/dashboard` |
| `PROFISSIONAL` | `/profissional`    |
| `PACIENTE`     | `/paciente/inicio` |

O dashboard por clínica, o cadastro de clínicas, o cadastro de usuários e a agenda (as
telas do administrador) só ficam acessíveis para um usuário com `userRole = ADMIN`.

Um admin logado pode cadastrar outro admin em `/admin/usuarios/novo` (chama
`POST /usuarios/admin`, protegido — só usuários autenticados com a authority
`USER_CREATE`, ou seja, já ADMIN, podem chamá-lo). Para o **primeiro** admin da instalação
(bootstrap, quando ainda não existe nenhum ADMIN para logar):

1. Suba o backend e acesse o Swagger em `http://localhost:8080/swagger-ui/index.html`.
2. Use o endpoint `POST /profissionais` para cadastrar um usuário qualquer (defina
   `nomeUsuario` e `senha` à sua escolha).
3. No banco `mindcare_db`, promova esse usuário a admin:

   ```sql
   UPDATE usuario SET user_role = 'ADMIN' WHERE nome_usuario = 'seu_usuario_aqui';
   ```

   (Se os nomes de tabela/coluna estiverem diferentes no seu banco, confira a estrutura
   real com `\d usuario` no `psql` — o Hibernate está com `ddl-auto=update`.)
4. Faça login no Angular (`http://localhost:4200/login`) com esse `nomeUsuario`/`senha`.
5. A partir daí, use `/admin/usuarios/novo` para cadastrar os próximos admins.

Cada admin só pode ter **uma** clínica associada. O botão "Nova clínica" e a rota
`/admin/nova-clinica` só aparecem/ficam acessíveis enquanto `GET /clinicas/admin/{nomeUsuario}`
não retornar nenhuma clínica para o admin logado; o backend também rejeita o cadastro
(`POST /clinicas`) se o admin já tiver uma.

## Estrutura do projeto

```
src/app/
  core/        # models, services HTTP, interceptor de auth, guards de rota/papel
  layout/      # shell (sidebar) usado pela área do administrador
  shared/      # componentes reutilizáveis (stat-card, bar-chart, bottom-nav)
  features/
    auth/         # tela de login
    dashboard/     # dashboard por clínica (admin)
    clinicas/      # cadastro de clínica (admin)
    usuarios/      # cadastro de usuário — admin/profissional/paciente (admin)
    agenda/        # agenda com as consultas de todos os profissionais da clínica (admin)
    patient/       # telas do paciente
    professional/  # telas do profissional
```

## Limitações conhecidas do backend

- Não existe endpoint público (sem autenticação) para criar um `ADMIN` — só um admin já
  logado pode criar outro, em `POST /usuarios/admin` (ver seção de login acima).
- O dashboard busca a clínica pelo nome (`GET /clinicas/{nome}/nome`); a busca por CNPJ
  (`GET /clinicas/{cnpj}/cnpj`) existe mas hoje não retorna pacientes/profissionais
  vinculados — prefira buscar pelo nome.
