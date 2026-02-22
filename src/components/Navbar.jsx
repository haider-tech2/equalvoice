import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { user, loginWithGoogle, logout, userData } = useAuth()
  const [expandedIdx, setExpandedIdx] = useState(null)

  const isAdmin = userData?.isAdmin ?? false

  const navItems = [
    { label: "Feed", path: "/home", options: [] },
    { label: "Create", path: "/create", options: [] },

    ...(isAdmin
      ? [
          {
            label: "Admin",
            path: "/admin",
            options: ["Reports", "Users", "Settings"]
          }
        ]
      : [])
  ]

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        width: "90%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        border: "1px solid rgba(255,255,255,0.15)"
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 24,
            color: "#fff",
            cursor: "pointer",
            letterSpacing: "1px"
          }}
        >
          EqualVoice
        </div>
      </Link>

      {/* Nav Buttons */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", position: "relative" }}>
        {navItems.map((item, idx) => (
          <div
            key={idx}
            style={{ position: "relative", zIndex: 210 }}
            onMouseEnter={() => setExpandedIdx(idx)}
            onMouseLeave={() => setExpandedIdx(null)}
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "10px 24px",
                borderRadius: 16,
                backdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                overflow: "hidden",
                color: "#fff",
                fontWeight: 600,
                position: "relative"
              }}
            >
              <Link to={item.path} style={{ textDecoration: "none", color: "#fff" }}>
                {item.label}
              </Link>

              {/* Glint Animation */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "150%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                  transform: "skewX(-20deg)"
                }}
              />
            </motion.div>

            {/* Dropdown */}
            <AnimatePresence>
              {expandedIdx === idx && item.options.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 10 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    minWidth: "140px",
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(16px)",
                    borderRadius: 16,
                    boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    overflow: "hidden",
                    zIndex: 220
                  }}
                >
                  {item.options.map((opt, i) => (
                    <Link
                      key={i}
                      to={`${item.path}/${opt.toLowerCase()}`}
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 500,
                        borderBottom:
                          i < item.options.length - 1
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "none",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {opt}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Auth Button */}
        {user ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={btnStyle}
          >
            Logout
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={loginWithGoogle}
            style={btnStyle}
          >
            Login
          </motion.button>
        )}
      </div>
    </div>
  )
}

const btnStyle = {
  padding: "12px 28px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  backdropFilter: "blur(12px)",
  position: "relative",
  overflow: "hidden"
}