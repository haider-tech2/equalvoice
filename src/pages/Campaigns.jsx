import { motion } from "framer-motion"
import taurus1 from "../assets/campaigns/taurus1.jpeg"
import taurus2 from "../assets/campaigns/taurus2.jpeg"
import taurus3 from "../assets/campaigns/taurus3.jpeg"

export default function Campaigns() {
  const campaign = {
    title: "Taurus School Awareness Drive",
    description:
      "A focused awareness campaign encouraging students of Taurus School to speak up about gender-based discrimination and support equality within their academic environment.",
    date: "January 2026",
    impact: {
      studentsReached: "300+",
      discussionsHeld: "12",
      feedbackForms: "85+"
    },
    images: [taurus1, taurus2, taurus3]
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0e0e0e",
        color: "#fff",
        paddingTop: "120px",
        paddingBottom: "100px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px"
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: 20 }}>
          Our Campaigns
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#ccc", lineHeight: 1.6 }}>
          Every initiative starts somewhere. This is our first step toward
          creating awareness and empowering students to stand for equality.
        </p>
      </motion.div>

      {/* Campaign Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          maxWidth: "1100px",
          margin: "80px auto",
          padding: "40px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)"
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: 15 }}>
          {campaign.title}
        </h2>

        <p style={{ color: "#ddd", lineHeight: 1.7, marginBottom: 25 }}>
          {campaign.description}
        </p>

        <div style={{ color: "#aaa", marginBottom: 40 }}>
          {campaign.date}
        </div>

        {/* Impact Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "30px",
            marginBottom: "60px"
          }}
        >
          {Object.entries(campaign.impact).map(([key, value], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "25px",
                borderRadius: 20,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {value}
              </div>
              <div style={{ color: "#bbb", marginTop: 8 }}>
                {key.replace(/([A-Z])/g, " $1")}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Gallery */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px"
          }}
        >
          {campaign.images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              style={{
                overflow: "hidden",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              <img
                src={img}
                alt={`Campaign ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Future Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        style={{
          textAlign: "center",
          marginTop: 100,
          padding: "0 20px"
        }}
      >
        <h3 style={{ fontSize: "1.8rem", marginBottom: 20 }}>
          This Is Just The Beginning
        </h3>
        <p style={{ color: "#ccc", maxWidth: "700px", margin: "0 auto" }}>
          Our mission does not stop here. We plan to expand our campaigns to
          more schools and communities to build a safer, fairer society.
        </p>
      </motion.div>
    </div>
  )
}