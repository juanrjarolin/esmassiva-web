import { createFileRoute } from "@tanstack/react-router";
import { Star, TrendingUp, Users, Award, ArrowRight, Building2, Globe, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/clientes/")({
  component: ClientesPage,
});

function ClientesPage() {
  const clientCategories = [
    {
      title: "Nuestros Clientes",
      clients: [
        { name: "TechCorp", logo: "https://via.placeholder.com/150x75/2563eb/ffffff?text=TechCorp" },
        { name: "CloudFirst", logo: "https://via.placeholder.com/150x75/2563eb/ffffff?text=CloudFirst" },
        { name: "DataSolutions", logo: "https://via.placeholder.com/150x75/2563eb/ffffff?text=DataSolutions" },
        { name: "InnovateAI", logo: "https://via.placeholder.com/150x75/2563eb/ffffff?text=InnovateAI" },
        { name: "SmartRetail", logo: "https://via.placeholder.com/150x75/64748b/ffffff?text=SmartRetail" },
        { name: "ShopMX", logo: "https://via.placeholder.com/150x75/64748b/ffffff?text=ShopMX" },
        { name: "MarketPlace", logo: "https://via.placeholder.com/150x75/64748b/ffffff?text=MarketPlace" },
        { name: "DigitalStore", logo: "https://via.placeholder.com/150x75/64748b/ffffff?text=DigitalStore" },
        { name: "FinTech Pro", logo: "https://via.placeholder.com/150x75/059669/ffffff?text=FinTech" },
        { name: "BankingPlus", logo: "https://via.placeholder.com/150x75/059669/ffffff?text=Banking" },
        { name: "CreditSmart", logo: "https://via.placeholder.com/150x75/059669/ffffff?text=Credit" },
        { name: "InvestCorp", logo: "https://via.placeholder.com/150x75/059669/ffffff?text=Invest" },
        { name: "TelecomMX", logo: "https://via.placeholder.com/150x75/7c3aed/ffffff?text=Telecom" },
        { name: "ConnectPlus", logo: "https://via.placeholder.com/150x75/7c3aed/ffffff?text=Connect" },
        { name: "NetworkPro", logo: "https://via.placeholder.com/150x75/7c3aed/ffffff?text=Network" },
        { name: "MobileTech", logo: "https://via.placeholder.com/150x75/7c3aed/ffffff?text=Mobile" }
      ]
    }
  ];

  const caseStudies = [
    {
      client: "TechCorp",
      industry: "Tecnología",
      challenge: "Reducir tiempo de respuesta y mejorar satisfacción del cliente",
      solution: "Implementación de contact center omnicanal con IA",
      results: [
        "40% mejora en satisfacción del cliente",
        "60% reducción en tiempo de respuesta",
        "25% aumento en retención de clientes",
        "50% optimización de costos operativos"
      ],
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      testimonial: "Esmassiva transformó completamente nuestra experiencia de cliente. Los resultados superaron todas nuestras expectativas.",
      contactPerson: "Ana García, Directora de Operaciones"
    },
    {
      client: "GlobalTrade",
      industry: "Comercio Internacional",
      challenge: "Escalabilidad para atender múltiples mercados",
      solution: "BPO integral con soporte multiidioma 24/7",
      results: [
        "200% crecimiento en volumen de atención",
        "35% reducción en costos operativos",
        "99.8% disponibilidad del servicio",
        "15 nuevos mercados atendidos"
      ],
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      testimonial: "La escalabilidad y profesionalismo de Esmassiva nos permitió expandirnos a nuevos mercados sin comprometer la calidad.",
      contactPerson: "Carlos Mendoza, CEO"
    }
  ];

  const testimonials = [
    {
      content: "La implementación fue perfecta. El equipo de Esmassiva entendió nuestras necesidades desde el primer día y entregó resultados excepcionales.",
      author: "Roberto Silva",
      position: "Director de Operaciones",
      company: "InnovateMX",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      content: "Hemos trabajado con varios proveedores de BPO, pero ninguno se compara con la calidad y dedicación de Esmassiva.",
      author: "Laura Hernández",
      position: "VP de Customer Experience",
      company: "FinTech Pro",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      content: "La tecnología y el talento humano de Esmassiva nos ayudaron a transformar completamente nuestra operación de contact center.",
      author: "Diego Morales",
      position: "Gerente General",
      company: "TelecomMX",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const partnershipBenefits = [
    {
      icon: Award,
      title: "Excelencia Garantizada",
      description: "Estándares de calidad certificados internacionalmente"
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Conjunto",
      description: "Escalamos contigo y nos adaptamos a tu ritmo de crecimiento"
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description: "Presencia en múltiples mercados hispanohablantes"
    },
    {
      icon: Users,
      title: "Equipo Dedicado",
      description: "Profesionales especializados asignados a tu cuenta"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Empresas Líderes Confían en Nosotros
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Nuestros <span className="text-primary-600">Clientes</span> & Socios
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Empresas líderes en sus industrias confían en Esmassiva para transformar 
              su experiencia de cliente y optimizar sus procesos de negocio.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-sm text-secondary-600">Clientes Satisfechos</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-sm text-secondary-600">Retención de Clientes</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-sm text-secondary-600">Años de Experiencia</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-sm text-secondary-600">Soporte Continuo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos by Category */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {clientCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {category.clients.map((client, clientIndex) => (
                    <div key={clientIndex} className="group">
                      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary-200 hover:bg-white">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-16 w-auto mx-auto hover:scale-105 transition-all duration-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Casos de Éxito
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Resultados reales que demuestran el impacto de nuestras soluciones
            </p>
          </div>

          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <img
                    src={study.image}
                    alt={study.client}
                    className="rounded-2xl shadow-xl w-full"
                  />
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <Building2 className="w-8 h-8 text-primary-600 mr-3" />
                      <div>
                        <h3 className="text-2xl font-bold text-secondary-900">{study.client}</h3>
                        <p className="text-secondary-600">{study.industry}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-900 mb-2">Desafío:</h4>
                      <p className="text-secondary-600 mb-4">{study.challenge}</p>
                      
                      <h4 className="font-semibold text-secondary-900 mb-2">Solución:</h4>
                      <p className="text-secondary-600 mb-4">{study.solution}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-900 mb-4">Resultados:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {study.results.map((result, resultIndex) => (
                          <div key={resultIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" />
                            <span className="text-secondary-700 text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-secondary-200 pt-6">
                      <p className="text-secondary-700 mb-3">"{study.testimonial}"</p>
                      <p className="text-sm font-medium text-secondary-900">{study.contactPerson}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Testimonios auténticos de líderes empresariales que han confiado en nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-secondary-900">{testimonial.author}</div>
                    <div className="text-sm text-secondary-600">
                      {testimonial.position} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              ¿Por qué las empresas nos eligen?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Beneficios que hacen la diferencia en cada partnership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnershipBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{benefit.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Quieres ser nuestro próximo caso de éxito?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a las empresas líderes que han transformado su negocio con Esmassiva
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contacto" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              Solicitar Propuesta
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Ver Más Casos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
