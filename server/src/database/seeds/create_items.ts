import Knex from 'knex';

export async function seed(knex: Knex) {
    return knex('items').insert([
        { title: 'Lampâdas', image: 'public/lampada.svg' },
        { title: 'Pilhas e Baterias', image: 'public/baterias.svg' },
        { title: 'Papéis e Papelão', image: 'public/papeis-papelao.svg' },
        { title: 'Resíduos Eletrônicos', image: 'public/eletronicos.svg' },
        { title: 'Resíduos Orgânicos', image: 'public/organicos.svg' },
        { title: 'Óleo de Cozinha', image: 'public/oleo.svg' }
    ])
}
