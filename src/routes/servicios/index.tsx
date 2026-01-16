import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Phone, ShoppingCart, Headphones, CreditCard, Building2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/servicios/")({
  component: ServiciosPage,
});

function ServiciosPage() {
  const services = [
    {
      id: 'ventas-telemarketing',
      title: 'B2B & B2C Ventas y Telemarketing',
      description: 'Servicios integrales de ventas para empresas B2B y B2C con estrategias personalizadas y tecnología avanzada.',
      icon: Phone,
      features: ['Ventas B2B especializadas', 'Telemarketing B2C', 'Generación de leads', 'CRM integrado'],
      href: '/servicios/ventas-telemarketing'
    },
    {
      id: 'ecommerce-soporte-digital',
      title: 'E-commerce - Ventas Digitales',
      description: 'Optimiza tu comercio electrónico con soporte especializado en ventas digitales y atención omnicanal 24/7.',
      icon: ShoppingCart,
      features: ['Soporte e-commerce', 'Ventas digitales', 'Chat en vivo', 'Gestión de pedidos'],
      href: '/servicios/ecommerce-soporte-digital'
    },
    {
      id: 'atencion-cliente',
      title: 'Servicio al Cliente',
      description: 'Brinda experiencias excepcionales a tus clientes con nuestro servicio de atención personalizada multicanal.',
      icon: Headphones,
      features: ['Atención 24/7', 'Soporte multicanal', 'Resolución de incidencias', 'Satisfacción garantizada'],
      href: '/servicios/atencion-cliente'
    },
    {
      id: 'cobranzas-recuperacion',
      title: 'Cobranzas y Recuperación',
      description: 'Recupera tu cartera vencida con estrategias profesionales y respetuosas hacia tus clientes.',
      icon: CreditCard,
      features: ['Cobranza preventiva', 'Recuperación de cartera', 'Negociación de pagos', 'Reporting detallado'],
      href: '/servicios/cobranzas-recuperacion'
    },
    {
      id: 'bpo',
      title: 'Business Process Outsourcing',
      description: 'Optimiza tus procesos de negocio con nuestras soluciones integrales de tercerización empresarial.',
      icon: Building2,
      features: ['Procesos administrativos', 'Back office', 'Data entry', 'Análisis de datos'],
      href: '/servicios/bpo'
    },
    {
      id: 'smart-b2b-revenues',
      title: 'Smart B2B Revenues',
      description: 'Soluciones inteligentes de generación de ingresos B2B con análisis predictivo y automatización avanzada.',
      icon: TrendingUp,
      features: ['Lead scoring inteligente', 'Estrategias B2B personalizadas', 'Automatización de ventas', 'Analytics avanzado'],
      href: '/servicios/smart-b2b-revenues'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Nuestros <span className="text-primary-600">Servicios</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Soluciones integrales de contact center y BPO diseñadas para impulsar el crecimiento 
              de tu empresa con tecnología de vanguardia y talento especializado.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary-100 hover:border-primary-200 hover:-translate-y-1 hover:scale-[1.01]"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Icon className="w-8 h-8 text-primary-600 transition-transform duration-300" />
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-200" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-secondary-600 mb-6 leading-relaxed transition-colors duration-300 group-hover:text-secondary-700">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-8">
                      {service.features.map((feature, index) => (
                        <li 
                          key={index} 
                          className="flex items-center text-sm text-secondary-600 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <a
                      href={service.href}
                      className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 hover:scale-[1.02] transition-all duration-200 group-hover:shadow-lg block text-center"
                    >
                      Conocer más
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Descubre cómo nuestras soluciones pueden optimizar tus procesos y 
            mejorar la experiencia de tus clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-lg">
              Solicitar Propuesta
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-200">
              Agendar Reunión
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
