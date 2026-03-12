import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, X, CalendarDays, User, FileText, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

interface PendingBlog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface EditForm {
  title: string;
  content: string;
  author: string;
}

const AdminBlogs: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [blogs, setBlogs] = useState<PendingBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ title: "", content: "", author: "" });
  const navigate = useNavigate();

// Check auth & admin status
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setAuthChecked(true);

    if (!currentUser) {
      navigate("/");
      return;
    }

    try {
      const token = await currentUser.getIdTokenResult();

      if (!token.claims.admin) {
        toast.error("Access denied. Admin only.");
        navigate("/");
        return;
      }

      setUser(currentUser);
    } catch (err) {
      console.error("Error checking admin claim:", err);
      navigate("/");
    }
  });

  return () => unsubscribe();
}, [navigate]);

  // Fetch pending blogs once admin is verified
  useEffect(() => {
    if (user) {
      fetchPendingBlogs();
    }
  }, [user]);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => {
        const blogData = d.data();
        return {
          id: d.id,
          title: blogData.title,
          content: blogData.content,
          author: blogData.author,
          createdAt: blogData.createdAt
            ? blogData.createdAt.toDate().toISOString()
            : new Date().toISOString(),
        };
      });
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching pending blogs:", error);
      toast.error("Failed to load pending blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "blogs", id), { status: "approved" });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog approved and published!");
    } catch (error) {
      console.error("Error approving blog:", error);
      toast.error("Failed to approve blog");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "blogs", id), { status: "rejected" });
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog rejected");
    } catch (error) {
      console.error("Error rejecting blog:", error);
      toast.error("Failed to reject blog");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  const handleEditStart = (blog: PendingBlog) => {
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
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, title: editForm.title.trim(), content: editForm.content.trim() }
            : b
        )
      );
      setEditingId(null);
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  // Don't render until auth check completes
  if (!authChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
          <p className="text-center text-muted-foreground">Checking access...</p>
        </div>
      </>
    );
  }

  // Non-admin users are redirected in useEffect, but guard here too
  // if (!user || user.email !== ADMIN_EMAIL) {
  //   return null;
  // }
  if (!user) {
  return null;
}

  return (
    <>
    <Navbar />
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Moderate pending blog submissions
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
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
                          <textarea
                            value={editForm.content}
                            onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                            placeholder="Content"
                            rows={8}
                            className="w-full px-4 py-2.5 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none text-foreground resize-y"
                          />
                        </div>
                      ) : (
                        /* ── Read-only view ── */
                        <>
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

                          <p className="text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                            {blog.content}
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
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminBlogs;
