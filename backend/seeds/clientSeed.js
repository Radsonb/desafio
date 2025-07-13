require('dotenv').config();
const mongoose = require('mongoose');
const { Client, Company } = require('../database/models');

const seedClients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vendergasdb');
    console.log('✅ Conectado ao MongoDB');

    const company = await Company.findOne();
    if (!company) {
      console.log('❌ Nenhuma empresa encontrada. Crie uma empresa primeiro!');
      return;
    }

    console.log(`📋 Inserindo clientes para empresa: ${company.fantasy_name}`);

    const clients = [
      {
        company_id: company._id,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-1111'
      },
      {
        company_id: company._id,
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(11) 99999-2222'
      },
      {
        company_id: company._id,
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        phone: '(11) 99999-3333'
      },
      {
        company_id: company._id,
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(11) 99999-4444'
      },
      {
        company_id: company._id,
        name: 'Carlos Ferreira',
        email: 'carlos.ferreira@email.com',
        phone: '(11) 99999-5555'
      },
      {
        company_id: company._id,
        name: 'Lucia Rodrigues',
        email: 'lucia.rodrigues@email.com',
        phone: '(11) 99999-6666'
      },
      {
        company_id: company._id,
        name: 'Roberto Almeida',
        email: 'roberto.almeida@email.com',
        phone: '(11) 99999-7777'
      },
      {
        company_id: company._id,
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        phone: '(11) 99999-8888'
      },
      {
        company_id: company._id,
        name: 'Marcos Pereira',
        email: 'marcos.pereira@email.com',
        phone: '(11) 99999-9999'
      },
      {
        company_id: company._id,
        name: 'Juliana Martins',
        email: 'juliana.martins@email.com',
        phone: '(11) 99999-0000'
      },
      {
        company_id: company._id,
        name: 'Ricardo Souza',
        email: 'ricardo.souza@email.com',
        phone: '(21) 98888-1111'
      },
      {
        company_id: company._id,
        name: 'Patrícia Gomes',
        email: 'patricia.gomes@email.com',
        phone: '(21) 98888-2222'
      },
      {
        company_id: company._id,
        name: 'Rafael Torres',
        email: 'rafael.torres@email.com',
        phone: '(21) 98888-3333'
      },
      {
        company_id: company._id,
        name: 'Camila Barbosa',
        email: 'camila.barbosa@email.com',
        phone: '(21) 98888-4444'
      },
      {
        company_id: company._id,
        name: 'Bruno Cardoso',
        email: 'bruno.cardoso@email.com',
        phone: '(21) 98888-5555'
      }
    ];

    await Client.deleteMany({ company_id: company._id });
    console.log('🧹 Clientes anteriores removidos');

    const insertedClients = await Client.insertMany(clients);
    console.log(`✅ ${insertedClients.length} clientes inseridos com sucesso!`);

    console.log('\n👥 Clientes inseridos:');
    insertedClients.forEach((client, index) => {
      console.log(`${index + 1}. ${client.name} - ${client.email} - ${client.phone}`);
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

seedClients();