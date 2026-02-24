import { createFileRoute } from "@tanstack/react-router";
import { Users, Zap, Heart, Trophy, MapPin, Clock, DollarSign, Briefcase, Linkedin } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/carreras/")({
  component: CarrerasPage,
});

function CarrerasPage() {
  const trpc = useTRPC();
  const { data: jobPositions, isLoading: isLoadingJobs } = useQuery(trpc.content.getJobPositions.queryOptions());
  const { data: hero } = useQuery(trpc.content.getHero.queryOptions({ page: "carreras" }));

  const benefits = [
    {
      icon: Heart,
      title: "Bienestar Integral",
      description: "Seguro médico, días de salud mental y programas de wellness"
    },
    {
      icon: Trophy,
      title: "Crecimiento Profesional",
      description: "Capacitaciones, certificaciones y plan de carrera personalizado"
    },
    {
      icon: Users,
      title: "Ambiente Colaborativo",
      description: "Equipos multidisciplinarios y cultura de trabajo en equipo"
    },
    {
      icon: Zap,
      title: "Tecnología de Vanguardia",
      description: "Herramientas modernas y oportunidades de innovación"
    }
  ];

  const companyLogos = [
    { name: "TechCorp", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=TechCorp" },
    { name: "GlobalTrade", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=GlobalTrade" },
    { name: "InnovateMX", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=InnovateMX" },
    { name: "DataSolutions", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=DataSolutions" },
    { name: "CloudFirst", logo: "https://via.placeholder.com/120x60/2563eb/ffffff?text=CloudFirst" },
    { name: "SmartRetail", logo: "https://via.placeholder.com/120x60/64748b/ffffff?text=SmartRetail" },
    { name: "FinTech Pro", logo: "https://via.placeholder.com/120x60/059669/ffffff?text=FinTech" },
    { name: "BankingPlus", logo: "https://via.placeholder.com/120x60/059669/ffffff?text=Banking" },
    { name: "TelecomMX", logo: "https://via.placeholder.com/120x60/7c3aed/ffffff?text=Telecom" },
    { name: "ConnectPlus", logo: "https://via.placeholder.com/120x60/7c3aed/ffffff?text=Connect" },
    { name: "NetworkPro", logo: "https://via.placeholder.com/120x60/7c3aed/ffffff?text=Network" },
    { name: "MobileTech", logo: "https://via.placeholder.com/120x60/7c3aed/ffffff?text=Mobile" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          {hero ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {hero.subtitle && (
                  <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                    {hero.subtitle}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 whitespace-pre-line">
                  {hero.title}
                </h1>
                {hero.description && (
                  <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                    {hero.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  {hero.ctaText && hero.ctaLink && (
                    <a
                      href={hero.ctaLink}
                      className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                    >
                      {hero.ctaText}
                    </a>
                  )}
                  {hero.ctaSecondaryText && hero.ctaSecondaryLink && (
                    <a
                      href={hero.ctaSecondaryLink}
                      className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                    >
                      {hero.ctaSecondaryText}
                    </a>
                  )}
                  {!hero.ctaText && (
                    <a
                      href="https://www.linkedin.com/company/esmassiva/jobs/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      Ver Vacantes en LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <div className="relative">
                {hero.image ? (
                  <img
                    src={hero.image}
                    alt={hero.title}
                    className="rounded-2xl shadow-2xl w-full h-auto"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    alt="Equipo joven trabajando"
                    className="rounded-2xl shadow-2xl"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                  Únete al <span className="text-primary-600">futuro</span> del trabajo
                </h1>
                <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                  En Esmassiva creamos un ambiente dinámico donde el talento joven prospera,
                  la innovación es constante y cada día es una oportunidad para crecer profesionalmente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://www.linkedin.com/company/esmassiva/jobs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    Ver Vacantes en LinkedIn
                  </a>
                  <button className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                    Enviar CV
                  </button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Equipo joven trabajando"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">4.8/5</div>
                    <div className="text-sm text-secondary-600">Satisfacción laboral</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Culture & Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              ¿Por qué elegir Esmassiva?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Ofrecemos más que un trabajo, creamos experiencias que transforman carreras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">{benefit.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Company Culture Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                alt="Oficina moderna"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Espacios Modernos</h3>
                <p className="text-sm opacity-90">Oficinas diseñadas para la colaboración</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Equipo colaborando"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Trabajo en Equipo</h3>
                <p className="text-sm opacity-90">Colaboración y crecimiento conjunto</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1543269664-76bc5e7ad5b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Capacitación"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Capacitación Continua</h3>
                <p className="text-sm opacity-90">Desarrollo profesional constante</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Vacantes Abiertas
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Explora las oportunidades disponibles y únete a nuestro equipo
            </p>
          </div>

          {isLoadingJobs ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Cargando vacantes...</p>
            </div>
          ) : jobPositions && jobPositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPositions.map((job) => {
                const typeLabels: Record<string, string> = {
                  "full-time": "Tiempo Completo",
                  "part-time": "Medio Tiempo",
                  "contract": "Contrato",
                  "remote": "Remoto",
                };
                return (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                    {job.image && (
                      <div className="relative h-48 w-full">
                        <img
                          src={job.image}
                          alt={job.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-secondary-900 mb-2">{job.title}</h3>
                          <div className="flex items-center text-slate-600 text-sm mb-2">
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center text-slate-600 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                          {typeLabels[job.type] || job.type}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                      <Link
                        to="/carreras/$slug"
                        params={{ slug: job.slug }}
                        className="inline-flex items-center justify-center w-full bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-xl text-slate-600 mb-4">No hay vacantes disponibles en este momento</p>
              <p className="text-slate-500">
                Visita nuestro{" "}
                <a
                  href="https://www.linkedin.com/company/esmassiva/jobs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline font-medium"
                >
                  LinkedIn
                </a>{" "}
                para más oportunidades
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Empresas que Confían en Nosotros
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Únete a profesionales que trabajan con las marcas más reconocidas
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companyLogos.map((company, index) => (
              <div key={index} className="flex justify-center">
                <div className="bg-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-auto hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a un equipo que valora el talento, la innovación y el crecimiento personal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="https://www.linkedin.com/company/esmassiva/jobs/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              Explorar Vacantes
            </a>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Conocer Más
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
