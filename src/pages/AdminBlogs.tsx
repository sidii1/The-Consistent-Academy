import React, { useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, X, CalendarDays, User, FileText, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

interface AdminBlogData {
  id: string;
  title: string;
  content: string;
  author: string;
  coverImageUrl?: string;
  createdAt: string;
}

interface EditForm {
  title: string;
  content: string;
  author: string;
}

const AdminBlogs: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ title: "", content: "", author: "" });

  const fetchPendingBlogs = async ({ pageParam }: { pageParam: any }) => {
    let q = query(
      collection(db, "blogs"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    if (pageParam) {
      q = query(
        collection(db, "blogs"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(10)
      );
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((d) => {
      const blogData = d.data();
      return {
        id: d.id,
        title: blogData.title,
        content: blogData.content,
        author: blogData.author,
        coverImageUrl: blogData.coverImageUrl,
        createdAt: blogData.createdAt
          ? blogData.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });

    return {
      blogs: data,
      nextCursor: snapshot.docs.length === 10 ? snapshot.docs[snapshot.docs.length - 1] : null,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["adminBlogs"],
    queryFn: fetchPendingBlogs,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

  // APPROVE
  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "blogs", id), { status: "approved" });
      
      queryClient.setQueryData(["adminBlogs"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            blogs: page.blogs.filter((b: any) => b.id !== id),
          })),
        };
      });

      toast.success("Blog approved and published!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve blog");
    }
  };

  // REJECT
  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "blogs", id), { status: "rejected" });
      
      queryClient.setQueryData(["adminBlogs"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            blogs: page.blogs.filter((b: any) => b.id !== id),
          })),
        };
      });

      toast.success("Blog rejected");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject blog");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      
      queryClient.setQueryData(["adminBlogs"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            blogs: page.blogs.filter((b: any) => b.id !== id),
          })),
        };
      });

      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const handleEditStart = (blog: AdminBlogData) => {
    setEditingId(blog.id);
    setEditForm({ title: blog.title, content: blog.content, author: blog.author });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ title: "", content: "", author: "" });
  };

  const handleEditSave = async (id: string) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error("All fields are required");
      return;
    }
    try {
      await updateDoc(doc(db, "blogs", id), {
        title: editForm.title.trim(),
        content: editForm.content.trim(),
      });
      
      queryClient.setQueryData(["adminBlogs"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            blogs: page.blogs.map((b: any) =>
              b.id === id
                ? { ...b, title: editForm.title.trim(), content: editForm.content.trim() }
                : b
            ),
          })),
        };
      });

      setEditingId(null);
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>

            <p className="text-muted-foreground mt-2">
              Moderate blog submissions
            </p>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <p className="text-center text-muted-foreground">
              Loading pending blogs...
            </p>
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">
                No pending blogs to review
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card p-6 md:p-8 rounded-3xl shadow-neu-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {editingId === blog.id ? (
                          /* ── Inline edit form ── */
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                              placeholder="Title"
                              className="w-full px-4 py-2.5 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-primary/30 focus:border-primary outline-none text-foreground font-semibold"
                            />
                            <RichTextEditor
                              content={editForm.content}
                              onChange={(html) => setEditForm((f) => ({ ...f, content: html }))}
                              placeholder="Content"
                              minHeight="220px"
                            />
                          </div>
                        ) : (
                          /* ── Read-only view ── */
                          <>
                            {blog.coverImageUrl && (
                              <img 
                                src={blog.coverImageUrl} 
                                alt={blog.title} 
                                className="w-full aspect-video object-cover rounded-xl mb-4 max-w-sm shadow-sm"
                              />
                            )}
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {blog.title}
                            </h3>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {blog.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                {new Date(blog.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>

                            <p className="text-muted-foreground line-clamp-4">
                              {blog.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex gap-3 md:flex-col md:ml-4 shrink-0">
                        {editingId === blog.id ? (
                          /* Save / Cancel when editing */
                          <>
                            <button
                              onClick={() => handleEditSave(blog.id)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-secondary text-foreground shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          /* Normal action buttons */
                          <>
                            <button
                              onClick={() => handleApprove(blog.id)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-green-600 text-white shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleEditStart(blog)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleReject(blog.id)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-yellow-500 text-white shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 text-white shadow-neu-lg hover:shadow-neu-xl transition-all text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {hasNextPage && (
                <div className="flex justify-center mt-8 pb-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-3 rounded-2xl bg-primary/10 text-primary shadow-neu-lg hover:shadow-neu-xl hover:bg-primary/20 transition-all font-semibold disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBlogs;