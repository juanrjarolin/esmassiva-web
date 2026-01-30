import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Servicios
  const services = [
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
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log("✅ Services seeded");

  // Métricas
  const metrics = [
    { number: "15+", label: "Años de experiencia", icon: "Award", order: 1 },
    { number: "500+", label: "Empresas atendidas", icon: "Users", order: 2 },
    { number: "50K+", label: "Llamadas diarias", icon: "Phone", order: 3 },
    { number: "98%", label: "Satisfacción del cliente", icon: "Star", order: 4 },
  ];

  for (const metric of metrics) {
    await prisma.metric.upsert({
      where: { id: metric.order },
      update: metric,
      create: metric,
    });
  }
  console.log("✅ Metrics seeded");

  // Testimonios
  const testimonials = [
    {
      name: "Ana García",
      position: "Directora de Operaciones",
      company: "TechCorp",
      content: "Esmassiva transformó completamente nuestra atención al cliente. Los resultados superaron nuestras expectativas con un 40% de mejora en satisfacción.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      order: 1,
    },
    {
      name: "Carlos Mendoza",
      position: "CEO",
      company: "GlobalTrade",
      content: "La profesionalidad y tecnología de Esmassiva nos permitió escalar nuestras operaciones sin comprometer la calidad del servicio.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      order: 2,
    },
    {
      name: "María Rodríguez",
      position: "Gerente de Ventas",
      company: "InnovateMX",
      content: "Gracias a las estrategias de telemarketing de Esmassiva, aumentamos nuestras ventas en un 60% en solo 6 meses.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      order: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.order },
      update: testimonial,
      create: testimonial,
    });
  }
  console.log("✅ Testimonials seeded");

  // Clientes
  const clients = [
    { name: "TechCorp", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=TechCorp", order: 1 },
    { name: "GlobalTrade", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=GlobalTrade", order: 2 },
    { name: "InnovateMX", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=InnovateMX", order: 3 },
    { name: "DataSolutions", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=DataSolutions", order: 4 },
    { name: "CloudFirst", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=CloudFirst", order: 5 },
    { name: "SmartRetail", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=SmartRetail", order: 6 },
  ];

  for (const client of clients) {
    await prisma.client.upsert({
      where: { id: client.order },
      update: client,
      create: client,
    });
  }
  console.log("✅ Clients seeded");

  // Certificaciones
  const certifications = [
    { name: "ISO 27001", icon: "Shield", order: 1 },
    { name: "SOC 2", icon: "Award", order: 2 },
    { name: "PCI DSS", icon: "Shield", order: 3 },
    { name: "ISO 9001", icon: "Award", order: 4 },
    { name: "COPC", icon: "Shield", order: 5 },
    { name: "GDPR", icon: "Award", order: 6 },
  ];

  for (const cert of certifications) {
    await prisma.certification.upsert({
      where: { id: cert.order },
      update: cert,
      create: cert,
    });
  }
  console.log("✅ Certifications seeded");

  // Oficinas
  const offices = [
    {
      city: "Asunción",
      address: "Sgto. Penayo 165, San Lorenzo 111426, Paraguay",
      phone: "+595 21 123 4567",
      email: "asuncion@esmassiva.com",
      hours: "Lun - Vie: 8:00 AM - 8:00 PM",
      order: 1,
    },
  ];

  for (const office of offices) {
    await prisma.office.upsert({
      where: { id: office.order },
      update: office,
      create: office,
    });
  }
  console.log("✅ Offices seeded");

  // Beneficios
  const benefits = [
    { title: "Cobertura Regional", description: "Presencia en toda Latinoamérica con equipos especializados por mercado", icon: "Globe", order: 1 },
    { title: "Seguridad Certificada", description: "Certificaciones ISO 27001 y SOC 2 para máxima protección de datos", icon: "Shield", order: 2 },
    { title: "Escalabilidad Garantizada", description: "Capacidad de crecimiento rápido según las necesidades de tu negocio", icon: "TrendingUp", order: 3 },
    { title: "Calidad Premium", description: "Estándares internacionales con métricas de clase mundial", icon: "Award", order: 4 },
  ];

  for (const benefit of benefits) {
    await prisma.benefit.upsert({
      where: { id: benefit.order },
      update: benefit,
      create: benefit,
    });
  }
  console.log("✅ Benefits seeded");

  // Hero Sections
  const heroSections = [
    {
      page: "home",
      title: "Transformamos tu\nexperiencia de cliente",
      subtitle: "Líder en Contact Center & BPO",
      description: "Soluciones integrales de contact center y BPO que impulsan el crecimiento de empresas líderes en el mercado hispanohablante con tecnología de vanguardia y talento especializado.",
      ctaText: "Solicitar Demo",
      ctaLink: "/contacto",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
      page: "contacto",
      title: "Hablemos de tu proyecto",
      description: "Nuestro equipo de especialistas está listo para ayudarte a transformar tu contact center y procesos de negocio. Agenda una consulta gratuita.",
    },
    {
      page: "servicios",
      title: "Nuestros Servicios",
      description: "Soluciones completas diseñadas para cada etapa del customer journey y optimizadas para el mercado latinoamericano",
    },
  ];

  for (const hero of heroSections) {
    await prisma.heroSection.upsert({
      where: { page: hero.page },
      update: hero,
      create: hero,
    });
  }
  console.log("✅ Hero sections seeded");

  // Admin User (password: admin123)
  const adminPassword = "admin123";
  let hash = 0;
  for (let i = 0; i < adminPassword.length; i++) {
    const char = adminPassword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  await prisma.adminUser.upsert({
    where: { email: "admin@esmassiva.com" },
    update: {},
    create: {
      email: "admin@esmassiva.com",
      password: hash.toString(16),
      name: "Administrador",
    },
  });
  console.log("✅ Admin user seeded (email: admin@esmassiva.com, password: admin123)");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

