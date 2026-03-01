import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";


interface BlogPost {
  id: string;
  [key: string]: unknown;
}

export const useFetchApprovedBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "blogs"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogPost[];

        setBlogs(data);

      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedBlogs();
  }, []);

  return { blogs, loading };
};