import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

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

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface ProcessItem {
  step: string;
  title: string;
  description: string;
}

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
  // Hero Section
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryLink?: string;
  // Features Section
  featuresTitle?: string;
  featuresSubtitle?: string;
  features?: FeatureItem[];
  // Services/Channels Section
  servicesTitle?: string;
  servicesSubtitle?: string;
  services?: FeatureItem[];
  // Benefits Section
  benefitsTitle?: string;
  benefitsSubtitle?: string;
  benefitsImage?: string;
  // Process Section
  processTitle?: string;
  processSubtitle?: string;
  process?: ProcessItem[];
  // CTA Section
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonLink?: string;
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    hero: false,
    features: false,
    services: false,
    benefits: false,
    process: false,
    cta: false,
    content: false,
  });

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
      const parsedService = {
        ...service,
        benefits: JSON.parse(service.benefits || "[]"),
        fullContent: service.fullContent || "",
        features: service.features ? JSON.parse(service.features) : [],
        services: service.services ? JSON.parse(service.services) : [],
        process: service.process ? JSON.parse(service.process) : [],
      };
      setEditingService(parsedService);
      setForm(parsedService);
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
      features: form.features?.filter(f => f.title.trim() !== "" && f.description.trim() !== "") || [],
      services: form.services?.filter(s => s.title.trim() !== "" && s.description.trim() !== "") || [],
      process: form.process?.filter(p => p.title.trim() !== "" && p.description.trim() !== "") || [],
    };

    if (editingService?.id) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  // Features management
  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...(prev.features || []), { icon: "Phone", title: "", description: "" }],
    }));
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features?.map((f, i) => i === index ? { ...f, [field]: value } : f) || [],
    }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  // Services/Channels management
  const addService = () => {
    setForm(prev => ({
      ...prev,
      services: [...(prev.services || []), { icon: "Phone", title: "", description: "" }],
    }));
  };

  const updateService = (index: number, field: keyof FeatureItem, value: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services?.map((s, i) => i === index ? { ...s, [field]: value } : s) || [],
    }));
  };

  const removeService = (index: number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || [],
    }));
  };

  // Process management
  const addProcess = () => {
    setForm(prev => ({
      ...prev,
      process: [...(prev.process || []), { step: String((prev.process?.length || 0) + 1), title: "", description: "" }],
    }));
  };

  const updateProcess = (index: number, field: keyof ProcessItem, value: string) => {
    setForm(prev => ({
      ...prev,
      process: prev.process?.map((p, i) => i === index ? { ...p, [field]: value } : p) || [],
    }));
  };

  const removeProcess = (index: number) => {
    setForm(prev => ({
      ...prev,
      process: prev.process?.filter((_, i) => i !== index) || [],
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {editingService ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
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

              {/* Hero Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("hero")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">🎯 Sección Hero</h3>
                  {expandedSections.hero ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.hero && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Título del Hero</label>
                      <input
                        type="text"
                        value={form.heroTitle || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                        placeholder="Ej: Optimiza tus procesos de negocio"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo del Hero (texto destacado)</label>
                      <input
                        type="text"
                        value={form.heroSubtitle || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                        placeholder="Ej: procesos de negocio"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Descripción del Hero</label>
                      <textarea
                        value={form.heroDescription || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, heroDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                        placeholder="Descripción detallada del servicio..."
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={form.heroImage || ""}
                        onChange={(url) => setForm(prev => ({ ...prev, heroImage: url }))}
                        label="Imagen del Hero"
                        folder="services"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Texto Botón Principal</label>
                        <input
                          type="text"
                          value={form.heroCtaText || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, heroCtaText: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Solicitar Propuesta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL Botón Principal</label>
                        <input
                          type="text"
                          value={form.heroCtaLink || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, heroCtaLink: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="/contacto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Texto Botón Secundario</label>
                        <input
                          type="text"
                          value={form.heroCtaSecondaryText || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, heroCtaSecondaryText: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Ver Casos de Éxito"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL Botón Secundario</label>
                        <input
                          type="text"
                          value={form.heroCtaSecondaryLink || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, heroCtaSecondaryLink: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="/casos-exito"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("features")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">✨ Sección Features (Características)</h3>
                  {expandedSections.features ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.features && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={form.featuresTitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, featuresTitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Servicios integrales de BPO"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={form.featuresSubtitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, featuresSubtitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Soluciones completas..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Características</label>
                      <div className="space-y-3">
                        {(form.features || []).map((feature, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Icono</label>
                                <select
                                  value={feature.icon}
                                  onChange={(e) => updateFeature(index, "icon", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                >
                                  {iconOptions.map((icon) => (
                                    <option key={icon} value={icon}>{icon}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Título</label>
                                <input
                                  type="text"
                                  value={feature.title}
                                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  placeholder="Título"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  className="w-full p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                              <textarea
                                value={feature.description}
                                onChange={(e) => updateFeature(index, "description", e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="Descripción..."
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addFeature}
                          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-primary-400 hover:text-primary-600 text-sm font-medium"
                        >
                          + Agregar Característica
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Services/Channels Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("services")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">🔧 Sección Services/Channels (Opcional)</h3>
                  {expandedSections.services ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.services && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={form.servicesTitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, servicesTitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Áreas de especialización"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={form.servicesSubtitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, servicesSubtitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Servicios especializados..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Servicios/Canales</label>
                      <div className="space-y-3">
                        {(form.services || []).map((service, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Icono</label>
                                <select
                                  value={service.icon}
                                  onChange={(e) => updateService(index, "icon", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                >
                                  {iconOptions.map((icon) => (
                                    <option key={icon} value={icon}>{icon}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Título</label>
                                <input
                                  type="text"
                                  value={service.title}
                                  onChange={(e) => updateService(index, "title", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  placeholder="Título"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => removeService(index)}
                                  className="w-full p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                              <textarea
                                value={service.description}
                                onChange={(e) => updateService(index, "description", e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="Descripción..."
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addService}
                          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-primary-400 hover:text-primary-600 text-sm font-medium"
                        >
                          + Agregar Servicio/Canal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Benefits Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("benefits")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">💎 Sección Benefits (Mejoras)</h3>
                  {expandedSections.benefits ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.benefits && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={form.benefitsTitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, benefitsTitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Ventajas competitivas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={form.benefitsSubtitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, benefitsSubtitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Nuestros clientes experimentan..."
                        />
                      </div>
                    </div>
                    <div>
                      <ImageUpload
                        value={form.benefitsImage || ""}
                        onChange={(url) => setForm(prev => ({ ...prev, benefitsImage: url }))}
                        label="Imagen de la Sección Benefits"
                        folder="services"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      💡 Los beneficios se configuran en la sección "Beneficios" más arriba en este formulario.
                    </p>
                  </div>
                )}
              </div>

              {/* Process Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("process")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">📋 Sección Process (Proceso)</h3>
                  {expandedSections.process ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.process && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={form.processTitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, processTitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Proceso de implementación"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={form.processSubtitle || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, processSubtitle: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Metodología probada..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Pasos del Proceso</label>
                      <div className="space-y-3">
                        {(form.process || []).map((step, index) => (
                          <div key={index} className="bg-slate-50 p-4 rounded-xl space-y-2">
                            <div className="grid grid-cols-4 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Paso #</label>
                                <input
                                  type="text"
                                  value={step.step}
                                  onChange={(e) => updateProcess(index, "step", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  placeholder="1"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-600 mb-1">Título</label>
                                <input
                                  type="text"
                                  value={step.title}
                                  onChange={(e) => updateProcess(index, "title", e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                  placeholder="Título del paso"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => removeProcess(index)}
                                  className="w-full p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
                              <textarea
                                value={step.description}
                                onChange={(e) => updateProcess(index, "description", e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                placeholder="Descripción del paso..."
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addProcess}
                          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-primary-400 hover:text-primary-600 text-sm font-medium"
                        >
                          + Agregar Paso del Proceso
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Section */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("cta")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">🚀 Sección CTA Final</h3>
                  {expandedSections.cta ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.cta && (
                  <div className="space-y-4 pl-4 border-l-2 border-primary-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={form.ctaTitle || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, ctaTitle: e.target.value }))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                        placeholder="Ej: ¿Listo para comenzar?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                      <textarea
                        value={form.ctaDescription || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, ctaDescription: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                        placeholder="Descripción del CTA..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Texto Botón Principal</label>
                        <input
                          type="text"
                          value={form.ctaButtonText || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Solicitar Propuesta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL Botón Principal</label>
                        <input
                          type="text"
                          value={form.ctaButtonLink || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, ctaButtonLink: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="/contacto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Texto Botón Secundario</label>
                        <input
                          type="text"
                          value={form.ctaSecondaryButtonText || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, ctaSecondaryButtonText: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="Ej: Agendar Consulta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">URL Botón Secundario</label>
                        <input
                          type="text"
                          value={form.ctaSecondaryButtonLink || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, ctaSecondaryButtonLink: e.target.value }))}
                          className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                          placeholder="/contacto"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Content (Optional) */}
              <div className="border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => toggleSection("content")}
                  className="w-full flex items-center justify-between text-left mb-4"
                >
                  <h3 className="text-lg font-bold text-slate-900">📄 Contenido Adicional (HTML - Opcional)</h3>
                  {expandedSections.content ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {expandedSections.content && (
                  <div className="pl-4 border-l-2 border-primary-200">
                    <p className="text-sm text-slate-600 mb-4">
                      Este campo permite agregar contenido HTML libre adicional si necesitas algo más específico.
                    </p>
                    <textarea
                      value={form.fullContent || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, fullContent: e.target.value }))}
                      rows={10}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-y"
                      placeholder="Contenido HTML adicional..."
                    />
                  </div>
                )}
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

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 flex-shrink-0">
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

