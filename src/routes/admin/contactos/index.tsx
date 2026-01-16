import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Mail, Phone, Building, Calendar, ExternalLink, CheckCircle, Clock, XCircle, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/admin/contactos/")({
  component: ContactosAdmin,
});

const statusOptions = [
  { value: "pending", label: "Pendiente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  { value: "contacted", label: "Contactado", color: "bg-blue-100 text-blue-700", icon: MessageSquare },
  { value: "qualified", label: "Calificado", color: "bg-green-100 text-green-700", icon: CheckCircle },
  { value: "closed", label: "Cerrado", color: "bg-slate-100 text-slate-700", icon: XCircle },
];

function ContactosAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: contacts, isLoading } = useQuery(trpc.contactRequests.list.queryOptions());
  const { data: stats } = useQuery(trpc.contactRequests.getStats.queryOptions());

  const updateStatusMutation = useMutation(
    trpc.contactRequests.updateStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
        toast.success("Estado actualizado");
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el estado");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.contactRequests.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
        toast.success("Contacto eliminado");
        setSelectedContact(null);
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
    if (confirm("¿Estás seguro de eliminar este contacto?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredContacts = contacts?.filter(contact =>
    statusFilter === "all" || contact.status === statusFilter
  ) || [];

  const selectedContactData = contacts?.find(c => c.id === selectedContact);

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
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Contacto</h1>
          <p className="text-slate-600">Leads recibidos desde el formulario de contacto</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Contactados</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.contacted}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Calificados</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.qualified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Cerrados</p>
                <p className="text-3xl font-bold text-slate-600 mt-1">{stats.closed}</p>
              </div>
              <XCircle className="w-8 h-8 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Contactos</h2>
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
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const status = statusOptions.find(s => s.value === contact.status) || statusOptions[0];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedContact === contact.id ? "bg-primary-50 border-l-4 border-primary-600" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${status.color}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{contact.company}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No hay contactos</h3>
                <p className="text-slate-500">Las solicitudes de contacto aparecerán aquí.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {selectedContactData ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Detalles</h2>
                <button
                  onClick={() => handleDelete(selectedContactData.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Nombre</label>
                  <p className="text-slate-900 font-medium">
                    {selectedContactData.firstName} {selectedContactData.lastName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Empresa</label>
                  <p className="text-slate-900">{selectedContactData.company}</p>
                </div>

                {selectedContactData.position && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Cargo</label>
                    <p className="text-slate-900">{selectedContactData.position}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                  <a
                    href={`mailto:${selectedContactData.email}`}
                    className="text-primary-600 hover:underline flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {selectedContactData.email}
                  </a>
                </div>

                {selectedContactData.phone && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Teléfono</label>
                    <a
                      href={`tel:${selectedContactData.phone}`}
                      className="text-primary-600 hover:underline flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedContactData.phone}
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Servicio de interés</label>
                  <p className="text-slate-900">{selectedContactData.service}</p>
                </div>

                {selectedContactData.budget && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Presupuesto</label>
                    <p className="text-slate-900">{selectedContactData.budget}</p>
                  </div>
                )}

                {selectedContactData.timeline && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase">Timeline</label>
                    <p className="text-slate-900">{selectedContactData.timeline}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase">Mensaje</label>
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedContactData.message}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase mb-2 block">Estado</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => {
                      const StatusIcon = status.icon;
                      return (
                        <button
                          key={status.value}
                          onClick={() => handleStatusChange(selectedContactData.id, status.value)}
                          className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedContactData.status === status.value
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
                    {new Date(selectedContactData.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Selecciona un contacto</h3>
              <p className="text-slate-500">Haz clic en un contacto para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
