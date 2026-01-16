import { createFileRoute } from "@tanstack/react-router";
import { Phone, Target, TrendingUp, Users, CheckCircle, ArrowRight, BarChart3, Clock, Shield } from "lucide-react";

export const Route = createFileRoute("/servicios/ventas-telemarketing/")({
  component: VentasTelemarketingPage,
});

function VentasTelemarketingPage() {
  const features = [
    {
      icon: Target,
      title: "Generación de Leads Cualificados",
      description: "Identificamos y contactamos prospectos de alta calidad que se ajusten a tu perfil de cliente ideal."
    },
    {
      icon: TrendingUp,
      title: "Ventas Telefónicas Efectivas",
      description: "Nuestros agentes especializados convierten leads en ventas con técnicas probadas y scripts personalizados."
    },
    {
      icon: Users,
      title: "Seguimiento Personalizado",
      description: "Mantenemos seguimiento continuo de prospectos para maximizar las oportunidades de conversión."
    },
    {
      icon: BarChart3,
      title: "CRM Integrado",
      description: "Gestión completa de la información de clientes y seguimiento de métricas en tiempo real."
    }
  ];

  const benefits = [
    "Aumento del 40% en generación de leads",
    "Reducción del 60% en costos de adquisición",
    "Mejora del 35% en tasas de conversión",
    "ROI promedio de 300% en primeros 6 meses"
  ];

  const process = [
    {
      step: "1",
      title: "Análisis y Estrategia",
      description: "Definimos tu mercado objetivo y desarrollamos estrategias personalizadas de prospección."
    },
    {
      step: "2", 
      title: "Configuración de Campañas",
      description: "Diseñamos scripts, configuramos sistemas CRM y preparamos bases de datos segmentadas."
    },
    {
      step: "3",
      title: "Ejecución y Monitoreo", 
      description: "Ejecutamos campañas con seguimiento en tiempo real y optimización continua."
    },
    {
      step: "4",
      title: "Análisis y Optimización",
      description: "Analizamos resultados y optimizamos estrategias para maximizar el rendimiento."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Phone className="w-4 h-4 mr-2" />
                Ventas & Telemarketing
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Impulsa tus <span className="text-blue-600">ventas</span> con telemarketing profesional
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Genera leads cualificados y aumenta tus ventas con nuestro equipo especializado en telemarketing. 
                Estrategias personalizadas, tecnología avanzada y resultados medibles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                  Solicitar Propuesta
                </button>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  Ver Casos de Éxito
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Agente de ventas telefónicas"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">+300%</div>
                  <div className="text-sm text-secondary-600">ROI Promedio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              ¿Cómo te ayudamos a vender más?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Servicios integrales de telemarketing diseñados para maximizar tus resultados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Resultados que hablan por sí solos
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes experimentan mejoras significativas en sus métricas de ventas desde el primer mes.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-secondary-700">
                    <CheckCircle className="w-6 h-6 text-success-600 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1015&q=80"
                alt="Gráficos de rendimiento"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Nuestro proceso de trabajo
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Metodología probada que garantiza resultados exitosos en cada campaña
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-4">{item.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para aumentar tus ventas?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Solicita una propuesta personalizada y descubre cómo podemos impulsar tu crecimiento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Solicitar Propuesta
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Agendar Reunión
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
