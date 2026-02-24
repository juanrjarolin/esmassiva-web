import { Phone, Mail, MapPin, Globe, Shield, Award, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const trpc = useTRPC();
  const { data: services = [] } = useQuery(trpc.content.getServices.queryOptions());
  const { data: settings } = useQuery(trpc.content.getSiteSettings.queryOptions());

  // Build services list from database
  const servicesList = services
    .filter(service => service.isActive)
    .map(service => ({
      name: service.title,
      href: service.href || `/servicios/${service.slug}`,
    }));

  const company = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Clientes", href: "/clientes" },
    { name: "Carreras", href: "/carreras" },
    { name: "Noticias", href: "/noticias" },
    { name: "Contacto", href: "/contacto" },
  ];

  const legal = [
    { name: "Política de Privacidad", href: "/politica-privacidad" },
    { name: "Términos y Condiciones", href: "/terminos-condiciones" },
    { name: "Aviso Legal", href: "/aviso-legal" },
    { name: "Política de Cookies", href: "/politica-cookies" },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              {settings?.logoFooter ? (
                <img
                  src={settings.logoFooter}
                  alt={settings.siteName || "Esmassiva"}
                  className="h-12 mr-3"
                />
              ) : (
                <img
                  src="/logo-esmassiva.png"
                  alt="Esmassiva"
                  className="h-12 mr-3"
                />
              )}
              <div>
                <div className="text-2xl font-bold">{settings?.siteName || "Esmassiva"}</div>
                <div className="text-secondary-400 text-sm">Contact Center & BPO</div>
              </div>
            </div>
            <p className="text-secondary-300 mb-6 leading-relaxed">
              Transformamos la experiencia de cliente de empresas líderes con soluciones
              integrales de contact center y BPO en el mercado hispanohablante.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/esmassiva" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-accentBlue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/esmassiva" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-accentBlue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/esmassiva" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-accentBlue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://wa.me/595211234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-accentBlue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Servicios</h3>
            <ul className="space-y-3">
              {servicesList.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-secondary-300 hover:text-accentBlue-400 transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6">Empresa</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-secondary-300 hover:text-accentBlue-400 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-accentBlue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Línea Nacional</div>
                  <div className="text-secondary-300">+52 800 123 4567</div>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-accentBlue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Email</div>
                  <div className="text-secondary-300">contacto@esmassiva.com</div>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-accentBlue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Horarios</div>
                  <div className="text-secondary-300">Lun - Vie: 8:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-secondary-400 text-sm mb-4 md:mb-0">
              © {currentYear} Esmassiva. Todos los derechos reservados.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {legal.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-secondary-400 hover:text-accentBlue-400 text-sm transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
