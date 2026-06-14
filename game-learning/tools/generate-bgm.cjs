/**
 * 背景音乐生成器
 * 
 * 为数学游戏生成 5 首背景音乐（WAV 格式）：
 * - main-theme: 主菜单音乐（C 大调，温暖欢迎）
 * - adventure-theme: 冒险地图音乐（D Mixolydian，愉悦探索）
 * - battle-theme: 战斗音乐（E 小调，紧张激烈）
 * - shop-theme: 商店音乐（G 大调，轻松愉快）
 * - victory: 胜利音乐（C 大调，凯旋号角）
 * 
 * 用法：node tools/generate-bgm.js
 * 输出：public/audio/bgm/*.wav
 */

const fs = require('fs')
const path = require('path')

// ============================================================
// 工具函数
// ============================================================

const SAMPLE_RATE = 22050
const BITS_PER_SAMPLE = 16
const MAX_16BIT = 32767

/** 音符名 → 频率 (Hz)，A4 = 440Hz */
function noteToFreq(note) {
  const noteMap = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  }
  const match = note.match(/^([A-G]#?b?)(\d)$/)
  if (!match) return 440
  const name = match[1]
  const octave = parseInt(match[2])
  const semitone = noteMap[name]
  if (semitone === undefined) return 440
  // A4 = 440Hz = 第 69 号 MIDI 音符
  const midiNumber = (octave + 1) * 12 + semitone
  return 440 * Math.pow(2, (midiNumber - 69) / 12)
}

/** 生成纯正弦波 */
function sineWave(freq, duration, volume = 0.5) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    buf[i] = Math.sin(2 * Math.PI * freq * i / SAMPLE_RATE) * volume
  }
  return buf
}

/** 生成方波 */
function squareWave(freq, duration, volume = 0.5) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    buf[i] = (Math.sin(2 * Math.PI * freq * i / SAMPLE_RATE) >= 0 ? 1 : -1) * volume
  }
  return buf
}

/** 生成三角波 */
function triangleWave(freq, duration, volume = 0.5) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const phase = (freq * i / SAMPLE_RATE) % 1
    buf[i] = (4 * Math.abs(phase - 0.5) - 1) * volume
  }
  return buf
}

/** 生成锯齿波 */
function sawWave(freq, duration, volume = 0.5) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const phase = (freq * i / SAMPLE_RATE) % 1
    buf[i] = (2 * phase - 1) * volume
  }
  return buf
}

/** 生成白噪声 */
function whiteNoise(duration, volume = 0.3) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    buf[i] = (Math.random() * 2 - 1) * volume
  }
  return buf
}

/** 应用 ADSR 包络 */
function applyADSR(samples, attack = 0.05, decay = 0.1, sustain = 0.7, release = 0.2) {
  const len = samples.length
  const aSamples = Math.floor(attack * SAMPLE_RATE)
  const dSamples = Math.floor(decay * SAMPLE_RATE)
  const rSamples = Math.floor(release * SAMPLE_RATE)
  const sStart = aSamples + dSamples
  const rStart = len - rSamples

  for (let i = 0; i < len; i++) {
    let envelope
    if (i < aSamples) {
      // Attack: 0 → 1
      envelope = i / aSamples
    } else if (i < sStart) {
      // Decay: 1 → sustain
      envelope = 1 - (1 - sustain) * (i - aSamples) / dSamples
    } else if (i < rStart) {
      // Sustain
      envelope = sustain
    } else {
      // Release: sustain → 0
      envelope = sustain * (1 - (i - rStart) / rSamples)
    }
    samples[i] *= envelope
  }
  return samples
}

/** 安全地获取 Float32Array 的最大绝对值（避免栈溢出） */
function maxAbs(samples) {
  let max = 0
  for (let i = 0; i < samples.length; i++) {
    const abs = Math.abs(samples[i])
    if (abs > max) max = abs
  }
  return max
}

/** 统一归一化（防止削波） */
function normalize(samples, targetMax = 0.85) {
  const max = maxAbs(samples)
  if (max > 0 && max > targetMax) {
    const scale = targetMax / max
    for (let i = 0; i < samples.length; i++) {
      samples[i] *= scale
    }
  }
  return samples
}

/** 淡入淡出（用于无缝循环） */
function applyFadeInOut(samples, fadeLen = 0.05) {
  const fSamples = Math.floor(fadeLen * SAMPLE_RATE)
  const len = samples.length
  for (let i = 0; i < fSamples && i < len; i++) {
    samples[i] *= i / fSamples
  }
  for (let i = len - fSamples; i < len && i >= 0; i++) {
    samples[i] *= (len - 1 - i) / fSamples
  }
  return samples
}

/** 混合多个音频流（同步混音） */
function mix(...streams) {
  const maxLen = Math.max(...streams.map(s => s.length))
  const result = new Float32Array(maxLen)
  for (const stream of streams) {
    for (let i = 0; i < stream.length; i++) {
      result[i] += stream[i]
    }
  }
  // 软限制防止削波
  for (let i = 0; i < result.length; i++) {
    if (result[i] > 1) result[i] = 1 - (1 / (result[i] + 1))
    if (result[i] < -1) result[i] = -1 + (1 / (-result[i] + 1))
  }
  return result
}

/** 串联多个音频流 */
function concat(...streams) {
  const totalLen = streams.reduce((sum, s) => sum + s.length, 0)
  const result = new Float32Array(totalLen)
  let offset = 0
  for (const stream of streams) {
    result.set(stream, offset)
    offset += stream.length
  }
  return result
}

/** 重复音频流多次 */
function repeat(stream, times) {
  const result = new Float32Array(stream.length * times)
  for (let t = 0; t < times; t++) {
    result.set(stream, t * stream.length)
  }
  return result
}

/** 生成静音 */
function silence(duration) {
  return new Float32Array(Math.floor(SAMPLE_RATE * duration))
}

/** 生成音符（带 ADSR 包络） */
function makeNote(freq, duration, waveformFn = sineWave, volume = 0.5, adsr = null) {
  const buf = waveformFn(freq, duration, volume)
  if (adsr) {
    applyADSR(buf, adsr.attack || 0.05, adsr.decay || 0.1, adsr.sustain || 0.7, adsr.release || 0.2)
  }
  return buf
}

/** 生成和弦（多个音符同时播放） */
function makeChord(notes, duration, waveformFn = sineWave, volume = 0.3, adsr = null) {
  const streams = notes.map(note => {
    const freq = typeof note === 'string' ? noteToFreq(note) : note
    return makeNote(freq, duration, waveformFn, volume / notes.length, adsr)
  })
  return mix(...streams)
}

/** 生成简单敲击声 */
function makeClick(duration = 0.05, volume = 0.3) {
  const buf = whiteNoise(duration, volume)
  applyADSR(buf, 0.001, 0.01, 0, 0.02)
  return buf
}

/** 生成低音鼓 */
function makeKick(duration = 0.3, volume = 0.5) {
  const len = Math.floor(SAMPLE_RATE * duration)
  const buf = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE
    const freq = 150 * Math.exp(-t * 25) // 频率衰减
    buf[i] = Math.sin(2 * Math.PI * freq * t) * volume
  }
  applyADSR(buf, 0.001, 0.05, 0.3, 0.1)
  return buf
}

/** 生成小军鼓 */
function makeSnare(duration = 0.2, volume = 0.4) {
  const noise = whiteNoise(duration, volume * 0.6)
  const tone = makeNote(180, duration, sineWave, volume * 0.4, { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 })
  return mix(noise, tone)
}

/** 生成踩镲 */
function makeHihat(duration = 0.05, volume = 0.2) {
  const buf = whiteNoise(duration, volume)
  applyADSR(buf, 0.001, 0.01, 0, 0.02)
  return buf
}

/** 创建混响效果（简单梳状滤波） */
function addReverb(samples, decay = 0.3, delaySec = 0.08) {
  const delaySamples = Math.floor(delaySec * SAMPLE_RATE)
  const result = new Float32Array(samples.length + delaySamples * 4)
  result.set(samples, 0)
  for (let rep = 1; rep <= 4; rep++) {
    const gain = Math.pow(decay, rep)
    const offset = delaySamples * rep
    for (let i = 0; i < samples.length && i + offset < result.length; i++) {
      result[i + offset] += samples[i] * gain
    }
  }
  return result
}

// ============================================================
// WAV 文件写入
// ============================================================

function writeWav(filepath, samples, sampleRate = SAMPLE_RATE) {
  const numChannels = 1
  const bitsPerSample = BITS_PER_SAMPLE
  const byteRate = sampleRate * numChannels * bitsPerSample / 8
  const blockAlign = numChannels * bitsPerSample / 8
  const dataSize = samples.length * blockAlign
  const fileSize = 36 + dataSize

  const buffer = Buffer.alloc(8 + fileSize)
  let offset = 0

  // RIFF header
  buffer.write('RIFF', offset); offset += 4
  buffer.writeUInt32LE(fileSize, offset); offset += 4
  buffer.write('WAVE', offset); offset += 4

  // fmt subchunk
  buffer.write('fmt ', offset); offset += 4
  buffer.writeUInt32LE(16, offset); offset += 4           // Subchunk1Size
  buffer.writeUInt16LE(1, offset); offset += 2            // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, offset); offset += 2  // NumChannels
  buffer.writeUInt32LE(sampleRate, offset); offset += 4   // SampleRate
  buffer.writeUInt32LE(byteRate, offset); offset += 4     // ByteRate
  buffer.writeUInt16LE(blockAlign, offset); offset += 2   // BlockAlign
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2// BitsPerSample

  // data subchunk
  buffer.write('data', offset); offset += 4
  buffer.writeUInt32LE(dataSize, offset); offset += 4

  // PCM data (16-bit signed)
  for (let i = 0; i < samples.length; i++) {
    let sample = Math.max(-1, Math.min(1, samples[i]))
    const intVal = sample < 0 ? sample * MAX_16BIT : sample * (MAX_16BIT - 1)
    buffer.writeInt16LE(Math.round(intVal), offset)
    offset += 2
  }

  fs.writeFileSync(filepath, buffer)
  const duration = (samples.length / sampleRate).toFixed(1)
  console.log(`  ✓ ${path.basename(filepath)}  (${duration}s, ${(fileSize / 1024).toFixed(0)} KB)`)
}

// ============================================================
// 节奏模式生成器
// ============================================================

/**
 * 创建一个节拍层
 * @param {number} bpm - 每分钟拍数
 * @param {number} beatsPerBar - 每小节拍数 （默认 4）
 * @param {number} bars - 小节数
 * @param {object[]} pattern - 节奏模式：[{beat: 0, fn: func, vol: 0.5}, ...] beat 基于 16 分音符
 * @param {number} subdivision - 细分 (4=四分音符, 8=八分音符, 16=十六分音符)
 */
function createBeatPattern(bpm, bars, pattern, subdivision = 4) {
  const beatDur = 60 / bpm
  const subDur = beatDur / subdivision
  const totalDur = beatDur * bars
  const tracks = []

  for (const p of pattern) {
    const t = p.beat * subDur
    const dur = p.dur || subDur * 0.5
    let sound
    if (typeof p.fn === 'function') {
      sound = p.fn(dur, p.vol || 0.5)
    }
    // 重复此声音到所有模式匹配位置
    const fullTrack = new Float32Array(Math.floor(SAMPLE_RATE * totalDur))
    for (let bar = 0; bar < bars; bar++) {
      for (const p2 of pattern) {
        if (p2.fn === p.fn) {
          const offset = bar * SAMPLE_RATE * beatDur * 4 + p2.beat * subDur * SAMPLE_RATE
          const startSample = Math.floor(offset)
          const soundDur = p2.dur || subDur * 0.5
          const soundLen = Math.floor(SAMPLE_RATE * soundDur)
          const soundFn = typeof p2.fn === 'function' ? p2.fn : null
          if (soundFn) {
            const sound = soundFn(soundDur, p2.vol || 0.5)
            for (let i = 0; i < soundLen && startSample + i < fullTrack.length; i++) {
              fullTrack[startSample + i] += sound[i]
            }
          }
        }
      }
    }
    tracks.push(fullTrack)
  }
  return tracks.length > 0 ? mix(...tracks) : null
}

/**
 * 简单的节拍生成器
 */
function simpleBeat(bpm, bars, pattern16th, kickVol = 0.5, snareVol = 0.4, hihatVol = 0.15) {
  const beatDur = 60 / bpm
  const totalDur = beatDur * 4 * bars
  const totalSamples = Math.floor(SAMPLE_RATE * totalDur)
  const result = new Float32Array(totalSamples)

  for (let bar = 0; bar < bars; bar++) {
    for (let step = 0; step < 16; step++) {
      const t = (bar * 4 * beatDur) + (step * beatDur / 4)
      const samplePos = Math.floor(t * SAMPLE_RATE)
      if (samplePos >= totalSamples) break

      const instr = pattern16th[step]
      if (!instr) continue

      if (instr === 'K') {
        const kick = makeKick(beatDur / 2, kickVol)
        for (let i = 0; i < kick.length && samplePos + i < totalSamples; i++) {
          result[samplePos + i] += kick[i]
        }
      } else if (instr === 'S') {
        const snare = makeSnare(beatDur / 2, snareVol)
        for (let i = 0; i < snare.length && samplePos + i < totalSamples; i++) {
          result[samplePos + i] += snare[i]
        }
      } else if (instr === 'H') {
        const hihat = makeHihat(beatDur / 8, hihatVol)
        for (let i = 0; i < hihat.length && samplePos + i < totalSamples; i++) {
          result[samplePos + i] += hihat[i]
        }
      }
    }
  }

  // 软限制
  for (let i = 0; i < result.length; i++) {
    if (result[i] > 1) result[i] = 1 - (1 / (result[i] + 1))
    if (result[i] < -1) result[i] = -1 + (1 / (-result[i] + 1))
  }
  return result
}

// ============================================================
// 音乐生成器
// ============================================================

/**
 * 生成主菜单背景音乐
 * C 大调，100 BPM，温暖欢迎的氛围
 * 和弦：C - G/B - Am - F (I - V6 - vi - IV)
 * 结构：Intro → Verse × 2 → Loop
 */
function generateMainTheme() {
  const bpm = 100
  const beatDur = 60 / bpm
  const barDur = beatDur * 4
  const bars = 8 // 循环长度：8 小节
  const totalDur = barDur * bars
  const totalSamples = Math.floor(SAMPLE_RATE * totalDur)

  // 和弦进行（每个和弦 2 小节）
  const chords = [
    ['C3', 'E3', 'G3', 'C4'],   // C (2 小节)
    ['B2', 'D3', 'G3', 'B3'],   // G/B (2 小节)
    ['A2', 'C3', 'E3', 'A3'],   // Am (2 小节)
    ['F2', 'A3', 'C4', 'F4']    // F (2 小节)
  ]

  // 每小节使用的和弦
  const barChords = [0, 0, 1, 1, 2, 2, 3, 3]

  const bassTrack = new Float32Array(totalSamples)
  const chordTrack = new Float32Array(totalSamples)
  const arpTrack = new Float32Array(totalSamples)
  const melodyTrack = new Float32Array(totalSamples)
  const padTrack = new Float32Array(totalSamples)

  for (let bar = 0; bar < bars; bar++) {
    const chordIdx = barChords[bar]
    const chordNotes = chords[chordIdx]
    const rootNote = chordNotes[0]
    const rootFreq = noteToFreq(rootNote)
    const barStart = bar * barDur * SAMPLE_RATE
    const barStartSamples = Math.floor(barStart)

    // --- 贝斯（每拍根音，八度更低）---
    for (let beat = 0; beat < 4; beat++) {
      const noteLen = barDur / 4
      const noteStart = barStartSamples + Math.floor(beat * noteLen * SAMPLE_RATE)
      const bassNote = makeNote(rootFreq / 2, noteLen * 0.9, sineWave, 0.4,
        { attack: 0.02, decay: 0.05, sustain: 0.6, release: 0.1 })
      for (let i = 0; i < bassNote.length && noteStart + i < totalSamples; i++) {
        bassTrack[noteStart + i] += bassNote[i]
      }
    }

    // --- 和弦垫（长音和弦）---
    const chordSound = makeChord(chordNotes, barDur, triangleWave, 0.25,
      { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 })
    for (let i = 0; i < chordSound.length && barStartSamples + i < totalSamples; i++) {
      chordTrack[barStartSamples + i] += chordSound[i]
    }

    // --- 琶音（8 分音符分解和弦）---
    const arpNotes = [chordNotes[3], chordNotes[1], chordNotes[2], chordNotes[1]]
    for (let sub = 0; sub < 8; sub++) {
      const noteIdx = sub % 4
      const noteFreq = noteToFreq(arpNotes[noteIdx])
      const noteLen = barDur / 8
      const noteStart = barStartSamples + Math.floor(sub * noteLen * SAMPLE_RATE)
      const arpNote = makeNote(noteFreq, noteLen * 0.7, triangleWave, 0.15,
        { attack: 0.02, decay: 0.05, sustain: 0.5, release: 0.1 })
      for (let i = 0; i < arpNote.length && noteStart + i < totalSamples; i++) {
        arpTrack[noteStart + i] += arpNote[i]
      }
    }

    // --- 旋律（简单悦耳的主旋律，每两小节一句）---
    if (bar % 2 === 0) {
      // 第一句旋律
      const melodyPatterns = [
        // 第 1 句 (C - G/B)
        [
          { note: 'C4', dur: beatDur * 1.5 },
          { note: 'E4', dur: beatDur * 0.5 },
          { note: 'G4', dur: beatDur * 1 },
          { note: 'E4', dur: beatDur * 0.5 },
          { note: 'D4', dur: beatDur * 0.5 }
        ],
        // 第 2 句 (Am - F)
        [
          { note: 'A4', dur: beatDur * 1 },
          { note: 'G4', dur: beatDur * 0.5 },
          { note: 'E4', dur: beatDur * 1.5 },
          { note: 'F4', dur: beatDur * 0.5 },
          { note: 'G4', dur: beatDur * 0.5 }
        ],
        // 第 3 句 (C - G/B)
        [
          { note: 'C5', dur: beatDur * 0.5 },
          { note: 'B4', dur: beatDur * 0.5 },
          { note: 'G4', dur: beatDur * 1 },
          { note: 'A4', dur: beatDur * 0.5 },
          { note: 'G4', dur: beatDur * 0.5 },
          { note: 'E4', dur: beatDur * 1 }
        ],
        // 第 4 句 (Am - F)
        [
          { note: 'F4', dur: beatDur * 0.5 },
          { note: 'E4', dur: beatDur * 0.5 },
          { note: 'C4', dur: beatDur * 1.5 },
          { note: 'D4', dur: beatDur * 0.5 },
          { note: 'C4', dur: beatDur * 1 }
        ]
      ]

      const patternIdx = Math.min(Math.floor(bar / 2), melodyPatterns.length - 1)
      const pattern = melodyPatterns[patternIdx]
      let offset = 0
      for (const m of pattern) {
        const noteStart = barStartSamples + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const melNote = makeNote(freq, m.dur, squareWave, 0.12,
          { attack: 0.02, decay: 0.05, sustain: 0.4, release: 0.15 })
        for (let i = 0; i < melNote.length && noteStart + i < totalSamples; i++) {
          melodyTrack[noteStart + i] += melNote[i]
        }
        offset += m.dur
      }
    }
  }

  // ---- 节奏部分 ----
  const beatPattern = [
    'K--H', '-S-H', 'K--H', '-S-H',
    'K--H', '-S-H', 'K-H-', 'S---'
  ].join('').split('')

  const percussion = simpleBeat(bpm, bars, beatPattern, 0.35, 0.25, 0.08)

  // ---- 混合所有音轨 ----
  let final = mix(bassTrack, chordTrack, arpTrack, melodyTrack, padTrack, percussion)
  applyFadeInOut(final, 0.01) // 极小淡入淡出保证循环无咔嗒声

  // 调整总体音量
  normalize(final, 0.85)
  return final
}

/**
 * 生成冒险地图背景音乐
 * D Mixolydian，120 BPM，愉悦探索感
 * 和弦：D - C - G - D (I - VII - IV - I)
 */
function generateAdventureTheme() {
  const bpm = 120
  const beatDur = 60 / bpm
  const barDur = beatDur * 4
  const bars = 8
  const totalSamples = Math.floor(SAMPLE_RATE * barDur * bars)

  // 和弦进行
  const chords = [
    ['D2', 'F#3', 'A3', 'D4'],  // D (2 小节)
    ['C3', 'E3', 'G3', 'C4'],   // C (2 小节)
    ['G2', 'B3', 'D4', 'G4'],   // G (2 小节)
    ['D2', 'F#3', 'A3', 'D4']   // D (2 小节)
  ]
  const barChords = [0, 0, 1, 1, 2, 2, 3, 3]

  const bassTrack = new Float32Array(totalSamples)
  const chordTrack = new Float32Array(totalSamples)
  const fillTrack = new Float32Array(totalSamples)
  const melodyTrack = new Float32Array(totalSamples)
  const counterTrack = new Float32Array(totalSamples)

  // D Mixolydian 音阶 (D E F# G A B C D)
  const scaleD = ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4']

  for (let bar = 0; bar < bars; bar++) {
    const chordIdx = barChords[bar]
    const chordNotes = chords[chordIdx]
    const rootNote = chordNotes[0]
    const rootFreq = noteToFreq(rootNote)
    const barStart = Math.floor(bar * barDur * SAMPLE_RATE)

    // 贝斯（行走贝斯风格）
    const bassPattern = [0, -1, 2, 0] // 根音、五音、六音、根音
    for (let beat = 0; beat < 4; beat++) {
      const noteLen = barDur / 4
      const noteOffset = Math.floor(beat * noteLen * SAMPLE_RATE)
      const bassFreq = noteToFreq(chordNotes[0])
      // 行走贝斯，每拍不同
      let walkFreq
      if (beat === 0) {
        walkFreq = bassFreq
      } else if (beat === 2) {
        walkFreq = noteToFreq(chordNotes[2]) // 五音
      } else {
        walkFreq = bassFreq * 1.5 // 五音上方
      }
      const bassNote = makeNote(walkFreq, noteLen * 0.8, sineWave, 0.35,
        { attack: 0.01, decay: 0.05, sustain: 0.5, release: 0.1 })
      for (let i = 0; i < bassNote.length && barStart + noteOffset + i < totalSamples; i++) {
        bassTrack[barStart + noteOffset + i] += bassNote[i]
      }
    }

    // 和弦（节奏性扫弦，每两拍一次）
    for (let beat = 0; beat < 4; beat += 2) {
      const noteLen = barDur / 2
      const noteOffset = Math.floor(beat * barDur / 4 * SAMPLE_RATE)
      const chordSound = makeChord(chordNotes, noteLen * 0.9, triangleWave, 0.2,
        { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.2 })
      for (let i = 0; i < chordSound.length && barStart + noteOffset + i < totalSamples; i++) {
        chordTrack[barStart + noteOffset + i] += chordSound[i]
      }
    }

    // 旋律（明亮的冒险主题）
    if (bar % 2 === 0) {
      // 用 D Mixolydian 音阶构建旋律
      const melodyPattern = [
        { note: 'D4', dur: beatDur * 1 },
        { note: 'F#4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 0.5 },
        { note: 'A4', dur: beatDur * 1.5 },
        { note: 'G4', dur: beatDur * 0.5 },
        { note: 'F#4', dur: beatDur * 0.5 },
        { note: 'E4', dur: beatDur * 1 },
        { note: 'C4', dur: beatDur * 0.5 },
        { note: 'D4', dur: beatDur * 1.5 }
      ]
      let offset = 0
      for (const m of melodyPattern) {
        const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const melNote = makeNote(freq, m.dur, triangleWave, 0.18,
          { attack: 0.03, decay: 0.05, sustain: 0.5, release: 0.15 })
        for (let i = 0; i < melNote.length && noteStart + i < totalSamples; i++) {
          melodyTrack[noteStart + i] += melNote[i]
        }
        offset += m.dur
      }
    }

    // 装饰音（高音点缀）
    if (bar % 2 === 1) {
      const fillPattern = [
        { note: 'E5', dur: beatDur * 0.25 },
        { note: 'D5', dur: beatDur * 0.25 },
        { note: 'C5', dur: beatDur * 0.25 },
        { note: 'B4', dur: beatDur * 0.25 }
      ]
      let offset = beatDur * 2.5
      for (const m of fillPattern) {
        const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const fillNote = makeNote(freq, m.dur, sineWave, 0.08,
          { attack: 0.01, decay: 0.03, sustain: 0.3, release: 0.1 })
        for (let i = 0; i < fillNote.length && noteStart + i < totalSamples; i++) {
          counterTrack[noteStart + i] += fillNote[i]
        }
        offset += m.dur
      }
    }
  }

  // 节奏（更活跃的节拍）
  const beatPattern = [
    'K-H-', '-S-H', 'K-H-', '-S-H',
    'K---', '-S--', 'K-H-', '-S--'
  ].join('').split('')
  const percussion = simpleBeat(bpm, bars, beatPattern, 0.3, 0.2, 0.06)

  let final = mix(bassTrack, chordTrack, melodyTrack, counterTrack, fillTrack, percussion)
  applyFadeInOut(final, 0.01)
  normalize(final, 0.85)
  return final
}

/**
 * 生成战斗背景音乐
 * E 小调，140 BPM，紧张激烈
 * 和弦：Em - C - D - Em (i - VI - VII - i)
 */
function generateBattleTheme() {
  const bpm = 140
  const beatDur = 60 / bpm
  const barDur = beatDur * 4
  const bars = 8
  const totalSamples = Math.floor(SAMPLE_RATE * barDur * bars)

  // 强力和弦（只用根音和五音，更有力量感）
  const powerChords = [
    ['E2', 'B2'],      // Em power
    ['C3', 'G3'],      // C power
    ['D3', 'A3'],      // D power
    ['E2', 'B2']       // Em power
  ]
  // 全和弦
  const fullChords = [
    ['E2', 'G3', 'B3', 'E4'],  // Em
    ['C3', 'E3', 'G3', 'C4'],  // C
    ['D3', 'F#3', 'A3', 'D4'], // D
    ['E2', 'G3', 'B3', 'E4']   // Em
  ]
  const barChords = [0, 0, 1, 1, 2, 2, 3, 3]

  const bassTrack = new Float32Array(totalSamples)
  const powerChordTrack = new Float32Array(totalSamples)
  const leadTrack = new Float32Array(totalSamples)
  const accentTrack = new Float32Array(totalSamples)

  // E 小调音阶
  const scaleEm = ['E3', 'F#3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4']

  for (let bar = 0; bar < bars; bar++) {
    const chordIdx = barChords[bar]
    const pChord = powerChords[chordIdx]
    const fChord = fullChords[chordIdx]
    const rootFreq = noteToFreq(pChord[0])
    const barStart = Math.floor(bar * barDur * SAMPLE_RATE)

    // 强力贝斯（八度跳跃，更有驱动力）
    for (let beat = 0; beat < 4; beat++) {
      const noteLen = barDur / 4
      const noteOffset = Math.floor(beat * noteLen * SAMPLE_RATE)
      // 第一拍和第三拍用低八度
      const octave = (beat % 2 === 0) ? 1 : 2
      const bassFreq = rootFreq / octave
      const bassNote = makeNote(bassFreq, noteLen * 0.7, sawWave, 0.3,
        { attack: 0.01, decay: 0.05, sustain: 0.4, release: 0.05 })
      for (let i = 0; i < bassNote.length && barStart + noteOffset + i < totalSamples; i++) {
        bassTrack[barStart + noteOffset + i] += bassNote[i]
      }
    }

    // 强力和弦（每拍重击）
    for (let beat = 0; beat < 4; beat++) {
      const noteLen = barDur / 4
      const noteOffset = Math.floor(beat * noteLen * SAMPLE_RATE)
      const chordSound = makeChord(pChord, noteLen * 0.5, sawWave, 0.2,
        { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.05 })
      for (let i = 0; i < chordSound.length && barStart + noteOffset + i < totalSamples; i++) {
        powerChordTrack[barStart + noteOffset + i] += chordSound[i]
      }
    }

    // 主旋律（紧张、快速）
    if (bar % 2 === 0) {
      const melodyPattern = [
        { note: 'E4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 0.25 },
        { note: 'A4', dur: beatDur * 0.25 },
        { note: 'B4', dur: beatDur * 1 },
        { note: 'A4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 0.5 },
        { note: 'E4', dur: beatDur * 1 }
      ]
      let offset = 0
      for (const m of melodyPattern) {
        const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const melNote = makeNote(freq, m.dur, squareWave, 0.15,
          { attack: 0.01, decay: 0.05, sustain: 0.3, release: 0.1 })
        for (let i = 0; i < melNote.length && noteStart + i < totalSamples; i++) {
          leadTrack[noteStart + i] += melNote[i]
        }
        offset += m.dur
      }
    }

    // 重音装饰
    if (bar % 4 === 3) {
      for (let beat = 0; beat < 4; beat++) {
        const noteOffset = Math.floor(beat * barDur / 4 * SAMPLE_RATE)
        const crash = whiteNoise(beatDur * 0.5, 0.08)
        applyADSR(crash, 0.001, 0.05, 0.1, 0.1)
        for (let i = 0; i < crash.length && barStart + noteOffset + i < totalSamples; i++) {
          accentTrack[barStart + noteOffset + i] += crash[i]
        }
      }
    }
  }

  // 节奏（更强烈）
  const beatPattern = [
    'K--S', '-H-H', 'K--S', '-H-H',
    'K--S', '-HHH', 'K--S', '-H-H'
  ].join('').split('')
  const percussion = simpleBeat(bpm, bars, beatPattern, 0.4, 0.3, 0.1)

  let final = mix(bassTrack, powerChordTrack, leadTrack, accentTrack, percussion)
  applyFadeInOut(final, 0.01)
  normalize(final, 0.85)
  return final
}

/**
 * 生成商店背景音乐
 * G 大调，90 BPM，轻松愉快
 * 和弦：G - Em - C - D (I - vi - IV - V)
 */
function generateShopTheme() {
  const bpm = 90
  const beatDur = 60 / bpm
  const barDur = beatDur * 4
  const bars = 8
  const totalSamples = Math.floor(SAMPLE_RATE * barDur * bars)

  // 和弦进行（每个和弦 2 小节）
  const chords = [
    ['G2', 'B3', 'D4', 'G4'],   // G
    ['E3', 'G3', 'B3', 'E4'],   // Em
    ['C3', 'E3', 'G3', 'C4'],   // C
    ['D3', 'F#3', 'A3', 'D4']   // D
  ]
  const barChords = [0, 0, 1, 1, 2, 2, 3, 3]

  const bassTrack = new Float32Array(totalSamples)
  const chordTrack = new Float32Array(totalSamples)
  const arpTrack = new Float32Array(totalSamples)
  const melodyTrack = new Float32Array(totalSamples)
  const glockTrack = new Float32Array(totalSamples)

  for (let bar = 0; bar < bars; bar++) {
    const chordIdx = barChords[bar]
    const chordNotes = chords[chordIdx]
    const rootNote = chordNotes[0]
    const rootFreq = noteToFreq(rootNote)
    const barStart = Math.floor(bar * barDur * SAMPLE_RATE)

    // 贝斯（柔和，两拍一次）
    for (let beat = 0; beat < 4; beat += 2) {
      const noteLen = barDur / 2
      const noteOffset = Math.floor(beat * noteLen * SAMPLE_RATE)
      const bassNote = makeNote(rootFreq / 2, noteLen * 0.9, sineWave, 0.35,
        { attack: 0.03, decay: 0.1, sustain: 0.5, release: 0.2 })
      for (let i = 0; i < bassNote.length && barStart + noteOffset + i < totalSamples; i++) {
        bassTrack[barStart + noteOffset + i] += bassNote[i]
      }
    }

    // 和弦（轻柔地保持）
    const chordSound = makeChord(chordNotes, barDur, sineWave, 0.2,
      { attack: 0.2, decay: 0.1, sustain: 0.6, release: 0.3 })
    for (let i = 0; i < chordSound.length && barStart + i < totalSamples; i++) {
      chordTrack[barStart + i] += chordSound[i]
    }

    // 琶音（三连音风格，更流畅）
    const arpNotes = [chordNotes[3], chordNotes[1], chordNotes[2]]
    for (let eighth = 0; eighth < 8; eighth++) {
      const noteIdx = eighth % 3
      const noteFreq = noteToFreq(arpNotes[noteIdx])
      const noteLen = barDur / 8
      const noteOffset = Math.floor(eighth * noteLen * SAMPLE_RATE)
      const arpNote = makeNote(noteFreq, noteLen * 0.6, triangleWave, 0.12,
        { attack: 0.03, decay: 0.05, sustain: 0.4, release: 0.15 })
      for (let i = 0; i < arpNote.length && barStart + noteOffset + i < totalSamples; i++) {
        arpTrack[barStart + noteOffset + i] += arpNote[i]
      }
    }

    // 旋律（轻松愉快的短句）
    if (bar % 2 === 0) {
      const melodyPattern = [
        { note: 'D4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 0.5 },
        { note: 'B4', dur: beatDur * 1 },
        { note: 'A4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 0.5 },
        { note: 'E4', dur: beatDur * 1 },
        { note: 'D4', dur: beatDur * 0.5 },
        { note: 'C4', dur: beatDur * 0.5 },
        { note: 'D4', dur: beatDur * 1.5 }
      ]
      let offset = 0
      for (const m of melodyPattern) {
        const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const melNote = makeNote(freq, m.dur, squareWave, 0.1,
          { attack: 0.03, decay: 0.05, sustain: 0.3, release: 0.15 })
        for (let i = 0; i < melNote.length && noteStart + i < totalSamples; i++) {
          melodyTrack[noteStart + i] += melNote[i]
        }
        offset += m.dur
      }
    }

    // 钟琴般的高音点缀
    if (bar % 4 === 3) {
      const glockPattern = [
        { note: 'G5', dur: beatDur * 0.25 },
        { note: 'D5', dur: beatDur * 0.25 },
        { note: 'G5', dur: beatDur * 0.25 }
      ]
      let offset = beatDur * 1.5
      for (const m of glockPattern) {
        const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
        const freq = noteToFreq(m.note)
        const glNote = makeNote(freq, m.dur, sineWave, 0.06,
          { attack: 0.02, decay: 0.05, sustain: 0.2, release: 0.2 })
        for (let i = 0; i < glNote.length && noteStart + i < totalSamples; i++) {
          glockTrack[noteStart + i] += glNote[i]
        }
        offset += m.dur
      }
    }
  }

  // 节奏（轻快的爵士鼓）
  const beatPattern = [
    'K-H-', '-SH-', 'K-H-', '-SH-',
    'K-H-', '-SH-', 'K---', 'S-H-'
  ].join('').split('')
  const percussion = simpleBeat(bpm, bars, beatPattern, 0.25, 0.15, 0.05)

  let final = mix(bassTrack, chordTrack, arpTrack, melodyTrack, glockTrack, percussion)
  applyFadeInOut(final, 0.01)
  normalize(final, 0.85)
  return final
}

/**
 * 生成胜利音乐
 * C 大调，110 BPM，凯旋号角
 * 和弦：C - F - G7 - C (I - IV - V7 - I)
 * 不循环，12 秒的短促凯旋音乐
 */
function generateVictoryFanfare() {
  const bpm = 110
  const beatDur = 60 / bpm
  const barDur = beatDur * 4
  const bars = 4
  const totalSamples = Math.floor(SAMPLE_RATE * barDur * bars)

  // 凯旋和弦
  const chords = [
    ['C3', 'E3', 'G3', 'C4', 'E4'],     // C
    ['F3', 'A3', 'C4', 'F4', 'A4'],     // F
    ['G3', 'B3', 'D4', 'F4', 'G4'],     // G7
    ['C4', 'E4', 'G4', 'C5', 'E5']      // C (高八度)
  ]

  const bassTrack = new Float32Array(totalSamples)
  const chordTrack = new Float32Array(totalSamples)
  const fanfareTrack = new Float32Array(totalSamples)
  const riseTrack = new Float32Array(totalSamples)

  for (let bar = 0; bar < bars; bar++) {
    const chordNotes = chords[bar]
    const rootNote = chordNotes[0]
    const rootFreq = noteToFreq(rootNote)
    const barStart = Math.floor(bar * barDur * SAMPLE_RATE)

    // 贝斯（强力的全音符）
    const bassNote = makeNote(rootFreq / 2, barDur * 0.95, sawWave, 0.4,
      { attack: 0.02, decay: 0.05, sustain: 0.6, release: 0.2 })
    for (let i = 0; i < bassNote.length && barStart + i < totalSamples; i++) {
      bassTrack[barStart + i] += bassNote[i]
    }

    // 和弦（辉煌的全音符）
    const chordSound = makeChord(chordNotes, barDur * 0.95, triangleWave, 0.3,
      { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3 })
    for (let i = 0; i < chordSound.length && barStart + i < totalSamples; i++) {
      chordTrack[barStart + i] += chordSound[i]
    }

    // 号角旋律
    const fanfarePatterns = [
      // C - 号角主题
      [
        { note: 'C4', dur: beatDur * 0.5 },
        { note: 'E4', dur: beatDur * 0.5 },
        { note: 'G4', dur: beatDur * 1 },
        { note: 'C5', dur: beatDur * 1 },
        { note: 'G4', dur: beatDur * 1 }
      ],
      // F - 回应
      [
        { note: 'A4', dur: beatDur * 0.5 },
        { note: 'C5', dur: beatDur * 0.5 },
        { note: 'F5', dur: beatDur * 1.5 },
        { note: 'E5', dur: beatDur * 0.5 },
        { note: 'C5', dur: beatDur * 1 }
      ],
      // G7 - 紧张
      [
        { note: 'B4', dur: beatDur * 0.5 },
        { note: 'D5', dur: beatDur * 0.5 },
        { note: 'G5', dur: beatDur * 1 },
        { note: 'F5', dur: beatDur * 0.5 },
        { note: 'D5', dur: beatDur * 0.5 },
        { note: 'B4', dur: beatDur * 1 }
      ],
      // C - 解决（高八度，辉煌）
      [
        { note: 'C5', dur: beatDur * 0.5 },
        { note: 'E5', dur: beatDur * 0.5 },
        { note: 'G5', dur: beatDur * 1 },
        { note: 'C6', dur: beatDur * 1 },
        { note: 'E5', dur: beatDur * 0.5 },
        { note: 'C5', dur: beatDur * 0.5 }
      ]
    ]

    const pattern = fanfarePatterns[bar]
    let offset = 0
    for (const m of pattern) {
      const noteStart = barStart + Math.floor(offset * SAMPLE_RATE)
      const freq = noteToFreq(m.note)
      const fanNote = makeNote(freq, m.dur, squareWave, 0.2,
        { attack: 0.02, decay: 0.05, sustain: 0.5, release: 0.2 })
      for (let i = 0; i < fanNote.length && noteStart + i < totalSamples; i++) {
        fanfareTrack[noteStart + i] += fanNote[i]
      }
      offset += m.dur
    }

    // 上升琶音效果（最后一小节）
    if (bar === 3) {
      const riseNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
      for (let i = 0; i < riseNotes.length; i++) {
        const t = i * beatDur / 4
        const noteStartOffset = Math.floor(t * SAMPLE_RATE)
        const freq = noteToFreq(riseNotes[i])
        const riseNote = makeNote(freq, beatDur / 6, sineWave, 0.08,
          { attack: 0.01, decay: 0.03, sustain: 0.3, release: 0.1 })
        for (let j = 0; j < riseNote.length && barStart + noteStartOffset + j < totalSamples; j++) {
          riseTrack[barStart + noteStartOffset + j] += riseNote[j]
        }
      }
    }
  }

  // 胜利的鼓点
  const beatPattern = [
    'K--S', '-H-H', 'K--S', '-HHH',
    'K--S', '-H-H', 'K---', 'KKKS'
  ].join('').split('')
  const percussion = simpleBeat(bpm, bars, beatPattern, 0.45, 0.35, 0.12)

  let final = mix(bassTrack, chordTrack, fanfareTrack, riseTrack, percussion)
  applyFadeInOut(final, 0.02)
  normalize(final, 0.9)
  return final
}

// ============================================================
// 主函数
// ============================================================

function main() {
  const outputDir = path.resolve(__dirname, '..', 'public', 'audio', 'bgm')

  console.log('🎵 背景音乐生成器')
  console.log('─'.repeat(40))
  console.log(`采样率: ${SAMPLE_RATE} Hz`)
  console.log(`输出目录: ${outputDir}`)
  console.log('─'.repeat(40))

  // 确保输出目录存在
  fs.mkdirSync(outputDir, { recursive: true })

  // 生成并保存各曲目
  console.log('\n1. 主菜单主题 (main-theme)')
  console.log('   C 大调, 100 BPM, 温暖欢迎')
  let samples = generateMainTheme()
  writeWav(path.join(outputDir, 'main-theme.wav'), samples)

  console.log('\n2. 冒险主题 (adventure-theme)')
  console.log('   D Mixolydian, 120 BPM, 愉悦探索')
  samples = generateAdventureTheme()
  writeWav(path.join(outputDir, 'adventure-theme.wav'), samples)

  console.log('\n3. 战斗主题 (battle-theme)')
  console.log('   E 小调, 140 BPM, 紧张激烈')
  samples = generateBattleTheme()
  writeWav(path.join(outputDir, 'battle-theme.wav'), samples)

  console.log('\n4. 商店主题 (shop-theme)')
  console.log('   G 大调, 90 BPM, 轻松愉快')
  samples = generateShopTheme()
  writeWav(path.join(outputDir, 'shop-theme.wav'), samples)

  console.log('\n5. 胜利主题 (victory)')
  console.log('   C 大调, 110 BPM, 凯旋号角')
  samples = generateVictoryFanfare()
  writeWav(path.join(outputDir, 'victory.wav'), samples)

  console.log('\n' + '─'.repeat(40))
  console.log('✅ 所有背景音乐生成完成！')
  console.log(`输出目录: ${outputDir}`)
}

main()
