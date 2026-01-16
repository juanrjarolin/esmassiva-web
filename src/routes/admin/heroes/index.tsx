import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Image } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/heroes/")({
  component: HeroesAdmin,
});

interface HeroForm {
  page: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

const emptyForm: HeroForm = {
  page: "",
  title: "",
  subtitle: "",
  description: "",
  image: "",
  ctaText: "",
  ctaLink: "",
  ctaSecondaryText: "",
  ctaSecondaryLink: "",
};

const pageOptions = [
  { value: "home", label: "Inicio" },
  { value: "servicios", label: "Servicios" },
  { value: "contacto", label: "Contacto" },
  { value: "nosotros", label: "Nosotros" },
  { value: "carreras", label: "Carreras" },
  { value: "noticias", label: "Noticias" },
];

function HeroesAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<HeroForm>(emptyForm);

  const { data: heroes, isLoading } = useQuery(trpc.heroSections.list.queryOptions());

  const upsertMutation = useMutation(
    trpc.heroSections.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.heroSections.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHero.queryOptions({ page: form.page }));
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Hero guardado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: HeroForm) => {
    setForm(item || emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Secciones Hero</h1>
          <p className="text-slate-600">Cabeceras de cada página del sitio</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nuevo Hero</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : heroes && heroes.length > 0 ? (
          heroes.map((item) => (
            <div key={item.page} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.page} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium uppercase">
                    {pageOptions.find(p => p.value === item.page)?.label || item.page}
                  </span>
                  <button onClick={() => openModal(item as HeroForm)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-2">{item.title?.replace(/\n/g, ' ')}</h3>
                {item.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay heroes. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button></p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{form.page ? "Editar" : "Nuevo"} Hero</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Página *</label>
                <select value={form.page} onChange={(e) => setForm(prev => ({ ...prev, page: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required>
                  <option value="">Seleccionar página</option>
                  {pageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <textarea value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Usa \n para saltos de línea" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtítulo (badge)</label>
                <input type="text" value={form.subtitle || ""} onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Ej: Líder en Contact Center" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea value={form.description || ""} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <ImageUpload
                value={form.image || ""}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                label="Imagen"
                folder="heroes"
                previewClassName="w-full h-48 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Texto CTA principal</label>
                  <input type="text" value={form.ctaText || ""} onChange={(e) => setForm(prev => ({ ...prev, ctaText: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Ej: Solicitar Demo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link CTA principal</label>
                  <input type="text" value={form.ctaLink || ""} onChange={(e) => setForm(prev => ({ ...prev, ctaLink: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="/contacto" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Texto CTA secundario</label>
                  <input type="text" value={form.ctaSecondaryText || ""} onChange={(e) => setForm(prev => ({ ...prev, ctaSecondaryText: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link CTA secundario</label>
                  <input type="text" value={form.ctaSecondaryLink || ""} onChange={(e) => setForm(prev => ({ ...prev, ctaSecondaryLink: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={upsertMutation.isPending} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
                  {upsertMutation.isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
