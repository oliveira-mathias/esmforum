const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando a inicialização de respostas para uma pergunta', () => {
  modelo.cadastrar_pergunta('Quanto vale pi?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);

  const id_pergunta = perguntas[0].id_pergunta;

  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(0);
})

test('Testando o cadastro de três respostas', () => {
  modelo.cadastrar_pergunta('Quanto vale pi?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);

  const id_pergunta = perguntas[0].id_pergunta;

  modelo.cadastrar_resposta(id_pergunta, "3,141592...");
  modelo.cadastrar_resposta(id_pergunta, "A razão da circunferência de um círculo pelo seu diâmetro");
  modelo.cadastrar_resposta(id_pergunta, "Algo maior que 3 e menor que 4");
  
  const respostas = modelo.get_respostas(id_pergunta);

  expect(respostas.length).toBe(3);

  expect(respostas[0].texto).toBe("3,141592...");
  expect(respostas[1].texto).toBe("A razão da circunferência de um círculo pelo seu diâmetro");
  expect(respostas[2].texto).toBe("Algo maior que 3 e menor que 4");

})

test('Testando a consistência do cadastro de perguntas', () => {
  modelo.cadastrar_pergunta('Quanto vale e?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);

  const id_pergunta = perguntas[0].id_pergunta;

  pergunta_bd = modelo.get_pergunta(id_pergunta);

  expect(pergunta_bd.id_pergunta).toBe(id_pergunta);
  expect(pergunta_bd.texto).toBe('Quanto vale e?');
})

test('Testando a consistência do cadastro de respostas', () => {
  modelo.cadastrar_pergunta('Quanto vale pi?');
  modelo.cadastrar_pergunta('Quanto vale e?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(2);

  const id_pergunta_1 = perguntas[0].id_pergunta;
  const id_pergunta_2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(id_pergunta_1, "3,141592...");
  modelo.cadastrar_resposta(id_pergunta_1, "Algo maior que 3 e menor que 4");
  
  modelo.cadastrar_resposta(id_pergunta_2, "2.718281...");
  modelo.cadastrar_resposta(id_pergunta_2, "Algo maior que 2 e menor que 3");
  modelo.cadastrar_resposta(id_pergunta_2, "Certamente é menor que pi");

  const respostas_1 = modelo.get_respostas(id_pergunta_1);
  expect(respostas_1.length).toBe(2);

  const respostas_2 = modelo.get_respostas(id_pergunta_2);
  expect(respostas_2.length).toBe(3);

  expect(respostas_1[0].texto).toBe("3,141592...");
  expect(respostas_1[1].texto).toBe("Algo maior que 3 e menor que 4");
  expect(respostas_1[0].id_pergunta).toBe(id_pergunta_1);
  expect(respostas_1[1].id_pergunta).toBe(id_pergunta_1);
  
  expect(respostas_2[0].texto).toBe("2.718281...");
  expect(respostas_2[1].texto).toBe("Algo maior que 2 e menor que 3");
  expect(respostas_2[2].texto).toBe("Certamente é menor que pi");
  expect(respostas_2[0].id_pergunta).toBe(id_pergunta_2);
  expect(respostas_2[1].id_pergunta).toBe(id_pergunta_2);
  expect(respostas_2[2].id_pergunta).toBe(id_pergunta_2);
})