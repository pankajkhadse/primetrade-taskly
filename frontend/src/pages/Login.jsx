import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(110,231,183,.07) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(52,211,153,.05) 0%, transparent 60%)'
      }}>
      <div className="w-full max-w-md bg-surface border border-border1 rounded-2xl px-10 py-12 animate-fadeUp">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_#6ee7b7]" />
          <h1 className="font-syne text-2xl font-extrabold tracking-tight text-white">Taskly</h1>
        </div>
        <p className="text-muted text-sm mb-7">Sign in to your workspace</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-danger rounded-lg px-3.5 py-2.5 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
              className="bg-surface2 border border-border1 rounded-lg text-white text-sm px-3.5 py-2.5 outline-none placeholder:text-muted2 focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
              className="bg-surface2 border border-border1 rounded-lg text-white text-sm px-3.5 py-2.5 outline-none placeholder:text-muted2 focus:border-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-accent text-[#0a1a12] font-semibold text-sm rounded-[9px] py-2.5 mt-1 hover:bg-accent2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-[#0a1a12]/20 border-t-[#0a1a12] rounded-full animate-spin" />
              : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted text-sm">
          No account?{' '}
          <Link to="/register" className="text-accent font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
