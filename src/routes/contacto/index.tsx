import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Building, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const Route = createFileRoute("/contacto/")({
  component: ContactoPage,
});

const contactFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono debe tener al menos 10 dígitos"),
  company: z.string().min(1, "La empresa es requerida"),
  position: z.string().optional(),
  service: z.string().min(1, "Selecciona un servicio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

function ContactoPage() {
  const trpc = useTRPC();

  const { data: settings } = useQuery(trpc.content.getSiteSettings.queryOptions());
  const { data: offices } = useQuery(trpc.content.getOffices.queryOptions());
  const { data: hero } = useQuery(trpc.content.getHero.queryOptions({ page: "contacto" }));

  const contactMutation = useMutation(
    trpc.createContactRequest.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Error al enviar el mensaje");
      },
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  // Obtener valores de configuración con valores por defecto
  const contactPhone = settings?.contactPhone || "+52 800 123 4567";
  const contactEmail = settings?.contactEmail || "contacto@esmassiva.com";
  const contactPhoneFormatted = contactPhone.replace(/\s/g, "");
  const contactPhoneTel = contactPhoneFormatted.startsWith("+")
    ? `tel:${contactPhoneFormatted}`
    : `tel:+${contactPhoneFormatted}`;

  const contactMethods = [
    {
      icon: Phone,
      title: "Llámanos",
      description: settings?.contactPhoneDescription || "Habla directamente con nuestros especialistas",
      value: contactPhone,
      action: contactPhoneTel
    },
    {
      icon: Mail,
      title: "Envíanos un email",
      description: settings?.contactEmailDescription || "Respuesta en menos de 24 horas",
      value: contactEmail,
      action: `mailto:${contactEmail}`
    },
    {
      icon: MessageSquare,
      title: settings?.contactChatTitle || "Chat en vivo",
      description: settings?.contactChatDescription || "Soporte instantáneo en línea",
      value: settings?.contactChatValue || "Iniciar chat",
      action: settings?.contactChatAction || "#"
    }
  ];

  const serviceOptions = [
    "Ventas & Telemarketing",
    "E-commerce & Soporte Digital",
    "Atención al Cliente",
    "Cobranzas & Recuperación de Deuda",
    "BPO - Business Process Outsourcing",
    "Consultoría Personalizada"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              {hero?.title || "Hablemos de tu"} <span className="text-primary-600">{hero?.titleHighlight || "proyecto"}</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {hero?.subtitle || "Nuestro equipo de especialistas está listo para ayudarte a transformar tu contact center y procesos de negocio. Agenda una consulta gratuita."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.action}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-secondary-100 hover:border-primary-200 text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">{method.title}</h3>
                  <p className="text-secondary-600 mb-4">{method.description}</p>
                  <p className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                    {method.value}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Solicita una propuesta
              </h2>
              <p className="text-secondary-600 mb-8">
                Completa el formulario y recibe una propuesta personalizada en menos de 24 horas.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Tu nombre"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Tu apellido"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email corporativo *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="nombre@empresa.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="+52 55 1234 5678"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register("company")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Nombre de tu empresa"
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-secondary-700 mb-2">
                      Cargo
                    </label>
                    <input
                      id="position"
                      type="text"
                      {...register("position")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Tu cargo en la empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-secondary-700 mb-2">
                    Servicio de interés *
                  </label>
                  <select
                    id="service"
                    {...register("service")}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Selecciona un servicio</option>
                    {serviceOptions.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-secondary-700 mb-2">
                      Presupuesto aproximado
                    </label>
                    <select
                      id="budget"
                      {...register("budget")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Seleccionar rango</option>
                      <option value="10000-25000">$10,000 - $25,000 USD</option>
                      <option value="25000-50000">$25,000 - $50,000 USD</option>
                      <option value="50000-100000">$50,000 - $100,000 USD</option>
                      <option value="100000+">$100,000+ USD</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-secondary-700 mb-2">
                      Tiempo para implementación
                    </label>
                    <select
                      id="timeline"
                      {...register("timeline")}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Seleccionar tiempo</option>
                      <option value="inmediato">Inmediato (1-2 semanas)</option>
                      <option value="1-3-meses">1-3 meses</option>
                      <option value="3-6-meses">3-6 meses</option>
                      <option value="6+-meses">6+ meses</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto, necesidades específicas y objetivos..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-700 disabled:bg-secondary-400 transition-colors flex items-center justify-center"
                >
                  {contactMutation.isPending ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Company Info */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                  ¿Por qué contactarnos?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Users className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-900">Consultoría especializada</h4>
                      <p className="text-secondary-600">Análisis gratuito de tus necesidades y recomendaciones personalizadas</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Building className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-900">Soluciones escalables</h4>
                      <p className="text-secondary-600">Desde startups hasta grandes corporaciones, adaptamos nuestros servicios</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-secondary-900">Implementación rápida</h4>
                      <p className="text-secondary-600">Procesos optimizados para poner en marcha tu proyecto en tiempo récord</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-primary-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Agenda una demo personalizada
                </h3>
                <p className="text-primary-100 mb-6">
                  Ve en acción nuestras soluciones con una demostración adaptada a tu industria y necesidades específicas.
                </p>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-secondary-50 transition-colors">
                  Solicitar Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      {offices && offices.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                {settings?.contactOfficesTitle || "Nuestras Oficinas"}
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                {settings?.contactOfficesSubtitle || "Ubicados estratégicamente para brindar el mejor servicio"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offices.map((office) => (
                <div key={office.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {office.mapUrl && (
                    <div className="h-48">
                      <iframe
                        src={office.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary-900 mb-4">{office.city}</h3>
                    <div className="space-y-3">
                      {office.address && (
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                          <p className="text-secondary-600">{office.address}</p>
                        </div>
                      )}
                      {office.phone && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                          <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="text-secondary-600 hover:text-primary-600 transition-colors">
                            {office.phone}
                          </a>
                        </div>
                      )}
                      {office.email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-secondary-600 hover:text-primary-600 transition-colors">
                            {office.email}
                          </a>
                        </div>
                      )}
                      {office.hours && (
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                          <p className="text-secondary-600">{office.hours}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
