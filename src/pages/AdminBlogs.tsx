import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, X, CalendarDays, User, FileText } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

interface PendingBlog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const AdminBlogs: React.FC = () => {

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [blogs, setBlogs] = useState<PendingBlog[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBlog, setSelectedBlog] = useState<PendingBlog | null>(null);

  const navigate = useNavigate();

  // AUTH CHECK
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

  // FETCH BLOGS
  useEffect(() => {
    if (user) fetchBlogs();
  }, [user]);

  const fetchBlogs = async () => {
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
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // APPROVE
  const handleApprove = async (id: string) => {
    try {

      await updateDoc(doc(db, "blogs", id), { status: "approved" });

      setBlogs(prev => prev.filter(b => b.id !== id));

      toast.success("Blog approved and published!");

      setSelectedBlog(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to approve blog");
    }
  };

  // REJECT
  const handleReject = async (id: string) => {
    try {

      await updateDoc(doc(db, "blogs", id), { status: "rejected" });

      setBlogs(prev => prev.filter(b => b.id !== id));

      toast.success("Blog rejected");

      setSelectedBlog(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to reject blog");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    try {

      await deleteDoc(doc(db, "blogs", id));

      setBlogs(prev => prev.filter(b => b.id !== id));

      toast.success("Blog deleted successfully");

      setSelectedBlog(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  if (!authChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
          <p className="text-center text-muted-foreground">
            Checking access...
          </p>
        </div>
      </>
    );
  }

  if (!user) return null;

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

          {/* CONTENT */}

          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading blogs...
            </p>
          ) : blogs.length === 0 ? (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >

              <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />

              <p className="text-lg text-muted-foreground">
                No blogs to review
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
                    onClick={() => setSelectedBlog(blog)}
                    className="cursor-pointer bg-card p-6 md:p-8 rounded-3xl shadow-neu-lg"
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="flex-1 min-w-0">

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
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>

                        </div>

                        <p className="text-muted-foreground line-clamp-4 whitespace-pre-wrap">
                          {blog.content}
                        </p>

                      </div>

                    </div>

                  </motion.div>

                ))}

              </AnimatePresence>

            </div>

          )}

        </div>

      </div>

      {/* BLOG MODAL */}

      {selectedBlog && (

        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedBlog(null)}
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card max-w-3xl w-full rounded-3xl shadow-xl p-8 max-h-[80vh] overflow-y-auto"
          >

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-bold">
                {selectedBlog.title}
              </h2>

              <button onClick={() => setSelectedBlog(null)}>
                <X />
              </button>

            </div>

            <p className="text-muted-foreground mb-6 whitespace-pre-wrap leading-relaxed">
              {selectedBlog.content}
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => handleApprove(selectedBlog.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(selectedBlog.id)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl"
              >
                Reject
              </button>

              <button
                onClick={() => handleDelete(selectedBlog.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default AdminBlogs;