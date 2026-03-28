import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone_no: '', password: '', role: 'client' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "bg-surface2 border border-border1 rounded-lg text-white text-sm px-3.5 py-2.5 outline-none placeholder:text-muted2 focus:border-accent transition-colors"

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(110,231,183,.07) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(52,211,153,.05) 0%, transparent 60%)'
      }}>
      <div className="w-full max-w-md bg-surface border border-border1 rounded-2xl px-10 py-12 animate-fadeUp">

        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_#6ee7b7]" />
          <h1 className="font-syne text-2xl font-extrabold tracking-tight text-white">Taskly</h1>
        </div>
        <p className="text-muted text-sm mb-7">Create your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-danger rounded-lg px-3.5 py-2.5 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handle} required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Phone</label>
            <input name="phone_no" placeholder="+91 9876543210" value={form.phone_no} onChange={handle} required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} required className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Role</label>
            <select name="role" value={form.role} onChange={handle} className={inputCls + " cursor-pointer"}>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-accent text-[#0a1a12] font-semibold text-sm rounded-[9px] py-2.5 mt-1 hover:bg-accent2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-[#0a1a12]/20 border-t-[#0a1a12] rounded-full animate-spin" />
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-muted text-sm">
          Have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
