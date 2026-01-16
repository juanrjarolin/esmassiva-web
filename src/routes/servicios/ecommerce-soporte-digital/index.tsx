import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Headphones, MessageCircle, Package, Globe, Clock, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/servicios/ecommerce-soporte-digital/")({
  component: EcommerceSoporteDigitalPage,
});

function EcommerceSoporteDigitalPage() {
  const features = [
    {
      icon: Headphones,
      title: "Soporte Técnico Especializado",
      description: "Resolución rápida de problemas técnicos y consultas sobre productos con agentes especializados."
    },
    {
      icon: MessageCircle,
      title: "Chat en Vivo 24/7",
      description: "Atención inmediata a tus clientes con chat en tiempo real integrado en tu plataforma."
    },
    {
      icon: Package,
      title: "Gestión de Pedidos",
      description: "Seguimiento completo del proceso de compra, desde la consulta hasta la entrega."
    },
    {
      icon: Globe,
      title: "Soporte Multiidioma",
      description: "Atención en español, inglés y portugués para expandir tu mercado internacional."
    }
  ];

  const benefits = [
    "Reducción del 50% en tiempo de respuesta",
    "Aumento del 35% en satisfacción del cliente",
    "Mejora del 25% en conversión de ventas",
    "Disponibilidad 24/7 los 365 días del año"
  ];

  const process = [
    {
      step: "1",
      title: "Integración de Plataforma",
      description: "Conectamos nuestros sistemas con tu e-commerce para un soporte sin interrupciones."
    },
    {
      step: "2",
      title: "Capacitación Especializada",
      description: "Entrenamos a nuestro equipo en tus productos y procesos específicos."
    },
    {
      step: "3",
      title: "Monitoreo Continuo",
      description: "Supervisión 24/7 de todas las interacciones y métricas de rendimiento."
    },
    {
      step: "4",
      title: "Optimización y Mejoras",
      description: "Análisis constante para identificar oportunidades de mejora en el servicio."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <ShoppingCart className="w-4 h-4 mr-2" />
                E-commerce & Soporte Digital
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Optimiza tu <span className="text-purple-600">comercio electrónico</span> con soporte especializado
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Brinda una experiencia excepcional a tus clientes online con nuestro soporte técnico especializado, 
                chat en vivo y gestión integral de pedidos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg">
                  Solicitar Demo
                </button>
                <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
                  Ver Integraciones
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="E-commerce y soporte digital"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                  <div className="text-sm text-secondary-600">Soporte Activo</div>
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
              Servicios especializados para tu e-commerce
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Soluciones integrales que cubren cada aspecto de la experiencia digital de tus clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-purple-600" />
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
                Mejora la experiencia de compra online
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Nuestros clientes de e-commerce experimentan mejoras significativas en satisfacción y conversiones.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-secondary-700">
                    <ShoppingCart className="w-6 h-6 text-success-600 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Analytics de e-commerce"
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
              Proceso de implementación
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Integración rápida y eficiente con tu plataforma de e-commerce existente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para optimizar tu e-commerce?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Solicita una demo personalizada y descubre cómo podemos mejorar la experiencia de tus clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Solicitar Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              Ver Casos de Éxito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
