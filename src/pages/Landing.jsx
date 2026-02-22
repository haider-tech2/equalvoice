import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import aboutGif from "../assets/about.gif"

const heroImages = [
  "https://images.unsplash.com/photo-1518991791759-577513e5f4d7?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80",
]

export default function Landing() {
  const { user, loginWithGoogle } = useAuth()
  const aboutRef = useRef()
  const [index, setIndex] = useState(0)

  // auto-change hero image
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: "smooth" })

  return (
    <div style={{ minHeight: "200vh", background: "#111", color: "#fff", overflowX: "hidden" }}>
      {/* Hero Section */}
      <div style={{ height: "100vh", width: "100%", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {heroImages.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`Hero ${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ))}

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: "relative", zIndex: 1, padding: "60px 20px", borderRadius: 20, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(24px)", textAlign: "center", width: "90%", maxWidth: 700, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: 20 }}>EqualVoice</h1>
          <p style={{ fontSize: "1.4rem", color: "#ddd", marginBottom: 30 }}>
            We <strong>empower people to report gender inequality</strong> and see stories from others.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <button style={buttonStyle} onClick={scrollToAbout}>Read More</button>
            <button
              onClick={!user ? loginWithGoogle : undefined}
              disabled={!!user}
              style={{ ...buttonStyle, background: user ? "rgba(200,200,200,0.25)" : "rgba(255,255,255,0.15)", color: user ? "#aaa" : "#fff", cursor: user ? "not-allowed" : "pointer" }}
            >
              {user ? "Already Logged In" : "Login with Google"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <div ref={aboutRef} style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 5%", gap: "40px", flexWrap: "wrap" }}>
        {/* Text */}
        <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ flex: "1 1 400px", minWidth: 300 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 20 }}>About EqualVoice</h2>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            We have collectively, carefully made this webapp to help the victims of daily life gender inequality while keeping these victim's identity and personal information confidential.
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            This will help empower those people who face discrimination based off their gender. We hope to bring a change in society by listening to these complaints and solving these issues!
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            People no longer have to keep such incidents to themselves but now they can confess it to the website and even if you don't want any action regarding it you can always feel lighter afterwards.
          </p>
          <p style={{ lineHeight: 1.8 }}>
            Nonetheless we aim to foster peace in society by hearing the voices of both genders and solving the discrimination issues they feel a little nervous solving on their own.
          </p>
        </motion.div>

        {/* GIF */}
        <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ flex: "1 1 400px", minWidth: 300, display: "flex", justifyContent: "center" }}>
          <img src={aboutGif} alt="About EqualVoice" style={{ maxWidth: "100%", borderRadius: 16, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }} />
        </motion.div>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: "14px 28px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  backdropFilter: "blur(6px)",
}