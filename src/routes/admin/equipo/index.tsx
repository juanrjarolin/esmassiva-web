import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Linkedin, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/equipo/")({
  component: EquipoAdmin,
});

interface TeamMemberForm {
  id?: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  linkedIn: string;
  email: string;
  order: number;
  isActive: boolean;
}

const emptyForm: TeamMemberForm = {
  name: "",
  position: "",
  bio: "",
  image: "",
  linkedIn: "",
  email: "",
  order: 0,
  isActive: true,
};

function EquipoAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMemberForm | null>(null);
  const [form, setForm] = useState<TeamMemberForm>(emptyForm);

  const { data: members, isLoading } = useQuery(trpc.teamMembers.list.queryOptions());

  const createMutation = useMutation(
    trpc.teamMembers.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.teamMembers.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTeamMembers.queryOptions());
        toast.success("Miembro creado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const updateMutation = useMutation(
    trpc.teamMembers.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.teamMembers.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTeamMembers.queryOptions());
        toast.success("Miembro actualizado");
        closeModal();
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const deleteMutation = useMutation(
    trpc.teamMembers.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.teamMembers.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getTeamMembers.queryOptions());
        toast.success("Miembro eliminado");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const openModal = (item?: TeamMemberForm) => {
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
          <h1 className="text-2xl font-bold text-slate-900">Equipo</h1>
          <p className="text-slate-600">Miembros del equipo directivo</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700">
          <Plus className="w-5 h-5" />
          <span>Nuevo Miembro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Cargando...</div>
        ) : members && members.length > 0 ? (
          members.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">{item.name[0]}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-primary-600">{item.position}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {item.linkedIn && <a href={item.linkedIn} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 text-slate-400 hover:text-blue-600" /></a>}
                    {item.email && <a href={`mailto:${item.email}`}><Mail className="w-4 h-4 text-slate-400 hover:text-primary-600" /></a>}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <button onClick={() => openModal(item)} className="p-1.5 hover:bg-slate-100 rounded-lg"><Pencil className="w-4 h-4 text-slate-600" /></button>
                  <button onClick={() => deleteMutation.mutate({ id: item.id })} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                </div>
              </div>
              {item.bio && <p className="text-sm text-slate-600 mt-3 line-clamp-2">{item.bio}</p>}
              <div className="mt-3">
                {item.isActive ? (
                  <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full flex items-center w-fit"><Eye className="w-3 h-3 mr-1" /> Activo</span>
                ) : (
                  <span className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-full flex items-center w-fit"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-slate-500">
            No hay miembros. <button onClick={() => openModal()} className="text-primary-600 font-medium">Crear uno</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">{editingItem ? "Editar" : "Nuevo"} Miembro</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cargo *</label>
                  <input type="text" value={form.position} onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" required />
                </div>
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm(prev => ({ ...prev, image: url }))}
                label="Foto"
                folder="team"
                previewClassName="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Biografía</label>
                <textarea value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                  <input type="url" value={form.linkedIn} onChange={(e) => setForm(prev => ({ ...prev, linkedIn: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
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
