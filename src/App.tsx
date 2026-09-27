import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Copy, Download, Play, Settings2, Trash2, Trophy, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FOCUS_PACK, LEVELS, READ_PACK, WORDS, grade, starText, stars } from '@/data/words'
import type { Word } from '@/data/words'
import { ChoiceLevel, ReadLevel } from '@/components/levels'
import { speak } from '@/lib/speech'

type Screen = 'home' | 'name' | 'play' | 'result' | 'board' | 'teacher'

interface Record_ {
  name: string
  date: string
  scores: number[]
  total: number
  grade: string
  wordCount: number
}

const SETTINGS_KEY = 'wq-settings'
const RECORDS_KEY = 'wq-records'

function loadSelected(): string[] {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const ids = JSON.parse(raw) as string[]
      const valid = ids.filter((id) => WORDS.some((w) => w.id === id))
      if (valid.length >= 4) return valid
    }
  } catch {
    /* ignore */
  }
  return [...READ_PACK]
}

function loadRecords(): Record_[] {
  try {
    return (JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]') as Record_[]) || []
  } catch {
    return []
  }
}

const GRADE_COLOR: Record<string, string> = {
  S: 'bg-amber-100 text-amber-700 border-amber-300',
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-teal-100 text-teal-700 border-teal-300',
  C: 'bg-blue-100 text-blue-700 border-blue-300',
  D: 'bg-slate-100 text-slate-600 border-slate-300',
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>(loadSelected)
  const [levelIdx, setLevelIdx] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [records, setRecords] = useState<Record_[]>(loadRecords)
  const [saved, setSaved] = useState(false)
  const [tip, setTip] = useState('')

  const words = useMemo(
    () => WORDS.filter((w) => selectedIds.includes(w.id)),
    [selectedIds]
  )

  // 支持分享链接：网址带 #words=flood,ash,... 时自动套用该词表
  useEffect(() => {
    const m = window.location.hash.match(/words=([a-z,]+)/)
    if (m) {
      const ids = m[1].split(',').filter((id) => WORDS.some((w) => w.id === id))
      if (ids.length >= 4) {
        setSelectedIds(ids)
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(ids))
      }
    }
  }, [])

  const total = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const startQuest = () => {
    if (!name.trim()) return
    setScores([])
    setLevelIdx(0)
    setSaved(false)
    setScreen('play')
  }

  const levelDone = (score: number) => {
    const next = [...scores, score]
    setScores(next)
    if (levelIdx + 1 >= LEVELS.length) {
      setScreen('result')
    } else {
      setLevelIdx(levelIdx + 1)
    }
  }

  const saveRecord = () => {
    const rec: Record_ = {
      name: name.trim(),
      date: new Date().toLocaleString('zh-CN', { hour12: false }),
      scores,
      total,
      grade: grade(total),
      wordCount: words.length,
    }
    const next = [rec, ...records]
    setRecords(next)
    localStorage.setItem(RECORDS_KEY, JSON.stringify(next))
    setSaved(true)
  }

  const exportCsv = () => {
    const header = '姓名,时间,第一关听音辨词,第二关音标达人,第三关朗读挑战,第四关词义运用,总评,等级,词数'
    const lines = records.map((r) =>
      [r.name, r.date, ...r.scores, r.total, r.grade, r.wordCount].join(',')
    )
    const blob = new Blob(['﻿' + [header, ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `单词闯关打卡记录_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const clearRecords = () => {
    if (!window.confirm('确定清空全部打卡记录吗？此操作不可恢复。')) return
    setRecords([])
    localStorage.removeItem(RECORDS_KEY)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-teal-50">
      <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            className="flex items-center gap-2 font-bold text-slate-800 whitespace-nowrap"
            onClick={() => setScreen('home')}
          >
            <span className="text-2xl">🌪️</span>
            <span>
              单词闯关 <span className="text-orange-500">Unit 6</span>
              <span className="ml-2 hidden text-xs font-normal text-slate-400 sm:inline">
                When disaster strikes
              </span>
            </span>
          </button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setScreen('board')}>
              <Trophy className="mr-1 h-4 w-4" /> 打卡榜
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScreen(screen === 'teacher' ? 'home' : 'teacher')}
            >
              <Settings2 className="mr-1 h-4 w-4" /> 我是老师
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {screen === 'home' && (
          <Home words={words} onStart={() => setScreen('name')} />
        )}

        {screen === 'name' && (
          <Card className="mx-auto max-w-md border-orange-200">
            <CardHeader>
              <CardTitle className="text-center">闯关前，写下你的名字</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="姓名（会出现在打卡榜上）"
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startQuest()}
                className="text-center text-lg"
              />
              <Button
                className="w-full rounded-xl bg-orange-500 text-lg hover:bg-orange-600"
                size="lg"
                disabled={!name.trim()}
                onClick={startQuest}
              >
                <Play className="mr-2 h-5 w-5" /> 开始闯关（共 4 关）
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setScreen('home')}>
                <ArrowLeft className="mr-1 h-4 w-4" /> 返回
              </Button>
            </CardContent>
          </Card>
        )}

        {screen === 'play' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  {LEVELS[levelIdx].icon} {LEVELS[levelIdx].name}
                </h2>
                <Badge variant="outline" className="border-teal-300 text-teal-700">
                  {name}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">{LEVELS[levelIdx].desc}</p>
              <div className="flex items-center gap-3">
                <Progress value={(levelIdx / LEVELS.length) * 100} className="h-2 flex-1" />
                <span className="text-xs text-slate-400">
                  {levelIdx + 1} / {LEVELS.length}
                </span>
              </div>
              {scores.length > 0 && (
                <div className="flex gap-2">
                  {scores.map((s, i) => (
                    <Badge key={i} variant="outline" className="border-orange-300 text-orange-600">
                      第{i + 1}关 {starText(stars(s))}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {LEVELS[levelIdx].key === 'read' ? (
              <ReadLevel key={levelIdx} words={words} onDone={levelDone} />
            ) : (
              <ChoiceLevel
                key={levelIdx}
                kind={LEVELS[levelIdx].key as 'listen' | 'phonetic' | 'use'}
                words={words}
                onDone={levelDone}
              />
            )}
          </div>
        )}

        {screen === 'result' && (
          <div className="mx-auto max-w-md space-y-5">
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-center">
              <CardContent className="space-y-4 py-8">
                <div className="text-5xl">🏆</div>
                <div className="text-lg text-slate-600">{name}，闯关完成！</div>
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 text-4xl font-black ${GRADE_COLOR[grade(total)]}`}
                >
                  {grade(total)}
                </div>
                <div className="text-3xl font-black text-slate-800">{total} 分</div>
                <div className="space-y-1 text-sm text-slate-600">
                  {LEVELS.map((l, i) => (
                    <div key={l.key} className="flex justify-between px-8">
                      <span>
                        {l.icon} {l.name.split('· ')[1]}
                      </span>
                      <span className="font-semibold">
                        {scores[i]} 分 {starText(stars(scores[i]))}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="rounded-xl bg-teal-600 hover:bg-teal-700"
                size="lg"
                disabled={saved}
                onClick={saveRecord}
              >
                {saved ? '✓ 已打卡' : '保存打卡记录'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={() => {
                  setScores([])
                  setLevelIdx(0)
                  setSaved(false)
                  setScreen('play')
                }}
              >
                再闯一次
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={() => setScreen('home')}>
              回到首页
            </Button>
          </div>
        )}

        {screen === 'board' && (
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>🏅 打卡榜（{records.length} 条）</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportCsv} disabled={!records.length}>
                  <Download className="mr-1 h-4 w-4" /> 导出 CSV
                </Button>
                <Button variant="ghost" size="sm" onClick={clearRecords} disabled={!records.length}>
                  <Trash2 className="mr-1 h-4 w-4" /> 清空
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="py-10 text-center text-slate-400">
                  还没有打卡记录，成为第一个闯关的人吧！
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>时间</TableHead>
                      <TableHead className="text-center">听音</TableHead>
                      <TableHead className="text-center">音标</TableHead>
                      <TableHead className="text-center">朗读</TableHead>
                      <TableHead className="text-center">运用</TableHead>
                      <TableHead className="text-center">总评</TableHead>
                      <TableHead className="text-center">等级</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-semibold">{r.name}</TableCell>
                        <TableCell className="text-xs text-slate-500">{r.date}</TableCell>
                        {r.scores.map((s, j) => (
                          <TableCell key={j} className="text-center">
                            {s}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold">{r.total}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={GRADE_COLOR[r.grade]}>{r.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <p className="mt-3 text-xs text-slate-400">
                记录保存在本机浏览器（localStorage），导出 CSV 可用 Excel 打开汇总全班成绩。
              </p>
            </CardContent>
          </Card>
        )}

        {screen === 'teacher' && (
          <TeacherPanel
            selectedIds={selectedIds}
            onSave={(ids) => {
              setSelectedIds(ids)
              localStorage.setItem(SETTINGS_KEY, JSON.stringify(ids))
              setTip(`✓ 已保存今日词表（${ids.length} 词），学生端立即生效`)
              window.setTimeout(() => setTip(''), 3000)
            }}
            tip={tip}
          />
        )}
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400">
        外研版八年级上册 Unit 6 When disaster strikes · 单词闯关打卡 · 数据仅存于本机浏览器
      </footer>
    </div>
  )
}

function Home({ words, onStart }: { words: Word[]; onStart: () => void }) {
  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-gradient-to-br from-orange-100 via-white to-teal-100">
        <CardContent className="space-y-4 py-10 text-center">
          <div className="text-5xl">🌪️🔥🌊</div>
          <h1 className="text-3xl font-black text-slate-800">
            单词闯关 <span className="text-orange-500">Unit 6</span>
          </h1>
          <p className="text-slate-500">When disaster strikes · 今日词表 {words.length} 词 · 4 关</p>
          <div className="mx-auto grid max-w-lg grid-cols-2 gap-2 text-left text-sm">
            {LEVELS.map((l) => (
              <div key={l.key} className="rounded-lg bg-white/70 px-3 py-2 text-slate-600">
                {l.icon} {l.name.split('· ')[1]}
              </div>
            ))}
          </div>
          <Button
            size="lg"
            className="rounded-full bg-orange-500 px-10 text-lg hover:bg-orange-600"
            onClick={onStart}
          >
            <Play className="mr-2 h-5 w-5" /> 开始闯关
          </Button>
          <p className="text-xs text-slate-400">
            评分规则：每关 100 分制；≥90 ★★★，≥75 ★★，≥60 ★；总评 S/A/B/C/D
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📖 今日词表（点单词听发音）</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {words.map((w) => (
            <button
              key={w.id}
              onClick={() => speak(w.en)}
              title={`${w.phonetic} ${w.pos} ${w.zh}`}
              className="group flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-800 transition hover:bg-teal-100"
            >
              <span className={w.bold ? 'font-bold' : ''}>{w.en}</span>
              <Volume2 className="h-3 w-3 opacity-0 transition group-hover:opacity-60" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function TeacherPanel({
  selectedIds,
  onSave,
  tip,
}: {
  selectedIds: string[]
  onSave: (ids: string[]) => void
  tip: string
}) {
  const [ids, setIds] = useState<string[]>(selectedIds)
  const [copied, setCopied] = useState(false)
  useEffect(() => setIds(selectedIds), [selectedIds])

  const toggle = (id: string) =>
    setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const copyShareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#words=${ids.join(',')}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 3000)
    } catch {
      window.prompt('复制这个分享链接（词表已包含在网址里）：', url)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>🛠️ 教师设置 · 今日过关词表</span>
            <span className="text-sm font-normal text-slate-500">已选 {ids.length} 词</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setIds([...FOCUS_PACK])}>
              词汇课聚焦词包（{FOCUS_PACK.length} 词）
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIds([...READ_PACK])}>
              朗读打卡词包（{READ_PACK.length} 词）
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIds(WORDS.map((w) => w.id))}>
              全选（{WORDS.length} 词）
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIds([])}>
              清空
            </Button>
          </div>

          <div className="grid max-h-96 grid-cols-2 gap-1 overflow-y-auto rounded-xl border border-slate-200 p-3 sm:grid-cols-3">
            {WORDS.map((w) => (
              <label
                key={w.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-orange-50"
              >
                <Checkbox checked={ids.includes(w.id)} onCheckedChange={() => toggle(w.id)} />
                <span className={w.bold ? 'font-bold text-slate-800' : 'text-slate-600'}>
                  {w.en}
                </span>
                <span className="truncate text-xs text-slate-400">{w.zh}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400">加粗为教材黑体重点词（必须掌握、会背会用会拼）</p>

          <Button
            className="w-full rounded-xl bg-teal-600 hover:bg-teal-700"
            disabled={ids.length < 4}
            onClick={() => onSave(ids)}
          >
            保存今日词表{ids.length < 4 ? '（至少选 4 词）' : ''}
          </Button>
          {tip && <p className="text-center text-sm font-semibold text-teal-600">{tip}</p>}

          <Button
            variant="outline"
            className="w-full rounded-xl border-orange-300 text-orange-600 hover:bg-orange-50"
            disabled={ids.length < 4}
            onClick={copyShareLink}
          >
            <Copy className="mr-2 h-4 w-4" /> 复制分享链接（词表已包含在网址里）
          </Button>
          {copied && (
            <p className="text-center text-sm font-semibold text-orange-600">
              ✓ 链接已复制，发给同事或学生即可，打开后自动套用这份词表
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="py-4 text-sm text-slate-500">
          💡 使用建议：课前选好今日词表并保存 → 学生回家打开本页闯关 → 结果页点「保存打卡记录」→
          老师在「打卡榜」查看并导出 CSV 汇总。
        </CardContent>
      </Card>
    </div>
  )
}
