import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Clock, MessageSquare, Users, CheckCircle, Star, Phone, Mail } from "lucide-react";

export const Route = createFileRoute("/servicios/atencion-cliente/")({
  component: AtencionClientePage,
});

function AtencionClientePage() {
  const features = [
    {
      icon: Clock,
      title: "Atención 24/7",
      description: "Disponibilidad completa todos los días del año para brindar soporte cuando tus clientes lo necesiten."
    },
    {
      icon: MessageSquare,
      title: "Soporte Multicanal",
      description: "Integración perfecta entre teléfono, chat, email y redes sociales para una experiencia omnicanal."
    },
    {
      icon: Users,
      title: "Resolución de Incidencias",
      description: "Gestión eficiente de quejas y reclamos con seguimiento completo hasta su resolución."
    },
    {
      icon: Star,
      title: "Satisfacción Garantizada",
      description: "Compromiso con la excelencia en el servicio y medición continua de la satisfacción del cliente."
    }
  ];

  const benefits = [
    "Mejora del 45% en satisfacción del cliente",
    "Reducción del 60% en tiempo de respuesta",
    "Aumento del 30% en retención de clientes",
    "95% de resolución en primera llamada"
  ];

  const channels = [
    {
      icon: Phone,
      name: "Telefónico",
      description: "Atención personalizada por teléfono con agentes especializados"
    },
    {
      icon: MessageSquare,
      name: "Chat en Vivo",
      description: "Respuesta inmediata a través de chat integrado en tu sitio web"
    },
    {
      icon: Mail,
      name: "Email",
      description: "Gestión profesional de consultas y seguimiento por correo electrónico"
    },
    {
      icon: Users,
      name: "Redes Sociales",
      description: "Monitoreo y respuesta en todas tus plataformas sociales"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Análisis de Necesidades",
      description: "Evaluamos tus requerimientos específicos y definimos los canales de atención óptimos."
    },
    {
      step: "2",
      title: "Configuración de Sistemas",
      description: "Integramos nuestras plataformas con tus sistemas existentes para una experiencia fluida."
    },
    {
      step: "3",
      title: "Entrenamiento Especializado",
      description: "Capacitamos a nuestro equipo en tus productos, servicios y valores de marca."
    },
    {
      step: "4",
      title: "Monitoreo y Mejora",
      description: "Seguimiento continuo de métricas y optimización del servicio basada en feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-success-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-success-100 text-success-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Headphones className="w-4 h-4 mr-2" />
                Atención al Cliente
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Experiencias <span className="text-success-600">excepcionales</span> que fortalecen la lealtad
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Brinda atención personalizada y profesional a tus clientes con nuestro servicio omnicanal disponible 24/7. 
                Convertimos cada interacción en una oportunidad de fidelización.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-success-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-success-700 transition-colors shadow-lg">
                  Solicitar Propuesta
                </button>
                <button className="border-2 border-success-600 text-success-600 px-8 py-4 rounded-xl font-semibold hover:bg-success-50 transition-colors">
                  Ver Testimonios
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Agente de atención al cliente"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600 mb-1">98%</div>
                  <div className="text-sm text-secondary-600">Satisfacción</div>
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
              Servicios de atención integral
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Soluciones completas para brindar la mejor experiencia de servicio al cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-success-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Canales de atención disponibles
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Experiencia omnicanal que se adapta a las preferencias de tus clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                  <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-success-600" />
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-3">{channel.name}</h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">{channel.description}</p>
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
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Métricas de satisfacción"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Resultados que marcan la diferencia
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes experimentan mejoras inmediatas en la satisfacción y lealtad de sus usuarios.
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
              Metodología estructurada para garantizar una transición perfecta y resultados óptimos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-success-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-success-600 to-success-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para mejorar la experiencia de tus clientes?
          </h2>
          <p className="text-xl text-success-100 mb-8">
            Solicita una propuesta personalizada y descubre cómo podemos transformar tu atención al cliente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-success-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <Headphones className="w-5 h-5 mr-2" />
              Solicitar Propuesta
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-success-600 transition-colors">
              Agendar Reunión
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
