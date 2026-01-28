import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTRPC } from "~/trpc/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Mail,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building2,
  Star,
  Award,
  MapPin,
  Heart,
  Image,
  BarChart3,
  Newspaper
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true
  },
  {
    title: "Contenido",
    icon: FileText,
    children: [
      { title: "Servicios", href: "/admin/servicios", icon: Building2 },
      { title: "Métricas", href: "/admin/metricas", icon: BarChart3 },
      { title: "Testimonios", href: "/admin/testimonios", icon: Star },
      { title: "Clientes", href: "/admin/clientes", icon: Users },
      { title: "Certificaciones", href: "/admin/certificaciones", icon: Award },
      { title: "Oficinas", href: "/admin/oficinas", icon: MapPin },
      { title: "Beneficios", href: "/admin/beneficios", icon: Heart },
      { title: "Heroes", href: "/admin/heroes", icon: Image },
      { title: "Páginas", href: "/admin/paginas", icon: FileText },
    ]
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: Newspaper
  },
  {
    title: "Equipo",
    href: "/admin/equipo",
    icon: Users
  },
  {
    title: "Empleos",
    href: "/admin/empleos",
    icon: Briefcase
  },
  {
    title: "Leads",
    icon: MessageSquare,
    children: [
      { title: "Contactos", href: "/admin/contactos", icon: MessageSquare },
      { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
      { title: "Aplicaciones", href: "/admin/aplicaciones", icon: Briefcase },
    ]
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["Contenido"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const trpc = useTRPC();

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor ingresa email y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      const result = await trpc.adminUsers.login.mutate({
        email: loginForm.email,
        password: loginForm.password,
      });
      localStorage.setItem("adminSession", JSON.stringify(result));
      setIsLoggedIn(true);
      setLoginError("");
      setLoginForm({ email: "", password: "" });
    } catch (error: any) {
      setLoginError(error.message || "Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    setIsLoggedIn(false);
  };

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
            <p className="text-slate-600 mt-2">Esmassiva CMS</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="admin@esmassiva.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Validando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-bold text-slate-900">Esmassiva Admin</span>
        <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-white
          transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-4 border-b border-slate-700">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                {sidebarOpen && (
                  <span className="font-bold text-lg">Esmassiva</span>
                )}
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                          text-slate-300 hover:bg-slate-800 hover:text-white
                          transition-colors
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {sidebarOpen && <span>{item.title}</span>}
                        </div>
                        {sidebarOpen && (
                          <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.title) ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      {sidebarOpen && expandedMenus.includes(item.title) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={`
                                flex items-center space-x-3 px-3 py-2 rounded-lg text-sm
                                ${isActive(child.href)
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                                transition-colors
                              `}
                            >
                              <child.icon className="w-4 h-4" />
                              <span>{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-xl
                        ${isActive(item.href, item.exact)
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                        transition-colors
                      `}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.title}</span>}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Cerrar Sesión</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}


