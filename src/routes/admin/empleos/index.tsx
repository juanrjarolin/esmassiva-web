import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, MapPin, Clock, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/empleos/")({
  component: EmpleosAdmin,
});

interface JobForm {
  id?: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  isActive: boolean;
}

const emptyForm: JobForm = {
  title: "",
  slug: "",
  department: "",
  location: "",
  type: "full-time",
  description: "",
  requirements: "",
  benefits: "",
  isActive: true,
};

const typeOptions = [
  { value: "full-time", label: "Tiempo Completo" },
  { value: "part-time", label: "Medio Tiempo" },
  { value: "contract", label: "Contrato" },
  { value: "remote", label: "Remoto" },
];

function EmpleosAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JobForm | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);

  const { data: jobs, isLoading } = useQuery(trpc.jobPositions.list.queryOptions());

  const createMutation = useMutation(
    trpc.jobPositions.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.jobPositions.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getJobPositions.queryOptions());
        queryClient.invalidateQueries(trpc.content.getJobBySlug.queryOptions({ slug: "" }));
        toast.success("Empleo creado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.jobPositions.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.jobPositions.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getJobPositions.queryOptions());
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getJobBySlug"],
          exact: false,
        });
        toast.success("Empleo actualizado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.jobPositions.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.jobPositions.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getJobPositions.queryOptions());
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getJobBySlug"],
          exact: false,
        });
        toast.success("Empleo eliminado");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: JobForm) => {
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

  const generateSlug = (title: string) => {
    return title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Empleos</h1>
          <p className="text-slate-600">Posiciones abiertas para candidatos</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nuevo Empleo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : jobs && jobs.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Posición</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Departamento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Ubicación</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {jobs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {typeOptions.find(t => t.value === item.type)?.label || item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.isActive ? (
                      <span className="flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full w-fit"><Eye className="w-3 h-3 mr-1" /> Activo</span>
                    ) : (
                      <span className="flex items-center text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full w-fit"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openModal(item)} className="p-2 hover:bg-slate-100 rounded-lg"><Pencil className="w-4 h-4 text-slate-600" /></button>
                      <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay empleos. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button></p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Empleo</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Departamento *</label>
                  <input type="text" value={form.department} onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación *</label>
                  <input type="text" value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                  <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl">
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
                <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Requisitos *</label>
                <textarea value={form.requirements} onChange={(e) => setForm(prev => ({ ...prev, requirements: e.target.value }))} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Un requisito por línea" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Beneficios</label>
                <textarea value={form.benefits} onChange={(e) => setForm(prev => ({ ...prev, benefits: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Un beneficio por línea" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 rounded" />
                <label htmlFor="isActive" className="text-sm">Activo (visible en el sitio)</label>
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
