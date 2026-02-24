import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, ShoppingCart, Headphones, CreditCard, Building2, TrendingUp, Users, Globe, Shield, Award, Star, CheckCircle, Zap, Target } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/servicios/")({
  component: ServiciosPage,
});

function ServiciosPage() {
  const trpc = useTRPC();
  const { data: settings } = useQuery(trpc.content.getSiteSettings.queryOptions());
  const { data: services = [] } = useQuery(trpc.content.getServices.queryOptions());

  // Función helper para obtener texto con fallback
  const t = (key: string, fallback: string) => (settings?.[key] && settings[key].trim() !== "" ? settings[key] : fallback);

  // Icon mapping helper
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Phone,
    ShoppingCart,
    Headphones,
    CreditCard,
    Building2,
    TrendingUp,
    Users,
    Globe,
    Shield,
    Award,
    Star,
    CheckCircle,
    Zap,
    Target,
  };

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
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600">No hay servicios disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Building2;
                const benefits = typeof service.benefits === 'string'
                  ? JSON.parse(service.benefits || "[]")
                  : service.benefits || [];

                return (
                  <div
                    key={service.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-secondary-100 hover:border-primary-200 hover:-translate-y-1 hover:scale-[1.01]"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-shrink-0">
                          <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <Icon className={`w-8 h-8 ${service.iconColor} transition-transform duration-300`} />
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

                      {benefits.length > 0 && (
                        <ul className="space-y-2 mb-8">
                          {benefits.slice(0, 4).map((benefit: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-secondary-600 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <CheckCircle className="w-4 h-4 text-primary-500 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link
                        to="/servicios/$slug"
                        params={{ slug: service.slug }}
                        className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-700 hover:scale-[1.02] transition-all duration-200 group-hover:shadow-lg block text-center"
                      >
                        {t("services_cta", "Conocer más")}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            <a
              href="/contacto"
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-lg text-center"
            >
              Solicitar Propuesta
            </a>
            <a
              href="/contacto"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-200 text-center"
            >
              Agendar Reunión
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
