import { getDb, createOrganization, createOpportunity } from "../server/db";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }

  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Create sample organizations
    const org1 = await createOrganization({
      userId: 1,
      organizationName: "Educação para Todos",
      description: "Organização dedicada a fornecer educação de qualidade para comunidades carentes.",
      location: "São Paulo, SP",
      website: "https://educacaoparatodos.org",
      verified: 1,
    });

    const org2 = await createOrganization({
      userId: 2,
      organizationName: "Saúde Comunitária",
      description: "Promovendo saúde e bem-estar em comunidades de baixa renda.",
      location: "Rio de Janeiro, RJ",
      website: "https://saudecomunitaria.org",
      verified: 1,
    });

    const org3 = await createOrganization({
      userId: 3,
      organizationName: "Meio Ambiente Sustentável",
      description: "Trabalhando pela preservação do meio ambiente e sustentabilidade.",
      location: "Belo Horizonte, MG",
      website: "https://meioambiente.org",
      verified: 1,
    });

    console.log("✅ Organizações criadas");

    // Create sample opportunities
    const opportunities = [
      {
        organizationId: 1,
        title: "Professor Voluntário - Reforço Escolar",
        description: "Procuramos voluntários para ajudar alunos do ensino fundamental com reforço escolar em matemática e português.",
        category: "Educação",
        location: "São Paulo, SP",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-12-31"),
        volunteersNeeded: 5,
        skillsRequired: JSON.stringify(["Ensino", "Paciência", "Comunicação"]),
      },
      {
        organizationId: 1,
        title: "Tutor Online para Inglês",
        description: "Voluntários para ensinar inglês online para crianças e adolescentes de comunidades carentes.",
        category: "Educação",
        location: "São Paulo, SP",
        startDate: new Date("2024-11-15"),
        endDate: new Date("2025-03-31"),
        volunteersNeeded: 3,
        skillsRequired: JSON.stringify(["Inglês fluente", "Ensino online", "Paciência"]),
      },
      {
        organizationId: 2,
        title: "Agente de Saúde Comunitária",
        description: "Ajude a levar informações sobre saúde preventiva para comunidades. Treinamento fornecido.",
        category: "Saúde",
        location: "Rio de Janeiro, RJ",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2025-02-28"),
        volunteersNeeded: 10,
        skillsRequired: JSON.stringify(["Comunicação", "Empatia", "Organização"]),
      },
      {
        organizationId: 2,
        title: "Assistente em Clínica Móvel",
        description: "Voluntários para ajudar em atendimentos de saúde em clínicas móveis que atendem comunidades carentes.",
        category: "Saúde",
        location: "Rio de Janeiro, RJ",
        startDate: new Date("2024-11-10"),
        endDate: new Date("2025-01-31"),
        volunteersNeeded: 8,
        skillsRequired: JSON.stringify(["Saúde", "Organização", "Dedicação"]),
      },
      {
        organizationId: 3,
        title: "Plantio de Árvores - Reflorestamento",
        description: "Participe de atividades de reflorestamento e recuperação de áreas verdes. Atividade ao ar livre.",
        category: "Meio Ambiente",
        location: "Belo Horizonte, MG",
        startDate: new Date("2024-11-20"),
        endDate: new Date("2024-12-15"),
        volunteersNeeded: 20,
        skillsRequired: JSON.stringify(["Disposição física", "Amor pela natureza"]),
      },
      {
        organizationId: 3,
        title: "Educador Ambiental",
        description: "Voluntários para ensinar sobre sustentabilidade e conservação ambiental em escolas e comunidades.",
        category: "Meio Ambiente",
        location: "Belo Horizonte, MG",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-05-31"),
        volunteersNeeded: 4,
        skillsRequired: JSON.stringify(["Educação", "Conhecimento ambiental", "Comunicação"]),
      },
      {
        organizationId: 1,
        title: "Assistente de Biblioteca Comunitária",
        description: "Ajude a organizar e gerenciar uma biblioteca comunitária. Atividades incluem catalogação e atendimento ao público.",
        category: "Educação",
        location: "São Paulo, SP",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2025-06-30"),
        volunteersNeeded: 6,
        skillsRequired: JSON.stringify(["Organização", "Atenção ao detalhe", "Atendimento ao público"]),
      },
      {
        organizationId: 2,
        title: "Voluntário para Campanhas de Vacinação",
        description: "Ajude em campanhas de vacinação e educação em saúde. Treinamento completo fornecido.",
        category: "Saúde",
        location: "Rio de Janeiro, RJ",
        startDate: new Date("2024-11-25"),
        endDate: new Date("2025-01-15"),
        volunteersNeeded: 15,
        skillsRequired: JSON.stringify(["Comunicação", "Organização", "Responsabilidade"]),
      },
    ];

    for (const opp of opportunities) {
      await createOpportunity({
        ...opp,
        status: "active",
      });
    }

    console.log("✅ Oportunidades criadas");
    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

seed();
