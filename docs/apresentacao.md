# Apresentação — Trilha Financeira

Roteiro de 12 slides para a defesa. Os exemplos são educativos; não representam cotações, recomendação ou operação financeira real.

## Slide 1 — Identificação

**Trilha Financeira** — aplicativo mobile de educação financeira. Ensina conceitos de investimentos por meio de conteúdo e simulações com saldo virtual.

## Slide 2 — Problema identificado

- Pessoas em fase de aprendizagem precisam entender conceitos como risco, liquidez, diversificação e prazo.
- O projeto oferece um ambiente para estudar esses conceitos sem movimentar dinheiro.
- O público previsto são estudantes e iniciantes em educação financeira.

## Slide 3 — Solução proposta

- Conteúdo introdutório em cartões curtos.
- Categorias educativas de investimento carregadas da API.
- Simulações registradas com uma carteira virtual por usuário.
- O app informa que não calcula rentabilidade nem usa preços de mercado.

## Slide 4 — Funcionalidades

- Cadastro, login e logout.
- Início com saldo virtual e total de simulações.
- Aprendizado, simulador e histórico.
- Edição e exclusão das próprias simulações.
- Minha conta; administradores também podem consultar usuários e alterar níveis.

## Slide 5 — Tecnologias

- React Native e Expo SDK 57.
- React Navigation Native Stack; SecureStore no Android/iOS e AsyncStorage como fallback web.
- Node.js, Express e `fetch()`.
- MySQL com `mysql2`.
- `bcryptjs` para hash de senha e `jsonwebtoken` para JWT.

## Slide 6 — Arquitetura

Fluxo: App mobile (React Native) → API Express → MySQL.

- O app envia requisições com token JWT; a API valida o acesso e consulta o banco.
- A API retorna somente os registros do usuário autenticado.
- No APK, configure EXPO_PUBLIC_API_URL com uma URL HTTPS acessível pelo celular; localhost aponta para o próprio aparelho.

## Slide 7 — Autenticação

1. O cadastro valida os campos e gera hash da senha com bcrypt.
2. O login compara a senha com o hash e emite um JWT com expiração de duas horas.
3. O app mantém o token no SecureStore nativo (AsyncStorage na web) e envia `Authorization: Bearer <token>` nas chamadas autenticadas.
4. O middleware valida assinatura/expiração e recarrega o usuário do MySQL.

## Slide 8 — Níveis de usuário

- **Usuário:** conteúdo, simulações próprias, histórico próprio e atualização do próprio perfil.
- **Administrador:** também lista usuários e altera o nível de outras contas.
- O servidor aplica `autenticarToken` e `somenteAdmin`; esconder uma tela no app não é a proteção da API.

## Slide 9 — CRUD

- **Create:** `POST /simulacoes`, verifica saldo e registra dentro de transação.
- **Read:** `GET /simulacoes`, filtrado pelo ID autenticado.
- **Update:** `PUT /simulacoes/:id`, altera categoria/valor próprios e ajusta o saldo.
- **Delete:** `DELETE /simulacoes/:id`, remove registro próprio e devolve o crédito virtual.

## Slide 10 — Banco de dados

- `usuarios`: identidade, e-mail único, hash de senha e nível.
- `investimentos`: categorias educativas.
- `carteiras`: saldo virtual associado ao usuário.
- `simulacoes`: usuário, categoria, valor virtual, texto informativo e data.
- Chaves estrangeiras ligam usuários e categorias às simulações e carteiras.

## Slide 11 — Testes e correções

- Lint e exportação web Expo executados.
- Testes de API/MySQL: cadastro, duplicidade, bcrypt, login, JWT ausente/inválido/expirado, permissões, CRUD, isolamento, atualização do total e persistência após novo login.
- Correções anteriores: contador atualizado ao focar a tela inicial; confirmação de exclusão feita com modal multiplataforma.
- Navegação em dispositivo real, toque em cancelar no modal e APK EAS ainda precisam de validação manual.

## Slide 12 — Demonstração e conclusão

1. Criar uma conta comum e entrar.
2. Mostrar o conteúdo de aprendizado.
3. Registrar, editar e excluir uma simulação; conferir histórico e contador.
4. Entrar como administrador e mostrar a gestão de usuários.
5. Explicar que os valores são virtuais e não representam investimento real.

**Conclusão:** o projeto conecta aprendizagem, prática simulada e controle de acesso por API. A demonstração final depende de API acessível pelo telefone e build Android validado.
