import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Home } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/configuracion/")({
  component: ConfiguracionAdmin,
});

function ConfiguracionAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery(trpc.siteSettings.list.queryOptions());

  const [form, setForm] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    tiktok: "",
    googleAnalytics: "",
    footerText: "",
    // Textos página de inicio
    home_hero_badge_line: "",
    home_hero_badge_24h_title: "",
    home_hero_badge_24h_subtitle: "",
    home_clients_title: "",
    home_services_title: "",
    home_services_title_highlight: "",
    home_services_subtitle: "",
    home_services_cta: "",
    home_services_btn: "",
    home_services_btn_link: "",
    home_benefits_title: "",
    home_benefits_subtitle: "",
    home_testimonials_title: "",
    home_testimonials_subtitle: "",
    home_certifications_title: "",
    home_certifications_subtitle: "",
    home_newsletter_title: "",
    home_newsletter_subtitle: "",
    home_newsletter_form_title: "",
    home_newsletter_form_description: "",
    home_social_title: "",
    home_social_description: "",
    home_offices_title: "",
    home_offices_subtitle: "",
    home_cta_title: "",
    home_cta_description: "",
    home_cta_btn_primary: "",
    home_cta_btn_secondary: "",
    home_cta_footer: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || "Esmassiva",
        siteDescription: settings.siteDescription || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        address: settings.address || "",
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        twitter: settings.twitter || "",
        tiktok: settings.tiktok || "",
        googleAnalytics: settings.googleAnalytics || "",
        footerText: settings.footerText || "",
        home_hero_badge_line: settings.home_hero_badge_line || "En línea: 1,247 agentes",
        home_hero_badge_24h_title: settings.home_hero_badge_24h_title || "24/7",
        home_hero_badge_24h_subtitle: settings.home_hero_badge_24h_subtitle || "Disponibilidad",
        home_clients_title: settings.home_clients_title || "Empresas líderes confían en Esmassiva",
        home_services_title: settings.home_services_title || "Nuestros",
        home_services_title_highlight: settings.home_services_title_highlight || "Servicios",
        home_services_subtitle: settings.home_services_subtitle || "Soluciones completas diseñadas para cada etapa del customer journey y optimizadas para el mercado latinoamericano",
        home_services_cta: settings.home_services_cta || "Conocer más",
        home_services_btn: settings.home_services_btn || "Ver Todos los Servicios",
        home_services_btn_link: settings.home_services_btn_link || "/servicios",
        home_benefits_title: settings.home_benefits_title || "¿Por qué elegir Esmassiva?",
        home_benefits_subtitle: settings.home_benefits_subtitle || "Ventajas competitivas que nos posicionan como líderes en la industria",
        home_testimonials_title: settings.home_testimonials_title || "Lo que dicen nuestros clientes",
        home_testimonials_subtitle: settings.home_testimonials_subtitle || "Testimonios reales de empresas que han transformado su negocio con Esmassiva",
        home_certifications_title: settings.home_certifications_title || "Certificaciones",
        home_certifications_subtitle: settings.home_certifications_subtitle || "Estándares internacionales que garantizan la calidad de nuestros servicios",
        home_newsletter_title: settings.home_newsletter_title || "Mantente Conectado con Esmassiva",
        home_newsletter_subtitle: settings.home_newsletter_subtitle || "Sé parte de una comunidad que está transformando las experiencias de cliente. Recibe insights exclusivos, casos de éxito y estrategias accionables directamente en tu correo.",
        home_newsletter_form_title: settings.home_newsletter_form_title || "Inspírate con historias e insights de marcas que transforman sus industrias.",
        home_newsletter_form_description: settings.home_newsletter_form_description || "Únete a miles de profesionales que reciben insights exclusivos, casos de éxito y estrategias accionables directamente en su bandeja de entrada.",
        home_social_title: settings.home_social_title || "Conéctate con nosotros",
        home_social_description: settings.home_social_description || "Únete a más de 2,000 profesionales que ya nos siguen para recibir actualizaciones, insights e ideas que transforman negocios.",
        home_offices_title: settings.home_offices_title || "Nuestras Oficinas",
        home_offices_subtitle: settings.home_offices_subtitle || "Presencia estratégica para estar cerca de nuestros clientes",
        home_cta_title: settings.home_cta_title || "¿Listo para transformar tu negocio?",
        home_cta_description: settings.home_cta_description || "Descubre cómo Esmassiva puede optimizar tus procesos, reducir costos y mejorar la experiencia de tus clientes con soluciones personalizadas.",
        home_cta_btn_primary: settings.home_cta_btn_primary || "Solicitar Propuesta Gratuita",
        home_cta_btn_secondary: settings.home_cta_btn_secondary || "Agendar Reunión",
        home_cta_footer: settings.home_cta_footer || "Respuesta en menos de 24 horas • Sin compromiso • Consulta gratuita",
      });
    }
  }, [settings]);

  const saveMutation = useMutation(
    trpc.siteSettings.setMany.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Configuración guardada");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600">Configuración general del sitio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-primary-600" />
            Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Sitio</label>
              <input type="text" value={form.siteName} onChange={(e) => setForm(prev => ({ ...prev, siteName: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Google Analytics ID</label>
              <input type="text" value={form.googleAnalytics} onChange={(e) => setForm(prev => ({ ...prev, googleAnalytics: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del Sitio (SEO)</label>
              <textarea value={form.siteDescription} onChange={(e) => setForm(prev => ({ ...prev, siteDescription: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-primary-600" />
            Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" /> Email de Contacto
              </label>
              <input type="email" value={form.contactEmail} onChange={(e) => setForm(prev => ({ ...prev, contactEmail: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" /> Teléfono
              </label>
              <input type="text" value={form.contactPhone} onChange={(e) => setForm(prev => ({ ...prev, contactPhone: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" /> Dirección
              </label>
              <input type="text" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Facebook className="w-4 h-4 inline mr-1" /> Facebook
              </label>
              <input type="url" value={form.facebook} onChange={(e) => setForm(prev => ({ ...prev, facebook: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Instagram className="w-4 h-4 inline mr-1" /> Instagram
              </label>
              <input type="url" value={form.instagram} onChange={(e) => setForm(prev => ({ ...prev, instagram: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Linkedin className="w-4 h-4 inline mr-1" /> LinkedIn
              </label>
              <input type="url" value={form.linkedin} onChange={(e) => setForm(prev => ({ ...prev, linkedin: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://linkedin.com/company/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Twitter className="w-4 h-4 inline mr-1" /> Twitter / X
              </label>
              <input type="url" value={form.twitter} onChange={(e) => setForm(prev => ({ ...prev, twitter: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">TikTok</label>
              <input type="url" value={form.tiktok} onChange={(e) => setForm(prev => ({ ...prev, tiktok: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://tiktok.com/@..." />
            </div>
          </div>
        </div>

        {/* Textos página de inicio */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Home className="w-5 h-5 mr-2 text-primary-600" />
            Textos de la página de inicio
          </h2>
          <p className="text-slate-600 text-sm mb-6">Todos los títulos y descripciones que se muestran en la página principal. Si están vacíos se usan los valores por defecto.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero - Badge línea (ej. En línea: 1,247 agentes)</label>
              <input type="text" value={form.home_hero_badge_line} onChange={(e) => setForm(prev => ({ ...prev, home_hero_badge_line: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero - Badge 24/7 título</label>
              <input type="text" value={form.home_hero_badge_24h_title} onChange={(e) => setForm(prev => ({ ...prev, home_hero_badge_24h_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hero - Badge 24/7 subtítulo</label>
              <input type="text" value={form.home_hero_badge_24h_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_hero_badge_24h_subtitle: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Sección Clientes - Título</label>
              <input type="text" value={form.home_clients_title} onChange={(e) => setForm(prev => ({ ...prev, home_clients_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sección Servicios - Título (ej. Nuestros)</label>
              <input type="text" value={form.home_services_title} onChange={(e) => setForm(prev => ({ ...prev, home_services_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sección Servicios - Título destacado (ej. Servicios)</label>
              <input type="text" value={form.home_services_title_highlight} onChange={(e) => setForm(prev => ({ ...prev, home_services_title_highlight: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Sección Servicios - Subtítulo</label>
              <textarea value={form.home_services_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_services_subtitle: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Servicios - Texto enlace (Conocer más)</label>
              <input type="text" value={form.home_services_cta} onChange={(e) => setForm(prev => ({ ...prev, home_services_cta: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Servicios - Botón (Ver todos)</label>
              <input type="text" value={form.home_services_btn} onChange={(e) => setForm(prev => ({ ...prev, home_services_btn: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Servicios - URL botón</label>
              <input type="text" value={form.home_services_btn_link} onChange={(e) => setForm(prev => ({ ...prev, home_services_btn_link: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="/servicios" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Beneficios - Título</label>
              <input type="text" value={form.home_benefits_title} onChange={(e) => setForm(prev => ({ ...prev, home_benefits_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Beneficios - Subtítulo</label>
              <textarea value={form.home_benefits_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_benefits_subtitle: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Testimonios - Título</label>
              <input type="text" value={form.home_testimonials_title} onChange={(e) => setForm(prev => ({ ...prev, home_testimonials_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Testimonios - Subtítulo</label>
              <textarea value={form.home_testimonials_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_testimonials_subtitle: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificaciones - Título</label>
              <input type="text" value={form.home_certifications_title} onChange={(e) => setForm(prev => ({ ...prev, home_certifications_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certificaciones - Subtítulo</label>
              <input type="text" value={form.home_certifications_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_certifications_subtitle: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Newsletter (sección) - Título</label>
              <input type="text" value={form.home_newsletter_title} onChange={(e) => setForm(prev => ({ ...prev, home_newsletter_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Newsletter (sección) - Subtítulo</label>
              <textarea value={form.home_newsletter_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_newsletter_subtitle: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Formulario newsletter - Título</label>
              <input type="text" value={form.home_newsletter_form_title} onChange={(e) => setForm(prev => ({ ...prev, home_newsletter_form_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Formulario newsletter - Descripción</label>
              <textarea value={form.home_newsletter_form_description} onChange={(e) => setForm(prev => ({ ...prev, home_newsletter_form_description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Redes sociales (módulo) - Título</label>
              <input type="text" value={form.home_social_title} onChange={(e) => setForm(prev => ({ ...prev, home_social_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Redes sociales (módulo) - Descripción</label>
              <textarea value={form.home_social_description} onChange={(e) => setForm(prev => ({ ...prev, home_social_description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Oficinas - Título</label>
              <input type="text" value={form.home_offices_title} onChange={(e) => setForm(prev => ({ ...prev, home_offices_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Oficinas - Subtítulo</label>
              <input type="text" value={form.home_offices_subtitle} onChange={(e) => setForm(prev => ({ ...prev, home_offices_subtitle: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA final - Título</label>
              <input type="text" value={form.home_cta_title} onChange={(e) => setForm(prev => ({ ...prev, home_cta_title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA final - Descripción</label>
              <textarea value={form.home_cta_description} onChange={(e) => setForm(prev => ({ ...prev, home_cta_description: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA - Botón principal</label>
              <input type="text" value={form.home_cta_btn_primary} onChange={(e) => setForm(prev => ({ ...prev, home_cta_btn_primary: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA - Botón secundario</label>
              <input type="text" value={form.home_cta_btn_secondary} onChange={(e) => setForm(prev => ({ ...prev, home_cta_btn_secondary: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">CTA - Texto pie (ej. Respuesta en 24h...)</label>
              <input type="text" value={form.home_cta_footer} onChange={(e) => setForm(prev => ({ ...prev, home_cta_footer: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Footer</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Texto del Footer</label>
            <input type="text" value={form.footerText} onChange={(e) => setForm(prev => ({ ...prev, footerText: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="© 2024 Esmassiva. Todos los derechos reservados." />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saveMutation.isPending} className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
            <Save className="w-5 h-5" />
            <span>{saveMutation.isPending ? "Guardando..." : "Guardar Configuración"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
