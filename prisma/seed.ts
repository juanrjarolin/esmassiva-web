import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ===============================
  // SERVICES
  // ===============================
  await prisma.service.createMany({
    data: [
      {
        title: "Ventas & Telemarketing",
        slug: "ventas-telemarketing",
        description: "Impulsa tus ventas con estrategias personalizadas y tecnología avanzada",
        icon: "Phone",
        href: "/servicios/ventas-telemarketing",
        bgColor: "bg-primary-100",
        iconColor: "text-primary-600",
        benefits: JSON.stringify([
          "Aumento del 40% en conversiones",
          "Scripts personalizados por industria",
          "Tecnología predictiva avanzada",
          "Reporting en tiempo real"
        ]),
        order: 1,
      },
      {
        title: "E-commerce & Soporte Digital",
        slug: "ecommerce-soporte-digital",
        description: "Optimiza tu comercio electrónico con soporte especializado 24/7",
        icon: "ShoppingCart",
        href: "/servicios/ecommerce-soporte-digital",
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        benefits: JSON.stringify([
          "Soporte multicanal 24/7",
          "Integración con plataformas e-commerce",
          "Gestión de inventario en tiempo real",
          "Análisis de comportamiento del cliente"
        ]),
        order: 2,
      },
      {
        title: "Atención al Cliente",
        slug: "atencion-cliente",
        description: "Experiencias excepcionales que fortalecen la lealtad de tus clientes",
        icon: "Headphones",
        href: "/servicios/atencion-cliente",
        bgColor: "bg-success-100",
        iconColor: "text-success-600",
        benefits: JSON.stringify([
          "95% satisfacción del cliente",
          "Resolución en primer contacto",
          "Agentes certificados y capacitados",
          "Métricas de calidad en tiempo real"
        ]),
        order: 3,
      },
      {
        title: "Cobranzas & Recuperación",
        slug: "cobranzas-recuperacion",
        description: "Estrategias profesionales para recuperar tu cartera vencida",
        icon: "CreditCard",
        href: "/servicios/cobranzas-recuperacion",
        bgColor: "bg-accent-100",
        iconColor: "text-accent-600",
        benefits: JSON.stringify([
          "60% mejora en recuperación",
          "Cumplimiento normativo garantizado",
          "Estrategias personalizadas por perfil",
          "Tecnología de scoring avanzado"
        ]),
        order: 4,
      },
      {
        title: "BPO - Procesos de Negocio",
        slug: "bpo",
        description: "Tercerización inteligente de procesos administrativos",
        icon: "Building2",
        href: "/servicios/bpo",
        bgColor: "bg-secondary-100",
        iconColor: "text-secondary-600",
        benefits: JSON.stringify([
          "50% reducción de costos operativos",
          "Automatización de procesos",
          "Escalabilidad inmediata",
          "Compliance y seguridad certificada"
        ]),
        order: 5,
      },
      {
        title: "Smart B2B Revenues",
        slug: "smart-b2b-revenues",
        description: "Soluciones inteligentes de generación de ingresos B2B con análisis predictivo",
        icon: "TrendingUp",
        href: "/servicios/smart-b2b-revenues",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        benefits: JSON.stringify([
          "Estrategias B2B personalizadas",
          "Lead scoring inteligente",
          "Automatización de procesos de venta",
          "Analytics y reporting avanzado"
        ]),
        order: 6,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Services seeded");

  // ===============================
  // METRICS
  // ===============================
  await prisma.metric.createMany({
    data: [
      { number: "15+", label: "Años de experiencia", icon: "Award", order: 1 },
      { number: "500+", label: "Empresas atendidas", icon: "Users", order: 2 },
      { number: "50K+", label: "Llamadas diarias", icon: "Phone", order: 3 },
      { number: "98%", label: "Satisfacción del cliente", icon: "Star", order: 4 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Metrics seeded");

  // ===============================
  // TESTIMONIALS
  // ===============================
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Ana García",
        position: "Directora de Operaciones",
        company: "TechCorp",
        content: "Esmassiva transformó completamente nuestra atención al cliente.",
        rating: 5,
        order: 1,
      },
      {
        name: "Carlos Mendoza",
        position: "CEO",
        company: "GlobalTrade",
        content: "La profesionalidad y tecnología de Esmassiva nos permitió escalar.",
        rating: 5,
        order: 2,
      },
      {
        name: "María Rodríguez",
        position: "Gerente de Ventas",
        company: "InnovateMX",
        content: "Aumentamos nuestras ventas en un 60% en solo 6 meses.",
        rating: 5,
        order: 3,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Testimonials seeded");

  // ===============================
  // HERO SECTIONS
  // ===============================
  await prisma.heroSection.createMany({
    data: [
      {
        page: "home",
        title: "Transformamos tu experiencia de cliente",
        subtitle: "Líder en Contact Center & BPO",
        description: "Soluciones integrales de contact center y BPO.",
        ctaText: "Solicitar Demo",
        ctaLink: "/contacto",
      },
      {
        page: "servicios",
        title: "Nuestros Servicios",
        description: "Soluciones diseñadas para cada etapa del customer journey",
      },
      {
        page: "contacto",
        title: "Hablemos de tu proyecto",
        description: "Agenda una consulta gratuita con nuestros especialistas",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Hero sections seeded");

  // ===============================
  // ADMIN USER
  // ===============================
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.createMany({
    data: [
      {
        email: "admin@esmassiva.com",
        password: passwordHash,
        name: "Administrador",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Admin user seeded (admin@esmassiva.com / admin123)");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
