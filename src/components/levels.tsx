import { useEffect, useMemo, useState } from 'react'
import { Volume2, Mic, MicOff, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Word } from '@/data/words'
import { speak, listenOnce, scoreReading, recognitionSupported } from '@/lib/speech'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickQuestions(words: Word[], count: number): Word[] {
  return shuffle(words).slice(0, Math.min(count, words.length))
}

function makeOptions(target: Word, pool: Word[]): Word[] {
  const others = shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3)
  return shuffle([target, ...others])
}

export type LevelKind = 'listen' | 'phonetic' | 'use'

interface MCQProps {
  kind: LevelKind
  words: Word[]
  onDone: (score: number) => void
}

const PER_LEVEL = 8 // 每关题数（词少时自动取全部）

/** 第一/二/四关：四选一选择题 */
export function ChoiceLevel({ kind, words, onDone }: MCQProps) {
  const questions = useMemo(() => pickQuestions(words, PER_LEVEL), [words])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)

  const q = questions[idx]
  const options = useMemo(() => makeOptions(q, words.length >= 4 ? words : [...words, ...words]), [q, words])

  // 听音关：进入每题自动播放
  useEffect(() => {
    if (kind === 'listen' && q) {
      const t = window.setTimeout(() => speak(q.en), 350)
      return () => window.clearTimeout(t)
    }
  }, [kind, q])

  if (!q) return null

  const answer = (id: string) => {
    if (picked) return
    setPicked(id)
    const ok = id === q.id
    if (ok) setCorrect((c) => c + 1)
    window.setTimeout(() => {
      if (idx + 1 >= questions.length) {
        const finalCorrect = correct + (ok ? 1 : 0)
        onDone(Math.round((finalCorrect / questions.length) * 100))
      } else {
        setIdx(idx + 1)
        setPicked(null)
      }
    }, 900)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          第 {idx + 1} / {questions.length} 题
        </span>
        <span>已答对 {correct} 题</span>
      </div>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-teal-50">
        <CardContent className="py-8 text-center space-y-3">
          {kind === 'listen' && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full"
                onClick={() => speak(q.en)}
              >
                <Volume2 className="mr-2 h-5 w-5" /> 再听一遍
              </Button>
              <p className="text-slate-500 text-sm">仔细听发音，选出你听到的单词</p>
            </>
          )}
          {kind === 'phonetic' && (
            <>
              <div className="text-3xl font-bold text-teal-700 tracking-wide">{q.phonetic}</div>
              <div className="text-slate-600">
                {q.pos} {q.zh}
              </div>
              <p className="text-slate-500 text-sm">根据音标和词义，选出正确的单词</p>
            </>
          )}
          {kind === 'use' && (
            <>
              <div className="text-2xl font-bold text-slate-800">
                {q.pos} {q.zh}
              </div>
              <p className="text-slate-500 text-sm">选出与中文意思对应的英文单词</p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {options.map((w) => {
          const isTarget = w.id === q.id
          const isPicked = picked === w.id
          let cls = 'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50'
          if (picked) {
            if (isTarget) cls = 'border-green-500 bg-green-50 text-green-800'
            else if (isPicked) cls = 'border-red-400 bg-red-50 text-red-700'
            else cls = 'border-slate-200 bg-white opacity-60'
          }
          return (
            <button
              key={w.id}
              onClick={() => answer(w.id)}
              disabled={!!picked}
              className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-lg font-semibold transition-all ${cls}`}
            >
              <span>{w.en}</span>
              {picked && isTarget && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {picked && isPicked && !isTarget && <XCircle className="h-5 w-5 text-red-500" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface ReadProps {
  words: Word[]
  onDone: (score: number) => void
}

interface Attempt {
  score: number
  heard: string | null
}

/** 第三关：朗读挑战（覆盖今日词表全部单词） */
export function ReadLevel({ words, onDone }: ReadProps) {
  const questions = useMemo(() => shuffle(words), [words])
  const [idx, setIdx] = useState(0)
  const [listening, setListening] = useState(false)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [allScores, setAllScores] = useState<number[]>([])
  const canRecognize = recognitionSupported()

  const q = questions[idx]
  if (!q) return null

  const best = attempts.length ? Math.max(...attempts.map((a) => a.score)) : null
  const triesLeft = 3 - attempts.length

  const finishWord = (score: number) => {
    const next = [...allScores, score]
    setAllScores(next)
    setAttempts([])
    if (idx + 1 >= questions.length) {
      onDone(Math.round(next.reduce((a, b) => a + b, 0) / next.length))
    } else {
      setIdx(idx + 1)
    }
  }

  const doListen = async () => {
    setListening(true)
    const r = await listenOnce()
    setListening(false)
    const s = scoreReading(q.en, r ? r.transcript : null)
    const next = [...attempts, { score: s, heard: r ? r.transcript : null }]
    setAttempts(next)
    if (s >= 85 || next.length >= 3) {
      window.setTimeout(() => finishWord(Math.max(...next.map((a) => a.score))), 1200)
    }
  }

  const selfRate = (score: number) => finishWord(score)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          第 {idx + 1} / {questions.length} 词
        </span>
        <span>每词最多 3 次，取最好成绩</span>
      </div>

      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-orange-50">
        <CardContent className="py-8 text-center space-y-2">
          <div className="text-4xl font-black text-slate-800 tracking-wide">{q.en}</div>
          <div className="text-xl text-teal-700">{q.phonetic}</div>
          <div className="text-slate-600">
            {q.pos} {q.zh}
          </div>
          <Button variant="ghost" size="sm" onClick={() => speak(q.en)}>
            <Volume2 className="mr-1 h-4 w-4" /> 播放示范发音
          </Button>
        </CardContent>
      </Card>

      {canRecognize ? (
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-lg"
            disabled={listening || triesLeft <= 0}
            onClick={doListen}
          >
            {listening ? (
              <>
                <MicOff className="mr-2 h-5 w-5 animate-pulse" /> 正在听…请大声朗读
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" /> 开始朗读（剩余 {triesLeft} 次）
              </>
            )}
          </Button>
          <p className="text-center text-xs text-slate-400">
            评分由浏览器语音识别完成，为近似参考；首次使用需允许麦克风权限
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm text-slate-500">
            当前浏览器不支持语音识别，请自评后点击：
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-teal-600 hover:bg-teal-700"
              onClick={() => selfRate(100)}
            >
              😊 我能读准
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl" onClick={() => selfRate(60)}>
              💪 还需练习
            </Button>
          </div>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">本词尝试记录</span>
            {best !== null && (
              <Badge className={best >= 85 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                最好成绩 {best} 分
              </Badge>
            )}
          </div>
          {attempts.map((a, i) => (
            <div key={i} className="flex items-center justify-between text-sm text-slate-500">
              <span>
                第 {i + 1} 次{a.heard ? `：识别为“${a.heard}”` : '：未听清'}
              </span>
              <span className="font-semibold text-slate-700">{a.score} 分</span>
            </div>
          ))}
          {triesLeft > 0 && best !== null && best < 85 && (
            <Button variant="ghost" size="sm" className="w-full" onClick={() => finishWord(best)}>
              <RotateCcw className="mr-1 h-4 w-4" /> 就按 {best} 分进入下一词
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
