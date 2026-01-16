import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/clientes/")({
  component: ClientesAdmin,
});

interface ClientForm {
  id?: number;
  name: string;
  logo: string;
  website: string;
  order: number;
  isActive: boolean;
}

const emptyForm: ClientForm = {
  name: "",
  logo: "",
  website: "",
  order: 0,
  isActive: true,
};

function ClientesAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientForm | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);

  const { data: clients, isLoading } = useQuery(trpc.clients.list.queryOptions());

  const createMutation = useMutation(
    trpc.clients.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.clients.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getClients.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Cliente creado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.clients.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.clients.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getClients.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Cliente actualizado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.clients.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.clients.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getClients.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Cliente eliminado");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: ClientForm) => {
    setEditingItem(item || null);
    setForm(item || emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600">Logos de empresas que confían en nosotros</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : clients && clients.length > 0 ? (
          clients.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-full h-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-slate-400 text-sm">Sin logo</span>
                  )}
                </div>
              </div>
              <h3 className="font-medium text-slate-900 mb-2">{item.name}</h3>
              {item.website && (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 flex items-center mb-3">
                  <ExternalLink className="w-3 h-3 mr-1" /> Ver sitio
                </a>
              )}
              <div className="flex items-center justify-between">
                {item.isActive ? (
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center"><Eye className="w-3 h-3 mr-1" /> Activo</span>
                ) : (
                  <span className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full flex items-center"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</span>
                )}
                <div className="flex items-center space-x-1">
                  <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Pencil className="w-4 h-4 text-slate-600" /></button>
                  <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay clientes. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Cliente</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <ImageUpload
                value={form.logo}
                onChange={(url) => setForm(prev => ({ ...prev, logo: url }))}
                label="Logo"
                folder="clients"
                previewClassName="h-12 object-contain"
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
                <input type="url" value={form.website} onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Orden</label>
                <input type="number" value={form.order} onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 rounded" />
                <label htmlFor="isActive" className="text-sm">Activo</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl">Cancelar</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
