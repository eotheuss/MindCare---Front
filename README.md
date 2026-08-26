# MindCare Diary — Frontend (Angular)

Frontend em Angular do MindCare Diary: login, área do paciente (diário, relatórios,
prescrições, agendamento), área do profissional (lista de pacientes, ficha do
paciente) e área do administrador (dashboard por clínica, cadastro de clínica).
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

O dashboard por clínica e o cadastro de clínicas (as telas do administrador) só ficam
acessíveis para um usuário com `userRole = ADMIN`. O backend, porém, **não tem hoje um
endpoint público para criar um usuário administrador** — só existem `POST /profissionais`
e `POST /pacientes`. Para conseguir um usuário admin para testes:

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
    patient/       # telas do paciente
    professional/  # telas do profissional
```

## Limitações conhecidas do backend

- Não existe um endpoint público para criar um usuário `ADMIN` (ver seção de login acima) —
  o cadastro de clínica só cria profissionais (`userRole = PROFISSIONAL`).
- O dashboard busca a clínica pelo nome (`GET /clinicas/{nome}/nome`); a busca por CNPJ
  (`GET /clinicas/{cnpj}/cnpj`) existe mas hoje não retorna pacientes/profissionais
  vinculados — prefira buscar pelo nome.
