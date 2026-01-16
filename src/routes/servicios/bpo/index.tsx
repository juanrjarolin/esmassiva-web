import { createFileRoute } from "@tanstack/react-router";
import { Building2, FileText, Database, BarChart3, Cog, CheckCircle, ArrowRight, Clock, Shield } from "lucide-react";

export const Route = createFileRoute("/servicios/bpo/")({
  component: BPOPage,
});

function BPOPage() {
  const features = [
    {
      icon: FileText,
      title: "Procesos Administrativos",
      description: "Gestión completa de procesos administrativos y documentales con altos estándares de calidad."
    },
    {
      icon: Building2,
      title: "Back Office",
      description: "Soporte integral de operaciones internas para optimizar la eficiencia de tu organización."
    },
    {
      icon: Database,
      title: "Data Entry",
      description: "Captura y procesamiento de datos con precisión y velocidad para mantener tus sistemas actualizados."
    },
    {
      icon: BarChart3,
      title: "Análisis de Datos",
      description: "Transformación de datos en insights accionables para mejorar la toma de decisiones."
    }
  ];

  const benefits = [
    "Reducción del 50% en costos operativos",
    "Mejora del 40% en eficiencia de procesos",
    "Escalabilidad flexible según demanda",
    "Acceso a tecnología de vanguardia"
  ];

  const services = [
    {
      icon: FileText,
      title: "Gestión Documental",
      description: "Digitalización, clasificación y archivo de documentos"
    },
    {
      icon: Database,
      title: "Procesamiento de Datos",
      description: "Captura, validación y análisis de información"
    },
    {
      icon: Cog,
      title: "Automatización",
      description: "Implementación de procesos automatizados"
    },
    {
      icon: Shield,
      title: "Cumplimiento",
      description: "Gestión de compliance y normativas"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Análisis de Procesos",
      description: "Evaluación detallada de tus procesos actuales y identificación de oportunidades de mejora."
    },
    {
      step: "2",
      title: "Diseño de Solución",
      description: "Desarrollo de una estrategia personalizada de outsourcing adaptada a tus necesidades."
    },
    {
      step: "3",
      title: "Implementación",
      description: "Transición gradual y controlada de procesos con mínimo impacto en las operaciones."
    },
    {
      step: "4",
      title: "Optimización Continua",
      description: "Monitoreo constante y mejora continua de procesos para maximizar la eficiencia."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-secondary-100 text-secondary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                BPO - Business Process Outsourcing
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Optimiza tus <span className="text-secondary-600">procesos de negocio</span> con tercerización inteligente
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Transforma tu organización con soluciones integrales de BPO que reducen costos, mejoran la eficiencia 
                y te permiten enfocar en tu core business con tecnología de vanguardia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-secondary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-700 transition-colors shadow-lg">
                  Evaluar Procesos
                </button>
                <button className="border-2 border-secondary-600 text-secondary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors">
                  Ver Casos de Éxito
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Oficina moderna de BPO"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600 mb-1">50%</div>
                  <div className="text-sm text-secondary-600">Ahorro en Costos</div>
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
              Servicios integrales de BPO
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Soluciones completas que cubren todos los aspectos de la tercerización de procesos de negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Áreas de especialización
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Servicios especializados para diferentes necesidades empresariales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-secondary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-3">{service.title}</h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">{service.description}</p>
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
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Análisis de eficiencia de procesos"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Ventajas competitivas del BPO
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes experimentan transformaciones significativas en sus operaciones y resultados.
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
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Proceso de implementación
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Metodología probada para una transición exitosa y resultados óptimos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-secondary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-secondary-600 to-secondary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para optimizar tus procesos?
          </h2>
          <p className="text-xl text-secondary-100 mb-8">
            Solicita una evaluación gratuita de tus procesos y descubre el potencial de ahorro y eficiencia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-secondary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 mr-2" />
              Evaluar Procesos
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-secondary-600 transition-colors">
              Agendar Consulta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
