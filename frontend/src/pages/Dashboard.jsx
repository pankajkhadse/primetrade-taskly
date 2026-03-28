import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const EMPTY = { name: '', task: '' }

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
  </svg>
)

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [tasks, setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(null)
  const [active, setActive] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')
  const [toast, setToast]   = useState('')

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/task')
      setTasks(data.tasks)
    } catch {
      showToast('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const openCreate = () => { setForm(EMPTY); setError(''); setModal('create') }
  const openEdit   = (t) => { setActive(t); setForm({ name: t.name, task: t.task }); setError(''); setModal('edit') }
  const openDelete = (t) => { setActive(t); setModal('delete') }
  const closeModal = () => { setModal(null); setActive(null); setForm(EMPTY); setError('') }

  const handleCreate = async () => {
    if (!form.name.trim() || !form.task.trim()) return setError('Both fields are required')
    setSaving(true)
    try {
      await api.post('/task', form)
      await fetchTasks(); closeModal(); showToast('Task created!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task')
    } finally { setSaving(false) }
  }

  const handleEdit = async () => {
    setSaving(true)
    try {
      await api.put(`/task/${active.id}`, form)
      await fetchTasks(); closeModal(); showToast('Task updated!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.delete(`/task/${active.id}`)
      await fetchTasks(); closeModal(); showToast('Task deleted!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task')
    } finally { setSaving(false) }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const inputCls = "w-full bg-surface2 border border-border1 rounded-lg text-white text-sm px-3.5 py-2.5 outline-none placeholder:text-muted2 focus:border-accent transition-colors resize-vertical"

  return (
    <div className="flex h-screen overflow-hidden bg-bg">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] min-w-[220px] bg-surface border-r border-border1 flex flex-col justify-between py-7 px-4">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-1.5 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_#6ee7b7]" />
            <span className="font-syne text-xl font-extrabold tracking-tight text-white">Taskly</span>
          </div>
          {/* Nav */}
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-2.5 bg-accent/10 text-accent font-medium text-sm px-3 py-2.5 rounded-[9px] w-full text-left transition-colors">
              <GridIcon /> Tasks
            </button>
          </nav>
        </div>

        <div>
          {/* User chip */}
          <div className="flex items-center gap-2.5 bg-surface2 rounded-xl px-2.5 py-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center text-[#0a1a12] text-xs font-bold font-syne flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-white truncate">{user?.name}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded w-fit mt-0.5 ${
                user?.role === 'admin'
                  ? 'bg-accent/15 text-accent'
                  : 'bg-white/5 text-muted'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted2 text-sm px-2 py-2 rounded-lg w-full hover:text-danger hover:bg-red-500/5 transition-colors"
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto scrollbar-thin px-10 py-9">

        {/* Topbar */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="font-syne text-[22px] font-bold tracking-tight text-white">My Tasks</h2>
            <p className="text-muted text-[13px] mt-0.5">{tasks.length} total task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
          
          {user?.role !== 'admin' && (
            <button onClick={openCreate} className="flex items-center gap-25 bg-accent/10 text-accent font-medium text-sm px-3 py-2.5 rounded-[9px] ">
              <PlusIcon /> New Task
            </button>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-muted">
            <span className="w-9 h-9 border-[3px] border-border1 border-t-accent rounded-full animate-spin" />
            <p className="text-sm">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-28 text-muted text-center">
            <div className="w-20 h-20 rounded-full bg-surface border border-border1 flex items-center justify-center text-muted2 mb-2">
              <ClipboardIcon />
            </div>
            <h3 className="font-syne text-lg font-bold text-white">No tasks yet</h3>
            <p className="text-sm mb-2">Create your first task to get started</p>
            <button onClick={openCreate} className="bg-accent text-[#0a1a12] font-semibold text-sm rounded-[9px] px-4 py-2.5 hover:bg-accent2 transition-colors">
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {tasks.map((t, i) => (
              <div
                key={t.id}
                className="bg-surface border border-border1 rounded-xl p-5 flex flex-col gap-2.5 hover:border-border2 hover:-translate-y-0.5 transition-all duration-200 animate-fadeUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted2 font-syne tracking-wide">
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(t)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted2 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => openDelete(t)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted2 hover:bg-red-500/10 hover:text-danger transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <h3 className="font-syne text-[15px] font-semibold text-white leading-snug">{t.name}</h3>
                <p className="text-[13px] text-muted leading-relaxed line-clamp-3 flex-1">{t.task}</p>

                {/* Card footer */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-border1">
                  {user?.role === 'admin' && t.owner_name && (
                    <span className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {t.owner_name}
                    </span>
                  )}
                  <span className="text-[11px] text-muted2 ml-auto">
                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-surface border border-border2 rounded-2xl p-8 w-full max-w-[440px] flex flex-col gap-4 animate-fadeUp mx-4"
            onClick={e => e.stopPropagation()}
          >
            {modal === 'delete' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-danger">
                  <TrashIcon />
                </div>
                <div>
                  <h3 className="font-syne text-lg font-bold text-white">Delete Task?</h3>
                  <p className="text-muted text-sm mt-1.5 leading-relaxed">
                    <span className="text-white font-medium">"{active?.name}"</span> will be permanently deleted. This cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-2.5 mt-1">
                  <button onClick={closeModal} className="border border-border2 text-muted text-sm font-medium rounded-[9px] px-5 py-2.5 hover:border-white hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="bg-danger text-[#1a0a0a] font-semibold text-sm rounded-[9px] px-5 py-2.5 hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <span className="w-4 h-4 border-2 border-[#1a0a0a]/20 border-t-[#1a0a0a] rounded-full animate-spin" /> : 'Delete'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-syne text-lg font-bold text-white">
                  {modal === 'create' ? 'New Task' : 'Edit Task'}
                </h3>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/25 text-danger rounded-lg px-3.5 py-2.5 text-sm">
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Task Name</label>
                  <input
                    placeholder="e.g. Fix login bug"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-medium text-muted uppercase tracking-wide">Description</label>
                  <textarea
                    placeholder="Describe the task..."
                    value={form.task}
                    onChange={e => setForm({ ...form, task: e.target.value })}
                    rows={4}
                    className={inputCls}
                  />
                </div>
                <div className="flex justify-end gap-2.5 mt-1">
                  <button onClick={closeModal} className="border border-border2 text-muted text-sm font-medium rounded-[9px] px-5 py-2.5 hover:border-white hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={modal === 'create' ? handleCreate : handleEdit}
                    disabled={saving}
                    className="bg-accent text-[#0a1a12] font-semibold text-sm rounded-[9px] px-5 py-2.5 hover:bg-accent2 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving
                      ? <span className="w-4 h-4 border-2 border-[#0a1a12]/20 border-t-[#0a1a12] rounded-full animate-spin" />
                      : modal === 'create' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-surface2 border border-border2 text-white text-[13px] font-medium px-5 py-3 rounded-full z-[60] animate-fadeUp shadow-2xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}
