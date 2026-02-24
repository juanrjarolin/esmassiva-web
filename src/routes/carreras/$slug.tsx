import { createFileRoute } from "@tanstack/react-router";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Clock, Briefcase, ArrowLeft, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/carreras/$slug")({
  component: JobDetailPage,
});

function JobDetailPage() {
  const { slug } = Route.useParams();
  const trpc = useTRPC();
  const { data: job, isLoading } = useQuery(trpc.content.getJobBySlug.queryOptions({ slug }));

  const typeLabels: Record<string, string> = {
    "full-time": "Tiempo Completo",
    "part-time": "Medio Tiempo",
    "contract": "Contrato",
    "remote": "Remoto",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Cargando vacante...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Vacante no encontrada</h1>
          <p className="text-slate-600 mb-6">La vacante que buscas no existe o no está disponible.</p>
          <Link
            to="/carreras"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Vacantes
          </Link>
        </div>
      </div>
    );
  }

  const requirements = job.requirements.split("\n").filter((r) => r.trim());
  const benefits = job.benefits ? job.benefits.split("\n").filter((b) => b.trim()) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/carreras"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Vacantes
          </Link>
          {job.image && (
            <div className="mb-6 rounded-2xl overflow-hidden">
              <img
                src={job.image}
                alt={job.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{typeLabels[job.type] || job.type}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.linkedin.com/company/esmassiva/jobs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                Aplicar en LinkedIn
              </a>
              <button className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                Enviar CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Descripción del Puesto</h2>
                <div className="prose max-w-none">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{job.description}</p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Requisitos</h2>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-3 mt-1">•</span>
                      <span className="text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              {benefits.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">Beneficios</h2>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-3 mt-1">•</span>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-secondary-900 mb-4">Detalles del Puesto</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Departamento</p>
                    <p className="text-slate-900">{job.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Ubicación</p>
                    <p className="text-slate-900">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Tipo de Trabajo</p>
                    <p className="text-slate-900">{typeLabels[job.type] || job.type}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <a
                    href="https://www.linkedin.com/company/esmassiva/jobs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Aplicar Ahora
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
