import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

interface RecentContentPreviewProps {
  className?: string;
}

export function RecentContentPreview({ className = "" }: RecentContentPreviewProps) {
  // En una aplicación real, esto vendría de una API o base de datos
  const recentContent = {
    type: "Artículo Destacado",
    title: "El Futuro del Contact Center: IA y Automatización en 2024",
    excerpt: "Descubre cómo la inteligencia artificial está revolucionando la industria de contact centers y qué tendencias dominarán el mercado este año...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "/noticias/el-futuro-del-contact-center-ia-y-automatizacion-en-2024",
    badge: "Nuevo"
  };

  return (
    <div className={`bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl shadow-lg text-white overflow-hidden relative ${className}`}>
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-primary-100 text-sm font-medium uppercase tracking-wide">
            {recentContent.badge}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 leading-tight">
          {recentContent.type}
        </h3>
        
        <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
          <img
            src={recentContent.image}
            alt={recentContent.title}
            className="w-full h-40 object-cover"
          />
        </div>
        
        <h4 className="text-lg font-semibold mb-3 leading-snug">
          {recentContent.title}
        </h4>
        
        <p className="text-primary-100 mb-6 leading-relaxed text-sm">
          {recentContent.excerpt}
        </p>
        
        <a
          href={recentContent.link}
          className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 group shadow-lg"
        >
          Leer artículo completo
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center text-primary-100 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Artículo más leído esta semana</span>
          </div>
        </div>
      </div>
    </div>
  );
}
