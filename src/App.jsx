import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import CreateReport from "./pages/CreateReport"
import AdminPanel from "./pages/AdminPanel"
import Navbar from "./components/Navbar"
import { useAuth } from "./context/AuthContext"
import Campaigns from "./pages/Campaigns"

export default function App() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={user ? <Home /> : <Landing />} />
        <Route path="/create" element={user ? <CreateReport /> : <Landing />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Landing />} />
      </Routes>
    </>
  )
}
