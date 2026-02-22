import { useEffect, useState } from "react"
import { db } from "../services/firebase"
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"

export default function AdminPanel() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)


  useEffect(() => {
    if (!user) return
    const fetchAdminStatus = async () => {
      const docRef = doc(db, "users", user.uid)
      const docSnap = await docRef.get()
      if (docSnap.exists()) setIsAdmin(docSnap.data().isAdmin)
    }
    fetchAdminStatus()
  }, [user])


  useEffect(() => {
    const q = collection(db, "reports")
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [])


  const markResolved = async (post) => {
    const postRef = doc(db, "reports", post.id)
    await updateDoc(postRef, { resolved: !post.resolved })
  }


  const deletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return
    const postRef = doc(db, "reports", post.id)
    await deleteDoc(postRef)
  }

 
  const deleteComment = async (post, comment) => {
    const postRef = doc(db, "reports", post.id)
    const updatedComments = post.comments.filter((c) => c.timestamp !== comment.timestamp)
    await updateDoc(postRef, { comments: updatedComments })
  }

  if (!isAdmin)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>
        Access Denied. You are not an admin.
      </div>
    )

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#111", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Admin Panel</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              borderRadius: 16,
              padding: 20,
              position: "relative",
            }}
          >
            <h2 style={{ color: "#fff" }}>{post.title}</h2>
            <p>{post.description}</p>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button
                onClick={() => markResolved(post)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: post.resolved ? "rgba(0,255,128,0.3)" : "rgba(255,0,0,0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {post.resolved ? "Resolved" : "Mark as Resolved"}
              </button>

              <button
                onClick={() => deletePost(post)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "rgba(255,0,0,0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Delete Post
              </button>
            </div>

            {/* Comments */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {post.comments?.map((c, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.05)",
                    padding: "6px 12px",
                    borderRadius: 8,
                  }}
                >
                  <span>
                    <strong>{c.username}:</strong> {c.text}
                  </span>
                  <button
                    onClick={() => deleteComment(post, c)}
                    style={{
                      background: "rgba(255,0,0,0.2)",
                      border: "none",
                      padding: "2px 6px",
                      borderRadius: 6,
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
