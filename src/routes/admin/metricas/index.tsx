import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/metricas/")({
  component: MetricasAdmin,
});

const iconOptions = [
  "Award", "Users", "Phone", "Star", "TrendingUp", "Globe", "Shield", "CheckCircle", "Zap", "Target", "Clock", "Heart"
];

interface MetricForm {
  id?: number;
  number: string;
  label: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const emptyForm: MetricForm = {
  number: "",
  label: "",
  icon: "Award",
  order: 0,
  isActive: true,
};

function MetricasAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MetricForm | null>(null);
  const [form, setForm] = useState<MetricForm>(emptyForm);

  const { data: metrics, isLoading } = useQuery(trpc.metrics.list.queryOptions());

  const createMutation = useMutation(
    trpc.metrics.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.metrics.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getMetrics.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Métrica creada correctamente");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.metrics.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.metrics.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getMetrics.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Métrica actualizada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.metrics.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.metrics.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getMetrics.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Métrica eliminada");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: MetricForm) => {
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
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar esta métrica?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Métricas</h1>
          <p className="text-slate-600">Estadísticas mostradas en el hero de la página principal</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Métrica</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : metrics && metrics.length > 0 ? (
          metrics.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">#</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{item.number}</div>
              <div className="text-slate-600">{item.label}</div>
              <div className="mt-3 text-xs text-slate-500">Icono: {item.icon}</div>
              <div className="mt-2">
                {item.isActive ? (
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <Eye className="w-3 h-3 mr-1" /> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                    <EyeOff className="w-3 h-3 mr-1" /> Inactivo
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay métricas. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear una</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? "Editar Métrica" : "Nueva Métrica"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número/Valor *</label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: 15+, 500+, 98%"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Etiqueta *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Años de experiencia"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icono</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">Activo</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
                >
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

