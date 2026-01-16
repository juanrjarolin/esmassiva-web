import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, AlertTriangle, TrendingDown, HandHeart, BarChart3, Shield, Clock, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/servicios/cobranzas-recuperacion/")({
  component: CobranzasRecuperacionPage,
});

function CobranzasRecuperacionPage() {
  const features = [
    {
      icon: AlertTriangle,
      title: "Cobranza Preventiva",
      description: "Identificación temprana de riesgos de impago y gestión proactiva para evitar la morosidad."
    },
    {
      icon: TrendingDown,
      title: "Recuperación de Cartera",
      description: "Estrategias especializadas para recuperar cuentas vencidas con altas tasas de éxito."
    },
    {
      icon: HandHeart,
      title: "Negociación de Pagos",
      description: "Planes de pago flexibles y negociaciones respetuosas que mantienen la relación con el cliente."
    },
    {
      icon: BarChart3,
      title: "Reporting Detallado",
      description: "Informes completos y análisis de rendimiento para optimizar la gestión de cobranza."
    }
  ];

  const benefits = [
    "Reducción del 40% en días de morosidad",
    "Aumento del 60% en recuperación de cartera",
    "Mejora del 25% en retención de clientes",
    "Cumplimiento 100% de normativas legales"
  ];

  const approach = [
    {
      icon: Shield,
      title: "Ético y Legal",
      description: "Cumplimiento estricto de todas las regulaciones y prácticas éticas en cobranza."
    },
    {
      icon: HandHeart,
      title: "Respetuoso",
      description: "Trato digno y profesional que preserva la relación comercial a largo plazo."
    },
    {
      icon: Clock,
      title: "Eficiente",
      description: "Procesos optimizados que maximizan la recuperación en el menor tiempo posible."
    }
  ];

  const process = [
    {
      step: "1",
      title: "Análisis de Cartera",
      description: "Evaluación detallada de la cartera vencida y segmentación por riesgo y antigüedad."
    },
    {
      step: "2",
      title: "Estrategia Personalizada",
      description: "Desarrollo de estrategias específicas según el perfil del deudor y tipo de deuda."
    },
    {
      step: "3",
      title: "Gestión Activa",
      description: "Ejecución de contactos sistemáticos con seguimiento continuo y documentación completa."
    },
    {
      step: "4",
      title: "Seguimiento y Reporte",
      description: "Monitoreo constante de resultados y reportes detallados de gestión y recuperación."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-accent-100 text-accent-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CreditCard className="w-4 h-4 mr-2" />
                Cobranzas & Recuperación
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Recupera tu <span className="text-accent-600">cartera vencida</span> con estrategias profesionales
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Maximiza la recuperación de tu cartera vencida con estrategias profesionales y respetuosas. 
                Procesos éticos que preservan la relación con tus clientes y cumplen toda la normativa legal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-700 transition-colors shadow-lg">
                  Evaluar Cartera
                </button>
                <button className="border-2 border-accent-600 text-accent-600 px-8 py-4 rounded-xl font-semibold hover:bg-accent-50 transition-colors">
                  Ver Resultados
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Gestión de cobranzas profesional"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 mb-1">85%</div>
                  <div className="text-sm text-secondary-600">Tasa de Éxito</div>
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
              Servicios especializados en cobranza
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Soluciones integrales que maximizan la recuperación mientras preservan las relaciones comerciales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Nuestro enfoque diferencial
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Principios que guían nuestra gestión de cobranza profesional y ética
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approach.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{item.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Resultados comprobados en recuperación
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes experimentan mejoras significativas en la recuperación de su cartera vencida.
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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Gráficos de recuperación de cartera"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Proceso de gestión de cobranza
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Metodología estructurada que garantiza resultados óptimos y cumplimiento legal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-600 to-accent-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para recuperar tu cartera vencida?
          </h2>
          <p className="text-xl text-accent-100 mb-8">
            Solicita una evaluación gratuita de tu cartera y descubre tu potencial de recuperación
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-accent-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Evaluar Cartera
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-accent-600 transition-colors">
              Agendar Consulta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
