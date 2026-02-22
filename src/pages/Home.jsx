import { useState, useEffect } from "react"
import { db } from "../services/firebase"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  deleteDoc
} from "firebase/firestore"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { FaHeart, FaTrash, FaCheck } from "react-icons/fa"

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [commentInputs, setCommentInputs] = useState({})
  const [filter, setFilter] = useState("latest") // latest, pinned
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false)


  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPosts(fetchedPosts)
    })
    return () => unsubscribe()
  }, [])


  useEffect(() => {
    const fetchAdmin = async () => {
      if (!user) return
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setCurrentUserIsAdmin(docSnap.data().isAdmin)
      }
    }
    fetchAdmin()
  }, [user])

  const filteredPosts = posts.filter((p) =>
    filter === "pinned" ? p.pinned : true
  )

  // Add comment
  const handleAddComment = async (postId) => {
    if (!user) return
    const text = commentInputs[postId]?.trim()
    if (!text) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)
    const isAdmin = userSnap.exists() ? userSnap.data().isAdmin : false

    const postRef = doc(db, "reports", postId)
    await updateDoc(postRef, {
      comments: arrayUnion({
        text,
        username: user.displayName,
        userPhoto: user.photoURL,
        isAdmin: isAdmin,
        timestamp: new Date(),
      }),
    })

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
  }

  // Support a post
  const handleSupport = async (post) => {
    if (!user) return
    const postRef = doc(db, "reports", post.id)
    await updateDoc(postRef, {
      supporters: arrayUnion(user.uid),
    })
  }

  // Pin/unpin post (admins only)
  const togglePin = async (post) => {
    if (!currentUserIsAdmin) return
    const postRef = doc(db, "reports", post.id)
    await updateDoc(postRef, { pinned: !post.pinned })
  }

  // Mark post as resolved (admins only)
  const toggleResolved = async (post) => {
    if (!currentUserIsAdmin) return
    const postRef = doc(db, "reports", post.id)
    await updateDoc(postRef, { resolved: !post.resolved })
  }

  // Delete post (admins only)
  const deletePost = async (postId) => {
    if (!currentUserIsAdmin) return
    await deleteDoc(doc(db, "reports", postId))
  }

  // Delete comment (admins only)
  const deleteComment = async (postId, comment) => {
    if (!currentUserIsAdmin) return
    const postRef = doc(db, "reports", postId)
    await updateDoc(postRef, {
      comments: posts
        .find((p) => p.id === postId)
        .comments.filter((c) => c !== comment),
    })
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Left filter tab */}
      <div
        style={{
          position: "fixed",
          top: 100,
          left: 20,
          width: 180,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          padding: 20,
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 100,
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: 10 }}>Filters</h2>
        {["latest", "pinned"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background:
                filter === f
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.3s",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Main feed */}
      <div style={{ padding: "20px 20px 20px 240px" }}>
        <h1
          style={{
            color: "#fff",
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: 20,
          }}
        >
          EqualVoice Feed
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                borderRadius: 16,
                padding: "20px",
                boxShadow: post.pinned
                  ? "0 8px 30px rgba(255, 215, 0, 0.6)"
                  : "0 10px 30px rgba(0,0,0,0.5)",
                border: post.pinned
                  ? "1px solid gold"
                  : "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Glass shine */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-150%",
                  width: "200%",
                  height: "100%",
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                  transform: "skewX(-25deg)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
                animate={{ x: ["-150%", "150%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Post header */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={post.userPhoto}
                    alt={post.username}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 600, color: "#fff" }}>
                      {post.username}
                    </span>
                    {post.isAdmin && (
                      <span
                        style={{
                          background: "rgba(0, 255, 128, 0.2)",
                          color: "#0f0",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 6,
                          boxShadow: "0 0 6px rgba(0,255,128,0.6)",
                        }}
                      >
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Admin-only Pin/Unpin */}
                  {currentUserIsAdmin && (
                    <>
                      <button
                        onClick={() => togglePin(post)}
                        style={adminBtnStyle}
                      >
                        {post.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => toggleResolved(post)}
                        style={adminBtnStyle}
                      >
                        {post.resolved ? "Resolved" : "Resolve"}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        style={{ ...adminBtnStyle, background: "rgba(255,0,0,0.2)", color: "red" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                <h3 style={{ color: "#fff", fontSize: "1.2rem", margin: "8px 0" }}>
                  {post.title}
                </h3>
                <p style={{ color: "#eee", lineHeight: 1.6 }}>{post.description}</p>

                {/* Comments */}
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {post.comments && post.comments.length > 0 ? (
                    [
                      ...post.comments.filter((c) => c.isAdmin),
                      ...post.comments.filter((c) => !c.isAdmin),
                    ].map((c, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 10px",
                          borderRadius: 10,
                          background: c.isAdmin ? "rgba(0, 255, 128, 0.2)" : "rgba(255,255,255,0.05)",
                          border: c.isAdmin ? "1px solid rgba(0,255,128,0.6)" : "none",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        <img
                          src={c.userPhoto}
                          alt={c.username}
                          style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
                        />
                        <span style={{ fontWeight: 600, color: "#fff" }}>{c.username}</span>
                        <span style={{ color: c.isAdmin ? "#0f0" : "#aaa" }}> - {c.text}</span>
                        {currentUserIsAdmin && (
                          <button
                            onClick={() => deleteComment(post.id, c)}
                            style={{ marginLeft: "auto", color: "red", background: "transparent", border: "none", cursor: "pointer" }}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#666", fontSize: "0.9rem" }}>No comments yet</span>
                  )}
                </div>

                {/* Add comment */}
                {user && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      style={inputStyle}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddComment(post.id)
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      style={commentBtnStyle}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.3)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
                    >
                      Comment
                    </button>
                  </div>
                )}

                {/* Support button */}
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => handleSupport(post)}
                    style={supportBtnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                  >
                    <FaHeart /> {post.supporters?.length || 0}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Styles
const adminBtnStyle = {
  marginLeft: "10px",
  padding: "4px 8px",
  borderRadius: 6,
  border: "none",
  background: "rgba(255,215,0,0.2)",
  color: "gold",
  fontWeight: 600,
  cursor: "pointer",
}

const inputStyle = {
  flex: 1,
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  outline: "none",
  backdropFilter: "blur(6px)",
}

const commentBtnStyle = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "none",
  background: "rgba(255,255,255,0.2)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  backdropFilter: "blur(6px)",
  transition: "all 0.3s",
}

const supportBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 12,
  border: "none",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  backdropFilter: "blur(6px)",
  transition: "all 0.3s",
}
