import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, User, Tag, ArrowLeft, Clock, Share2, Bookmark, ThumbsUp, MessageCircle, BookOpen } from "lucide-react";
import { NewsletterForm } from "~/components/NewsletterForm";
import { SocialMediaModule } from "~/components/SocialMediaModule";
import { RecentContentPreview } from "~/components/RecentContentPreview";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/noticias/$postSlug/")({
  component: BlogPostPage,
});

// Helper function to calculate reading time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
};

function BlogPostPage() {
  const { postSlug } = Route.useParams();
  const trpc = useTRPC();

  const { data: post, isLoading, error } = useQuery(
    trpc.content.getBlogPostBySlug.queryOptions({ slug: postSlug })
  );

  // Get related posts (excluding current post)
  const { data: relatedPostsData } = useQuery(
    trpc.content.getBlogPosts.queryOptions({ limit: 3 })
  );

  const relatedPosts = relatedPostsData?.filter(p => p.slug !== postSlug).slice(0, 2) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Artículo no encontrado</h1>
          <p className="text-secondary-600 mb-8">El artículo que buscas no existe o ha sido movido.</p>
          <Link
            to="/noticias"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Noticias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-secondary-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/noticias"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Blog
          </Link>

          <div className="flex items-center mb-4">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
              {post.category}
            </span>
            <div className="flex items-center text-secondary-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {calculateReadTime(post.content)}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {post.publishedAt && (
                <>
                  <Calendar className="w-5 h-5 text-secondary-400 mr-2" />
                  <span className="text-secondary-600">{new Date(post.publishedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show excerpt if available */}
        {post.excerpt && (
          <div className="mb-8 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-600">
            <p className="text-lg text-secondary-700 leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div
            className="text-secondary-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Sharing */}
        <div className="mt-8 p-6 bg-secondary-50 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ThumbsUp className="w-5 h-5 text-secondary-600 mr-2" />
              <span className="text-secondary-700">¿Te gustó este artículo?</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-primary-600 hover:text-primary-700 transition-colors">
                <Share2 className="w-4 h-4 mr-1" />
                Compartir
              </button>
              <button className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors">
                <MessageCircle className="w-4 h-4 mr-1" />
                Comentar
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-secondary-200 mt-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Artículos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-48">
                  {relatedPost.featuredImage ? (
                    <img
                      src={relatedPost.featuredImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary-600 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {calculateReadTime(relatedPost.content)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-3 leading-tight">
                    {relatedPost.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 leading-relaxed">
                    {relatedPost.excerpt || relatedPost.content.slice(0, 150) + "..."}
                  </p>
                  <Link
                    to="/noticias/$postSlug"
                    params={{ postSlug: relatedPost.slug }}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center text-sm"
                  >
                    Leer más
                    <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Stay Connected Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-primary-50/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Mantente Conectado con <span className="text-primary-600">Esmassiva</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              No te pierdas contenido exclusivo. Únete a nuestra comunidad para recibir insights, tendencias e historias que inspiran transformación.
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
