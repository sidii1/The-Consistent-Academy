import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, CalendarDays, PenSquare } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface BlogFormData {
  title: string;
  content: string;
  author: string;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovedBlogs();
  }, []);

const fetchApprovedBlogs = async () => {
  try {
    setLoading(true);

    const q = query(
      collection(db, "blogs"),
      where("status", "==", "approved")    
    );

    const snapshot = await getDocs(q);

    const blogData = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        author: data.author,
        status: data.status,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });

    console.log("BLOGS:", blogData);
    setBlogs(blogData);

  } catch (error) {
    console.error("Error fetching blogs:", error);
  } finally {
    setLoading(false);
  }
};

   
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, "blogs"), {
      ...formData,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Blog submitted for approval!");
    setFormData({ title: "", content: "", author: "" });
    setShowForm(false);

  } catch (error) {
    console.error("Error submitting blog:", error);
  }
};
  return (
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Community Blog
          </h1>
          <p className="text-muted-foreground mt-2">
            Share insights, stories and learning experiences ✨
          </p>
        </motion.div>

        {/* Write Blog Button */}
        <div className="text-center mb-10">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white shadow-neu-lg hover:shadow-neu-xl transition-all"
          >
            <PenSquare className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Write a Blog'}
          </button>
        </div>

        {/* Blog Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-card p-8 rounded-3xl shadow-neu-xl mb-12 space-y-5"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Submit Your Blog
              </h2>

              <input
                type="text"
                name="author"
                placeholder="Your Name"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none"
              />

              <input
                type="text"
                name="title"
                placeholder="Blog Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none"
              />

              <textarea
                name="content"
                placeholder="Write your blog content..."
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                required
                className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none"
              />

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition"
              >
                Submit for Approval
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Blogs Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No approved blogs yet. Be the first to submit!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-3xl shadow-neu-lg bg-card hover:shadow-neu-xl transition-all flex flex-col"
              >
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {blog.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {blog.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-muted-foreground line-clamp-4 mb-4">
                  {blog.content}
                </p>

                <a
                  href={`/blog/${blog.id}`}
                  className="mt-auto text-primary font-semibold hover:underline"
                >
                  Read More →
                </a>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
