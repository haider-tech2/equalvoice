import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { db } from "../services/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { motion } from "framer-motion"

export default function CreateReport() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description) {
      setError("Please fill in all fields")
      return
    }
    if (!user) {
      setError("You must be logged in to post")
      return
    }

    setLoading(true)
    setError("")
    try {
      await addDoc(collection(db, "reports"), {
        title,
        description,
        userId: user.uid,
        username: user.displayName,
        userPhoto: user.photoURL,
        pinned: false,
        timestamp: serverTimestamp(),
      })
      setTitle("")
      setDescription("")
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError("Failed to submit post")
    }
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 20px",
        background: "#111",
        overflowX: "hidden", 
        boxSizing: "border-box", 
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          padding: "40px",
          borderRadius: 20,
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          color: "#fff",
          boxSizing: "border-box", 
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: 20, textAlign: "center" }}>Post</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: "100%", 
          }}
        >
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "1rem",
              outline: "none",
              backdropFilter: "blur(6px)",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          <label style={{ fontSize: "1.1rem", fontWeight: 500 }}>
            Explain the event: where, how, and why it happened
          </label>
          <textarea
            placeholder="Describe what happened, where it took place, how it happened, and why..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: "1rem",
              outline: "none",
              backdropFilter: "blur(6px)",
              resize: "vertical",
              width: "100%",
              boxSizing: "border-box",
            }}
          />

          {error && <p style={{ color: "#ff5555" }}>{error}</p>}
          {success && <p style={{ color: "#55ff55" }}>Post submitted successfully!</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              backdropFilter: "blur(6px)",
              transition: "all 0.3s ease",
              width: "100%",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
