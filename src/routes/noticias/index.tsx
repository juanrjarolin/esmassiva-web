import { createFileRoute } from "@tanstack/react-router";
import { Calendar, User, Tag, ArrowRight, TrendingUp, BookOpen, Clock } from "lucide-react";
import { NewsletterForm } from "~/components/NewsletterForm";
import { SocialMediaModule } from "~/components/SocialMediaModule";
import { RecentContentPreview } from "~/components/RecentContentPreview";

export const Route = createFileRoute("/noticias/")({
  component: NoticiasPage,
});

function NoticiasPage() {
  // Function to generate URL-friendly slugs from titles
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const featuredPost = {
    title: "El Futuro del Contact Center: IA y Automatización en 2024",
    excerpt: "Descubre cómo la inteligencia artificial está revolucionando la industria de contact centers y qué tendencias dominarán el mercado este año.",
    content: "La transformación digital en los contact centers ha alcanzado un punto de inflexión...",
    author: "María Elena Rodríguez",
    publishedAt: "2024-01-15",
    category: "Tendencias",
    tags: ["IA", "Automatización", "Contact Center", "Futuro"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    readTime: "8 min"
  };

  const recentPosts = [
    {
      title: "Cómo Mejorar la Experiencia del Cliente con Tecnología Omnicanal",
      excerpt: "Estrategias probadas para crear experiencias consistentes a través de todos los puntos de contacto.",
      author: "Carlos Mendoza",
      publishedAt: "2024-01-12",
      category: "Customer Experience",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "6 min"
    },
    {
      title: "Tendencias en BPO para el Mercado Latinoamericano",
      excerpt: "Análisis de las oportunidades y desafíos del outsourcing de procesos de negocio en la región.",
      author: "Ana Sofía Herrera",
      publishedAt: "2024-01-10",
      category: "BPO",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "5 min"
    },
    {
      title: "Métricas Clave para Medir el Éxito de tu Contact Center",
      excerpt: "KPIs esenciales que todo director de operaciones debe monitorear para optimizar resultados.",
      author: "Roberto Silva",
      publishedAt: "2024-01-08",
      category: "Métricas",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "7 min"
    },
    {
      title: "La Importancia de la Capacitación Continua en Contact Centers",
      excerpt: "Por qué invertir en el desarrollo del talento humano es clave para el éxito a largo plazo.",
      author: "Laura Martínez",
      publishedAt: "2024-01-05",
      category: "Talento Humano",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "4 min"
    },
    {
      title: "Seguridad de Datos en Contact Centers: Mejores Prácticas",
      excerpt: "Guía completa para proteger la información sensible de clientes y cumplir con regulaciones.",
      author: "Diego Morales",
      publishedAt: "2024-01-03",
      category: "Seguridad",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "9 min"
    },
    {
      title: "Innovaciones Tecnológicas que Transforman el BPO",
      excerpt: "Desde RPA hasta análisis predictivo, las tecnologías que están redefiniendo el outsourcing.",
      author: "Patricia Vega",
      publishedAt: "2024-01-01",
      category: "Tecnología",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      readTime: "6 min"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              <span className="text-primary-600">Blog</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Mantente al día with las últimas tendencias de la industria, insights de expertos 
              y noticias corporativas de Esmassiva.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Destacado
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {featuredPost.category}
                  </span>
                  <div className="flex items-center text-secondary-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-secondary-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-700 font-medium mr-4">{featuredPost.author}</span>
                    <Calendar className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-600">{new Date(featuredPost.publishedAt).toLocaleDateString('es-MX')}</span>
                  </div>
                  <a
                    href={`/noticias/${generateSlug(featuredPost.title)}`}
                    className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">Artículos Recientes</h2>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span className="text-secondary-600">Todos los artículos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3 text-sm text-secondary-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="mr-3">{post.readTime}</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('es-MX')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-secondary-400 mr-2" />
                      <span className="text-secondary-600 text-sm">{post.author}</span>
                    </div>
                    <a
                      href={`/noticias/${generateSlug(post.title)}`}
                      className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center text-sm"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Cargar Más Artículos
            </button>
          </div>
        </div>
      </section>

      {/* Stay Connected Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Mantente Conectado con <span className="text-primary-600">Esmassiva</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Sé parte de una comunidad que está transformando las experiencias de cliente. Recibe los últimos insights, tendencias e historias que importan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Newsletter Form */}
            <div className="lg:col-span-1">
              <NewsletterForm 
                variant="inline"
                className="h-full"
              />
            </div>

            {/* Recent Content Preview */}
            <div className="lg:col-span-1">
              <RecentContentPreview className="h-full" />
            </div>

            {/* Social Media Section */}
            <div className="lg:col-span-1">
              <SocialMediaModule className="h-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
