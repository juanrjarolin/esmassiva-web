import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Target, BarChart3, Users, CheckCircle, ArrowRight, Zap, Brain, LineChart } from "lucide-react";

export const Route = createFileRoute("/servicios/smart-b2b-revenues/")({
  component: SmartB2BRevenuesPage,
});

function SmartB2BRevenuesPage() {
  const features = [
    {
      icon: Brain,
      title: "Lead Scoring Inteligente",
      description: "Algoritmos avanzados que identifican y priorizan los prospectos con mayor probabilidad de conversión."
    },
    {
      icon: Target,
      title: "Estrategias B2B Personalizadas",
      description: "Desarrollamos estrategias de ventas adaptadas a tu industria y modelo de negocio específico."
    },
    {
      icon: Zap,
      title: "Automatización de Procesos",
      description: "Optimiza tu ciclo de ventas con automatización inteligente de tareas repetitivas y seguimientos."
    },
    {
      icon: LineChart,
      title: "Analytics Predictivo",
      description: "Análisis de datos en tiempo real con proyecciones y recomendaciones basadas en IA."
    }
  ];

  const benefits = [
    "Aumento del 50% en generación de leads cualificados",
    "Reducción del 40% en ciclo de ventas B2B",
    "Mejora del 45% en tasas de conversión",
    "ROI promedio de 350% en primeros 12 meses"
  ];

  const process = [
    {
      step: "1",
      title: "Análisis de Mercado",
      description: "Evaluamos tu mercado objetivo, competencia y oportunidades de crecimiento B2B."
    },
    {
      step: "2", 
      title: "Estrategia Personalizada",
      description: "Diseñamos una estrategia de generación de ingresos adaptada a tus objetivos específicos."
    },
    {
      step: "3",
      title: "Implementación y Automatización", 
      description: "Desplegamos tecnología y procesos optimizados para maximizar resultados."
    },
    {
      step: "4",
      title: "Optimización Continua",
      description: "Monitoreamos, analizamos y optimizamos constantemente para mejorar el rendimiento."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Smart B2B Revenues
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Impulsa tus <span className="text-primary-600">ingresos B2B</span> con inteligencia artificial
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Genera más ingresos con estrategias inteligentes de ventas B2B. Combinamos experiencia humana 
                con tecnología de vanguardia para maximizar tus resultados comerciales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg">
                  Solicitar Propuesta
                </button>
                <button className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                  Ver Casos de Éxito
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                alt="Analytics y estrategia B2B"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-1">+350%</div>
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
              ¿Cómo generamos más ingresos para tu negocio?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Soluciones integrales que combinan tecnología, datos y experiencia para impulsar tu crecimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Resultados que transforman tu negocio
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes B2B experimentan mejoras significativas en generación de ingresos y eficiencia comercial.
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
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1015&q=80"
                alt="Resultados y métricas"
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
              Metodología probada que garantiza resultados exitosos en cada implementación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para aumentar tus ingresos B2B?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Solicita una propuesta personalizada y descubre cómo podemos transformar tu estrategia comercial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Solicitar Propuesta
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Agendar Reunión
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
