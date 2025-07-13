require('dotenv').config();
const mongoose = require('mongoose');
const { Product, Company } = require('../database/models');

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendergasdb');
    console.log('✅ Conectado ao MongoDB');

    const company = await Company.findOne();
    if (!company) {
      console.log('❌ Nenhuma empresa encontrada. Crie uma empresa primeiro!');
      return;
    }

    console.log(`📋 Inserindo produtos para empresa: ${company.fantasy_name}`);

    const products = [
      {
        company_id: company._id,
        name: 'Coca-Cola 350ml',
        value: 4.50,
        description: 'Refrigerante de cola 350ml gelado'
      },
      {
        company_id: company._id,
        name: 'Coca-Cola 2L',
        value: 8.90,
        description: 'Refrigerante de cola 2 litros'
      },
      {
        company_id: company._id,
        name: 'Guaraná Antarctica 350ml',
        value: 4.20,
        description: 'Refrigerante guaraná 350ml'
      },
      {
        company_id: company._id,
        name: 'Água Mineral 500ml',
        value: 2.50,
        description: 'Água mineral natural sem gás'
      },
      {
        company_id: company._id,
        name: 'Cerveja Skol 350ml',
        value: 3.80,
        description: 'Cerveja pilsen 350ml gelada'
      },
      {
        company_id: company._id,
        name: 'Suco de Laranja 1L',
        value: 6.90,
        description: 'Suco natural de laranja integral'
      },
      {
        company_id: company._id,
        name: 'Energético Red Bull 250ml',
        value: 8.50,
        description: 'Bebida energética Red Bull'
      },
      {
        company_id: company._id,
        name: 'Café Pilão 500g',
        value: 15.90,
        description: 'Café torrado e moído tradicional'
      },
      {
        company_id: company._id,
        name: 'Açúcar Cristal 1kg',
        value: 4.20,
        description: 'Açúcar cristal refinado'
      },
      {
        company_id: company._id,
        name: 'Arroz Tio João 1kg',
        value: 5.80,
        description: 'Arroz branco tipo 1'
      },
      {
        company_id: company._id,
        name: 'Feijão Carioca 1kg',
        value: 7.50,
        description: 'Feijão carioca tipo 1'
      },
      {
        company_id: company._id,
        name: 'Óleo de Soja 900ml',
        value: 6.20,
        description: 'Óleo de soja refinado'
      },
      {
        company_id: company._id,
        name: 'Macarrão Espaguete 500g',
        value: 3.90,
        description: 'Massa de trigo espaguete'
      },
      {
        company_id: company._id,
        name: 'Leite Integral 1L',
        value: 4.80,
        description: 'Leite integral longa vida'
      },
      {
        company_id: company._id,
        name: 'Pão de Açúcar 500g',
        value: 4.50,
        description: 'Pão de forma tradicional'
      }
    ];

    await Product.deleteMany({ company_id: company._id });
    console.log('🧹 Produtos anteriores removidos');

    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} produtos inseridos com sucesso!`);

    console.log('\n📦 Produtos inseridos:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - R$ ${product.value.toFixed(2)}`);
    });

    console.log(`\n🏢 Empresa: ${company.fantasy_name} (ID: ${company._id})`);
    console.log('✅ Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado do MongoDB');
  }
};
seedProducts();