import { createFileRoute } from "@tanstack/react-router";
import { Calendar, User, Tag, ArrowRight, TrendingUp, BookOpen, Clock } from "lucide-react";
import { NewsletterForm } from "~/components/NewsletterForm";
import { SocialMediaModule } from "~/components/SocialMediaModule";
import { RecentContentPreview } from "~/components/RecentContentPreview";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/noticias/")({
  component: NoticiasPage,
});

// Helper function to calculate reading time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
};

function NoticiasPage() {
  const trpc = useTRPC();
  const { data: featuredPost } = useQuery(trpc.content.getBlogPosts.queryOptions({ limit: 1, featured: true }));
  const { data: recentPosts } = useQuery(trpc.content.getBlogPosts.queryOptions({ limit: 12 }));

  // Get featured post (first one if exists, otherwise use first recent post)
  const featured = featuredPost && featuredPost.length > 0
    ? featuredPost[0]
    : (recentPosts && recentPosts.length > 0 ? recentPosts[0] : null);

  // Get other posts (exclude featured from recent)
  const otherPosts = recentPosts?.filter(post =>
    featured ? post.id !== featured.id : true
  ) || [];

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
      {featured && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  {featured.featuredImage ? (
                    <img
                      src={featured.featuredImage}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary-600 opacity-50" />
                    </div>
                  )}
                  {featured.isFeatured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Destacado
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-4">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                      {featured.category}
                    </span>
                    <div className="flex items-center text-secondary-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {calculateReadTime(featured.content)}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-secondary-900 mb-4 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    {featured.excerpt || featured.content.slice(0, 200) + "..."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {featured.publishedAt && (
                        <>
                          <Calendar className="w-5 h-5 text-secondary-400 mr-2" />
                          <span className="text-secondary-600">{new Date(featured.publishedAt).toLocaleDateString('es-MX')}</span>
                        </>
                      )}
                    </div>
                    <a
                      href={`/noticias/${featured.slug}`}
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
      )}

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

          {otherPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative h-48">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary-600 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3 text-sm text-secondary-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="mr-3">{calculateReadTime(post.content)}</span>
                      {post.publishedAt && (
                        <>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(post.publishedAt).toLocaleDateString('es-MX')}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 leading-relaxed">
                      {post.excerpt || post.content.slice(0, 150) + "..."}
                    </p>
                    <div className="flex items-center justify-between">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <a
                        href={`/noticias/${post.slug}`}
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
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 text-lg">No hay artículos publicados aún.</p>
              <p className="text-slate-400 text-sm mt-2">Crea y publica artículos desde el panel de administración.</p>
            </div>
          )}

          {otherPosts.length >= 12 && (
            <div className="text-center mt-12">
              <button className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                Cargar Más Artículos
              </button>
            </div>
          )}
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
