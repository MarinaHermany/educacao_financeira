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
- Histórico consultado pela API.

O saldo inicial virtual é R$ 10.000,00 por usuário. É apenas um crédito de demonstração. O sistema não consulta cotações, não calcula rentabilidade e não realiza operações financeiras.

## Tipos de usuário e permissões previstas

- **Estudante/usuário:** cria uma conta, acessa os conteúdos, consulta as opções de simulação, registra simulações e consulta o próprio histórico.
- **Administrador:** existem rotas administrativas herdadas do trabalho anterior para gestão de usuários. A interface administrativa não faz parte do fluxo principal desta etapa.

O projeto mantém autenticação JWT já existente para as rotas protegidas. O controle administrativo completo e outras funcionalidades de autorização podem ser tratados na etapa prevista para isso.

## Telas e navegação

O aplicativo usa React Navigation com um stack:

1. **Login** — autenticação e acesso ao cadastro.
2. **Cadastro** — criação de conta.
3. **Início** — resumo e acesso a aprendizado, simulador e histórico.
4. **Aprendizado** — conceitos financeiros em cartões curtos.
5. **Simulador** — categorias recebidas da API, saldo, valor e confirmação de registro.
6. **Histórico** — simulações persistidas para a conta autenticada.

## Tecnologias

- React Native e Expo SDK 57.
- React Navigation Native Stack.
- AsyncStorage para persistir a sessão existente.
- Node.js, Express e fetch() para comunicação com a API.
- MySQL com mysql2.
- JWT para manter a autenticação já implementada.

## Estrutura do banco

O script database/educacao_financeira.sql cria o banco educacao_financeira e as tabelas:

- usuarios: contas e hashes de senha.
- investimentos: categorias educativas disponíveis para simulação; não representam ativos cotados.
- carteiras: saldo virtual por usuário.
- simulacoes: categoria, valor, resultado informativo e data de cada registro.

As chaves estrangeiras ligam carteira e simulações ao usuário e a categoria selecionada. O script database/migrar_usuarios.sql copia as contas do banco anterior loja_jwt, incluindo os hashes de senha. Ele deve ser executado somente se a base antiga existir. O banco antigo não é apagado.

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

### Aplicativo Expo

1. Copie .env.example para .env na raiz do projeto e ajuste EXPO_PUBLIC_API_URL para o endereço em que o dispositivo alcança a API.
2. Endereços comuns: http://localhost:3000 no navegador local; http://10.0.2.2:3000 no emulador Android; no celular físico, use o IP local do computador na mesma rede Wi-Fi.
3. Inicie o Expo:

~~~bash
npm start
~~~

EXPO_PUBLIC_API_URL é incluída no bundle do cliente; não coloque senhas, chaves privadas ou outros segredos nessa variável.

## Arquivos de apoio

- backend/.env.example: modelo fictício para configuração da API.
- .env.example: endereço configurável da API para o aplicativo.
- database/loja_jwt.sql: script antigo descontinuado; use os scripts de educação financeira acima.

