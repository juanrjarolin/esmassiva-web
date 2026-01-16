import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Star,
  MessageSquare,
  Mail,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    { title: "Servicios", value: "6", icon: Building2, color: "bg-blue-500" },
    { title: "Testimonios", value: "3", icon: Star, color: "bg-yellow-500" },
    { title: "Contactos", value: "0", icon: MessageSquare, color: "bg-green-500" },
    { title: "Newsletter", value: "0", icon: Mail, color: "bg-purple-500" },
  ];

  const quickActions = [
    { title: "Nuevo Servicio", href: "/admin/servicios", icon: Building2 },
    { title: "Nuevo Testimonio", href: "/admin/testimonios", icon: Star },
    { title: "Ver Contactos", href: "/admin/contactos", icon: MessageSquare },
    { title: "Configuración", href: "/admin/configuracion", icon: Settings },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Bienvenido al panel de administración de Esmassiva</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="flex flex-col items-center p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <action.icon className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600 text-center">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Actividad Reciente</h2>
        <div className="text-center py-8 text-slate-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay actividad reciente</p>
        </div>
      </div>
    </div>
  );
}
