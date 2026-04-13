import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ArrowLeft, User, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import DOMPurify from 'dompurify';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  coverImageUrl?: string;
  createdAt: string;
  status: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status !== "approved") {
            setNotFound(true);
          } else {
            setBlog({
              id: docSnap.id,
              title: data.title,
              content: data.content,
              author: data.author,
              coverImageUrl: data.coverImageUrl,
              status: data.status,
              createdAt: data.createdAt
                ? data.createdAt.toDate().toISOString()
                : new Date().toISOString(),
            });
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground">Loading blog post...</p>
          </div>
        </div>
      </>
    );
  }

  if (notFound || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Blog not found
              </h1>
              <p className="text-muted-foreground mb-6">
                This blog post doesn't exist or hasn't been approved yet.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen pt-24 px-6 bg-gradient-to-br from-background to-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mb-8 block"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="bg-card p-8 md:p-12 rounded-3xl shadow-neu-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 border-b border-border pb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blog.author}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {blog.coverImageUrl && (
            <img 
              src={blog.coverImageUrl} 
              alt={blog.title} 
              className="w-full rounded-2xl object-cover max-h-[400px] shadow-md mb-8"
            />
          )}

          <div
            className="blog-content max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
          />
        </article>
      </motion.div>
    </div>
    </>
  );
};

export default BlogPost;
