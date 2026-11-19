# Trilha Financeira

Aplicativo mobile de educação financeira para estudantes aprenderem conceitos do mercado de investimentos e praticarem decisões em um ambiente simulado, sem movimentar dinheiro real.

## Problema e proposta

O projeto busca apoiar o aprendizado de conceitos financeiros e de investimentos por meio de conteúdo introdutório e prática simulada. A proposta é oferecer um espaço acessível para explorar categorias de investimento e registrar decisões de prática, sem apresentar as simulações como cotações ou recomendações reais.

O público previsto são estudantes e pessoas em fase de aprendizagem financeira. Esta descrição apresenta a proposta do projeto; não afirma resultados de pesquisa ou avaliação.

## Objetivo e relação com as ODS

O objetivo é ensinar conceitos básicos de educação financeira e funcionamento do mercado de investimentos por meio de uma experiência mobile com conteúdo e simulações educativas.

- **ODS 1 — Erradicação da pobreza:** educação financeira pode apoiar o planejamento e o conhecimento sobre decisões econômicas.
- **ODS 4 — Educação de qualidade:** a plataforma organiza conteúdo introdutório e atividades de aprendizagem.
- **ODS 8 — Trabalho decente e crescimento econômico:** conhecimentos financeiros fazem parte da formação para participação econômica consciente.

Essas relações descrevem a intenção educativa do projeto, sem alegar impacto medido.

## Funcionalidades

- Cadastro e login de usuários.
- Painel inicial com saldo virtual e quantidade de simulações obtidos pela API.
- Conteúdo introdutório sobre educação financeira, bolsa, ações, investimentos, risco e retorno.
- Consulta das categorias educativas de investimento cadastradas no MySQL.
- Registro de simulações com créditos virtuais, com validação de saldo e histórico por usuário.
- Histórico consultado pela API, com edição e exclusão das próprias simulações.
- Tela Minha conta para atualizar nome e e-mail; administradores também podem listar usuários e alterar seus níveis.

O saldo inicial virtual é R$ 10.000,00 por usuário. É apenas um crédito de demonstração. O sistema não consulta cotações, não calcula rentabilidade e não realiza operações financeiras.

## Níveis de usuário e permissões

- **Usuário:** acessa o conteúdo educativo, cria simulações e consulta, edita ou exclui somente seus registros. Também pode atualizar seus próprios dados.
- **Administrador:** além das funções comuns, pode consultar usuários e alterar o nível de outras contas.

As permissões são verificadas pela API com os middlewares `autenticarToken` e `somenteAdmin`. O nível enviado pelo cliente não é usado para autorizar requisições.

## Telas e navegação

O aplicativo usa React Navigation com um stack:

1. **Login** — autenticação e acesso ao cadastro.
2. **Cadastro** — criação de conta.
3. **Início** — resumo e acesso a aprendizado, simulador e histórico.
4. **Aprendizado** — conceitos financeiros em cartões curtos.
5. **Simulador** — categorias recebidas da API, saldo, valor e confirmação de registro.
6. **Histórico** — simulações persistidas para a conta autenticada, com ações para editar e excluir.
7. **Minha conta** — atualização do perfil; a listagem e gestão de usuários aparece para administradores.

O fluxo começa em Login/Cadastro. Com uma sessão válida, o stack apresenta Início, Aprendizado, Simulador, Histórico e Minha conta. Logout limpa token e usuário; respostas `401` também invalidam a sessão. Início e Histórico recarregam os dados ao receber foco.

## Estrutura do repositório

~~~text
App.js                    Navegação e sessão do app
screens/                  Telas mobile
services/api.js            URL centralizada e fetch com Bearer
backend/server.js          Servidor Express
backend/routes/            Rotas de autenticação, educação e usuários
backend/controllers/       Validações e operações no MySQL
backend/middlewares/       JWT e autorização administrativa
backend/database/          Pool MySQL
database/                  Criação e migração do schema
assets/                    Ícones e splash
docs/                      Apresentação PPTX e roteiro Markdown
~~~

## Tecnologias

- React Native e Expo SDK 57.
- React Navigation Native Stack.
- Expo SecureStore para persistir o token no Android/iOS; AsyncStorage como fallback para a sessão web.
- Node.js, Express e fetch() para comunicação com a API.
- MySQL com mysql2.
- JWT para manter a autenticação já implementada.

## Cadastro, JWT e Bearer Token

O cadastro exige nome, e-mail válido e senha entre 8 e 72 caracteres; e-mail duplicado retorna conflito. A senha é armazenada como hash bcrypt, nunca em texto puro. O login consulta o hash, compara a credencial e emite um JWT de duas horas usando `JWT_SECRET` do backend.

No Android/iOS, o token fica no Expo SecureStore (Android Keystore/iOS Keychain); o nome e e-mail não sensíveis ficam no AsyncStorage. Na web, os dois valores usam AsyncStorage como fallback. Nas rotas protegidas, `services/api.js` adiciona `Authorization: Bearer <token>`. O middleware verifica a assinatura e expiração, busca o nível atual no MySQL e preenche `req.usuario`. `somenteAdmin` bloqueia endpoints administrativos para os demais níveis.

## Estrutura do banco

O script database/educacao_financeira.sql cria o banco educacao_financeira e as tabelas:

- usuarios: contas e hashes de senha.
- investimentos: categorias educativas disponíveis para simulação; não representam ativos cotados.
- carteiras: saldo virtual por usuário.
- simulacoes: categoria, valor, resultado informativo e data de cada registro.

As chaves estrangeiras ligam carteira e simulações ao usuário e a categoria selecionada. O script database/migrar_usuarios.sql copia as contas do banco anterior loja_jwt, incluindo os hashes de senha. Ele deve ser executado somente se a base antiga existir. O banco antigo não é apagado.

Relacionamentos: `usuarios` 1:1 `carteiras`; `usuarios` 1:N `simulacoes`; `investimentos` 1:N `simulacoes`. `simulacoes.usuario_id` e `simulacoes.investimento_id` são chaves estrangeiras; `usuarios.email` e `investimentos.nome` são únicos.

## Rotas da API

Rotas financeiras exigem Authorization: Bearer <token>.

| Método | Rota | Ação |
| --- | --- | --- |
| POST | /auth/cadastro | Cria uma conta |
| POST | /auth/login | Autentica e retorna token |
| GET | /auth/me | Valida sessão e retorna perfil |
| GET | /inicio | Retorna saldo virtual e total de simulações |
| GET | /investimentos | Lista categorias educativas do banco |
| POST | /simulacoes | Debita saldo virtual e registra uma simulação |
| GET | /simulacoes | Lista o histórico da conta autenticada |
| PUT | /simulacoes/:id | Atualiza valor e categoria de uma simulação própria |
| DELETE | /simulacoes/:id | Exclui simulação própria e devolve o crédito virtual |
| PUT | /usuarios/me | Atualiza nome e e-mail da própria conta |
| GET | /usuarios | Lista usuários (somente admin) |
| PUT | /usuarios/:id/nivel | Altera nível de outro usuário (somente admin) |

## Configuração e execução

Requisitos: Node.js 22.13 ou superior, MySQL e npm. Instale as dependências do projeto:

~~~bash
npm install
~~~

### MySQL e backend

1. Crie as tabelas e categorias educativas:

~~~bash
mysql -u root -p < database/educacao_financeira.sql
~~~

2. Se as contas ainda estiverem no banco anterior, copie-as:

~~~bash
mysql -u root -p < database/migrar_usuarios.sql
~~~

3. Opcionalmente, crie um usuário MySQL local com permissões limitadas para o backend (troque a senha de exemplo):

~~~sql
CREATE USER 'educacao_financeira_app'@'localhost' IDENTIFIED BY 'escolha_uma_senha_local';
GRANT SELECT, INSERT, UPDATE, DELETE ON educacao_financeira.* TO 'educacao_financeira_app'@'localhost';
~~~

4. Se ainda não existir, copie backend/.env.example para backend/.env. Se já existir, preserve seus valores locais e ajuste DB_NAME para educacao_financeira. Configure DB_HOST, DB_PORT, DB_USER e DB_PASSWORD, e defina um JWT_SECRET aleatório com pelo menos 32 caracteres. Não use valores do exemplo como segredos. As contas do banco antigo precisam ser copiadas pelo passo anterior antes de voltar a entrar.
5. Inicie a API a partir da pasta do projeto:

~~~bash
npm run api
~~~

A API usa por padrão a porta 3000. O serviço MySQL precisa estar iniciado e acessível com as credenciais configuradas.

### Aplicativo Expo e APK Android

Para desenvolvimento, copie `.env.example` para `.env` na raiz e ajuste `EXPO_PUBLIC_API_URL` para a API: `http://localhost:3000` no navegador local, `http://10.0.2.2:3000` no emulador Android, ou o IP LAN do computador em um celular na mesma rede. Inicie o Expo com:

~~~bash
npm start
~~~

O APK não pode usar `localhost`, `127.0.0.1` ou `10.0.2.2`. É necessário hospedar a API em um endereço HTTPS acessível ao dispositivo, ou usar o IP LAN do computador durante uma demonstração na mesma rede Wi-Fi. Nesse modo local, mantenha a API ativa, libere a porta 3000 no firewall e use o mesmo Wi-Fi; mudanças de IP exigem novo build. Não invente um endereço de produção. `EXPO_PUBLIC_API_URL` é incorporada ao app e não pode conter segredos.

O perfil EAS `apk` está configurado para gerar um APK interno instalável. Antes do build, configure `EXPO_PUBLIC_API_URL` como variável pública no ambiente EAS `preview`, faça login no Expo e vincule o projeto a uma conta Expo. Depois execute:

~~~bash
npx eas-cli@latest build --platform android --profile apk
~~~

Passos para configurar a conta e a URL (substitua `URL_PUBLICA_DA_API` pelo endereço real da sua API; não use esse texto literal):

~~~bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL --value "URL_PUBLICA_DA_API" --environment preview --visibility plaintext
~~~

O comando retorna o link do artefato EAS. Baixe o APK pelo link e instale-o no Android. O APK deste projeto já foi gerado com o perfil apk no EAS. Para a demonstração atual, EXPO_PUBLIC_API_URL usa um Cloudflare Quick Tunnel; a URL é temporária e requer que o túnel e a API permaneçam ativos. O hook de build interrompe a geração se a URL estiver ausente ou usar loopback/emulador.

### Admin inicial

Defina `ADMIN_NOME`, `ADMIN_EMAIL` e `ADMIN_SENHA` em `backend/.env` e execute `npm run criar-admin`. O script grava a senha com bcrypt e não cria outra conta se esse e-mail já existir. Não versionar o `.env` nem reutilizar a senha de desenvolvimento na entrega.

### Testes executados

- `npm run lint` passou.
- `npx expo-doctor` passou em 21/21 verificações após atualizar Expo para a versão patch requerida pelo SDK 57.
- `npx expo export --platform web` e `--platform android` passaram; são compilações dos bundles JS, não builds nativos/APK.
- Testes de integração com a API e o MySQL cobriram cadastro, duplicidade, bcrypt, login, JWT ausente/inválido/expirado, permissões de admin, CRUD, isolamento entre contas, edição e persistência após novo login.
- O build EAS do perfil apk foi concluído e o APK foi gerado. A instalação e validação em dispositivo Android real ainda precisam ser feitas.
- `npm audit` reporta avisos: 9 no total (8 moderados e 1 alto), sendo 3 moderados na árvore de produção e nenhum alto nela. A correção sugerida para a cadeia Expo exige downgrade de SDK; não apliquei um downgrade incompatível.

O projeto é JavaScript e não contém `tsconfig.json`; portanto, `tsc --noEmit` não funciona como typecheck deste repositório.

## Arquivos de apoio

- backend/.env.example: modelo fictício para configuração da API.
- .env.example: endereço configurável da API para o aplicativo.
- docs/apresentacao.pptx: apresentação de 12 slides.
- docs/apresentacao.md: roteiro-fonte da apresentação.
- database/loja_jwt.sql: script antigo descontinuado; use os scripts de educação financeira acima.

