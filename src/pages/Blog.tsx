import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, CalendarDays, PenSquare, LogIn, LogOut, Shield, X, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import imageCompression from 'browser-image-compression';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  coverImageUrl?: string;
  excerpt?: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface BlogFormData {
  title: string;
  content: string;
  author: string;
}

const Blog: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const queryClient = useQueryClient();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdTokenResult();
          setIsAdmin(!!token.claims.admin);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchApprovedBlogs = async ({ pageParam }: { pageParam: any }) => {
    let q = query(
      collection(db, "blogs"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    if (pageParam) {
      q = query(
        collection(db, "blogs"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc"),
        startAfter(pageParam),
        limit(10)
      );
    }

    const snapshot = await getDocs(q);
    const blogData = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        excerpt: data.excerpt,
        author: data.author,
        status: data.status,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      };
    });

    return {
      blogs: blogData as BlogPost[],
      nextCursor: snapshot.docs.length === 10 ? snapshot.docs[snapshot.docs.length - 1] : null,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["approvedBlogs"],
    queryFn: fetchApprovedBlogs,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
  });

  const blogs = data?.pages.flatMap((page) => page.blogs) ?? [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const stripHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login?redirect=blog");
      return;
    }

    try {
      setIsUploadingImage(true);
      let coverImageUrl = "";

      if (imageFile) {
        // Compress Image
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Upload to Cloudinary
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", compressedFile);
        cloudinaryData.append("upload_preset", "tca_blogs");

        const response = await fetch("https://api.cloudinary.com/v1_1/dftodlkkt/image/upload", {
          method: "POST",
          body: cloudinaryData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const json = await response.json();
        coverImageUrl = json.secure_url;
      }

      const plainText = stripHtml(formData.content);
      const excerpt = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;

      await addDoc(collection(db, "blogs"), {
        ...formData,
        coverImageUrl,
        excerpt,
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Blog submitted for approval!");
      setFormData({ title: "", content: "", author: "" });
      removeImage();
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Failed to submit blog. Please check your connection or image size.");
    } finally {
      setIsUploadingImage(false);
    }
  };

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
            <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neu-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Community Blog
            </h1>
            <p className="text-muted-foreground mt-2">
              Share insights, stories and learning experiences ✨
            </p>
          </motion.div>

          {/* Auth + Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white shadow-neu-lg hover:shadow-neu-xl transition-all"
                >
                  <PenSquare className="w-5 h-5" />
                  Write a Blog
                </button>
                {isAdmin && (
                  <Link
                    to="/admin/blogs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white shadow-neu-lg hover:shadow-neu-xl transition-all"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition-all bg-secondary text-foreground"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login?redirect=blog");
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white shadow-neu-lg hover:shadow-neu-xl transition-all"
                >
                  <PenSquare className="w-5 h-5" />
                  Write a Blog
                </button>
                <button
                  onClick={() => navigate("/login?redirect=blog")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition-all bg-secondary text-foreground"
                >
                  <LogIn className="w-5 h-5" />
                  Login / Register
                </button>
              </>
            )}
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

                {/* Cover Image Input */}
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-neu-lg">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer text-muted-foreground p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-sm font-semibold">Upload Cover Image</span>
                      <span className="text-xs opacity-70">JPG, PNG, WEBP (Max: 500KB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                <input
                  type="text"
                  name="title"
                  placeholder="Blog Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-secondary/20 border-2 border-transparent focus:border-primary outline-none"
                />

                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Write your blog content..."
                  minHeight="260px"
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isUploadingImage}
                    className="flex-1 bg-primary text-white py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isUploadingImage ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Submit for Approval"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      removeImage();
                    }}
                    className="px-6 py-3 rounded-2xl shadow-neu-lg hover:shadow-neu-xl transition bg-secondary text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Blogs Grid */}
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No approved blogs yet. Be the first to submit!
            </p>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-3xl shadow-neu-lg bg-card hover:shadow-neu-xl transition-all flex flex-col"
                  >
                    {blog.coverImageUrl && (
                      <img 
                        src={blog.coverImageUrl} 
                        alt={blog.title} 
                        className="w-full aspect-video object-cover rounded-t-2xl rounded-b-md mb-4 -mt-2 -mx-2 max-w-[calc(100%+16px)] shadow-sm"
                      />
                    )}
                    
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
                      {blog.excerpt ? blog.excerpt : stripHtml(blog.content)}
                    </p>

                    <Link
                      to={`/blog/${blog.id}`}
                      className="mt-auto text-primary font-semibold hover:underline"
                    >
                      Read More →
                    </Link>
                  </motion.article>
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center pb-12">
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
      <Footer />
    </>
  );
};

export default Blog;
