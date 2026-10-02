import { useEffect, useState } from 'react'

export interface Field<T> { key: keyof T & string; label: string; type?: 'text' | 'number' | 'email' }
interface Props<T extends { id: number }> {
  title: string
  fields: Field<T>[]
  load: () => Promise<T[]>
  create: (d: Omit<T, 'id'>) => Promise<unknown>
  extraCols?: { label: string; value: (r: T) => string }[]
}

export default function Crud<T extends { id: number }>({ title, fields, load, create, extraCols = [] }: Props<T>) {
  const [rows, setRows] = useState<T[]>([])
  const [form, setForm] = useState<Record<string, string>>({})
  const [q, setQ] = useState('')
  const refresh = () => load().then(setRows)
  useEffect(() => { refresh() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const d: Record<string, unknown> = {}
    fields.forEach(f => { d[f.key] = f.type === 'number' ? Number(form[f.key] || 0) : form[f.key] || '' })
    await create(d as Omit<T, 'id'>)
    setForm({}); refresh()
  }
  const shown = rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))

  return (
    <section>
      <h1>{title}</h1>
      <form className="card form" onSubmit={submit}>
        {fields.map(f => (
          <label key={f.key}>{f.label}
            <input required type={f.type ?? 'text'} value={form[f.key] ?? ''}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
          </label>
        ))}
        <button className="primary">Guardar</button>
      </form>
      <input className="search" placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="card tablewrap">
        <table>
          <thead><tr>{fields.map(f => <th key={f.key}>{f.label}</th>)}{extraCols.map(x => <th key={x.label}>{x.label}</th>)}</tr></thead>
          <tbody>
            {shown.map(r => <tr key={r.id}>{fields.map(f => <td key={f.key}>{String(r[f.key])}</td>)}{extraCols.map(x => <td key={x.label}>{x.value(r)}</td>)}</tr>)}
            {!shown.length && <tr><td colSpan={fields.length + extraCols.length} className="empty">Sin registros. Agrega el primero arriba.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
