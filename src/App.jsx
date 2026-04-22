import { useState, useRef, useEffect } from 'react'

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book', done: false },
    { id: 2, text: 'Go for a walk', done: true },
    { id: 3, text: 'Write some code', done: false },
  ])
  const [input, setInput] = useState('')
  const [inputDate, setInputDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const editInputRef = useRef(null)

  // Focus the edit input whenever editingId changes
  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus()
    }
  }, [editingId])

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([
      ...todos,
      { id: Date.now(), text, done: false, dueDate: inputDate || undefined },
    ])
    setInput('')
    setInputDate('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  // Enter edit mode on double-click
  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditDueDate(todo.dueDate || '')
  }

  // Save: empty text → delete; otherwise update
  const saveEdit = (id) => {
    const trimmed = editText.trim()
    if (!trimmed) {
      deleteTodo(id)
    } else {
      setTodos(
        todos.map((t) =>
          t.id === id
            ? { ...t, text: trimmed, dueDate: editDueDate || undefined }
            : t,
        ),
      )
    }
    setEditingId(null)
    setEditText('')
    setEditDueDate('')
  }

  // Cancel: restore original text
  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditDueDate('')
  }

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') saveEdit(id)
    if (e.key === 'Escape') cancelEdit()
  }

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="New todo"
          />
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="New todo due date"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={tabClass(f)}
              aria-pressed={filter === f}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              {editingId === todo.id ? (
                // ── Edit mode ──────────────────────────────────────────────
                <div
                  className="flex-1 flex flex-col gap-2"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      saveEdit(todo.id)
                    }
                  }}
                >
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    className="w-full px-2 py-0.5 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    aria-label="Edit todo"
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full sm:w-40 px-2 py-0.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    aria-label="Edit todo due date"
                  />
                </div>
              ) : (
                // ── View mode ──────────────────────────────────────────────
                <button
                  onClick={() => toggleTodo(todo.id)}
                  onDoubleClick={() => startEdit(todo)}
                  className={`flex-1 text-left ${
                    todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                  title="Double-click to edit"
                >
                  <span>{todo.text}</span>
                  {todo.dueDate && (
                    <span className="ml-2 text-sm text-slate-500">
                      Due {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </button>
              )}

              {editingId === todo.id ? (
                // Cancel button shown during edit
                <button
                  onMouseDown={(e) => {
                    // prevent the input's onBlur from firing first
                    e.preventDefault()
                    cancelEdit()
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm px-2"
                  aria-label="Cancel edit"
                >
                  Esc
                </button>
              ) : (
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-500 text-lg font-bold px-2"
                  aria-label="Delete todo"
                >
                  ×
                </button>
              )}
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
          {editingId && (
            <span className="ml-2 text-indigo-400">
              · Enter to save · Esc to cancel
            </span>
          )}
        </div>
      </div>
    </div>
  )
}