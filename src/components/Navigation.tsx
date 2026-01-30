import { useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown, ShoppingCart, Headphones, CreditCard, Building2, TrendingUp, Users, Globe, Shield, Award, Star, CheckCircle, MapPin, Zap, Target } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

// Icon mapping helper
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone, ShoppingCart, Headphones, CreditCard, Building2, Users, Globe, Shield, Award, TrendingUp, Star, CheckCircle, MapPin, Zap, Target
};

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const trpc = useTRPC();
  const { data: services = [] } = useQuery(trpc.content.getServices.queryOptions());

  // Build dropdown items from database services
  const serviceDropdownItems = services
    .filter(service => service.isActive)
    .map(service => {
      const Icon = iconMap[service.icon] || Building2;
      return {
        name: service.title,
        href: service.href || `/servicios/${service.slug}`,
        icon: Icon,
      };
    });

  const mainNavItems = [
    { name: "Nosotros", href: "/nosotros" },
    {
      name: "Servicios",
      href: "/servicios",
      hasDropdown: true,
      dropdownItems: serviceDropdownItems,
    },
    { name: "Clientes", href: "/clientes" },
    { name: "Trabaja con nosotros", href: "/carreras" },
    { name: "Blog", href: "/noticias" },
    { name: "Contacto", href: "/contacto" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary-900 text-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>+52 800 123 4567</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>contacto@esmassiva.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjREU3ODM1IiBmaWxsLW9wYWNpdHk9IjAuMSIgcng9IjEwIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSI0MCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNERTc4MzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FPC90ZXh0Pgo8L3N2Zz4="
                  alt="Esmassiva"
                  className="h-12 mr-3"
                />
                <div>
                  <div className="text-2xl font-bold text-secondary-900">Esmassiva</div>
                  <div className="text-xs text-secondary-500 -mt-1">Contact Center & BPO</div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {mainNavItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="group"
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                    >
                      <button className="flex items-center text-secondary-700 hover:text-accentBlue-600 font-medium transition-colors">
                        {item.name}
                        <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform" />
                      </button>
                      {isServicesOpen && item.dropdownItems && item.dropdownItems.length > 0 && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-secondary-100 py-2 z-50">
                          {item.dropdownItems.map((dropdownItem) => {
                            const DropdownIcon = dropdownItem.icon;
                            return (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="flex items-center px-4 py-3 text-secondary-700 hover:bg-accentBlue-50 hover:text-accentBlue-600 transition-colors group"
                              >
                                {DropdownIcon && (
                                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                                    <DropdownIcon className="w-5 h-5 text-primary-600" />
                                  </div>
                                )}
                                <span className="flex-1">{dropdownItem.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="text-secondary-700 hover:text-accentBlue-600 font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <a href="/contacto" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg">
                Solicitar Propuesta
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-secondary-700 hover:text-accentBlue-600 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-secondary-200">
              <div className="py-4 space-y-2">
                {mainNavItems.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="block px-4 py-3 text-secondary-700 hover:bg-accentBlue-50 hover:text-accentBlue-600 transition-colors rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-4 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          return (
                            <a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-center px-4 py-2 text-sm text-secondary-600 hover:bg-accentBlue-50 hover:text-accentBlue-600 transition-colors rounded-lg group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {DropdownIcon && (
                                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                                  <DropdownIcon className="w-4 h-4 text-primary-600" />
                                </div>
                              )}
                              <span className="flex-1">{dropdownItem.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                <div className="px-4 pt-4">
                  <a href="/contacto" className="block w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center">
                    Solicitar Propuesta
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
