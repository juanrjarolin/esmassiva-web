import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Shield, Award } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/certificaciones/")({
  component: CertificacionesAdmin,
});

const iconOptions = ["Shield", "Award", "CheckCircle", "Star", "Badge", "Certificate"];

interface CertForm {
  id?: number;
  name: string;
  icon: string;
  description: string;
  image?: string;
  order: number;
  isActive: boolean;
}

const emptyForm: CertForm = {
  name: "",
  icon: "Shield",
  description: "",
  image: "",
  order: 0,
  isActive: true,
};

function CertificacionesAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertForm | null>(null);
  const [form, setForm] = useState<CertForm>(emptyForm);

  const { data: certs, isLoading } = useQuery(trpc.certifications.list.queryOptions());

  const createMutation = useMutation(
    trpc.certifications.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.certifications.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getCertifications.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Certificación creada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.certifications.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.certifications.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getCertifications.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Certificación actualizada");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.certifications.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.certifications.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getCertifications.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Certificación eliminada");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: CertForm) => {
    if (item) {
      // Normalizar valores null a strings vacíos
      const normalizedItem = {
        ...item,
        description: item.description || "",
        image: item.image || "",
      };
      setEditingItem(normalizedItem);
      setForm(normalizedItem);
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
    // Normalizar valores: convertir null/undefined a string vacío o undefined según corresponda
    const normalizedForm = {
      ...form,
      description: form.description || undefined,
      image: form.image || undefined,
    };

    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: normalizedForm });
    } else {
      createMutation.mutate(normalizedForm);
    }
  };

  const IconComponent = form.icon === "Award" ? Award : Shield;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificaciones</h1>
          <p className="text-slate-600">Certificaciones y acreditaciones de la empresa</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nueva Certificación</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : certs && certs.length > 0 ? (
          certs.map((item) => {
            const Icon = item.icon === "Award" ? Award : Shield;
            return (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="h-16 flex items-center justify-center mb-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-16 w-auto object-contain" />
                  ) : (
                    <Icon className="w-12 h-12 text-primary-600" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                {item.description && <p className="text-xs text-slate-500 mb-3">{item.description}</p>}
                <div className="flex items-center justify-center space-x-2">
                  {item.isActive ? (
                    <Eye className="w-3 h-3 text-green-600" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-slate-400" />
                  )}
                  <button onClick={() => openModal(item)} className="p-1 hover:bg-slate-100 rounded"><Pencil className="w-3 h-3 text-slate-600" /></button>
                  <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-600" /></button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay certificaciones. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear una</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nueva"} Certificación</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Ej: ISO 27001" required />
              </div>
              <ImageUpload
                key={`${editingItem?.id ?? "new"}:${form.image || ""}`}
                value={form.image || ""}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                label="Foto del Premio/Certificado"
                folder="certifications"
                previewClassName="h-32 w-auto object-contain"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icono (se usa si no hay imagen)</label>
                <select value={form.icon} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl">
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <input type="text" value={form.description || ""} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="Opcional" />
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
