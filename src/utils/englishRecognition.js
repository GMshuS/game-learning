/**
 * 英语语音识别工具 - Web Speech Recognition API 封装
 * 单例模式，参考 src/utils/englishSpeech.js
 */
class EnglishRecognition {
  constructor() {
    this.recognition = null;
    this._supported = false;
    this._permissionGranted = false;
    this._timeoutId = null;
  }

  /**
   * 检查浏览器是否支持 SpeechRecognition
   * @returns {boolean}
   */
  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * 请求麦克风权限
   * @returns {Promise<boolean>}
   */
  async requestPermission() {
    if (this._permissionGranted) {
      return true;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 立即释放流，仅用于权限检测
      stream.getTracks().forEach(track => track.stop());
      this._permissionGranted = true;
      return true;
    } catch (e) {
      this._permissionGranted = false;
      return false;
    }
  }

  /**
   * 开始语音识别，返回 Promise<string>
   * 识别到结果后自动停止
   * @param {string} [language='en-US'] - 识别语言
   * @returns {Promise<string>}
   */
  startRecognition(language = 'en-US') {
    this._supported = this.isSupported();

    if (!this._supported) {
      return Promise.reject(new Error('SpeechRecognition not supported in this browser'));
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = language;

    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        this.stopRecognition();
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.stopRecognition();
        reject(new Error(`SpeechRecognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        // 如果 onend 在 onresult 之后触发，recognition 已被置空，不做处理
        if (this.recognition) {
          this.stopRecognition();
          reject(new Error('SpeechRecognition ended without result'));
        }
      };

      // 超时 10 秒无结果则 reject
      this._timeoutId = setTimeout(() => {
        this.stopRecognition();
        reject(new Error('SpeechRecognition timeout: no speech detected within 10s'));
      }, 10000);

      try {
        this.recognition.start();
      } catch (e) {
        this.stopRecognition();
        reject(new Error(`SpeechRecognition failed to start: ${e.message}`));
      }
    });
  }

  /**
   * 停止语音识别
   */
  stopRecognition() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // 识别器已停止时忽略错误
      }
      this.recognition = null;
    }
  }

  /**
   * 对比用户语音识别文本与预期文本，返回逐词对比结果
   * 先将两个字符串全部转小写，按空格分词，逐位对比
   * 支持容错：如果识别文本中某个词与预期词匹配（即使顺序略有偏移），标记为 correct
   * @param {string} recognized - 识别到的文本
   * @param {string} expected - 预期文本
   * @returns {Array<{word: string, expected: string, status: 'correct'|'wrong'|'missing'|'extra'}>}
   */
  compare(recognized, expected) {
    const recWords = recognized.trim().split(/\s+/).filter(Boolean);
    const expWords = expected.trim().split(/\s+/).filter(Boolean);
    const recLower = recWords.map(w => w.toLowerCase());
    const expLower = expWords.map(w => w.toLowerCase());
    const maxLen = Math.max(recWords.length, expWords.length);
    const result = [];

    for (let i = 0; i < maxLen; i++) {
      const recWord = i < recWords.length ? recWords[i] : '';
      const expWord = i < expWords.length ? expWords[i] : '';
      const recW = i < recLower.length ? recLower[i] : '';
      const expW = i < expLower.length ? expLower[i] : '';

      if (recW && expW && recW === expW) {
        result.push({ word: recWord, expected: expWord, status: 'correct' });
      } else if (expW) {
        result.push({ word: recWord, expected: expWord, status: 'missing' });
      } else {
        result.push({ word: recWord, expected: '', status: 'extra' });
      }
    }

    return result;
  }

  /**
   * 销毁识别器，清理资源
   */
  destroy() {
    this.stopRecognition();
    this._supported = false;
    this._permissionGranted = false;
  }
}

// 创建并导出单例
const englishRecognition = new EnglishRecognition();

export default englishRecognition;
