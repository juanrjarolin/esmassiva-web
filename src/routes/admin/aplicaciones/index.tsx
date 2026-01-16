import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Mail, Phone, Calendar, FileText, CheckCircle, Clock, UserCheck, XCircle, Eye, Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/aplicaciones/")({
  component: AplicacionesAdmin,
});

const statusOptions = [
  { value: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  { value: "reviewing", label: "En Revisión", color: "bg-blue-100 text-blue-700", icon: Eye },
  { value: "interview", label: "Entrevista", color: "bg-purple-100 text-purple-700", icon: UserCheck },
  { value: "hired", label: "Contratado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  { value: "rejected", label: "Rechazado", color: "bg-red-100 text-red-700", icon: XCircle },
];

function AplicacionesAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: applications, isLoading } = useQuery(trpc.careerApplications.list.queryOptions());
  const { data: stats } = useQuery(trpc.careerApplications.getStats.queryOptions());

  const updateStatusMutation = useMutation(
    trpc.careerApplications.updateStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["careerApplications"] });
        toast.success("Estado actualizado");
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el estado");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.careerApplications.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["careerApplications"] });
        toast.success("Aplicación eliminada");
        setSelectedApplication(null);
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar");
      },
    })
  );

  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status: status as any });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta aplicación?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleExport = () => {
    if (!applications || applications.length === 0) {
      toast.error("No hay aplicaciones para exportar");
      return;
    }

    const csv = [
      ["Nombre", "Email", "Teléfono", "Posición", "Experiencia", "Estado", "Fecha"],
      ...applications.map(app => [
        `${app.firstName} ${app.lastName}`,
        app.email,
        app.phone,
        app.position,
        app.experience,
        app.status,
        new Date(app.createdAt).toLocaleDateString(),
      ]),
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `aplicaciones-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exportado correctamente");
  };

  const filteredApplications = applications?.filter(app =>
    statusFilter === "all" || app.status === statusFilter
  ) || [];

  const selectedApplicationData = applications?.find(a => a.id === selectedApplication);

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
          <h1 className="text-2xl font-bold text-slate-900">Aplicaciones de Trabajo</h1>
          <p className="text-slate-600">Candidatos que han aplicado a posiciones</p>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">En Revisión</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.reviewing}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">Entrevista</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.interview}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">Contratados</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.hired}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-slate-600 text-xs">Rechazados</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Aplicaciones</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            >
              <option value="all">Todos</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => {
                const status = statusOptions.find(s => s.value === application.status) || statusOptions[0];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={application.id}
                    onClick={() => setSelectedApplication(application.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedApplication === application.id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {application.firstName} {application.lastName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${status.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{application.position}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {application.phone}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No hay aplicaciones</h3>
                <p className="text-slate-500">Las aplicaciones de trabajo aparecerán aquí.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {selectedApplicationData ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Detalles</h2>
                <button
                  onClick={() => handleDelete(selectedApplicationData.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Nombre</label>
                  <p className="text-slate-900 font-medium">
                    {selectedApplicationData.firstName} {selectedApplicationData.lastName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                  <a
                    href={`mailto:${selectedApplicationData.email}`}
                    className="text-primary-600 hover:underline flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {selectedApplicationData.email}
                  </a>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Teléfono</label>
                  <a
                    href={`tel:${selectedApplicationData.phone}`}
                    className="text-primary-600 hover:underline flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {selectedApplicationData.phone}
                  </a>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Posición</label>
                  <p className="text-slate-900">{selectedApplicationData.position}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Experiencia</label>
                  <p className="text-slate-900">{selectedApplicationData.experience} años</p>
                </div>

                {selectedApplicationData.education && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Educación</label>
                    <p className="text-slate-900">{selectedApplicationData.education}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Habilidades</label>
                  <p className="text-slate-900">{selectedApplicationData.skills}</p>
                </div>

                {selectedApplicationData.cvFileUrl && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">CV</label>
                    <a
                      href={selectedApplicationData.cvFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {selectedApplicationData.cvFileName || "Ver CV"}
                    </a>
                  </div>
                )}

                {selectedApplicationData.coverLetter && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Carta de Presentación</label>
                    <p className="text-slate-900 whitespace-pre-wrap text-sm">{selectedApplicationData.coverLetter}</p>
                  </div>
                )}

                {selectedApplicationData.availableStart && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Disponible desde</label>
                    <p className="text-slate-900">{selectedApplicationData.availableStart}</p>
                  </div>
                )}

                {selectedApplicationData.salary && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Salario esperado</label>
                    <p className="text-slate-900">{selectedApplicationData.salary}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Estado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => {
                      const StatusIcon = status.icon;
                      return (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(selectedApplicationData.id, status.value)}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedApplicationData.status === status.value
                              ? status.color
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span>{status.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Fecha</label>
                  <p className="text-slate-900 text-sm">
                    {new Date(selectedApplicationData.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Selecciona una aplicación</h3>
              <p className="text-slate-500">Haz clic en una aplicación para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
