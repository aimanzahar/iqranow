import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

export default function Learn() {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [recognized, setRecognized] = useState('')
  const [expected, setExpected] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [flags, setFlags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      mediaRecorder?.stream.getTracks().forEach(t => t.stop())
    }
  }, [mediaRecorder])

  async function startRecording() {
    setError(null)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    chunksRef.current = []
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => setIsRecording(false)
    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
  }

  function stopRecording() {
    mediaRecorder?.stop()
  }

  async function submitRecitation() {
    try {
      setLoading(true)
      setError(null)
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const form = new FormData()
      form.append('audio', blob, 'recitation.webm')
      form.append('expectedText', expected)

      const token = localStorage.getItem('token') || ''
      const res = await axios.post('/api/recitation', form, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      })
      setRecognized(res.data.recognizedText || '')
      setScore(res.data.feedback?.score ?? null)
      setFlags(res.data.feedback?.tajweedFlags ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold">Practice Recitation</h2>
      <p className="text-white/70 mt-2">Record your recitation and receive immediate feedback.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <label className="text-sm text-white/70">Expected Verse (Arabic)</label>
          <textarea
            aria-label="Expected Quranic verse"
            className="mt-2 w-full h-32 rounded-xl bg-black/30 border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            placeholder="اِقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ"
          />

          <div className="mt-4 flex gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 rounded-lg bg-brand-500 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 rounded-lg bg-red-500 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Stop Recording
              </button>
            )}
            <button
              onClick={submitRecitation}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Get Feedback'}
            </button>
          </div>
          {error && <div className="mt-3 text-red-400" role="alert">{error}</div>}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div>
            <div className="text-sm text-white/70">Recognized Text</div>
            <div className="mt-2 min-h-24 rounded-lg bg-black/30 border border-white/10 p-3">{recognized || '—'}</div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-black/30 border border-white/10 rounded-xl p-4">
              <div className="text-sm text-white/70">Score</div>
              <div className="text-3xl font-extrabold mt-2">{score ?? '—'}{score !== null ? '%' : ''}</div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-xl p-4">
              <div className="text-sm text-white/70">Tajweed Flags</div>
              <ul className="mt-2 space-y-2">
                {flags.length === 0 && <li className="text-white/50">—</li>}
                {flags.map((f, i) => (
                  <li key={i} className="text-sm text-white/80">• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-white/60">
        Tip: Use voice commands like “Start”, “Stop”, “Submit” with your system voice assistant for hands-free.
      </div>
    </div>
  )
}
