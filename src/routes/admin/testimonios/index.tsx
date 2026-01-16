import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/testimonios/")({
  component: TestimoniosAdmin,
});

interface TestimonialForm {
  id?: number;
  name: string;
  position: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  order: number;
  isActive: boolean;
}

const emptyForm: TestimonialForm = {
  name: "",
  position: "",
  company: "",
  content: "",
  image: "",
  rating: 5,
  order: 0,
  isActive: true,
};

function TestimoniosAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialForm | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);

  const { data: testimonials, isLoading } = useQuery(trpc.testimonials.list.queryOptions());

  const createMutation = useMutation(
    trpc.testimonials.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.testimonials.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTestimonials.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Testimonio creado correctamente");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.testimonials.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.testimonials.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTestimonials.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Testimonio actualizado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.testimonials.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.testimonials.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTestimonials.queryOptions());
        queryClient.invalidateQueries(trpc.content.getHomepageData.queryOptions());
        toast.success("Testimonio eliminado");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: TestimonialForm) => {
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
    if (confirm("¿Eliminar este testimonio?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonios</h1>
          <p className="text-slate-600">Gestiona los testimonios de clientes</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Testimonio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : testimonials && testimonials.length > 0 ? (
          testimonials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-500">{item.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.position}</div>
                    <div className="text-sm text-slate-500">{item.company}</div>
                  </div>
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
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < item.rating ? "text-yellow-400 fill-current" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <p className="text-slate-600 text-sm line-clamp-3">"{item.content}"</p>
              <div className="mt-3 flex items-center">
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
            No hay testimonios. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? "Editar Testimonio" : "Nuevo Testimonio"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Empresa *</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo *</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                label="Imagen"
                folder="testimonials"
                previewClassName="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Testimonio *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Calificación</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= form.rating ? "text-yellow-400 fill-current" : "text-slate-300"}`}
                      />
                    </button>
                  ))}
                </div>
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

