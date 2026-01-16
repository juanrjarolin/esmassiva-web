import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Calendar, Newspaper, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "~/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/blog/")({
  component: BlogAdmin,
});

const categoryOptions = [
  "Noticias",
  "Tecnología",
  "Servicios",
  "Cultura",
  "Eventos",
  "Recursos",
];

interface BlogPostForm {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  featuredImage: string;
  publishedAt?: Date;
}

const emptyForm: BlogPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  category: "Noticias",
  tags: [],
  isPublished: false,
  isFeatured: false,
  featuredImage: "",
};

function BlogAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostForm | null>(null);
  const [form, setForm] = useState<BlogPostForm>(emptyForm);
  const [tagInput, setTagInput] = useState("");

  const { data: posts, isLoading } = useQuery(trpc.blogPosts.list.queryOptions());

  const createMutation = useMutation(
    trpc.blogPosts.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.blogPosts.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getBlogPosts.queryOptions({ limit: 10 }));
        if (data?.slug) {
          queryClient.invalidateQueries(trpc.content.getBlogPostBySlug.queryOptions({ slug: data.slug }));
        }
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getBlogPostBySlug"],
          exact: false,
        });
        toast.success("Artículo creado correctamente");
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear el artículo");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.blogPosts.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.blogPosts.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getBlogPosts.queryOptions({ limit: 10 }));
        if (data?.slug) {
          queryClient.invalidateQueries(trpc.content.getBlogPostBySlug.queryOptions({ slug: data.slug }));
        }
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getBlogPostBySlug"],
          exact: false,
        });
        toast.success("Artículo actualizado correctamente");
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el artículo");
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.blogPosts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.blogPosts.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getBlogPosts.queryOptions({ limit: 10 }));
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getBlogPostBySlug"],
          exact: false,
        });
        toast.success("Artículo eliminado correctamente");
      },
      onError: (error) => {
        toast.error(error.message || "Error al eliminar el artículo");
      },
    })
  );

  const togglePublishedMutation = useMutation(
    trpc.blogPosts.togglePublished.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.blogPosts.list.queryOptions());
        queryClient.invalidateQueries(trpc.content.getBlogPosts.queryOptions({ limit: 10 }));
        if (data?.slug) {
          queryClient.invalidateQueries(trpc.content.getBlogPostBySlug.queryOptions({ slug: data.slug }));
        }
        queryClient.invalidateQueries({
          queryKey: ["trpc", "content", "getBlogPostBySlug"],
          exact: false,
        });
        toast.success("Estado actualizado");
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar el estado");
      },
    })
  );

  const openModal = (post?: typeof posts extends (infer T)[] ? T : never) => {
    if (post) {
      const postData = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : (post.tags ? JSON.parse(post.tags) : []),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
      };
      setEditingPost(postData);
      setForm(postData);
    } else {
      setEditingPost(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
    setTagInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.filter(t => t.trim() !== ""),
    };

    if (editingPost?.id) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este artículo?")) {
      deleteMutation.mutate({ id });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-slate-600">Artículos y noticias</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Artículo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {posts && posts.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Artículo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {post.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      <div>
                        <div className="font-medium text-slate-900">{post.title}</div>
                        {post.excerpt && (
                          <div className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.publishedAt ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">No publicado</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublishedMutation.mutate({ id: post.id })}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm ${
                        post.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {post.isPublished ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Publicado</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Borrador</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(post)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No hay artículos</h3>
            <p className="text-slate-500 mb-4">Comienza a crear contenido para tu blog.</p>
            <button
              onClick={() => openModal()}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Crear primer artículo
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold">
                {editingPost ? "Editar Artículo" : "Nuevo Artículo"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => {
                        setForm(prev => ({ ...prev, title: e.target.value }));
                        if (!editingPost) {
                          setForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Extracto
                  </label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contenido *
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      required
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <ImageUpload
                    value={form.featuredImage}
                    onChange={(url) => setForm(prev => ({ ...prev, featuredImage: url }))}
                    label="Imagen destacada"
                    folder="blog"
                    previewClassName="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-primary-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl"
                      placeholder="Agregar tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Título (SEO)
                    </label>
                    <input
                      type="text"
                      value={form.metaTitle}
                      onChange={(e) => setForm(prev => ({ ...prev, metaTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Meta Descripción (SEO)
                    </label>
                    <textarea
                      value={form.metaDescription}
                      onChange={(e) => setForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Publicado</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Destacado</span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                >
                  {editingPost ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
