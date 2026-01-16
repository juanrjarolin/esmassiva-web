import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, MapPin, Phone, Mail, Clock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/oficinas/")({
  component: OficinasAdmin,
});

interface OfficeForm {
  id?: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
  order: number;
  isActive: boolean;
}

const emptyForm: OfficeForm = {
  city: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  mapUrl: "",
  order: 0,
  isActive: true,
};

function OficinasAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OfficeForm | null>(null);
  const [form, setForm] = useState<OfficeForm>(emptyForm);

  const { data: offices, isLoading } = useQuery(trpc.offices.list.queryOptions());

  const createMutation = useMutation(
    trpc.offices.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.offices.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getOffices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Oficina creada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.offices.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.offices.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getOffices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Oficina actualizada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.offices.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.offices.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getOffices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Oficina eliminada");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: OfficeForm) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Oficinas</h1>
          <p className="text-slate-600">Ubicaciones de la empresa</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nueva Oficina</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : offices && offices.length > 0 ? (
          offices.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </button>
                  <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.city}</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />{item.address}</div>
                <div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{item.phone}</div>
                {item.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-2" />{item.email}</div>}
                {item.hours && <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{item.hours}</div>}
              </div>
              <div className="mt-3">
                {item.isActive ? (
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full"><Eye className="w-3 h-3 mr-1" /> Activo</span>
                ) : (
                  <span className="inline-flex items-center text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay oficinas. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear una</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nueva"} Oficina</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Ciudad *</label>
                <input type="text" value={form.city} onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Dirección *</label>
                <input type="text" value={form.address} onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Teléfono *</label>
                <input type="text" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Horario</label>
                <input type="text" value={form.hours} onChange={(e) => setForm(prev => ({ ...prev, hours: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Ej: Lun - Vie: 9:00 - 18:00" />
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">URL de Google Maps</label>
                <textarea value={form.mapUrl} onChange={(e) => setForm(prev => ({ ...prev, mapUrl: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="URL del embed de Google Maps" />
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

