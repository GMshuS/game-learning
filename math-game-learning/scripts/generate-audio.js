/**
 * 生成占位音频文件（WAV 格式）
 * 由于项目缺少音频文件，使用此脚本生成简单的 WAV 占位文件
 * 
 * 运行: node scripts/generate-audio.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUDIO_DIR = path.resolve(__dirname, '..', 'public', 'audio')

// 确保目录存在
;['bgm', 'sfx'].forEach(dir => {
  const p = path.join(AUDIO_DIR, dir)
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
})

/**
 * 生成 WAV 文件缓冲区
 * @param {number} duration 时长（秒）
 * @param {number} frequency 频率（Hz）
 * @param {number} volume 音量 (0-1)
 * @param {number} sampleRate 采样率
 * @returns {Buffer}
 */
function generateWav(duration, frequency, volume = 0.3, sampleRate = 22050) {
  const numChannels = 1
  const bitsPerSample = 16
  const numSamples = Math.floor(sampleRate * duration)
  const dataSize = numSamples * numChannels * (bitsPerSample / 8)
  
  const buffer = Buffer.alloc(44 + dataSize)
  let offset = 0
  
  // RIFF header
  buffer.write('RIFF', offset); offset += 4
  buffer.writeUInt32LE(36 + dataSize, offset); offset += 4
  buffer.write('WAVE', offset); offset += 4
  
  // fmt chunk
  buffer.write('fmt ', offset); offset += 4
  buffer.writeUInt32LE(16, offset); offset += 4
  buffer.writeUInt16LE(1, offset); offset += 2      // PCM
  buffer.writeUInt16LE(numChannels, offset); offset += 2
  buffer.writeUInt32LE(sampleRate, offset); offset += 4
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), offset); offset += 4
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), offset); offset += 2
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2
  
  // data chunk
  buffer.write('data', offset); offset += 4
  buffer.writeUInt32LE(dataSize, offset); offset += 4
  
  // 生成正弦波采样
  const maxAmp = Math.floor(volume * 32767)
  // 淡入淡出（前/后 10%）
  const fadeSamples = Math.floor(numSamples * 0.1)
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    let sample = Math.sin(2 * Math.PI * frequency * t) * maxAmp
    
    // 淡入
    if (i < fadeSamples) {
      sample *= (i / fadeSamples)
    }
    // 淡出
    if (i > numSamples - fadeSamples) {
      sample *= ((numSamples - i) / fadeSamples)
    }
    
    buffer.writeInt16LE(Math.round(sample), offset)
    offset += 2
  }
  
  return buffer
}

/**
 * 生成简单的类白噪音脉冲音效
 */
function generatePulse(duration, volume = 0.5, sampleRate = 22050) {
  const numChannels = 1
  const bitsPerSample = 16
  const numSamples = Math.floor(sampleRate * duration)
  const dataSize = numSamples * numChannels * (bitsPerSample / 8)
  
  const buffer = Buffer.alloc(44 + dataSize)
  let offset = 0
  
  buffer.write('RIFF', offset); offset += 4
  buffer.writeUInt32LE(36 + dataSize, offset); offset += 4
  buffer.write('WAVE', offset); offset += 4
  
  buffer.write('fmt ', offset); offset += 4
  buffer.writeUInt32LE(16, offset); offset += 4
  buffer.writeUInt16LE(1, offset); offset += 2
  buffer.writeUInt16LE(numChannels, offset); offset += 2
  buffer.writeUInt32LE(sampleRate, offset); offset += 4
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), offset); offset += 4
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), offset); offset += 2
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2
  
  buffer.write('data', offset); offset += 4
  buffer.writeUInt32LE(dataSize, offset); offset += 4
  
  const maxAmp = Math.floor(volume * 16384)
  // 快速衰减的混合频率脉冲
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const env = Math.exp(-t * 20)  // 快速衰减包络
    const sample = (
      Math.sin(2 * Math.PI * 800 * t) * 0.5 +
      Math.sin(2 * Math.PI * 1200 * t) * 0.3 +
      Math.sin(2 * Math.PI * 1600 * t) * 0.2
    ) * maxAmp * env
    buffer.writeInt16LE(Math.round(sample), offset)
    offset += 2
  }
  
  return buffer
}

// BGM 配置
const bgmFiles = {
  'main-theme':     { duration: 5,  frequency: 440, volume: 0.25, desc: 'A4 柔和' },
  'adventure-theme': { duration: 5,  frequency: 523, volume: 0.25, desc: 'C5 明亮' },
  'battle-theme':   { duration: 5,  frequency: 587, volume: 0.30, desc: 'D5 紧张' },
  'shop-theme':     { duration: 5,  frequency: 494, volume: 0.25, desc: 'B4 轻快' },
  'victory':        { duration: 3,  frequency: 659, volume: 0.35, desc: 'E5 胜利' }
}

// SFX 配置: 不同频率和时长的脉冲
const sfxFiles = {
  'click':      { duration: 0.10, freq: 1000, desc: '短点击' },
  'hover':      { duration: 0.08, freq: 800,  desc: '悬停' },
  'open':       { duration: 0.15, freq: 600,  desc: '打开' },
  'close':      { duration: 0.12, freq: 400,  desc: '关闭' },
  'correct':    { duration: 0.25, freq: 880,  desc: '正确' },
  'wrong':      { duration: 0.30, freq: 200,  desc: '错误' },
  'submit':     { duration: 0.20, freq: 660,  desc: '提交' },
  'attack':     { duration: 0.15, freq: 150,  desc: '攻击' },
  'hit':        { duration: 0.12, freq: 300,  desc: '命中' },
  'miss':       { duration: 0.10, freq: 100,  desc: '未命中' },
  'critical':   { duration: 0.20, freq: 1200, desc: '暴击' },
  'coin':       { duration: 0.15, freq: 1400, desc: '金币' },
  'gain-exp':   { duration: 0.20, freq: 740,  desc: '获得经验' },
  'level-up':   { duration: 0.40, freq: 1047, desc: '升级' },
  'achievement':{ duration: 0.50, freq: 1319, desc: '成就解锁' },
  'buy':        { duration: 0.15, freq: 880,  desc: '购买' },
  'sell':       { duration: 0.12, freq: 440,  desc: '出售' },
  'cash':       { duration: 0.20, freq: 1100, desc: '收银' }
}

// 生成 BGM 文件
Object.entries(bgmFiles).forEach(([name, config]) => {
  const filename = `${name}.wav`
  const filepath = path.join(AUDIO_DIR, 'bgm', filename)
  const buffer = generateWav(config.duration, config.frequency, config.volume)
  fs.writeFileSync(filepath, buffer)
  console.log(`  BGM: ${filename} (${config.desc}, ${config.duration}s, ${config.frequency}Hz)`)
})

// 生成 SFX 文件
Object.entries(sfxFiles).forEach(([name, config]) => {
  const filename = `${name}.wav`
  const filepath = path.join(AUDIO_DIR, 'sfx', filename)
  const buffer = generatePulse(config.duration, 0.5)
  fs.writeFileSync(filepath, buffer)
  console.log(`  SFX: ${filename} (${config.desc}, ${config.duration}s)`)
})

console.log('\n✅ 占位音频文件生成完成！')
console.log(`   路径: ${AUDIO_DIR}`)
console.log('   注意: 需要更新 src/config/audio.js 中的文件扩展名为 .wav')
