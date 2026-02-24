import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, ArrowRight, Phone, ShoppingCart, Headphones, CreditCard, Building2, TrendingUp, Users, Globe, Shield, Award, Star, Zap, Target, FileText, Database, BarChart3, Cog, Clock, MessageSquare, Mail } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/servicios/$slug/")({
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const trpc = useTRPC();

  const { data: service, isLoading, error } = useQuery(
    trpc.content.getServiceBySlug.queryOptions({ slug })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Servicio no encontrado</h1>
          <p className="text-secondary-600 mb-8">El servicio que buscas no existe o ha sido movido.</p>
          <Link
            to="/servicios"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Servicios
          </Link>
        </div>
      </div>
    );
  }

  // Parse data from JSON
  const benefits = typeof service.benefits === 'string'
    ? JSON.parse(service.benefits || "[]")
    : service.benefits || [];

  const features = service.features || [];
  const services = service.services || [];
  const process = service.process || [];

  // Get icon component
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Phone, ShoppingCart, Headphones, CreditCard, Building2, TrendingUp,
    Users, Globe, Shield, Award, Star, CheckCircle, Zap, Target,
    FileText, Database, BarChart3, Cog, Clock, MessageSquare, Mail,
  };

  const getIcon = (iconName: string) => iconMap[iconName] || Building2;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className={`relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${service.bgColor?.replace('bg-', 'from-')} to-white`}>
        <div className="max-w-7xl mx-auto">
          <Link
            to="/servicios"
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Servicios
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center ${service.bgColor} ${service.iconColor} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
                {(() => {
                  const Icon = getIcon(service.icon);
                  return <Icon className="w-4 h-4 mr-2" />;
                })()}
                {service.title}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                {service.heroTitle || service.title}
                {service.heroSubtitle && (
                  <span className="text-secondary-600"> {service.heroSubtitle}</span>
                )}
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                {service.heroDescription || service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {service.heroCtaText && (
                  <a
                    href={service.heroCtaLink || "/contacto"}
                    className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg text-center"
                  >
                    {service.heroCtaText}
                  </a>
                )}
                {service.heroCtaSecondaryText && (
                  <a
                    href={service.heroCtaSecondaryLink || "/contacto"}
                    className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors text-center"
                  >
                    {service.heroCtaSecondaryText}
                  </a>
                )}
                {!service.heroCtaText && !service.heroCtaSecondaryText && (
                  <>
                    <a
                      href="/contacto"
                      className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg text-center"
                    >
                      Solicitar Propuesta
                    </a>
                    <a
                      href="/contacto"
                      className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors text-center"
                    >
                      Agendar Consulta
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              {service.heroImage ? (
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              ) : (
                <div className={`w-full h-64 ${service.bgColor} rounded-2xl flex items-center justify-center`}>
                  {(() => {
                    const Icon = getIcon(service.icon);
                    return <Icon className={`w-32 h-32 ${service.iconColor}`} />;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (service.featuresTitle || service.featuresSubtitle) && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {service.featuresTitle || "Características principales"}
              </h2>
              {service.featuresSubtitle && (
                <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                  {service.featuresSubtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature: any, index: number) => {
                const FeatureIcon = getIcon(feature.icon);
                return (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                    <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                      <FeatureIcon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-4">{feature.title}</h3>
                    <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services/Channels Section */}
      {services.length > 0 && (service.servicesTitle || service.servicesSubtitle) && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {service.servicesTitle || "Servicios especializados"}
              </h2>
              {service.servicesSubtitle && (
                <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                  {service.servicesSubtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((serviceItem: any, index: number) => {
                const ServiceIcon = getIcon(serviceItem.icon);
                return (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                    <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <ServiceIcon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary-900 mb-3">{serviceItem.title}</h3>
                    <p className="text-secondary-600 text-sm leading-relaxed">{serviceItem.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {benefits.length > 0 && (service.benefitsTitle || service.benefitsSubtitle) && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {service.benefitsImage && (
                <div className="relative">
                  <img
                    src={service.benefitsImage}
                    alt="Beneficios"
                    className="rounded-2xl shadow-xl w-full h-auto"
                  />
                </div>
              )}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                  {service.benefitsTitle || "Ventajas competitivas"}
                </h2>
                {service.benefitsSubtitle && (
                  <p className="text-xl text-secondary-600 mb-8">
                    {service.benefitsSubtitle}
                  </p>
                )}
                <ul className="space-y-4">
                  {benefits.map((benefit: string, index: number) => (
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
      )}

      {/* Process Section */}
      {process.length > 0 && (service.processTitle || service.processSubtitle) && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {service.processTitle || "Proceso de implementación"}
              </h2>
              {service.processSubtitle && (
                <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                  {service.processSubtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step: any, index: number) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${service.bgColor?.replace('bg-', 'bg-') || 'bg-primary-600'} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{step.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Content Section (Optional) */}
      {service.fullContent && service.fullContent.trim() !== "" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:text-secondary-900 prose-p:text-secondary-600 prose-a:text-primary-600 prose-strong:text-secondary-900 prose-ul:text-secondary-600 prose-ol:text-secondary-600"
              dangerouslySetInnerHTML={{ __html: service.fullContent }}
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${service.bgColor?.replace('bg-', 'from-') || 'from-primary-600'} to-primary-700`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {service.ctaTitle || "¿Listo para comenzar?"}
          </h2>
          {service.ctaDescription && (
            <p className="text-xl text-primary-100 mb-8">
              {service.ctaDescription}
            </p>
          )}
          {!service.ctaDescription && (
            <p className="text-xl text-primary-100 mb-8">
              Solicita una propuesta personalizada y descubre cómo podemos ayudarte a alcanzar tus objetivos
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {service.ctaButtonText ? (
              <a
                href={service.ctaButtonLink || "/contacto"}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center"
              >
                {service.ctaButtonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            ) : (
              <a
                href="/contacto"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center"
              >
                Solicitar Propuesta
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            )}
            {service.ctaSecondaryButtonText ? (
              <a
                href={service.ctaSecondaryButtonLink || "/contacto"}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                {service.ctaSecondaryButtonText}
              </a>
            ) : (
              <a
                href="/contacto"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Agendar Consulta
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
