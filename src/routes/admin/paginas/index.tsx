import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/paginas/")({
  component: PaginasAdmin,
});

interface PageForm {
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

const emptyForm: PageForm = {
  slug: "",
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
};

function PaginasAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PageForm | null>(null);
  const [form, setForm] = useState<PageForm>(emptyForm);

  const { data: pages, isLoading } = useQuery(trpc.pages.list.queryOptions());

  const upsertMutation = useMutation(
    trpc.pages.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.pages.list.queryOptions());
        queryClient.invalidateQueries(trpc.pages.getBySlug.queryOptions({ slug: form.slug }));
        toast.success("Página guardada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.pages.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.pages.list.queryOptions());
        queryClient.invalidateQueries({
          queryKey: ["trpc", "pages", "getBySlug"],
          exact: false,
        });
        toast.success("Página eliminada");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: PageForm) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertMutation.mutate(form);
  };

  const handleDelete = (slug: string) => {
    if (confirm("¿Estás seguro de eliminar esta página?")) {
      deleteMutation.mutate({ slug });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Páginas</h1>
          <p className="text-slate-600 mt-1">Gestiona las páginas estáticas del sitio</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Página
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Cargando...</div>
      ) : pages && pages.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-200">
            {pages.map((page) => (
              <div key={page.slug} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div>
                        <h3 className="font-semibold text-slate-900">{page.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">/{page.slug}</p>
                        {page.metaTitle && (
                          <p className="text-xs text-slate-400 mt-1">Meta: {page.metaTitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(page)}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay páginas. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear una</button></p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nueva"} Página</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm(prev => ({
                      ...prev,
                      title: e.target.value,
                      slug: editingItem ? prev.slug : generateSlug(e.target.value)
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
                  placeholder="ejemplo-pagina"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">URL: /{form.slug || "ejemplo-pagina"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contenido *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-sm"
                  placeholder="Contenido HTML o Markdown..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Título</label>
                  <input
                    type="text"
                    value={form.metaTitle || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    placeholder="Título para SEO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Descripción</label>
                  <input
                    type="text"
                    value={form.metaDescription || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    placeholder="Descripción para SEO"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
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
