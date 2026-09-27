// 语音工具：TTS 发音 + 浏览器语音识别评分
// 说明：评分基于浏览器 SpeechRecognition（如可用），属于“识别文本比对”的模拟评分，
// 并非真正的 AI 音素级口语评测；不支持的浏览器会自动降级为学生自评。

export function speak(text: string, rate = 0.85): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

export function ttsSupported(): boolean {
  return 'speechSynthesis' in window
}

interface SRResult {
  transcript: string
  confidence: number
}

type SpeechRecognitionCtor = new () => {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: unknown) => void) | null
  onerror: ((e: unknown) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

export function recognitionSupported(): boolean {
  const w = window as unknown as Record<string, unknown>
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
}

function getCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as SpeechRecognitionCtor | null
}

/**
 * 识别一次朗读（约 6 秒窗口）。resolve 出最佳识别文本；失败/无声 resolve null。
 */
export function listenOnce(): Promise<SRResult | null> {
  return new Promise((resolve) => {
    const Ctor = getCtor()
    if (!Ctor) {
      resolve(null)
      return
    }
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 3
    let done = false
    let best: SRResult | null = null
    const finish = () => {
      if (done) return
      done = true
      resolve(best)
    }
    rec.onresult = (e: unknown) => {
      const ev = e as { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }
      const alts = ev.results[0]
      if (alts && alts.length > 0) {
        // 取置信度最高的候选
        let top = alts[0]
        for (let i = 1; i < alts.length; i++) {
          if (alts[i].confidence > top.confidence) top = alts[i]
        }
        best = { transcript: top.transcript, confidence: top.confidence }
      }
    }
    rec.onerror = () => finish()
    rec.onend = () => finish()
    try {
      rec.start()
    } catch {
      finish()
    }
    // 兜底 8 秒强制结束
    window.setTimeout(() => {
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
      window.setTimeout(finish, 500)
    }, 8000)
  })
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
}

/**
 * 朗读评分：识别文本与目标词比对。
 * 完全一致 100；目标词出现在识别文本中（或反之）85；编辑距离很近 70；否则 50。
 */
export function scoreReading(target: string, transcript: string | null): number {
  if (!transcript) return 50
  const t = normalize(target)
  const heard = normalize(transcript)
  if (!heard) return 50
  const words = heard.split(/\s+/)
  if (words.includes(t)) return 100
  if (heard.includes(t) || t.includes(heard)) return 85
  if (levenshtein(t, heard) <= 1) return 70
  return 50
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return dp[n]
}
