import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
  previewClassName?: string;
  required?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label = "Imagen",
  folder = "images",
  className = "",
  previewClassName = "h-32 object-cover rounded-lg",
  required = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();

  // Sincronizar preview con value cuando cambia desde el padre
  // Solo actualizar si no estamos en proceso de subida y el valor realmente cambió
  useEffect(() => {
    if (!isUploading && value !== preview) {
      setPreview(value || null);
      // Limpiar el input file si el valor cambió desde fuera
      if (fileInputRef.current && !value) {
        fileInputRef.current.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const uploadMutation = useMutation(
    trpc.requestImageUploadUrl.mutationOptions({
      onSuccess: async (data) => {
        try {
          if (!selectedFile) {
            throw new Error("Archivo no encontrado");
          }

          // Upload the file to MinIO using the presigned URL
          const response = await fetch(data.uploadUrl, {
            method: "PUT",
            body: selectedFile,
            headers: {
              "Content-Type": selectedFile.type,
            },
          });

          if (!response.ok) {
            throw new Error("Error al subir la imagen");
          }

          // Update the form with the public URL
          onChange(data.publicUrl);
          setPreview(data.publicUrl);
          setSelectedFile(null);
          toast.success("Imagen subida correctamente");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Error al subir la imagen. Por favor, inténtalo de nuevo.");
        } finally {
          setIsUploading(false);
        }
      },
      onError: (error) => {
        console.error("Error getting upload URL:", error);
        toast.error(error.message || "Error al preparar la subida de imagen");
        setIsUploading(false);
        setSelectedFile(null);
      },
    })
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, GIF, WEBP, SVG).");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no puede ser mayor a 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setSelectedFile(file);

    // Start upload
    setIsUploading(true);
    uploadMutation.mutate({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder,
    });
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && "*"}
      </label>

      <div className="space-y-2">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className={previewClassName}
            />
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Upload button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {preview ? "Cambiar imagen" : "Subir imagen"}
              </>
            )}
          </button>
        </div>

        {/* URL input as fallback */}
        <div className="text-xs text-slate-500 mt-2">
          O ingresa una URL:
        </div>
        <input
          type="url"
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value || null);
          }}
          className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
          placeholder="https://..."
          disabled={isUploading}
        />
      </div>
    </div>
  );
}

