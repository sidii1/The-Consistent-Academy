import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CalendarDays,
  PenSquare,
  LogIn,
  LogOut,
  Shield,
  X,
  Search,
  Clock,
  ImagePlus,
  Loader2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import RichTextEditor from "@/components/ui/rich-text-editor";
import imageCompression from "browser-image-compression";
import { signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/utils";
import { reveal } from "@/lib/device";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  coverImageUrl?: string;
  excerpt?: string;
  createdAt: string;
  status: "approved" | "pending" | "rejected";
}

interface BlogFormData {
  title: string;
  content: string;
  author: string;
}

const PAGE_SIZE = 10;
const MIN_TITLE = 5;
const MIN_BODY_CHARS = 50;
const MAX_TITLE = 120;
const MAX_IMAGE_MB = 10;
const DRAFT_KEY = "tca_blog_draft_v1";

const EMPTY_FORM: BlogFormData = { title: "", content: "", author: "" };

/** Plain text of an HTML string. DOMParser never executes scripts or loads images (innerHTML on a detached div does). */
const htmlToText = (html: string): string =>
  new DOMParser().parseFromString(html || "", "text/html").body.textContent?.trim() ?? "";

const readMinutes = (html: string): number => {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Shared field styling: carved into the surface, accent focus ring (never a border).
const fieldClass =
  "w-full px-5 py-3 rounded-neo-btn bg-neo-base neo-inset text-neo-fg placeholder:text-neo-placeholder outline-none transition-shadow focus-visible:shadow-neo-focus";

const Blog: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const bodyText = useMemo(() => htmlToText(formData.content), [formData.content]);
  const isDirty = !!(formData.title.trim() || bodyText || imageFile);

  // ── Auth ──
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

  // ── Draft restore / autosave (best-effort: storage can be blocked) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<BlogFormData>;
        if (draft.title || draft.content) {
          setFormData({ ...EMPTY_FORM, ...draft });
          toast.info("Restored your unsent draft.", { id: "blog-draft" });
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      if (formData.title || bodyText) localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, [formData, bodyText]);

  // Prefill the author from the account (still editable).
  useEffect(() => {
    if (user && !formData.author) {
      const guess = user.displayName || user.email?.split("@")[0] || "";
      if (guess) setFormData((prev) => (prev.author ? prev : { ...prev, author: guess }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Release the object URL when the preview changes / unmounts.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ── Data ──
  const fetchApprovedBlogs = async ({ pageParam }: { pageParam: QueryDocumentSnapshot<DocumentData> | null }) => {
    const constraints = [
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      ...(pageParam ? [startAfter(pageParam)] : []),
      limit(PAGE_SIZE),
    ];
    const snapshot = await getDocs(query(collection(db, "blogs"), ...constraints));

    const blogData: BlogPost[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        content: data.content,
        coverImageUrl: data.coverImageUrl,
        excerpt: data.excerpt,
        author: data.author,
        status: data.status,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    return {
      blogs: blogData,
      nextCursor: snapshot.docs.length === PAGE_SIZE ? snapshot.docs[snapshot.docs.length - 1] : null,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
    queryKey: ["approvedBlogs"],
    queryFn: fetchApprovedBlogs,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
  });

  const blogs = useMemo(() => data?.pages.flatMap((page) => page.blogs) ?? [], [data]);

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((b) =>
      `${b.title} ${b.author} ${b.excerpt ?? htmlToText(b.content)}`.toLowerCase().includes(q)
    );
  }, [blogs, search]);

  // ── Actions ──
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const openForm = () => {
    if (!user) {
      navigate("/login?redirect=blog");
      return;
    }
    setShowForm(true);
    // wait for the form to mount, then bring it into view
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`That image is too large — please pick one under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const closeForm = () => {
    if (isDirty && !window.confirm("Discard this draft?")) return;
    setFormData({ ...EMPTY_FORM, author: formData.author });
    removeImage();
    setShowForm(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      navigate("/login?redirect=blog");
      return;
    }

    const title = formData.title.trim();
    const author = formData.author.trim();
    if (!author) return toast.error("Please enter your name.");
    if (title.length < MIN_TITLE) return toast.error(`Give your blog a title (at least ${MIN_TITLE} characters).`);
    if (bodyText.length < MIN_BODY_CHARS) {
      return toast.error(`Your blog is a bit short — write at least ${MIN_BODY_CHARS} characters.`);
    }

    setIsSubmitting(true);
    try {
      let coverImageUrl = "";
      if (imageFile) {
        const compressed = await imageCompression(imageFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        coverImageUrl = await uploadToCloudinary(compressed, "tca_blogs");
      }

      const excerpt = bodyText.length > 150 ? bodyText.substring(0, 150).trimEnd() + "…" : bodyText;

      await addDoc(collection(db, "blogs"), {
        title,
        author,
        content: formData.content,
        coverImageUrl,
        excerpt,
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Blog submitted for approval!");
      setFormData({ ...EMPTY_FORM, author });
      removeImage();
      setShowForm(false);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      queryClient.invalidateQueries({ queryKey: ["approvedBlogs"] });
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("Failed to submit blog. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Community Blogs | The Consistent Academy"
        description="Read insights, stories, and learning experiences from the community at The Consistent Academy."
        canonical="/blog"
      />
      <Navbar />
      <div className="min-h-screen bg-neo-base overflow-x-hidden">
        <main className="pt-28 pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center mb-10"
            >
              <p className="text-neo-accent text-sm uppercase tracking-widest font-semibold mb-3">Community</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neo-fg mb-4">
                Community <span className="text-neo-accent">Blogs</span>
              </h1>
              <p className="text-neo-muted max-w-xl mx-auto">
                Share insights, stories and learning experiences ✨
              </p>
            </motion.header>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <NeumorphicButton variant="primary" onClick={openForm}>
                <PenSquare className="w-5 h-5" />
                Write a Blog
              </NeumorphicButton>

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/blogs"
                      className="inline-flex items-center justify-center gap-2.5 h-11 px-9 rounded-neo-btn neo-surface font-semibold text-neo-accent-deep transition-all hover:shadow-neo-lifted hover:-translate-y-0.5 active:neo-inset focus-visible:outline-none focus-visible:shadow-neo-focus"
                    >
                      <Shield className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <NeumorphicButton variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                    Logout
                  </NeumorphicButton>
                </>
              ) : (
                <NeumorphicButton variant="secondary" onClick={() => navigate("/login?redirect=blog")}>
                  <LogIn className="w-5 h-5" />
                  Login / Register
                </NeumorphicButton>
              )}
            </div>

            {/* Submission form */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  ref={formRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Submit your blog"
                  className="max-w-3xl mx-auto neo-surface rounded-neo-card p-8 max-sm:p-5 mb-12 space-y-6 scroll-mt-28"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-neo-fg">Submit Your Blog</h2>
                    <p className="text-sm text-neo-muted mt-1">
                      Your post is reviewed by our team before it goes live.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="blog-author" className="text-sm font-semibold text-neo-fg">
                      Your name
                    </label>
                    <input
                      id="blog-author"
                      type="text"
                      name="author"
                      placeholder="How should we credit you?"
                      value={formData.author}
                      onChange={handleInputChange}
                      maxLength={60}
                      required
                      className={fieldClass}
                    />
                  </div>

                  {/* Cover image */}
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-neo-fg">
                      Cover image <span className="font-normal text-neo-muted">(optional)</span>
                    </span>
                    {imagePreview ? (
                      <div className="relative neo-inset rounded-neo-card p-2">
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="w-full h-48 md:h-64 object-cover rounded-neo-inner"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove cover image"
                          className="absolute top-4 right-4 p-2 rounded-full neo-surface-sm text-neo-fg transition-all hover:text-neo-accent active:neo-inset-sm focus-visible:outline-none focus-visible:shadow-neo-focus"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-neo-card neo-inset text-neo-muted p-4 text-center cursor-pointer transition-shadow hover:shadow-neo-inset-deep focus-within:shadow-neo-focus">
                        <ImagePlus className="w-8 h-8 mb-2 text-neo-accent-mid" />
                        <span className="text-sm font-semibold text-neo-fg">Upload a cover image</span>
                        <span className="text-xs">JPG, PNG or WEBP · up to {MAX_IMAGE_MB} MB · auto-optimised</span>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <label htmlFor="blog-title" className="text-sm font-semibold text-neo-fg">
                        Title
                      </label>
                      <span className="text-xs text-neo-muted" aria-live="polite">
                        {formData.title.length}/{MAX_TITLE}
                      </span>
                    </div>
                    <input
                      id="blog-title"
                      type="text"
                      name="title"
                      placeholder="A headline worth clicking"
                      value={formData.title}
                      onChange={handleInputChange}
                      maxLength={MAX_TITLE}
                      required
                      className={fieldClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-neo-fg">Your story</span>
                      <span className={`text-xs ${bodyText.length >= MIN_BODY_CHARS ? "text-neo-success" : "text-neo-muted"}`} aria-live="polite">
                        {bodyText.length} characters · ~{readMinutes(formData.content)} min read
                      </span>
                    </div>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                      placeholder="Write your blog content..."
                      minHeight="260px"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <NeumorphicButton type="submit" variant="primary" disabled={isSubmitting} className="flex-1 min-w-[200px]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading…
                        </>
                      ) : (
                        "Submit for Approval"
                      )}
                    </NeumorphicButton>
                    <NeumorphicButton variant="secondary" onClick={closeForm} disabled={isSubmitting}>
                      Cancel
                    </NeumorphicButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Search */}
            {!isLoading && !isError && blogs.length > 0 && (
              <div className="max-w-xl mx-auto mb-10">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neo-muted pointer-events-none" aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search blogs by title, author or topic"
                    aria-label="Search blogs"
                    className={`${fieldClass} pl-12 rounded-full`}
                  />
                </div>
                {search.trim() && (
                  <p className="text-xs text-neo-muted text-center mt-3" aria-live="polite">
                    {filteredBlogs.length} {filteredBlogs.length === 1 ? "result" : "results"} for “{search.trim()}”
                    {hasNextPage && " in the posts loaded so far"}
                  </p>
                )}
              </div>
            )}

            {/* Grid / states */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true" aria-label="Loading blogs">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="neo-surface rounded-neo-card p-6 space-y-4 motion-safe:animate-pulse">
                    <div className="neo-inset rounded-neo-inner aspect-video" />
                    <div className="neo-inset-sm rounded-full h-5 w-4/5" />
                    <div className="neo-inset-sm rounded-full h-3 w-2/5" />
                    <div className="neo-inset-sm rounded-full h-3 w-full" />
                    <div className="neo-inset-sm rounded-full h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="max-w-md mx-auto neo-surface rounded-neo-card p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full neo-inset flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-neo-accent-mid" />
                </div>
                <h2 className="text-lg font-bold text-neo-fg mb-1">We couldn't load the blogs</h2>
                <p className="text-sm text-neo-muted mb-5">Check your connection and try again.</p>
                <NeumorphicButton variant="secondary" size="sm" onClick={() => refetch()}>
                  Try again
                </NeumorphicButton>
              </div>
            ) : blogs.length === 0 ? (
              <div className="max-w-md mx-auto neo-surface rounded-neo-card p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full neo-inset flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-neo-accent-mid" />
                </div>
                <h2 className="text-lg font-bold text-neo-fg mb-1">No approved blogs yet</h2>
                <p className="text-sm text-neo-muted">Be the first to share your story!</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="max-w-md mx-auto neo-inset rounded-neo-card p-8 text-center">
                <p className="text-neo-fg font-semibold mb-1">No matches</p>
                <p className="text-sm text-neo-muted">Try a different keyword{hasNextPage ? " or load more posts." : "."}</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog, index) => (
                    <motion.article
                      key={blog.id}
                      {...reveal({
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.1 },
                        transition: { delay: (index % 3) * 0.08, duration: 0.5 },
                      })}
                      className="group neo-surface rounded-neo-card p-6 max-sm:p-5 flex flex-col transition-all duration-300 hover:shadow-neo-lifted hover:-translate-y-0.5"
                    >
                      {blog.coverImageUrl && (
                        <div className="neo-inset rounded-neo-inner p-1.5 mb-5">
                          <img
                            src={blog.coverImageUrl}
                            alt=""
                            loading="lazy"
                            className="w-full aspect-video object-cover rounded-neo-inner"
                          />
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-neo-fg mb-3 line-clamp-2">
                        <Link
                          to={`/blog/${blog.id}`}
                          className="focus-visible:outline-none focus-visible:shadow-neo-focus rounded-md"
                        >
                          {blog.title}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neo-muted mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full neo-inset-sm">
                          <User className="w-3.5 h-3.5" /> {blog.author}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full neo-inset-sm">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {new Date(blog.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full neo-inset-sm">
                          <Clock className="w-3.5 h-3.5" /> {readMinutes(blog.content)} min
                        </span>
                      </div>

                      <p className="text-neo-muted line-clamp-4 mb-5">{blog.excerpt ? blog.excerpt : htmlToText(blog.content)}</p>

                      <Link
                        to={`/blog/${blog.id}`}
                        className="mt-auto inline-flex items-center gap-1 font-semibold text-neo-accent transition-transform group-hover:translate-x-0.5 hover:underline focus-visible:outline-none focus-visible:shadow-neo-focus rounded-md w-fit"
                      >
                        Read More →
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="flex justify-center">
                    <NeumorphicButton variant="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading more…
                        </>
                      ) : (
                        "Load More"
                      )}
                    </NeumorphicButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
