import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Phone, ShoppingCart, Headphones, CreditCard, Building2, Users, Globe, Shield, Award, TrendingUp, Star, CheckCircle, Play, MapPin } from "lucide-react";
import { NewsletterForm } from "~/components/NewsletterForm";
import { SocialMediaModule } from "~/components/SocialMediaModule";
import { RecentContentPreview } from "~/components/RecentContentPreview";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone, ShoppingCart, Headphones, CreditCard, Building2, Users, Globe, Shield, Award, TrendingUp, Star, CheckCircle, MapPin
};

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.content.getHomepageData.queryOptions());

  // Fallback data while loading
  const services = data?.services || [];
  const metrics = data?.metrics || [];
  const testimonials = data?.testimonials || [];
  const clients = data?.clients || [];
  const certifications = data?.certifications || [];
  const offices = data?.offices || [];
  const benefits = data?.benefits || [];
  const hero = data?.hero;
  const s = data?.settings || {};
  const t = (key: string, fallback: string) => (s[key] && s[key].trim() !== "" ? s[key] : fallback);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              {hero?.subtitle && (
                <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Award className="w-4 h-4 mr-2" />
                  {hero.subtitle}
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
                {hero?.title?.split('\n').map((line, i) => (
                  <span key={i} className={i > 0 ? "text-primary-600 block" : ""}>
                    {line}
                  </span>
                )) || "Transformamos tu experiencia de cliente"}
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                {hero?.description || "Soluciones integrales de contact center y BPO que impulsan el crecimiento de empresas líderes en el mercado hispanohablante con tecnología de vanguardia y talento especializado."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href={hero?.ctaLink || "/contacto"} className="group border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  {hero?.ctaText || "Solicitar Demo"}
                </a>
              </div>
              {metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => {
                    const Icon = iconMap[metric.icon] || Award;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Icon className="w-5 h-5 text-primary-600 mr-2" />
                          <span className="text-2xl font-bold text-primary-600">{metric.number}</span>
                        </div>
                        <div className="text-sm text-secondary-600">{metric.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="relative animate-slide-up">
              <div className="relative">
                <img
                  src={hero?.image || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"}
                  alt="Contact Center moderno"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-secondary-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-secondary-700">
                      {t("home_hero_badge_line", "En línea: 1,247 agentes")}
                    </span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-primary-600 text-white p-4 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-lg font-bold">{t("home_hero_badge_24h_title", "24/7")}</div>
                    <div className="text-xs opacity-90">{t("home_hero_badge_24h_subtitle", "Disponibilidad")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      {clients.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-secondary-600 font-medium">
                {t("home_clients_title", "Empresas líderes confían en Esmassiva")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {clients.map((client, index) => (
                <div key={index} className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-12 w-auto hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Overview */}
      {services.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-6">
                {t("home_services_title", "Nuestros")} <span className="text-primary-600">{t("home_services_title_highlight", "Servicios")}</span>
              </h2>
              <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
                {t("home_services_subtitle", "Soluciones completas diseñadas para cada etapa del customer journey y optimizadas para el mercado latinoamericano")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Building2;
                return (
                  <div
                    key={index}
                    className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-secondary-100 hover:border-primary-200"
                  >
                    <div className={`w-16 h-16 ${service.bgColor} group-hover:opacity-80 rounded-2xl flex items-center justify-center mb-6 transition-colors`}>
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-secondary-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.benefits.slice(0, 4).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-secondary-600">
                          <CheckCircle className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <a href={service.href} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center">
                      {t("home_services_cta", "Conocer más")}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <a href={t("home_services_btn_link", "/servicios")} className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg inline-block">
                {t("home_services_btn", "Ver Todos los Servicios")}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {t("home_benefits_title", "¿Por qué elegir Esmassiva?")}
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                {t("home_benefits_subtitle", "Ventajas competitivas que nos posicionan como líderes en la industria")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = iconMap[benefit.icon] || Award;
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
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {t("home_testimonials_title", "Lo que dicen nuestros clientes")}
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                {t("home_testimonials_subtitle", "Testimonios reales de empresas que han transformado su negocio con Esmassiva")}
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
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full mr-4 bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-bold">{testimonial.name[0]}</span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-secondary-900">{testimonial.name}</div>
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
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {t("home_certifications_title", "Certificaciones")}
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                {t("home_certifications_subtitle", "Estándares internacionales que garantizan la calidad de nuestros servicios")}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
              {certifications.map((cert) => {
                const Icon = iconMap[cert.icon] || Shield;
                return (
                  <div key={cert.name} className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <Icon className="w-12 h-12 text-primary-600 mb-2" />
                    <span className="text-lg font-bold text-secondary-900 text-center">{cert.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stay Updated - Newsletter & Social Media */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {t("home_newsletter_title", "Mantente Conectado con Esmassiva")}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              {t("home_newsletter_subtitle", "Sé parte de una comunidad que está transformando las experiencias de cliente. Recibe insights exclusivos, casos de éxito y estrategias accionables directamente en tu correo.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <NewsletterForm
                variant="inline"
                showNameFields={false}
                className="h-full"
                title={t("home_newsletter_form_title", "Inspírate con historias e insights de marcas que transforman sus industrias.")}
                description={t("home_newsletter_form_description", "Únete a miles de profesionales que reciben insights exclusivos, casos de éxito y estrategias accionables directamente en su bandeja de entrada.")}
              />
            </div>
            <div className="lg:col-span-1">
              <RecentContentPreview className="h-full" post={data?.featuredPost ?? null} />
            </div>
            <div className="lg:col-span-1">
              <SocialMediaModule
                className="h-full"
                title={t("home_social_title", "Conéctate con nosotros")}
                description={t("home_social_description", "Únete a más de 2,000 profesionales que ya nos siguen para recibir actualizaciones, insights e ideas que transforman negocios.")}
                facebook={s.facebook}
                instagram={s.instagram}
                linkedin={s.linkedin}
                tiktok={s.tiktok}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Offices */}
      {offices.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {t("home_offices_title", "Nuestras Oficinas")}
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                {t("home_offices_subtitle", "Presencia estratégica para estar cerca de nuestros clientes")}
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-8">
              {offices.map((office) => (
                <div key={office.city} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center max-w-md">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{office.city}</h3>
                  <p className="text-secondary-600 text-sm mb-2">{office.address}</p>
                  <p className="text-secondary-600 text-sm">{office.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t("home_cta_title", "¿Listo para transformar tu negocio?")}
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            {t("home_cta_description", "Descubre cómo Esmassiva puede optimizar tus procesos, reducir costos y mejorar la experiencia de tus clientes con soluciones personalizadas.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="/contacto" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {t("home_cta_btn_primary", "Solicitar Propuesta Gratuita")}
            </a>
            <a href="/contacto" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              {t("home_cta_btn_secondary", "Agendar Reunión")}
            </a>
          </div>
          <p className="text-primary-200 text-sm">
            {t("home_cta_footer", "Respuesta en menos de 24 horas • Sin compromiso • Consulta gratuita")}
          </p>
        </div>
      </section>
    </div>
  );
}
