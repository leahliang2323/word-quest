export interface Word {
  id: string
  en: string
  phonetic: string
  pos: string
  zh: string
  bold: boolean // 教材黑体重点词
}

// 外研版八年级上册 Unit 6 When disaster strikes 词汇（教材第137—138页）
export const WORDS: Word[] = [
  { id: 'lost', en: 'lost', phonetic: '/lɒst/', pos: 'adj.', zh: '不复存在的；不再拥有的', bold: true },
  { id: 'into', en: 'into', phonetic: "/'ɪntə/", pos: 'prep.', zh: '进入，到……里面', bold: true },
  { id: 'outside', en: 'outside', phonetic: "/aʊt'saɪd/", pos: 'adv.', zh: '在室外', bold: true },
  { id: 'scared', en: 'scared', phonetic: '/skeəd/', pos: 'adj.', zh: '害怕的，恐惧的', bold: true },
  { id: 'shut', en: 'shut', phonetic: '/ʃʌt/', pos: 'v.', zh: '（使）关上，（使）关闭', bold: true },
  { id: 'shocking', en: 'shocking', phonetic: "/'ʃɒkɪŋ/", pos: 'adj.', zh: '惊人的，骇人的', bold: true },
  { id: 'coach', en: 'coach', phonetic: '/kəʊtʃ/', pos: 'n.', zh: '公共马车，四轮大马车', bold: true },
  { id: 'straight', en: 'straight', phonetic: '/streɪt/', pos: 'adv.', zh: '笔直地，成直线地', bold: true },
  { id: 'ahead', en: 'ahead', phonetic: "/ə'hed/", pos: 'adv.', zh: '向前', bold: true },
  { id: 'sand', en: 'sand', phonetic: '/sænd/', pos: 'n.', zh: '沙滩', bold: true },
  { id: 'while', en: 'while', phonetic: '/waɪl/', pos: 'conj.', zh: '当……的时候', bold: true },
  { id: 'flood', en: 'flood', phonetic: '/flʌd/', pos: 'n.', zh: '洪水，水灾', bold: true },
  { id: 'thick', en: 'thick', phonetic: '/θɪk/', pos: 'adj.', zh: '浓密的；混浊的', bold: true },
  { id: 'smoke', en: 'smoke', phonetic: '/sməʊk/', pos: 'n.', zh: '（燃烧产生的）烟', bold: false },
  { id: 'ash', en: 'ash', phonetic: '/æʃ/', pos: 'n.', zh: '灰，灰烬', bold: false },
  { id: 'shower', en: 'shower', phonetic: "/'ʃaʊə/", pos: 'n.', zh: '一大批，一阵', bold: true },
  { id: 'around', en: 'around', phonetic: "/ə'raʊnd/", pos: 'prep.', zh: '环绕，在……周围', bold: true },
  { id: 'daylight', en: 'daylight', phonetic: "/'deɪlaɪt/", pos: 'n.', zh: '日光', bold: false },
  { id: 'erupt', en: 'erupt', phonetic: "/ɪ'rʌpt/", pos: 'v.', zh: '（火山）爆发，喷发', bold: false },
  { id: 'volcano', en: 'volcano', phonetic: "/vɒl'keɪnəʊ/", pos: 'n.', zh: '火山', bold: false },
  { id: 'volcanic', en: 'volcanic', phonetic: "/vɒl'kænɪk/", pos: 'adj.', zh: '火山的', bold: false },
  { id: 'eruption', en: 'eruption', phonetic: "/ɪ'rʌpʃən/", pos: 'n.', zh: '（火山）爆发，喷发', bold: false },
  { id: 'reaction', en: 'reaction', phonetic: "/ri'ækʃən/", pos: 'n.', zh: '反应', bold: false },
  { id: 'hurricane', en: 'hurricane', phonetic: "/'hʌrɪkən/", pos: 'n.', zh: '飓风', bold: false },
  { id: 'airline', en: 'airline', phonetic: "/'eəlaɪn/", pos: 'n.', zh: '航空公司', bold: false },
  { id: 'weekday', en: 'weekday', phonetic: "/'wiːkdeɪ/", pos: 'n.', zh: '工作日', bold: true },
  { id: 'railway', en: 'railway', phonetic: "/'reɪlweɪ/", pos: 'n.', zh: '铁路，铁道', bold: true },
  { id: 'rainstorm', en: 'rainstorm', phonetic: "/'reɪnstɔːm/", pos: 'n.', zh: '暴风雨', bold: false },
  { id: 'service', en: 'service', phonetic: "/'sɜːvɪs/", pos: 'n.', zh: '交通服务，班次', bold: true },
  { id: 'search', en: 'search', phonetic: '/sɜːtʃ/', pos: 'v.', zh: '寻找，搜索，搜寻', bold: true },
  { id: 'report', en: 'report', phonetic: "/rɪ'pɔːt/", pos: 'n.', zh: '新闻报道', bold: true },
  { id: 'orchestra', en: 'orchestra', phonetic: "/'ɔːkɪstrə/", pos: 'n.', zh: '管弦乐队', bold: false },
  { id: 'terrible', en: 'terrible', phonetic: "/'terəbəl/", pos: 'adj.', zh: '剧烈的；厉害的；非常严重的', bold: true },
  { id: 'cause', en: 'cause', phonetic: '/kɔːz/', pos: 'n.', zh: '原因，起因', bold: true },
  { id: 'introduction', en: 'introduction', phonetic: "/ˌɪntrə'dʌkʃən/", pos: 'n.', zh: '引言，序言；开场白', bold: true },
  { id: 'video', en: 'video', phonetic: "/'vɪdiəʊ/", pos: 'n.', zh: '视频', bold: true },
  { id: 'tsunami', en: 'tsunami', phonetic: "/tsu'nɑːmi/", pos: 'n.', zh: '海啸', bold: false },
  { id: 'iron', en: 'iron', phonetic: "/'aɪən/", pos: 'adj./n.', zh: '极坚强的；铁', bold: false },
  { id: 'fashion', en: 'fashion', phonetic: "/'fæʃən/", pos: 'n.', zh: '时装业', bold: true },
  { id: 'slim', en: 'slim', phonetic: '/slɪm/', pos: 'adj.', zh: '苗条的，修长的', bold: true },
  { id: 'bleed', en: 'bleed', phonetic: '/bliːd/', pos: 'v.', zh: '流血，出血', bold: true },
  { id: 'uncomfortable', en: 'uncomfortable', phonetic: "/ʌn'kʌmfətəbəl/", pos: 'adj.', zh: '不舒服的', bold: true },
  { id: 'jeans', en: 'jeans', phonetic: '/dʒiːnz/', pos: 'n.', zh: '牛仔裤', bold: true },
  { id: 'shadow', en: 'shadow', phonetic: "/'ʃædəʊ/", pos: 'n.', zh: '阴影，阴暗处', bold: false },
  { id: 'encouraging', en: 'encouraging', phonetic: "/ɪn'kʌrədʒɪŋ/", pos: 'adj.', zh: '令人鼓舞的，振奋人心的', bold: true },
  { id: 'complete', en: 'complete', phonetic: "/kəm'pliːt/", pos: 'v.', zh: '（尤指经历长时间之后）结束，完成', bold: true },
  { id: 'herself', en: 'herself', phonetic: "/hɜː'self/", pos: 'pron.', zh: '她自己', bold: true },
  { id: 'survivor', en: 'survivor', phonetic: "/sə'vaɪvə/", pos: 'n.', zh: '生还者，幸存者', bold: true },
  { id: 'forward', en: 'forward', phonetic: "/'fɔːwəd/", pos: 'adv.', zh: '向将来', bold: true },
  { id: 'torch', en: 'torch', phonetic: '/tɔːtʃ/', pos: 'n.', zh: '火炬', bold: false },
  { id: 'honour', en: 'honour', phonetic: "/'ɒnə/", pos: 'n.', zh: '荣幸，光荣', bold: true },
  { id: 'brave', en: 'brave', phonetic: '/breɪv/', pos: 'adj.', zh: '勇敢的，无畏的', bold: true },
  { id: 'wound', en: 'wound', phonetic: '/wuːnd/', pos: 'n.', zh: '伤痛，伤害', bold: true },
  { id: 'pain', en: 'pain', phonetic: '/peɪn/', pos: 'n.', zh: '疼，痛，疼痛', bold: true },
  { id: 'heroine', en: 'heroine', phonetic: "/'herəʊɪn/", pos: 'n.', zh: '女主角，女主人公', bold: true },
  { id: 'victim', en: 'victim', phonetic: "/'vɪktɪm/", pos: 'n.', zh: '受害者', bold: true },
]

// 推荐词包：词汇课聚焦的灾害主题核心词（作业设计同款）
export const FOCUS_PACK = [
  'flood', 'rainstorm', 'hurricane', 'tsunami', 'eruption',
  'smoke', 'ash', 'shower', 'thick', 'shocking', 'terrible', 'scared',
  'lost', 'shut', 'outside', 'into', 'coach', 'straight', 'ahead', 'sand',
  'while', 'survivor', 'victim', 'brave', 'cause', 'encouraging', 'report', 'search', 'forward', 'daylight',
]

// 朗读闯关推荐 15 词（与作业设计 E 任务一致）
export const READ_PACK = [
  'flood', 'rainstorm', 'hurricane', 'tsunami', 'eruption', 'ash', 'shower', 'thick',
  'shocking', 'terrible', 'scared', 'survivor', 'victim', 'encouraging', 'forward',
]

export interface LevelDef {
  key: string
  name: string
  icon: string
  desc: string
}

export const LEVELS: LevelDef[] = [
  { key: 'listen', name: '第一关 · 听音辨词', icon: '🎧', desc: '听发音，选出正确的单词' },
  { key: 'phonetic', name: '第二关 · 音标达人', icon: '🔤', desc: '看音标和词义，选出正确的单词' },
  { key: 'read', name: '第三关 · 朗读挑战', icon: '🎤', desc: '大声朗读单词，AI 听音评分' },
  { key: 'use', name: '第四关 · 词义运用', icon: '⚡', desc: '看中文意思，选出正确的英文单词' },
]

export function stars(score: number): number {
  if (score >= 90) return 3
  if (score >= 75) return 2
  if (score >= 60) return 1
  return 0
}

export function grade(total: number): string {
  if (total >= 90) return 'S'
  if (total >= 80) return 'A'
  if (total >= 70) return 'B'
  if (total >= 60) return 'C'
  return 'D'
}

export function starText(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(3 - n)
}
