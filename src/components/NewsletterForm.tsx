import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  variant?: 'sidebar' | 'footer' | 'inline';
  showNameFields?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterForm({ 
  variant = 'inline', 
  showNameFields = false,
  title = "Inspírate con historias e insights de marcas que transforman sus industrias.",
  description = "Únete a miles de profesionales que reciben insights exclusivos, casos de éxito y estrategias accionables directamente en su bandeja de entrada.",
  className = ""
}: NewsletterFormProps) {
  const trpc = useTRPC();
  
  const newsletterMutation = useMutation(
    trpc.subscribeNewsletter.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Error al suscribirse al newsletter");
      },
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    newsletterMutation.mutate(data);
  };

  if (variant === 'sidebar') {
    return (
      <div className={`bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-2xl text-white ${className}`}>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-primary-100 mb-6 text-sm">{description}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="email"
            {...register("email")}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors.email && (
            <p className="text-primary-200 text-sm">{errors.email.message}</p>
          )}
          <button
            type="submit"
            disabled={newsletterMutation.isPending}
            className="w-full bg-white text-primary-600 py-3 px-4 rounded-xl font-semibold hover:bg-secondary-50 transition-colors disabled:opacity-50"
          >
            {newsletterMutation.isPending ? "Suscribiendo..." : "Suscribirse"}
          </button>
        </form>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold mb-4 text-white">{title}</h3>
        <p className="text-secondary-300 mb-6 text-sm">{description}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              {...register("email")}
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={newsletterMutation.isPending}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              {newsletterMutation.isPending ? "..." : "Suscribir"}
            </button>
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
          )}
        </form>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg flex flex-col ${className}`}>
      <div className="flex items-center mb-6">
        <Mail className="w-6 h-6 text-primary-600 mr-3" />
        <h3 className="text-2xl font-bold text-secondary-900">{title}</h3>
      </div>
      <p className="text-secondary-600 mb-8">{description}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col">
        {showNameFields && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                {...register("firstName")}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                {...register("lastName")}
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Tu apellido"
              />
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="nombre@empresa.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-2 text-sm text-secondary-500 italic">
            Sin spam. Solo contenido de valor.
          </p>
        </div>

        {showNameFields && (
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Empresa
            </label>
            <input
              type="text"
              {...register("company")}
              className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Nombre de tu empresa"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={newsletterMutation.isPending}
          className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-700 disabled:bg-secondary-400 transition-colors flex items-center justify-center mt-auto"
        >
          {newsletterMutation.isPending ? (
            "Suscribiendo..."
          ) : (
            <>
              Envíame ideas 💡
            </>
          )}
        </button>
      </form>
    </div>
  );
}
