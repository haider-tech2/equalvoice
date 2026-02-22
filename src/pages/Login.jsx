import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [registerMode, setRegisterMode] = useState(false)

  const handleSubmit = async () => {
    try {
      if (registerMode) {
        if (!name) return alert("Enter a name")
        await register(email, password, name)
      } else {
        await login(email, password)
      }
      navigate("/")
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="container">
      <h1>{registerMode ? "Register" : "Login"}</h1>
      {registerMode && (
        <>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </>
      )}
      <label>Email</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>{registerMode ? "Register" : "Login"}</button>
      <button onClick={() => setRegisterMode(!registerMode)}>
        {registerMode ? "Switch to Login" : "Switch to Register"}
      </button>
      <hr />
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  )
}
