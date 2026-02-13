'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { motion } from 'framer-motion'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Restore session
  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    }

    restoreSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
        if (!session) setBookmarks([])
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setBookmarks(data)
  }

  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user])

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return

    const { data } = await supabase
      .from('bookmarks')
      .insert([
        {
          title: title.trim(),
          url: url.trim(),
          user_id: user?.id,
        },
      ])
      .select()

    if (data) setBookmarks((prev) => [data[0], ...prev])

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    if (!window.confirm('Delete this bookmark?')) return
    await supabase.from('bookmarks').delete().eq('id', id)
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  const updateBookmark = async (id: string) => {
    await supabase
      .from('bookmarks')
      .update({
        title: editTitle,
        url: editUrl,
      })
      .eq('id', id)

    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, title: editTitle, url: editUrl } : b
      )
    )

    setEditingId(null)
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading) return <div className="p-10 text-center">Loading...</div>

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="bg-black text-white px-8 py-4 rounded-xl"
        >
          Login with Google
        </button>
      </div>
    )

  return (
    <div
      className={`min-h-screen transition ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <div className="max-w-3xl mx-auto py-12 px-4">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">🚀 Smart Bookmarks</h1>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-white text-black px-3 py-1 rounded-lg text-sm"
              >
                {darkMode ? '☀ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Add */}
        <div className="flex flex-col gap-3 mb-8">
          <input
            className="p-3 rounded-lg border"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-3 rounded-lg border"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={addBookmark}
            className="bg-black text-white py-3 rounded-lg"
          >
            Add Bookmark
          </button>
        </div>

        {/* Search */}
        <input
          className="p-3 rounded-lg border w-full mb-8"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* List */}
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => {
            const favicon = `https://www.google.com/s2/favicons?domain=${bookmark.url}`

            return (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
              >
                {editingId === bookmark.id ? (
                  <div className="flex flex-col gap-3">
                    <input
                      className="border p-2 rounded"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                      className="border p-2 rounded"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateBookmark(bookmark.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={favicon} alt="favicon" />
                      <div>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold hover:text-blue-500"
                        >
                          {bookmark.title}
                        </a>
                        <div className="text-xs opacity-60">
                          {new Date(
                            bookmark.created_at
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(bookmark.url)}
                        className="text-purple-500"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(bookmark.id)
                          setEditTitle(bookmark.title)
                          setEditUrl(bookmark.url)
                        }}
                        className="text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBookmark(bookmark.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
