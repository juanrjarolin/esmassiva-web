import { createFileRoute } from "@tanstack/react-router";
import { Users, Target, Eye, Heart, Award, TrendingUp, Globe, Shield, CheckCircle, Star, Zap } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/nosotros/")({
  component: NosotrosPage,
});

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Shield, TrendingUp, Award, Users, CheckCircle, Star, Zap, Target, Heart
};

function NosotrosPage() {
  const trpc = useTRPC();
  const { data: settings } = useQuery(trpc.content.getSiteSettings.queryOptions());
  const { data: values } = useQuery(trpc.content.getValues.queryOptions());
  const { data: teamMembers } = useQuery(trpc.content.getTeamMembers.queryOptions());

  const stats = [
    { number: "15+", label: "Años de experiencia" },
    { number: "500+", label: "Empresas atendidas" },
    { number: "50K+", label: "Llamadas diarias" },
    { number: "98%", label: "Satisfacción del cliente" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
                Transformando el <span className="text-primary-600">futuro</span> de los contact centers
              </h1>
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                Desde 2008, Esmassiva ha sido pionera en brindar soluciones innovadoras de
                contact center y BPO para empresas líderes en el mercado hispanohablante.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-secondary-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Equipo Esmassiva"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex gap-6">
                  {stats.slice(2).map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary-600 mb-1">{stat.number}</div>
                      <div className="text-xs text-secondary-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900">Nuestra Misión</h2>
              </div>
              <p className="text-secondary-700 leading-relaxed">
                {settings?.nosotros_mission || "Empoderar a las empresas con soluciones integrales de contact center y BPO, combinando tecnología de vanguardia con talento humano especializado para crear experiencias excepcionales que impulsen el crecimiento y la satisfacción del cliente en el mercado hispanohablante."}
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-600 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-secondary-900">Nuestra Visión</h2>
              </div>
              <p className="text-secondary-700 leading-relaxed">
                {settings?.nosotros_vision || "Ser la empresa líder en servicios de contact center y BPO en Latinoamérica, reconocida por nuestra innovación, excelencia operativa y capacidad de transformar digitalmente los procesos de negocio de nuestros clientes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en Esmassiva
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values && values.length > 0 ? (
              values.map((value) => {
                const Icon = iconMap[value.icon] || Shield;
                return (
                  <div key={value.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-4">{value.title}</h3>
                    <p className="text-secondary-600 leading-relaxed">{value.description}</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-slate-500 py-8">
                No hay valores configurados. Configúralos desde el panel de administración.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Nuestro Equipo Directivo
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Líderes con experiencia comprobada en la industria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers && teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                        <Users className="w-16 h-16 text-primary-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">{member.name}</h3>
                    <p className="text-primary-600 font-semibold mb-2">{member.position}</p>
                    {member.bio && (
                      <p className="text-sm text-secondary-600 line-clamp-2">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-8">
                No hay miembros del equipo configurados. Agrégalos desde el panel de administración.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Quieres conocer más sobre nosotros?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Agenda una reunión con nuestro equipo y descubre cómo podemos ayudarte
          </p>
          <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors shadow-lg">
            Contactar Equipo
          </button>
        </div>
      </section>
    </div>
  );
}
