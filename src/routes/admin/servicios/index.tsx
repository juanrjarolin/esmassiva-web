import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/servicios/")({
  component: ServiciosAdmin,
});

const iconOptions = [
  "Phone", "ShoppingCart", "Headphones", "CreditCard", "Building2", "TrendingUp",
  "Users", "Globe", "Shield", "Award", "Star", "CheckCircle", "Zap", "Target"
];

const colorOptions = [
  { bg: "bg-primary-100", icon: "text-primary-600", label: "Primario" },
  { bg: "bg-purple-100", icon: "text-purple-600", label: "Púrpura" },
  { bg: "bg-success-100", icon: "text-success-600", label: "Verde" },
  { bg: "bg-accent-100", icon: "text-accent-600", label: "Acento" },
  { bg: "bg-secondary-100", icon: "text-secondary-600", label: "Secundario" },
  { bg: "bg-blue-100", icon: "text-blue-600", label: "Azul" },
];

interface ServiceForm {
  id?: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  href: string;
  bgColor: string;
  iconColor: string;
  benefits: string[];
  fullContent: string;
  order: number;
  isActive: boolean;
}

const emptyForm: ServiceForm = {
  title: "",
  slug: "",
  description: "",
  icon: "Phone",
  href: "/servicios/",
  bgColor: "bg-primary-100",
  iconColor: "text-primary-600",
  benefits: [""],
  fullContent: "",
  order: 0,
  isActive: true,
};

function ServiciosAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceForm | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const { data: services, isLoading } = useQuery(trpc.services.list.queryOptions());

  const createMutation = useMutation(
    trpc.services.create.mutationOptions({
      onSuccess: (data) => {
        // Invalidate admin list
        queryClient.invalidateQueries(trpc.services.list.queryOptions());
        // Invalidate public queries that use services
        queryClient.invalidateQueries(trpc.content.getServices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        // Invalidate the specific service page if slug is available
        if (data?.slug) {
          queryClient.invalidateQueries(trpc.content.getServiceBySlug.queryOptions({ slug: data.slug }));
        }
        // Also invalidate all service by slug queries (in case of any cached pages)
        // Using a partial queryKey match to invalidate all getServiceBySlug queries
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getServiceBySlug"],
          exact: false,
        });
        toast.success("Servicio creado correctamente");
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el servicio");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.services.update.mutationOptions({
      onSuccess: (data) => {
        // Invalidate admin list
        queryClient.invalidateQueries(trpc.services.list.queryOptions());
        // Invalidate public queries that use services
        queryClient.invalidateQueries(trpc.content.getServices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        // Invalidate the specific service page if slug is available
        if (data?.slug) {
          queryClient.invalidateQueries(trpc.content.getServiceBySlug.queryOptions({ slug: data.slug }));
        }
        // Also invalidate all service by slug queries (in case slug changed or any cached pages)
        // Using a partial queryKey match to invalidate all getServiceBySlug queries
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getServiceBySlug"],
          exact: false,
        });
        toast.success("Servicio actualizado correctamente");
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el servicio");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.services.delete.mutationOptions({
      onSuccess: () => {
        // Invalidate admin list
        queryClient.invalidateQueries(trpc.services.list.queryOptions());
        // Invalidate public queries that use services
        queryClient.invalidateQueries(trpc.content.getServices.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        // Invalidate all service by slug queries (the deleted service page should no longer be accessible)
        // Using a partial queryKey match to invalidate all getServiceBySlug queries
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getServiceBySlug"],
          exact: false,
        });
        toast.success("Servicio eliminado correctamente");
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar el servicio");
      },
    })
  );

  const openModal = (service?: typeof services extends (infer T)[] ? T : never) => {
    if (service) {
      setEditingService({
        ...service,
        benefits: JSON.parse(service.benefits || "[]"),
        fullContent: service.fullContent || "",
      });
      setForm({
        ...service,
        benefits: JSON.parse(service.benefits || "[]"),
        fullContent: service.fullContent || "",
      });
    } else {
      setEditingService(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      benefits: form.benefits.filter(b => b.trim() !== ""),
    };

    if (editingService?.id) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      deleteMutation.mutate({ id });
    }
  };

  const addBenefit = () => {
    setForm(prev => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const updateBenefit = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b),
    }));
  };

  const removeBenefit = (index: number) => {
    setForm(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Servicios</h1>
          <p className="text-slate-600">Gestiona los servicios que ofrece la empresa</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando...</div>
        ) : services && services.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Orden</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Servicio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${service.bgColor} rounded-xl flex items-center justify-center`}>
                        <span className={`text-lg ${service.iconColor}`}>●</span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{service.title}</div>
                        <div className="text-sm text-slate-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{service.slug}</td>
                  <td className="px-6 py-4">
                    {service.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        <EyeOff className="w-3 h-3 mr-1" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(service)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p>No hay servicios creados</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Crear el primer servicio
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      setForm(prev => ({
                        ...prev,
                        title: e.target.value,
                        slug: generateSlug(e.target.value),
                        href: `/servicios/${generateSlug(e.target.value)}`,
                      }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value, href: `/servicios/${e.target.value}` }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción corta *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Icono
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <select
                    value={`${form.bgColor}|${form.iconColor}`}
                    onChange={(e) => {
                      const [bg, icon] = e.target.value.split("|");
                      setForm(prev => ({ ...prev, bgColor: bg, iconColor: icon }));
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.label} value={`${color.bg}|${color.icon}`}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Beneficios
                </label>
                <div className="space-y-2">
                  {form.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: Aumento del 40% en conversiones"
                      />
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Agregar beneficio
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contenido completo (página individual)
                </label>
                <textarea
                  value={form.fullContent}
                  onChange={(e) => setForm(prev => ({ ...prev, fullContent: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Contenido HTML o Markdown para la página del servicio..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Servicio activo (visible en el sitio)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Guardando..."
                    : editingService ? "Guardar Cambios" : "Crear Servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

