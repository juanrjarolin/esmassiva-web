import { Facebook, Instagram, Linkedin } from "lucide-react";

// Custom TikTok icon component
function TikTokIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

interface SocialMediaModuleProps {
  className?: string;
  title?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

const defaultTitle = "Conéctate con nosotros";
const defaultDescription = "Únete a más de 2,000 profesionales que ya nos siguen para recibir actualizaciones, insights e ideas que transforman negocios.";
const defaultFb = "https://www.facebook.com/esmassiva";
const defaultIg = "https://www.instagram.com/esmassiva";
const defaultLi = "https://www.linkedin.com/company/esmassiva";
const defaultTk = "https://www.tiktok.com/@esmassiva";

export function SocialMediaModule({
  className = "",
  title = defaultTitle,
  description = defaultDescription,
  facebook = defaultFb,
  instagram = defaultIg,
  linkedin = defaultLi,
  tiktok = defaultTk,
}: SocialMediaModuleProps) {
  const links = [
    { href: facebook?.trim() || defaultFb, label: "Facebook", handle: "@esmassiva", Icon: Facebook, color: '#1877F2' },
    { href: instagram?.trim() || defaultIg, label: "Instagram", handle: "@esmassiva", Icon: Instagram, color: 'linear-gradient(45deg, #E1306C 0%, #F77737 50%, #FCAF45 100%)' },
    { href: linkedin?.trim() || defaultLi, label: "LinkedIn", handle: "Esmassiva", Icon: Linkedin, color: '#0A66C2' },
    { href: tiktok?.trim() || defaultTk, label: "TikTok", handle: "@esmassiva", Icon: TikTokIcon, color: '#000000' },
  ].filter((l) => l.href);

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      <h3 className="text-2xl font-bold mb-4 text-secondary-900">{title || defaultTitle}</h3>
      <p className="text-secondary-600 mb-6 leading-relaxed">
        {description || defaultDescription}
      </p>

      <div className="space-y-3">
        {links.map(({ href, label, handle, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 rounded-xl transition-all duration-300 group hover:shadow-md"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: label === "Instagram" ? undefined : color, background: label === "Instagram" ? color : undefined }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-secondary-900">{label}</div>
              <div className="text-sm text-secondary-600">{handle}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
