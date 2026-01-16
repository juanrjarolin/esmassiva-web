import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
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
    googleAnalytics: "",
    footerText: "",
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
        googleAnalytics: settings.googleAnalytics || "",
        footerText: settings.footerText || "",
      });
    }
  }, [settings]);

  const saveMutation = useMutation(
    trpc.siteSettings.setMany.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
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
