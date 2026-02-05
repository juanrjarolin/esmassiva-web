import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

interface FeaturedPost {
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  isFeatured: boolean;
}

interface RecentContentPreviewProps {
  className?: string;
  post?: FeaturedPost | null;
}

const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

export function RecentContentPreview({ className = "", post }: RecentContentPreviewProps) {
  if (!post) {
    return (
      <div className={`bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl shadow-lg text-white overflow-hidden relative ${className}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 mr-2" />
            <span className="text-primary-100 text-sm font-medium uppercase tracking-wide">Contenido</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">Artículo destacado</h3>
          <p className="text-primary-100 text-sm">Cuando publiques un artículo en el blog, aparecerá aquí.</p>
        </div>
      </div>
    );
  }

  const image = post.featuredImage || defaultImage;
  const link = `/blog/${post.slug}`;

  return (
    <div className={`bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl shadow-lg text-white overflow-hidden relative ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-primary-100 text-sm font-medium uppercase tracking-wide">
            {post.isFeatured ? "Artículo Destacado" : "Nuevo"}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-3 leading-tight">
          {post.isFeatured ? "Artículo Destacado" : "Último artículo"}
        </h3>

        <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
          <img
            src={image}
            alt={post.title}
            className="w-full h-40 object-cover"
          />
        </div>

        <h4 className="text-lg font-semibold mb-3 leading-snug">
          {post.title}
        </h4>

        <p className="text-primary-100 mb-6 leading-relaxed text-sm">
          {post.excerpt || ""}
        </p>

        <a
          href={link}
          className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 group shadow-lg"
        >
          Leer artículo completo
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center text-primary-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Desde el blog</span>
          </div>
        </div>
      </div>
    </div>
  );
}
