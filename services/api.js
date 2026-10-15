const itensMock = [
  {
    id: 1,
    nome: 'Item Exemplo 1',
    descricao: 'Descrição do primeiro item',
    categoria: 'Categoria A',
  },
  {
    id: 2,
    nome: 'Item Exemplo 2',
    descricao: 'Descrição do segundo item',
    categoria: 'Categoria B',
  },
  // ... adicionem os itens reais do projeto de vocês
];

/**
 * Busca todos os itens.
 * HOJE: retorna dados falsos.
 * AMANHÃ: vai chamar a API Spring Boot.
 */
export async function buscarItens() {
  // Simula um pequeno atraso, como se fosse a rede
  await new Promise((resolve) => setTimeout(resolve, 500));
  return itensMock;
}

/**
 * Busca um item específico pelo id.
 */
export async function buscarItemPorId(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return itensMock.find((i) => i.id === Number(id));
}