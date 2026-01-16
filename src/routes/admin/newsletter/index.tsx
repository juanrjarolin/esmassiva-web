import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Download, Users, Eye, EyeOff, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/newsletter/")({
  component: NewsletterAdmin,
});

function NewsletterAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const { data: subscriptions, isLoading } = useQuery(trpc.newsletterSubscriptions.list.queryOptions());
  const { data: stats } = useQuery(trpc.newsletterSubscriptions.getStats.queryOptions());

  const toggleActiveMutation = useMutation(
    trpc.newsletterSubscriptions.toggleActive.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["newsletterSubscriptions"] });
        toast.success("Estado actualizado");
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.newsletterSubscriptions.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["newsletterSubscriptions"] });
        toast.success("Suscripción eliminada");
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar");
      },
    })
  );

  const handleExport = () => {
    if (!subscriptions || subscriptions.length === 0) {
      toast.error("No hay suscripciones para exportar");
      return;
    }

    const csv = [
      ["Email", "Nombre", "Apellido", "Empresa", "Estado", "Fecha"],
      ...subscriptions.map(sub => [
        sub.email,
        sub.firstName || "",
        sub.lastName || "",
        sub.company || "",
        sub.isActive ? "Activo" : "Inactivo",
        new Date(sub.createdAt).toLocaleDateString(),
      ]),
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exportado correctamente");
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta suscripción?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredSubscriptions = subscriptions?.filter(sub => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return sub.isActive;
    return !sub.isActive;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
          <p className="text-slate-600">Suscriptores al newsletter</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
        >
          <Download className="w-5 h-5" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Suscriptores</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <Eye className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Inactivos</p>
                <p className="text-3xl font-bold text-slate-600 mt-1">{stats.inactive}</p>
              </div>
              <EyeOff className="w-12 h-12 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">Filtrar:</span>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === "all"
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === "active"
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setActiveFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === "inactive"
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredSubscriptions.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Empresa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{subscription.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {subscription.firstName || subscription.lastName
                      ? `${subscription.firstName || ""} ${subscription.lastName || ""}`.trim()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {subscription.company || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(subscription.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: subscription.id })}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm ${
                        subscription.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {subscription.isActive ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Mail className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No hay suscripciones</h3>
            <p className="text-slate-500">Las suscripciones al newsletter aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
