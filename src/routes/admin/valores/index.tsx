import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Globe, Shield, TrendingUp, Award, Users, CheckCircle, Star, Zap, Target, Heart } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/valores/")({
  component: ValoresAdmin,
});

const iconOptions = ["Globe", "Shield", "TrendingUp", "Award", "Users", "CheckCircle", "Star", "Zap", "Target", "Heart"];
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Shield, TrendingUp, Award, Users, CheckCircle, Star, Zap, Target, Heart
};

interface ValueForm {
  id?: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const emptyForm: ValueForm = {
  title: "",
  description: "",
  icon: "Shield",
  order: 0,
  isActive: true,
};

function ValoresAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ValueForm | null>(null);
  const [form, setForm] = useState<ValueForm>(emptyForm);

  const { data: values, isLoading } = useQuery(trpc.values.list.queryOptions());

  const createMutation = useMutation(
    trpc.values.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.values.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getValues.queryOptions());
        toast.success("Valor creado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.values.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.values.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getValues.queryOptions());
        toast.success("Valor actualizado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.values.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.values.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getValues.queryOptions());
        toast.success("Valor eliminado");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: ValueForm) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Valores</h1>
          <p className="text-slate-600">Valores de la empresa (página Nosotros)</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nuevo Valor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : values && values.length > 0 ? (
          values.map((item) => {
            const Icon = iconMap[item.icon] || Shield;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Pencil className="w-4 h-4 text-slate-600" /></button>
                    <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                {item.isActive ? (
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center w-fit"><Eye className="w-3 h-3 mr-1" /> Activo</span>
                ) : (
                  <span className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full flex items-center w-fit"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</span>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay valores. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Valor</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icono</label>
                <select value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl">
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
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
