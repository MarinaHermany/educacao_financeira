import { cadastrarUsuario } from './backend/controllers/authController.js';

const req = {
  body: { nome: 'Teste', email: 'teste@teste.com', senha: '12345678' },
};

const res = {
  status(code) {
    console.log('STATUS', code);
    return this;
  },
  json(payload) {
    console.log('JSON', payload);
    return this;
  },
};

try {
  await cadastrarUsuario(req, res);
} catch (error) {
  console.error('EXCEPTION', error);
}
