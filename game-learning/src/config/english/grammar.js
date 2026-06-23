/**
 * 语法塔配置 - 全部语法塔数据
 *
 * 数据结构参考：
 * - tower: { id, name, icon, description, unlockLevel, tutorial, floors }
 *   - unlockLevel: 英语等级解锁条件（1=一年级起可用）
 * - floor: { floor, type, title, description, questions }
 * - question: { sentence, blanks, answer, options, voicePrompt }
 *   - dragOrder 类型额外字段: words
 *   - bossFight 类型额外字段: wrongSentence, explanation
 *   - categorize 类型额外字段: items, categories
 *   - match 类型额外字段: pairs
 *   - imageChoice 类型额外字段: emoji
 *   - verbTable 类型额外字段: baseForms, pastForms
 *   - transform 类型额外字段: sentence (为陈述句原文)
 *   - connector 类型额外字段: sentences (为两句子数组)
 */
export const grammarTowers = [
  {
    'id': 'be-verb',
    'name': 'Be动词塔',
    'icon': '📖',
    'description': '掌握 am/is/are 的用法，成为语法大师！',
    'unlockLevel': 1,
    'tutorial': {
      'title': 'Be动词是什么？',
      'rules': [
        {
          'rule': 'I → am',
          'example': 'I am a student.',
          'explanation': '当主语是 I 时，be 动词用 am'
        },
        {
          'rule': 'He/She/It → is',
          'example': 'She is my friend.',
          'explanation': '当主语是第三人称单数时，be 动词用 is'
        },
        {
          'rule': 'You/We/They → are',
          'example': 'They are happy.',
          'explanation': '当主语是复数时，be 动词用 are'
        }
      ],
      'tips': [
        'am 只和 I 搭配',
        'is 用于第三人称单数',
        'are 用于复数'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '识别题 (I搭配)',
        'description': '选择正确的 be 动词 — 主语是 I 时用 am',
        'questions': [
          {
            'sentence': 'I ___ a student.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am a student.'
          },
          {
            'sentence': 'I ___ happy.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am happy.'
          },
          {
            'sentence': 'I ___ ten years old.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am ten years old.'
          },
          {
            'sentence': 'I ___ from China.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am from China.'
          },
          {
            'sentence': 'I ___ a boy.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am a boy.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '识别题 (第三人称搭配)',
        'description': '选择正确的 be 动词 — 第三人称单数用 is',
        'questions': [
          {
            'sentence': 'She ___ a teacher.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'She is a teacher.'
          },
          {
            'sentence': 'He ___ my friend.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is my friend.'
          },
          {
            'sentence': 'It ___ a cat.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'It is a cat.'
          },
          {
            'sentence': 'She ___ beautiful.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'She is beautiful.'
          },
          {
            'sentence': 'He ___ tall.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is tall.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '识别题 (复数搭配)',
        'description': '选择正确的 be 动词 — 复数主语用 are',
        'questions': [
          {
            'sentence': 'They ___ students.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'They are students.'
          },
          {
            'sentence': 'We ___ happy.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are happy.'
          },
          {
            'sentence': 'You ___ my friends.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'You are my friends.'
          },
          {
            'sentence': 'They ___ in the classroom.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'They are in the classroom.'
          },
          {
            'sentence': 'We ___ good friends.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are good friends.'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (主谓匹配)',
        'description': '根据主语填入正确的 be 动词',
        'questions': [
          {
            'sentence': 'We ___ in the classroom.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are in the classroom.'
          },
          {
            'sentence': 'I ___ a student.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am a student.'
          },
          {
            'sentence': 'She ___ my sister.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'She is my sister.'
          },
          {
            'sentence': 'They ___ from Beijing.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'They are from Beijing.'
          },
          {
            'sentence': 'He ___ a doctor.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is a doctor.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (混合人称)',
        'description': '判断主语人称，填写正确的 be 动词',
        'questions': [
          {
            'sentence': 'He ___ my brother.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is my brother.'
          },
          {
            'sentence': 'We ___ happy today.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are happy today.'
          },
          {
            'sentence': 'I ___ a teacher.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am a teacher.'
          },
          {
            'sentence': 'You ___ very kind.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'You are very kind.'
          },
          {
            'sentence': 'It ___ a small dog.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'It is a small dog.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (否定句)',
        'description': '在否定句中填入正确的 be 动词',
        'questions': [
          {
            'sentence': 'She ___ not a doctor.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'She is not a doctor.'
          },
          {
            'sentence': 'I ___ not tired.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am not tired.'
          },
          {
            'sentence': 'He ___ not a student.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is not a student.'
          },
          {
            'sentence': 'They ___ not at home.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'They are not at home.'
          },
          {
            'sentence': 'We ___ not late.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are not late.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (疑问句)',
        'description': '拖拽单词组成正确的疑问句',
        'questions': [
          {
            'sentence': '你是一名学生吗？',
            'blanks': [],
            'words': [
              'you',
              'Are',
              'a student',
              '?'
            ],
            'answer': 'Are you a student?',
            'options': [],
            'voicePrompt': 'Are you a student?'
          },
          {
            'sentence': '她是一名老师吗？',
            'blanks': [],
            'words': [
              'she',
              'Is',
              'a teacher',
              '?'
            ],
            'answer': 'Is she a teacher?',
            'options': [],
            'voicePrompt': 'Is she a teacher?'
          },
          {
            'sentence': '他们开心吗？',
            'blanks': [],
            'words': [
              'they',
              'Are',
              'happy',
              '?'
            ],
            'answer': 'Are they happy?',
            'options': [],
            'voicePrompt': 'Are they happy?'
          },
          {
            'sentence': '他是你的兄弟吗？',
            'blanks': [],
            'words': [
              'he',
              'Is',
              'your brother',
              '?'
            ],
            'answer': 'Is he your brother?',
            'options': [],
            'voicePrompt': 'Is he your brother?'
          },
          {
            'sentence': '我们在教室吗？',
            'blanks': [],
            'words': [
              'we',
              'Are',
              'in the classroom',
              '?'
            ],
            'answer': 'Are we in the classroom?',
            'options': [],
            'voicePrompt': 'Are we in the classroom?'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (语法魔王)',
        'description': '找出并修复语法错误，击败语法魔王！',
        'questions': [
          {
            'wrongSentence': 'She are a teacher.',
            'answer': 'is',
            'options': [
              'is',
              'am',
              'are'
            ],
            'explanation': 'She 是第三人称单数，要用 is',
            'voicePrompt': 'is'
          },
          {
            'wrongSentence': 'I is happy.',
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'I 要和 am 搭配',
            'voicePrompt': 'am'
          },
          {
            'wrongSentence': 'They is students.',
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'They 是复数，要用 are',
            'voicePrompt': 'are'
          },
          {
            'wrongSentence': 'We is in the classroom.',
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'We 是复数，要用 are',
            'voicePrompt': 'are'
          },
          {
            'wrongSentence': 'He are my friend.',
            'answer': 'is',
            'options': [
              'is',
              'am',
              'are'
            ],
            'explanation': 'He 是第三人称单数，要用 is',
            'voicePrompt': 'is'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'presentSimple',
    'name': '一般现在时',
    'icon': '⏰',
    'description': '掌握一般现在时的肯定句、否定句和疑问句',
    'unlockLevel': 2,
    'tutorial': {
      'title': '一般现在时是什么？',
      'rules': [
        {
          'rule': '主语 + 动词原形 / 动词-s',
          'example': 'I like apples. / He likes apples.',
          'explanation': '第三人称单数主语后动词要加 -s 或 -es'
        },
        {
          'rule': "否定句用 don't / doesn't",
          'example': "I don't like cats. He doesn't like cats.",
          'explanation': "第三人称单数用 doesn't，其他人称用 don't"
        },
        {
          'rule': '疑问句用 Do / Does 开头',
          'example': 'Do you like milk? / Does she like milk?',
          'explanation': '第三人称单数用 Does，其他人称用 Do'
        }
      ],
      'tips': [
        'he/she/it 是第三人称单数',
        '动词加 -s 规则：一般加 -s，以 s/x/ch/sh/o 结尾加 -es',
        'does 后面的动词要恢复原形'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (肯定句)',
        'description': '选择正确的动词形式',
        'questions': [
          {
            'sentence': 'I ___ apples every day.',
            'blanks': [
              '___'
            ],
            'answer': 'eat',
            'options': [
              'eat',
              'eats',
              'eating'
            ],
            'voicePrompt': 'I eat apples every day.'
          },
          {
            'sentence': 'You ___ English very well.',
            'blanks': [
              '___'
            ],
            'answer': 'speak',
            'options': [
              'speak',
              'speaks',
              'speaking'
            ],
            'voicePrompt': 'You speak English very well.'
          },
          {
            'sentence': 'We ___ to school every morning.',
            'blanks': [
              '___'
            ],
            'answer': 'go',
            'options': [
              'go',
              'goes',
              'going'
            ],
            'voicePrompt': 'We go to school every morning.'
          },
          {
            'sentence': 'They ___ football on weekends.',
            'blanks': [
              '___'
            ],
            'answer': 'play',
            'options': [
              'play',
              'plays',
              'playing'
            ],
            'voicePrompt': 'They play football on weekends.'
          },
          {
            'sentence': 'I ___ my homework every evening.',
            'blanks': [
              '___'
            ],
            'answer': 'do',
            'options': [
              'do',
              'does',
              'doing'
            ],
            'voicePrompt': 'I do my homework every evening.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (第三人称单数)',
        'description': '选择正确的第三人称单数动词形式',
        'questions': [
          {
            'sentence': 'He ___ milk every morning.',
            'blanks': [
              '___'
            ],
            'answer': 'drinks',
            'options': [
              'drink',
              'drinks',
              'drinking'
            ],
            'voicePrompt': 'He drinks milk every morning.'
          },
          {
            'sentence': 'She ___ to school by bus.',
            'blanks': [
              '___'
            ],
            'answer': 'goes',
            'options': [
              'go',
              'goes',
              'going'
            ],
            'voicePrompt': 'She goes to school by bus.'
          },
          {
            'sentence': 'The cat ___ fish.',
            'blanks': [
              '___'
            ],
            'answer': 'likes',
            'options': [
              'like',
              'likes',
              'liking'
            ],
            'voicePrompt': 'The cat likes fish.'
          },
          {
            'sentence': 'He ___ his room every Saturday.',
            'blanks': [
              '___'
            ],
            'answer': 'cleans',
            'options': [
              'clean',
              'cleans',
              'cleaning'
            ],
            'voicePrompt': 'He cleans his room every Saturday.'
          },
          {
            'sentence': 'She ___ Chinese every day.',
            'blanks': [
              '___'
            ],
            'answer': 'studies',
            'options': [
              'study',
              'studies',
              'studying'
            ],
            'voicePrompt': 'She studies Chinese every day.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (否定与疑问)',
        'description': '选择正确的否定或疑问形式',
        'questions': [
          {
            'sentence': 'I ___ like snakes.',
            'blanks': [
              '___'
            ],
            'answer': "don't",
            'options': [
              "don't",
              "doesn't",
              'am not'
            ],
            'voicePrompt': "I don't like snakes."
          },
          {
            'sentence': '___ she like ice cream?',
            'blanks': [
              '___'
            ],
            'answer': 'Does',
            'options': [
              'Do',
              'Does',
              'Is'
            ],
            'voicePrompt': 'Does she like ice cream?'
          },
          {
            'sentence': 'He ___ play the piano.',
            'blanks': [
              '___'
            ],
            'answer': "doesn't",
            'options': [
              "don't",
              "doesn't",
              "isn't"
            ],
            'voicePrompt': "He doesn't play the piano."
          },
          {
            'sentence': '___ you like reading?',
            'blanks': [
              '___'
            ],
            'answer': 'Do',
            'options': [
              'Do',
              'Does',
              'Are'
            ],
            'voicePrompt': 'Do you like reading?'
          },
          {
            'sentence': 'They ___ have a pet.',
            'blanks': [
              '___'
            ],
            'answer': "don't",
            'options': [
              "don't",
              "doesn't",
              "aren't"
            ],
            'voicePrompt': "They don't have a pet."
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (肯定句)',
        'description': '填入正确的动词形式',
        'questions': [
          {
            'sentence': "I ___ breakfast at 7 o'clock.",
            'blanks': [
              '___'
            ],
            'answer': 'have',
            'options': [
              'have',
              'has',
              'having'
            ],
            'voicePrompt': "I have breakfast at 7 o'clock."
          },
          {
            'sentence': 'She ___ a red dress.',
            'blanks': [
              '___'
            ],
            'answer': 'has',
            'options': [
              'have',
              'has',
              'having'
            ],
            'voicePrompt': 'She has a red dress.'
          },
          {
            'sentence': 'They ___ in Beijing.',
            'blanks': [
              '___'
            ],
            'answer': 'live',
            'options': [
              'live',
              'lives',
              'living'
            ],
            'voicePrompt': 'They live in Beijing.'
          },
          {
            'sentence': 'He ___ fast.',
            'blanks': [
              '___'
            ],
            'answer': 'runs',
            'options': [
              'run',
              'runs',
              'running'
            ],
            'voicePrompt': 'He runs fast.'
          },
          {
            'sentence': 'We ___ English together.',
            'blanks': [
              '___'
            ],
            'answer': 'learn',
            'options': [
              'learn',
              'learns',
              'learning'
            ],
            'voicePrompt': 'We learn English together.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (否定句)',
        'description': "填入 don't 或 doesn't",
        'questions': [
          {
            'sentence': 'I ___ like getting up early.',
            'blanks': [
              '___'
            ],
            'answer': "don't",
            'options': [
              "don't",
              "doesn't"
            ],
            'voicePrompt': "I don't like getting up early."
          },
          {
            'sentence': 'She ___ eat meat.',
            'blanks': [
              '___'
            ],
            'answer': "doesn't",
            'options': [
              "don't",
              "doesn't"
            ],
            'voicePrompt': "She doesn't eat meat."
          },
          {
            'sentence': 'We ___ watch TV at night.',
            'blanks': [
              '___'
            ],
            'answer': "don't",
            'options': [
              "don't",
              "doesn't"
            ],
            'voicePrompt': "We don't watch TV at night."
          },
          {
            'sentence': 'He ___ drink coffee.',
            'blanks': [
              '___'
            ],
            'answer': "doesn't",
            'options': [
              "don't",
              "doesn't"
            ],
            'voicePrompt': "He doesn't drink coffee."
          },
          {
            'sentence': 'They ___ live here.',
            'blanks': [
              '___'
            ],
            'answer': "don't",
            'options': [
              "don't",
              "doesn't"
            ],
            'voicePrompt': "They don't live here."
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (疑问句)',
        'description': '填入 Do 或 Does',
        'questions': [
          {
            'sentence': '___ you like swimming?',
            'blanks': [
              '___'
            ],
            'answer': 'Do',
            'options': [
              'Do',
              'Does'
            ],
            'voicePrompt': 'Do you like swimming?'
          },
          {
            'sentence': '___ he play basketball?',
            'blanks': [
              '___'
            ],
            'answer': 'Does',
            'options': [
              'Do',
              'Does'
            ],
            'voicePrompt': 'Does he play basketball?'
          },
          {
            'sentence': '___ they speak French?',
            'blanks': [
              '___'
            ],
            'answer': 'Do',
            'options': [
              'Do',
              'Does'
            ],
            'voicePrompt': 'Do they speak French?'
          },
          {
            'sentence': '___ she like cats?',
            'blanks': [
              '___'
            ],
            'answer': 'Does',
            'options': [
              'Do',
              'Does'
            ],
            'voicePrompt': 'Does she like cats?'
          },
          {
            'sentence': '___ your parents live here?',
            'blanks': [
              '___'
            ],
            'answer': 'Do',
            'options': [
              'Do',
              'Does'
            ],
            'voicePrompt': 'Do your parents live here?'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (一般现在时)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '他每天喝牛奶。',
            'blanks': [],
            'words': [
              'milk',
              'He',
              'every day',
              'drinks'
            ],
            'answer': 'He drinks milk every day.',
            'options': [],
            'voicePrompt': 'He drinks milk every day.'
          },
          {
            'sentence': '他们周末踢足球。',
            'blanks': [],
            'words': [
              'on weekends',
              'They',
              'play',
              'football'
            ],
            'answer': 'They play football on weekends.',
            'options': [],
            'voicePrompt': 'They play football on weekends.'
          },
          {
            'sentence': '你喜欢猫吗？',
            'blanks': [],
            'words': [
              'you',
              'Do',
              'like',
              'cats',
              '?'
            ],
            'answer': 'Do you like cats?',
            'options': [],
            'voicePrompt': 'Do you like cats?'
          },
          {
            'sentence': '她不吃肉。',
            'blanks': [],
            'words': [
              'meat',
              'She',
              "doesn't",
              'eat'
            ],
            'answer': "She doesn't eat meat.",
            'options': [],
            'voicePrompt': "She doesn't eat meat."
          },
          {
            'sentence': '他每天早晨跑步。',
            'blanks': [],
            'words': [
              'every morning',
              'He',
              'runs'
            ],
            'answer': 'He runs every morning.',
            'options': [],
            'voicePrompt': 'He runs every morning.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (时态魔王)',
        'description': '找出并修复一般现在时的语法错误！',
        'questions': [
          {
            'wrongSentence': 'He go to school every day.',
            'answer': 'goes',
            'options': [
              'go',
              'goes',
              'going'
            ],
            'explanation': '第三人称单数 He 后面动词要加 -es',
            'voicePrompt': 'goes'
          },
          {
            'wrongSentence': 'She not like apples.',
            'answer': "doesn't",
            'options': [
              "doesn't",
              "don't",
              'not'
            ],
            'explanation': "第三人称单数要用 doesn't 否定",
            'voicePrompt': "doesn't"
          },
          {
            'wrongSentence': 'Do he play football?',
            'answer': 'Does',
            'options': [
              'Do',
              'Does',
              'Is'
            ],
            'explanation': '第三人称单数要用 Does 提问',
            'voicePrompt': 'Does'
          },
          {
            'wrongSentence': 'They likes ice cream.',
            'answer': 'like',
            'options': [
              'like',
              'likes',
              'liking'
            ],
            'explanation': 'They 是复数，动词用原形',
            'voicePrompt': 'like'
          },
          {
            'wrongSentence': 'I likes reading books.',
            'answer': 'like',
            'options': [
              'like',
              'likes',
              'liking'
            ],
            'explanation': 'I 后面动词用原形',
            'voicePrompt': 'like'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'presentContinuous',
    'name': '现在进行时',
    'icon': '🔄',
    'description': '掌握现在进行时的构成和用法',
    'unlockLevel': 2,
    'tutorial': {
      'title': '现在进行时是什么？',
      'rules': [
        {
          'rule': '主语 + be动词 + 动词-ing',
          'example': 'I am reading. / She is singing.',
          'explanation': '现在进行时表示正在进行的动作'
        },
        {
          'rule': '否定句在 be 动词后加 not',
          'example': 'He is not sleeping.',
          'explanation': '表示"不在做某事"'
        },
        {
          'rule': '疑问句把 be 动词提前',
          'example': 'Are you watching TV?',
          'explanation': '提问时把 am/is/are 放到句首'
        }
      ],
      'tips': [
        '动词加 -ing 规则：一般直接加 -ing',
        '以 e 结尾的动词要去 e 加 -ing (make → making)',
        '以重读闭音节结尾的，双写尾字母加 -ing (run → running)'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (肯定句)',
        'description': '选择正确的现在进行时形式',
        'questions': [
          {
            'sentence': 'I ___ a book now.',
            'blanks': [
              '___'
            ],
            'answer': 'am reading',
            'options': [
              'am reading',
              'read',
              'reads'
            ],
            'voicePrompt': 'I am reading a book now.'
          },
          {
            'sentence': 'She ___ to music.',
            'blanks': [
              '___'
            ],
            'answer': 'is listening',
            'options': [
              'is listening',
              'listens',
              'listen'
            ],
            'voicePrompt': 'She is listening to music.'
          },
          {
            'sentence': 'They ___ football now.',
            'blanks': [
              '___'
            ],
            'answer': 'are playing',
            'options': [
              'are playing',
              'play',
              'plays'
            ],
            'voicePrompt': 'They are playing football now.'
          },
          {
            'sentence': 'He ___ dinner.',
            'blanks': [
              '___'
            ],
            'answer': 'is cooking',
            'options': [
              'is cooking',
              'cooks',
              'cook'
            ],
            'voicePrompt': 'He is cooking dinner.'
          },
          {
            'sentence': 'We ___ a movie.',
            'blanks': [
              '___'
            ],
            'answer': 'are watching',
            'options': [
              'are watching',
              'watch',
              'watches'
            ],
            'voicePrompt': 'We are watching a movie.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (否定句)',
        'description': '选择正确的否定形式',
        'questions': [
          {
            'sentence': 'He ___ sleeping now.',
            'blanks': [
              '___'
            ],
            'answer': 'is not',
            'options': [
              'is not',
              'does not',
              'is'
            ],
            'voicePrompt': 'He is not sleeping now.'
          },
          {
            'sentence': 'I ___ working today.',
            'blanks': [
              '___'
            ],
            'answer': 'am not',
            'options': [
              'am not',
              "don't",
              "isn't"
            ],
            'voicePrompt': 'I am not working today.'
          },
          {
            'sentence': 'They ___ coming to the party.',
            'blanks': [
              '___'
            ],
            'answer': 'are not',
            'options': [
              'are not',
              "don't",
              "isn't"
            ],
            'voicePrompt': 'They are not coming to the party.'
          },
          {
            'sentence': 'She ___ wearing a hat.',
            'blanks': [
              '___'
            ],
            'answer': 'is not',
            'options': [
              'is not',
              'does not',
              'are not'
            ],
            'voicePrompt': 'She is not wearing a hat.'
          },
          {
            'sentence': 'We ___ playing outside today.',
            'blanks': [
              '___'
            ],
            'answer': 'are not',
            'options': [
              'are not',
              "don't",
              "isn't"
            ],
            'voicePrompt': 'We are not playing outside today.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (疑问句)',
        'description': '选择正确的疑问形式',
        'questions': [
          {
            'sentence': '___ you reading a book?',
            'blanks': [
              '___'
            ],
            'answer': 'Are',
            'options': [
              'Are',
              'Do',
              'Is'
            ],
            'voicePrompt': 'Are you reading a book?'
          },
          {
            'sentence': '___ he sleeping?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Does',
              'Are'
            ],
            'voicePrompt': 'Is he sleeping?'
          },
          {
            'sentence': '___ they playing outside?',
            'blanks': [
              '___'
            ],
            'answer': 'Are',
            'options': [
              'Are',
              'Do',
              'Is'
            ],
            'voicePrompt': 'Are they playing outside?'
          },
          {
            'sentence': '___ she watching TV?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Does',
              'Are'
            ],
            'voicePrompt': 'Is she watching TV?'
          },
          {
            'sentence': '___ the dog running?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Are',
              'Does'
            ],
            'voicePrompt': 'Is the dog running?'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (动词-ing)',
        'description': '填入动词的现在分词 (-ing) 形式',
        'questions': [
          {
            'sentence': 'Look! The cat is ___ (run) after a mouse.',
            'blanks': [
              '___'
            ],
            'answer': 'running',
            'options': [
              'run',
              'running',
              'runs'
            ],
            'voicePrompt': 'Look! The cat is running (run) after a mouse.'
          },
          {
            'sentence': 'She is ___ (make) a cake.',
            'blanks': [
              '___'
            ],
            'answer': 'making',
            'options': [
              'make',
              'making',
              'makes'
            ],
            'voicePrompt': 'She is making (make) a cake.'
          },
          {
            'sentence': 'He is ___ (swim) in the pool.',
            'blanks': [
              '___'
            ],
            'answer': 'swimming',
            'options': [
              'swim',
              'swimming',
              'swims'
            ],
            'voicePrompt': 'He is swimming (swim) in the pool.'
          },
          {
            'sentence': 'I am ___ (write) a letter.',
            'blanks': [
              '___'
            ],
            'answer': 'writing',
            'options': [
              'write',
              'writing',
              'writes'
            ],
            'voicePrompt': 'I am writing (write) a letter.'
          },
          {
            'sentence': 'They are ___ (dance) at the party.',
            'blanks': [
              '___'
            ],
            'answer': 'dancing',
            'options': [
              'dance',
              'dancing',
              'dances'
            ],
            'voicePrompt': 'They are dancing (dance) at the party.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (be动词选择)',
        'description': '填入正确的 be 动词 (am/is/are)',
        'questions': [
          {
            'sentence': 'I ___ eating lunch now.',
            'blanks': [
              '___'
            ],
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'I am eating lunch now.'
          },
          {
            'sentence': 'The children ___ playing outside.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'The children are playing outside.'
          },
          {
            'sentence': 'He ___ doing his homework.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'He is doing his homework.'
          },
          {
            'sentence': 'We ___ having a good time.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'We are having a good time.'
          },
          {
            'sentence': 'The bird ___ singing.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'voicePrompt': 'The bird is singing.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (综合)',
        'description': '根据上下文填入正确的形式',
        'questions': [
          {
            'sentence': 'She ___ (work) on her project right now.',
            'blanks': [
              '___'
            ],
            'answer': 'is working',
            'options': [
              'is working',
              'works',
              'worked'
            ],
            'voicePrompt': 'She is working (work) on her project right now.'
          },
          {
            'sentence': 'Listen! Someone ___ (sing) in the next room.',
            'blanks': [
              '___'
            ],
            'answer': 'is singing',
            'options': [
              'is singing',
              'sings',
              'sang'
            ],
            'voicePrompt': 'Listen! Someone is singing (sing) in the next room.'
          },
          {
            'sentence': 'The kids ___ (play) in the garden.',
            'blanks': [
              '___'
            ],
            'answer': 'are playing',
            'options': [
              'are playing',
              'play',
              'played'
            ],
            'voicePrompt': 'The kids are playing (play) in the garden.'
          },
          {
            'sentence': 'I ___ (study) for the test tonight.',
            'blanks': [
              '___'
            ],
            'answer': 'am studying',
            'options': [
              'am studying',
              'study',
              'studied'
            ],
            'voicePrompt': 'I am studying (study) for the test tonight.'
          },
          {
            'sentence': 'It ___ (rain) outside right now.',
            'blanks': [
              '___'
            ],
            'answer': 'is raining',
            'options': [
              'is raining',
              'rains',
              'rained'
            ],
            'voicePrompt': 'It is raining (rain) outside right now.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (现在进行时)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '她正在读书。',
            'blanks': [],
            'words': [
              'a book',
              'She',
              'reading',
              'is'
            ],
            'answer': 'She is reading a book.',
            'options': [],
            'voicePrompt': 'She is reading a book.'
          },
          {
            'sentence': '他们正在踢足球。',
            'blanks': [],
            'words': [
              'football',
              'playing',
              'They',
              'are'
            ],
            'answer': 'They are playing football.',
            'options': [],
            'voicePrompt': 'They are playing football.'
          },
          {
            'sentence': '你在看电视吗？',
            'blanks': [],
            'words': [
              'watching',
              'Are',
              'you',
              'TV',
              '?'
            ],
            'answer': 'Are you watching TV?',
            'options': [],
            'voicePrompt': 'Are you watching TV?'
          },
          {
            'sentence': '他没有在睡觉。',
            'blanks': [],
            'words': [
              'sleeping',
              'He',
              'not',
              'is'
            ],
            'answer': 'He is not sleeping.',
            'options': [],
            'voicePrompt': 'He is not sleeping.'
          },
          {
            'sentence': '我正在做晚饭。',
            'blanks': [],
            'words': [
              'dinner',
              'I',
              'cooking',
              'am'
            ],
            'answer': 'I am cooking dinner.',
            'options': [],
            'voicePrompt': 'I am cooking dinner.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (进行时魔王)',
        'description': '找出并修复现在进行时的语法错误！',
        'questions': [
          {
            'wrongSentence': 'She are reading a book.',
            'answer': 'is',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'She 是第三人称单数，要用 is',
            'voicePrompt': 'is'
          },
          {
            'wrongSentence': 'He is play football now.',
            'answer': 'playing',
            'options': [
              'play',
              'playing',
              'plays'
            ],
            'explanation': '现在进行时动词要用 -ing 形式',
            'voicePrompt': 'playing'
          },
          {
            'wrongSentence': 'We is watching TV.',
            'answer': 'are',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'We 是复数，要用 are',
            'voicePrompt': 'are'
          },
          {
            'wrongSentence': 'Do you sleeping?',
            'answer': 'Are',
            'options': [
              'Are',
              'Do',
              'Is'
            ],
            'explanation': '现在进行时的疑问句要把 be 动词提前',
            'voicePrompt': 'Are'
          },
          {
            'wrongSentence': 'She is makeing a cake.',
            'answer': 'making',
            'options': [
              'makeing',
              'making',
              'makes'
            ],
            'explanation': '以 e 结尾的动词去 e 加 -ing',
            'voicePrompt': 'making'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'noun',
    'name': '名词',
    'icon': '📦',
    'description': '学习名词的分类：可数名词与不可数名词',
    'unlockLevel': 1,
    'tutorial': {
      'title': '名词是什么？',
      'rules': [
        {
          'rule': '可数名词 (Countable)',
          'example': 'a book, two apples, many students',
          'explanation': '可以用数字计数的名词，有单复数形式'
        },
        {
          'rule': '不可数名词 (Uncountable)',
          'example': 'water, rice, milk, homework',
          'explanation': '不能直接用数字计数的名词，没有复数形式'
        },
        {
          'rule': '可数名词复数变化',
          'example': 'cat → cats, box → boxes, baby → babies',
          'explanation': '一般加 -s，以 s/x/ch/sh/o 加 -es，辅音+y 变 y 为 i 加 -es'
        }
      ],
      'tips': [
        '可数名词前面可以用 a/an',
        '不可数名词前面不能用 a/an',
        '不可数名词可以用 some, a little, much 修饰',
        '可数名词可以用 many, a few, several 修饰'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (可数/不可数)',
        'description': '判断名词是可数还是不可数',
        'questions': [
          {
            'sentence': 'The word "water" is ___ noun.',
            'blanks': [
              '___'
            ],
            'answer': 'uncountable',
            'options': [
              'countable',
              'uncountable'
            ],
            'voicePrompt': 'The word "water" is uncountable noun.'
          },
          {
            'sentence': 'The word "book" is ___ noun.',
            'blanks': [
              '___'
            ],
            'answer': 'countable',
            'options': [
              'countable',
              'uncountable'
            ],
            'voicePrompt': 'The word "book" is countable noun.'
          },
          {
            'sentence': 'The word "rice" is ___ noun.',
            'blanks': [
              '___'
            ],
            'answer': 'uncountable',
            'options': [
              'countable',
              'uncountable'
            ],
            'voicePrompt': 'The word "rice" is uncountable noun.'
          },
          {
            'sentence': 'The word "apple" is ___ noun.',
            'blanks': [
              '___'
            ],
            'answer': 'countable',
            'options': [
              'countable',
              'uncountable'
            ],
            'voicePrompt': 'The word "apple" is countable noun.'
          },
          {
            'sentence': 'The word "milk" is ___ noun.',
            'blanks': [
              '___'
            ],
            'answer': 'uncountable',
            'options': [
              'countable',
              'uncountable'
            ],
            'voicePrompt': 'The word "milk" is uncountable noun.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (名词复数)',
        'description': '选择正确的复数形式',
        'questions': [
          {
            'sentence': 'one cat → two ___',
            'blanks': [
              '___'
            ],
            'answer': 'cats',
            'options': [
              'cat',
              'cats',
              'cates'
            ],
            'voicePrompt': 'one cat → two cats'
          },
          {
            'sentence': 'one box → three ___',
            'blanks': [
              '___'
            ],
            'answer': 'boxes',
            'options': [
              'box',
              'boxs',
              'boxes'
            ],
            'voicePrompt': 'one box → three boxes'
          },
          {
            'sentence': 'one baby → two ___',
            'blanks': [
              '___'
            ],
            'answer': 'babies',
            'options': [
              'babys',
              'babies',
              'babyes'
            ],
            'voicePrompt': 'one baby → two babies'
          },
          {
            'sentence': 'one potato → many ___',
            'blanks': [
              '___'
            ],
            'answer': 'potatoes',
            'options': [
              'potatos',
              'potatoes',
              'potato'
            ],
            'voicePrompt': 'one potato → many potatoes'
          },
          {
            'sentence': 'one child → two ___',
            'blanks': [
              '___'
            ],
            'answer': 'children',
            'options': [
              'childs',
              'children',
              'childrens'
            ],
            'voicePrompt': 'one child → two children'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'categorize',
        'title': '分类题 (可数/不可数)',
        'description': '将名词拖入正确的分类',
        'questions': [
          {
            'sentence': '将下列名词分类',
            'prompt': '将下列名词分为可数名词和不可数名词',
            'items': [
              'apple',
              'water',
              'book',
              'rice',
              'dog',
              'milk',
              'chair',
              'bread',
              'egg',
              'sugar'
            ],
            'categories': [
              {
                'id': 'countable',
                'label': '可数名词',
                'icon': '📦'
              },
              {
                'id': 'uncountable',
                'label': '不可数名词',
                'icon': '💧'
              }
            ],
            'answer': 'apple:countable,water:uncountable,book:countable,rice:uncountable,dog:countable,milk:uncountable,chair:countable,bread:uncountable,egg:countable,sugar:uncountable'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (a/an)',
        'description': '填入 a 或 an',
        'questions': [
          {
            'sentence': 'I have ___ apple.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'I have an apple.'
          },
          {
            'sentence': 'This is ___ book.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'This is a book.'
          },
          {
            'sentence': 'She is ___ engineer.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'She is an engineer.'
          },
          {
            'sentence': 'It is ___ orange.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'It is an orange.'
          },
          {
            'sentence': 'He is ___ teacher.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'He is a teacher.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (some/any)',
        'description': '填入 some 或 any',
        'questions': [
          {
            'sentence': 'I want ___ water.',
            'blanks': [
              '___'
            ],
            'answer': 'some',
            'options': [
              'some',
              'any'
            ],
            'voicePrompt': 'I want some water.'
          },
          {
            'sentence': 'Do you have ___ milk?',
            'blanks': [
              '___'
            ],
            'answer': 'any',
            'options': [
              'some',
              'any'
            ],
            'voicePrompt': 'Do you have any milk?'
          },
          {
            'sentence': 'There are ___ books on the desk.',
            'blanks': [
              '___'
            ],
            'answer': 'some',
            'options': [
              'some',
              'any'
            ],
            'voicePrompt': 'There are some books on the desk.'
          },
          {
            'sentence': "I don't have ___ money.",
            'blanks': [
              '___'
            ],
            'answer': 'any',
            'options': [
              'some',
              'any'
            ],
            'voicePrompt': "I don't have any money."
          },
          {
            'sentence': 'Would you like ___ tea?',
            'blanks': [
              '___'
            ],
            'answer': 'some',
            'options': [
              'some',
              'any'
            ],
            'voicePrompt': 'Would you like some tea?'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (名词综合)',
        'description': '填入正确的名词形式',
        'questions': [
          {
            'sentence': 'There are five ___ (child) in the park.',
            'blanks': [
              '___'
            ],
            'answer': 'children',
            'options': [
              'child',
              'children',
              'childs'
            ],
            'voicePrompt': 'There are five children (child) in the park.'
          },
          {
            'sentence': 'Please give me some ___ (water).',
            'blanks': [
              '___'
            ],
            'answer': 'water',
            'options': [
              'water',
              'waters',
              'a water'
            ],
            'voicePrompt': 'Please give me some water (water).'
          },
          {
            'sentence': 'I have two ___ (sister).',
            'blanks': [
              '___'
            ],
            'answer': 'sisters',
            'options': [
              'sister',
              'sisters',
              'sisteres'
            ],
            'voicePrompt': 'I have two sisters (sister).'
          },
          {
            'sentence': 'We need ___ (bread) for breakfast.',
            'blanks': [
              '___'
            ],
            'answer': 'bread',
            'options': [
              'bread',
              'breads',
              'a bread'
            ],
            'voicePrompt': 'We need bread (bread) for breakfast.'
          },
          {
            'sentence': 'The ___ (leaf) fall in autumn.',
            'blanks': [
              '___'
            ],
            'answer': 'leaves',
            'options': [
              'leafs',
              'leaves',
              'leaf'
            ],
            'voicePrompt': 'The leaves (leaf) fall in autumn.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (名词)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '桌子上有一些书。',
            'blanks': [],
            'words': [
              'There',
              'on the desk',
              'are',
              'some books'
            ],
            'answer': 'There are some books on the desk.',
            'options': [],
            'voicePrompt': 'There are some books on the desk.'
          },
          {
            'sentence': '我想要一些水。',
            'blanks': [],
            'words': [
              'want',
              'I',
              'some water'
            ],
            'answer': 'I want some water.',
            'options': [],
            'voicePrompt': 'I want some water.'
          },
          {
            'sentence': '你有任何牛奶吗？',
            'blanks': [],
            'words': [
              'any milk',
              'you',
              'Do',
              'have',
              '?'
            ],
            'answer': 'Do you have any milk?',
            'options': [],
            'voicePrompt': 'Do you have any milk?'
          },
          {
            'sentence': '她是一个好老师。',
            'blanks': [],
            'words': [
              'a good teacher',
              'She',
              'is'
            ],
            'answer': 'She is a good teacher.',
            'options': [],
            'voicePrompt': 'She is a good teacher.'
          },
          {
            'sentence': '今天我没有作业。',
            'blanks': [],
            'words': [
              "don't",
              'I',
              'have',
              'any homework',
              'today'
            ],
            'answer': "I don't have any homework today.",
            'options': [],
            'voicePrompt': "I don't have any homework today."
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (名词魔王)',
        'description': '找出并修复名词用法中的错误！',
        'questions': [
          {
            'wrongSentence': 'I have three child.',
            'answer': 'children',
            'options': [
              'child',
              'children',
              'childs'
            ],
            'explanation': 'child 的复数是不规则变化 children',
            'voicePrompt': 'children'
          },
          {
            'wrongSentence': 'Please give me a water.',
            'answer': 'some water',
            'options': [
              'a water',
              'some water',
              'water'
            ],
            'explanation': 'water 是不可数名词，不能用 a',
            'voicePrompt': 'some water'
          },
          {
            'wrongSentence': 'There are many milks in the fridge.',
            'answer': 'milk',
            'options': [
              'milk',
              'milks',
              'milkes'
            ],
            'explanation': 'milk 是不可数名词，没有复数形式',
            'voicePrompt': 'milk'
          },
          {
            'wrongSentence': 'She is a engineer.',
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'explanation': 'engineer 以元音音素开头，要用 an',
            'voicePrompt': 'an'
          },
          {
            'wrongSentence': 'I have two boxs.',
            'answer': 'boxes',
            'options': [
              'box',
              'boxs',
              'boxes'
            ],
            'explanation': '以 x 结尾的名词，复数加 -es',
            'voicePrompt': 'boxes'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'pronoun',
    'name': '代词',
    'icon': '👤',
    'description': '学习主格代词和宾格代词的用法',
    'unlockLevel': 2,
    'tutorial': {
      'title': '代词是什么？',
      'rules': [
        {
          'rule': '主格代词 (Subject Pronouns)',
          'example': 'I, you, he, she, it, we, they',
          'explanation': '主格代词用作句子的主语'
        },
        {
          'rule': '宾格代词 (Object Pronouns)',
          'example': 'me, you, him, her, it, us, them',
          'explanation': '宾格代词用作动词或介词的宾语'
        },
        {
          'rule': '用法区别',
          'example': 'I like her. (I=主格, her=宾格)',
          'explanation': '动词前用主格，动词/介词后用宾格'
        }
      ],
      'tips': [
        'I (我) 永远大写',
        'you 的主格和宾格形式相同',
        'it 的主格和宾格形式相同'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (主格代词)',
        'description': '选择正确的主格代词',
        'questions': [
          {
            'sentence': '___ is a teacher. (张老师)',
            'blanks': [
              '___'
            ],
            'answer': 'She',
            'options': [
              'She',
              'Her',
              'Him'
            ],
            'voicePrompt': 'She is a teacher. (张老师)'
          },
          {
            'sentence': '___ are good friends. (我和李明)',
            'blanks': [
              '___'
            ],
            'answer': 'We',
            'options': [
              'We',
              'Us',
              'Our'
            ],
            'voicePrompt': 'We are good friends. (我和李明)'
          },
          {
            'sentence': '___ is running fast. (那只狗)',
            'blanks': [
              '___'
            ],
            'answer': 'It',
            'options': [
              'It',
              'Its',
              'They'
            ],
            'voicePrompt': 'It is running fast. (那只狗)'
          },
          {
            'sentence': '___ am a student.',
            'blanks': [
              '___'
            ],
            'answer': 'I',
            'options': [
              'I',
              'Me',
              'My'
            ],
            'voicePrompt': 'I am a student.'
          },
          {
            'sentence': '___ are in the classroom. (学生们)',
            'blanks': [
              '___'
            ],
            'answer': 'They',
            'options': [
              'They',
              'Them',
              'Their'
            ],
            'voicePrompt': 'They are in the classroom. (学生们)'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'match',
        'title': '配对题 (主格↔宾格)',
        'description': '将主格代词与对应的宾格代词配对',
        'questions': [
          {
            'sentence': '将主格代词与对应的宾格代词配对',
            'prompt': '将主格代词与对应的宾格代词配对',
            'pairs': [
              {
                'left': 'I',
                'right': 'me'
              },
              {
                'left': 'he',
                'right': 'him'
              },
              {
                'left': 'she',
                'right': 'her'
              },
              {
                'left': 'we',
                'right': 'us'
              },
              {
                'left': 'they',
                'right': 'them'
              }
            ],
            'answer': 'i-me|he-him|she-her|we-us|they-them'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (主格/宾格辨析)',
        'description': '选择正确的代词形式',
        'questions': [
          {
            'sentence': 'Please give ___ a book. (我)',
            'blanks': [
              '___'
            ],
            'answer': 'me',
            'options': [
              'I',
              'me',
              'my'
            ],
            'voicePrompt': 'Please give me a book. (我)'
          },
          {
            'sentence': '___ like playing football. (他们)',
            'blanks': [
              '___'
            ],
            'answer': 'They',
            'options': [
              'They',
              'Them',
              'Their'
            ],
            'voicePrompt': 'They like playing football. (他们)'
          },
          {
            'sentence': 'Can you help ___? (她)',
            'blanks': [
              '___'
            ],
            'answer': 'her',
            'options': [
              'she',
              'her',
              'hers'
            ],
            'voicePrompt': 'Can you help her? (她)'
          },
          {
            'sentence': '___ is my best friend. (他)',
            'blanks': [
              '___'
            ],
            'answer': 'He',
            'options': [
              'He',
              'Him',
              'His'
            ],
            'voicePrompt': 'He is my best friend. (他)'
          },
          {
            'sentence': 'The teacher is talking to ___. (我们)',
            'blanks': [
              '___'
            ],
            'answer': 'us',
            'options': [
              'we',
              'us',
              'our'
            ],
            'voicePrompt': 'The teacher is talking to us. (我们)'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (代词选择)',
        'description': '根据提示填入正确的代词',
        'questions': [
          {
            'sentence': '___ (她) is a doctor.',
            'blanks': [
              '___'
            ],
            'answer': 'She',
            'options': [
              'She',
              'Her',
              'Hers'
            ],
            'voicePrompt': 'She (她) is a doctor.'
          },
          {
            'sentence': 'I like ___ (他们).',
            'blanks': [
              '___'
            ],
            'answer': 'them',
            'options': [
              'they',
              'them',
              'their'
            ],
            'voicePrompt': 'I like them (他们).'
          },
          {
            'sentence': '___ (我们) are going to the park.',
            'blanks': [
              '___'
            ],
            'answer': 'We',
            'options': [
              'We',
              'Us',
              'Our'
            ],
            'voicePrompt': 'We (我们) are going to the park.'
          },
          {
            'sentence': 'Please tell ___ (我) the truth.',
            'blanks': [
              '___'
            ],
            'answer': 'me',
            'options': [
              'I',
              'me',
              'my'
            ],
            'voicePrompt': 'Please tell me (我) the truth.'
          },
          {
            'sentence': '___ (它) is a beautiful flower.',
            'blanks': [
              '___'
            ],
            'answer': 'It',
            'options': [
              'It',
              'Its',
              'They'
            ],
            'voicePrompt': 'It (它) is a beautiful flower.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (物主代词)',
        'description': '填入正确的物主代词',
        'questions': [
          {
            'sentence': 'This is ___ (我的) book.',
            'blanks': [
              '___'
            ],
            'answer': 'my',
            'options': [
              'my',
              'mine',
              'me'
            ],
            'voicePrompt': 'This is my (我的) book.'
          },
          {
            'sentence': 'That bag is ___ (她的).',
            'blanks': [
              '___'
            ],
            'answer': 'hers',
            'options': [
              'she',
              'her',
              'hers'
            ],
            'voicePrompt': 'That bag is hers (她的).'
          },
          {
            'sentence': '___ (他们的) house is big.',
            'blanks': [
              '___'
            ],
            'answer': 'Their',
            'options': [
              'Their',
              'Them',
              'They'
            ],
            'voicePrompt': 'Their (他们的) house is big.'
          },
          {
            'sentence': 'Is this ___ (你的) pencil?',
            'blanks': [
              '___'
            ],
            'answer': 'your',
            'options': [
              'your',
              'yours',
              'you'
            ],
            'voicePrompt': 'Is this your (你的) pencil?'
          },
          {
            'sentence': 'The car is ___ (我们的).',
            'blanks': [
              '___'
            ],
            'answer': 'ours',
            'options': [
              'our',
              'ours',
              'us'
            ],
            'voicePrompt': 'The car is ours (我们的).'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (代词综合)',
        'description': '根据语境填入正确的代词形式',
        'questions': [
          {
            'sentence': 'My sister is tall. ___ is a basketball player.',
            'blanks': [
              '___'
            ],
            'answer': 'She',
            'options': [
              'She',
              'Her',
              'Hers'
            ],
            'voicePrompt': 'My sister is tall. She is a basketball player.'
          },
          {
            'sentence': 'I have a cat. ___ name is Mimi.',
            'blanks': [
              '___'
            ],
            'answer': 'Its',
            'options': [
              'It',
              'Its',
              "It's"
            ],
            'voicePrompt': 'I have a cat. Its name is Mimi.'
          },
          {
            'sentence': 'Please help ___ to clean the room.',
            'blanks': [
              '___'
            ],
            'answer': 'me',
            'options': [
              'I',
              'me',
              'my'
            ],
            'voicePrompt': 'Please help me to clean the room.'
          },
          {
            'sentence': '___ should do our best.',
            'blanks': [
              '___'
            ],
            'answer': 'We',
            'options': [
              'We',
              'Us',
              'Our'
            ],
            'voicePrompt': 'We should do our best.'
          },
          {
            'sentence': 'Give the money to ___.',
            'blanks': [
              '___'
            ],
            'answer': 'them',
            'options': [
              'they',
              'them',
              'their'
            ],
            'voicePrompt': 'Give the money to them.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (代词)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '她是我最好的朋友。',
            'blanks': [],
            'words': [
              'She',
              'my best friend',
              'is'
            ],
            'answer': 'She is my best friend.',
            'options': [],
            'voicePrompt': 'She is my best friend.'
          },
          {
            'sentence': '请给我们一些水。',
            'blanks': [],
            'words': [
              'some water',
              'Please',
              'us',
              'give'
            ],
            'answer': 'Please give us some water.',
            'options': [],
            'voicePrompt': 'Please give us some water.'
          },
          {
            'sentence': '我喜欢她。',
            'blanks': [],
            'words': [
              'like',
              'I',
              'her'
            ],
            'answer': 'I like her.',
            'options': [],
            'voicePrompt': 'I like her.'
          },
          {
            'sentence': '这是你的书吗？',
            'blanks': [],
            'words': [
              'your book',
              'Is',
              'this',
              '?'
            ],
            'answer': 'Is this your book?',
            'options': [],
            'voicePrompt': 'Is this your book?'
          },
          {
            'sentence': '他们的房子很大。',
            'blanks': [],
            'words': [
              'house',
              'Their',
              'big',
              'is'
            ],
            'answer': 'Their house is big.',
            'options': [],
            'voicePrompt': 'Their house is big.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (代词魔王)',
        'description': '找出并修复代词用法中的错误！',
        'questions': [
          {
            'wrongSentence': 'Me is a student.',
            'answer': 'I',
            'options': [
              'I',
              'Me',
              'My'
            ],
            'explanation': '主语要用主格 I，不能用宾格 me',
            'voicePrompt': 'I'
          },
          {
            'wrongSentence': 'Please help I.',
            'answer': 'me',
            'options': [
              'I',
              'me',
              'my'
            ],
            'explanation': '动词 help 后面要用宾格 me',
            'voicePrompt': 'me'
          },
          {
            'wrongSentence': 'Her is my friend.',
            'answer': 'She',
            'options': [
              'She',
              'Her',
              'Hers'
            ],
            'explanation': '主语要用主格 She',
            'voicePrompt': 'She'
          },
          {
            'wrongSentence': 'This is him book.',
            'answer': 'his',
            'options': [
              'him',
              'his',
              'he'
            ],
            'explanation': '名词前要用物主代词 his',
            'voicePrompt': 'his'
          },
          {
            'wrongSentence': 'They are my friends. I like they.',
            'answer': 'them',
            'options': [
              'they',
              'them',
              'their'
            ],
            'explanation': '动词 like 后面要用宾格 them',
            'voicePrompt': 'them'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'thereBe',
    'name': 'There be 句型',
    'icon': '🏗️',
    'description': '学习 There is / There are 的用法',
    'unlockLevel': 2,
    'tutorial': {
      'title': 'There be 句型是什么？',
      'rules': [
        {
          'rule': 'There is + 单数/不可数名词',
          'example': 'There is a book on the desk.',
          'explanation': '单数名词或不可数名词用 There is'
        },
        {
          'rule': 'There are + 复数名词',
          'example': 'There are many students in the classroom.',
          'explanation': '复数名词用 There are'
        },
        {
          'rule': '否定句和疑问句',
          'example': 'There is not / There are not / Is there? / Are there?',
          'explanation': '否定加 not，疑问把 is/are 提前'
        }
      ],
      'tips': [
        'There be 中的 be 动词由后面第一个名词决定',
        "缩写：There's = There is, There're = There are",
        "There be 表示'存在有'，have/has 表示'拥有'"
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (There is)',
        'description': '选择正确的 There is 形式',
        'questions': [
          {
            'sentence': '___ a cat under the table.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There is a cat under the table.'
          },
          {
            'sentence': '___ some water in the glass.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There is some water in the glass.'
          },
          {
            'sentence': '___ a book on the shelf.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There is a book on the shelf.'
          },
          {
            'sentence': '___ some milk in the fridge.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There is some milk in the fridge.'
          },
          {
            'sentence': '___ an apple on the table.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There is an apple on the table.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (There are)',
        'description': '选择正确的 There are 形式',
        'questions': [
          {
            'sentence': '___ many books in the library.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'They are'
            ],
            'voicePrompt': 'There are many books in the library.'
          },
          {
            'sentence': '___ five students in the classroom.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There are five students in the classroom.'
          },
          {
            'sentence': '___ two cats on the sofa.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There are two cats on the sofa.'
          },
          {
            'sentence': '___ some apples in the basket.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There are some apples in the basket.'
          },
          {
            'sentence': '___ many trees in the park.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'It is'
            ],
            'voicePrompt': 'There are many trees in the park.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (There be 综合)',
        'description': '选择 There is 或 There are',
        'questions': [
          {
            'sentence': '___ a big playground in our school.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'There have'
            ],
            'voicePrompt': 'There is a big playground in our school.'
          },
          {
            'sentence': '___ 30 students in my class.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'There has'
            ],
            'voicePrompt': 'There are 30 students in my class.'
          },
          {
            'sentence': '___ some rice in the bowl.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'There have'
            ],
            'voicePrompt': 'There is some rice in the bowl.'
          },
          {
            'sentence': '___ a pen and two books on the desk.',
            'blanks': [
              '___'
            ],
            'answer': 'There is',
            'options': [
              'There is',
              'There are',
              'There have'
            ],
            'voicePrompt': 'There is a pen and two books on the desk.'
          },
          {
            'sentence': '___ many flowers in the garden.',
            'blanks': [
              '___'
            ],
            'answer': 'There are',
            'options': [
              'There is',
              'There are',
              'There has'
            ],
            'voicePrompt': 'There are many flowers in the garden.'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (is/are)',
        'description': '填入 is 或 are',
        'questions': [
          {
            'sentence': 'There ___ a pencil in the box.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'is',
              'are'
            ],
            'voicePrompt': 'There is a pencil in the box.'
          },
          {
            'sentence': 'There ___ many stars in the sky.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'is',
              'are'
            ],
            'voicePrompt': 'There are many stars in the sky.'
          },
          {
            'sentence': 'There ___ some juice in the bottle.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'is',
              'are'
            ],
            'voicePrompt': 'There is some juice in the bottle.'
          },
          {
            'sentence': 'There ___ two dogs in the yard.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'is',
              'are'
            ],
            'voicePrompt': 'There are two dogs in the yard.'
          },
          {
            'sentence': 'There ___ a bridge over the river.',
            'blanks': [
              '___'
            ],
            'answer': 'is',
            'options': [
              'is',
              'are'
            ],
            'voicePrompt': 'There is a bridge over the river.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (否定句)',
        'description': "填入 isn't 或 aren't",
        'questions': [
          {
            'sentence': 'There ___ any milk in the fridge.',
            'blanks': [
              '___'
            ],
            'answer': "isn't",
            'options': [
              "isn't",
              "aren't"
            ],
            'voicePrompt': "There isn't any milk in the fridge."
          },
          {
            'sentence': 'There ___ any students in the classroom.',
            'blanks': [
              '___'
            ],
            'answer': "aren't",
            'options': [
              "isn't",
              "aren't"
            ],
            'voicePrompt': "There aren't any students in the classroom."
          },
          {
            'sentence': 'There ___ a TV in my room.',
            'blanks': [
              '___'
            ],
            'answer': "isn't",
            'options': [
              "isn't",
              "aren't"
            ],
            'voicePrompt': "There isn't a TV in my room."
          },
          {
            'sentence': 'There ___ any apples on the tree.',
            'blanks': [
              '___'
            ],
            'answer': "aren't",
            'options': [
              "isn't",
              "aren't"
            ],
            'voicePrompt': "There aren't any apples on the tree."
          },
          {
            'sentence': 'There ___ any water in the bottle.',
            'blanks': [
              '___'
            ],
            'answer': "isn't",
            'options': [
              "isn't",
              "aren't"
            ],
            'voicePrompt': "There isn't any water in the bottle."
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (疑问句)',
        'description': '填入 Is 或 Are',
        'questions': [
          {
            'sentence': '___ there a bank near here?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Are'
            ],
            'voicePrompt': 'Is there a bank near here?'
          },
          {
            'sentence': '___ there any restaurants nearby?',
            'blanks': [
              '___'
            ],
            'answer': 'Are',
            'options': [
              'Is',
              'Are'
            ],
            'voicePrompt': 'Are there any restaurants nearby?'
          },
          {
            'sentence': '___ there a cat under the bed?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Are'
            ],
            'voicePrompt': 'Is there a cat under the bed?'
          },
          {
            'sentence': '___ there many books in your bag?',
            'blanks': [
              '___'
            ],
            'answer': 'Are',
            'options': [
              'Is',
              'Are'
            ],
            'voicePrompt': 'Are there many books in your bag?'
          },
          {
            'sentence': '___ there some water in the glass?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Is',
              'Are'
            ],
            'voicePrompt': 'Is there some water in the glass?'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (There be)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '桌子上有一本书。',
            'blanks': [],
            'words': [
              'There',
              'a book',
              'on the desk',
              'is'
            ],
            'answer': 'There is a book on the desk.',
            'options': [],
            'voicePrompt': 'There is a book on the desk.'
          },
          {
            'sentence': '花园里有很多花。',
            'blanks': [],
            'words': [
              'many flowers',
              'in the garden',
              'There',
              'are'
            ],
            'answer': 'There are many flowers in the garden.',
            'options': [],
            'voicePrompt': 'There are many flowers in the garden.'
          },
          {
            'sentence': '冰箱里没有牛奶。',
            'blanks': [],
            'words': [
              'any milk',
              'There',
              'in the fridge',
              "isn't"
            ],
            'answer': "There isn't any milk in the fridge.",
            'options': [],
            'voicePrompt': "There isn't any milk in the fridge."
          },
          {
            'sentence': '附近有银行吗？',
            'blanks': [],
            'words': [
              'a bank',
              'Is',
              'near here',
              'there',
              '?'
            ],
            'answer': 'Is there a bank near here?',
            'options': [],
            'voicePrompt': 'Is there a bank near here?'
          },
          {
            'sentence': '杯子里有一些果汁。',
            'blanks': [],
            'words': [
              'some juice',
              'in the glass',
              'There',
              'is'
            ],
            'answer': 'There is some juice in the glass.',
            'options': [],
            'voicePrompt': 'There is some juice in the glass.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (There be 魔王)',
        'description': '找出并修复 There be 句型中的错误！',
        'questions': [
          {
            'wrongSentence': 'There have a book on the desk.',
            'answer': 'is',
            'options': [
              'is',
              'are',
              'have'
            ],
            'explanation': '表示"存在有"要用 There be 句型，不用 have',
            'voicePrompt': 'is'
          },
          {
            'wrongSentence': 'There are a cat under the table.',
            'answer': 'is',
            'options': [
              'is',
              'are',
              'have'
            ],
            'explanation': 'a cat 是单数，要用 There is',
            'voicePrompt': 'is'
          },
          {
            'wrongSentence': 'There is many students in the classroom.',
            'answer': 'are',
            'options': [
              'is',
              'are',
              'have'
            ],
            'explanation': 'many students 是复数，要用 There are',
            'voicePrompt': 'are'
          },
          {
            'wrongSentence': 'Is there any milk? Yes, there are.',
            'answer': 'is',
            'options': [
              'is',
              'are',
              'am'
            ],
            'explanation': 'milk 是不可数名词，回答用 Yes, there is.',
            'voicePrompt': 'is'
          },
          {
            'wrongSentence': "There isn't some water in the bottle.",
            'answer': 'any',
            'options': [
              'some',
              'any',
              'no'
            ],
            'explanation': '否定句中要用 any，不用 some',
            'voicePrompt': 'any'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'preposition',
    'name': '介词',
    'icon': '📍',
    'description': '学习方位介词和时间介词的用法',
    'unlockLevel': 3,
    'tutorial': {
      'title': '介词是什么？',
      'rules': [
        {
          'rule': '方位介词',
          'example': 'in, on, under, behind, in front of, next to',
          'explanation': '表示物体之间的位置关系'
        },
        {
          'rule': '时间介词',
          'example': 'at (具体时间), in (月份/年), on (星期/日期)',
          'explanation': '表示时间关系'
        },
        {
          'rule': '常用搭配',
          'example': "at 7 o'clock, in the morning, on Monday",
          'explanation': '不同时间名词前用不同的介词'
        }
      ],
      'tips': [
        'in: 在...里面 (in the box)',
        'on: 在...上面 (on the table)',
        'under: 在...下面 (under the bed)',
        'at + 具体时间 / 小地点'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (方位介词)',
        'description': '选择正确的位置介词',
        'questions': [
          {
            'sentence': 'The cat is ___ the box. (在盒子里面)',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'in',
              'on',
              'under'
            ],
            'voicePrompt': 'The cat is in the box. (在盒子里面)'
          },
          {
            'sentence': 'The book is ___ the desk. (在桌子上)',
            'blanks': [
              '___'
            ],
            'answer': 'on',
            'options': [
              'in',
              'on',
              'under'
            ],
            'voicePrompt': 'The book is on the desk. (在桌子上)'
          },
          {
            'sentence': 'The ball is ___ the chair. (在椅子下面)',
            'blanks': [
              '___'
            ],
            'answer': 'under',
            'options': [
              'in',
              'on',
              'under'
            ],
            'voicePrompt': 'The ball is under the chair. (在椅子下面)'
          },
          {
            'sentence': 'The school is ___ the park. (在公园旁边)',
            'blanks': [
              '___'
            ],
            'answer': 'next to',
            'options': [
              'next to',
              'in front of',
              'behind'
            ],
            'voicePrompt': 'The school is next to the park. (在公园旁边)'
          },
          {
            'sentence': 'The car is ___ the house. (在房子前面)',
            'blanks': [
              '___'
            ],
            'answer': 'in front of',
            'options': [
              'in front of',
              'behind',
              'next to'
            ],
            'voicePrompt': 'The car is in front of the house. (在房子前面)'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'imageChoice',
        'title': '看图题 (选介词)',
        'description': '根据 emoji 场景选择正确的介词',
        'questions': [
          {
            'emoji': '🐱📦',
            'sentence': 'The cat is ___ the box.',
            'options': [
              'in',
              'on',
              'under',
              'behind'
            ],
            'answer': 'in',
            'prompt': '看图选择正确的介词'
          },
          {
            'emoji': '📚📖➡️📚',
            'sentence': 'The book is ___ the desk.',
            'options': [
              'under',
              'on',
              'in',
              'behind'
            ],
            'answer': 'on',
            'prompt': '看图选择正确的介词'
          },
          {
            'emoji': '⚽🪑',
            'sentence': 'The ball is ___ the chair.',
            'options': [
              'on',
              'under',
              'in',
              'next to'
            ],
            'answer': 'under',
            'prompt': '看图选择正确的介词'
          },
          {
            'emoji': '🏫🌳🏫',
            'sentence': 'The school is ___ the park.',
            'options': [
              'behind',
              'in front of',
              'next to',
              'between'
            ],
            'answer': 'next to',
            'prompt': '看图选择正确的介词'
          },
          {
            'emoji': '🚗🏠',
            'sentence': 'The car is ___ the house.',
            'options': [
              'behind',
              'next to',
              'in front of',
              'under'
            ],
            'answer': 'in front of',
            'prompt': '看图选择正确的介词'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (时间介词)',
        'description': '选择正确的时间介词',
        'questions': [
          {
            'sentence': "I get up ___ 7 o'clock.",
            'blanks': [
              '___'
            ],
            'answer': 'at',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': "I get up at 7 o'clock."
          },
          {
            'sentence': 'We go to the park ___ Sunday.',
            'blanks': [
              '___'
            ],
            'answer': 'on',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'We go to the park on Sunday.'
          },
          {
            'sentence': 'My birthday is ___ May.',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'My birthday is in May.'
          },
          {
            'sentence': 'She was born ___ 2010.',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'She was born in 2010.'
          },
          {
            'sentence': "Let's meet ___ noon.",
            'blanks': [
              '___'
            ],
            'answer': 'at',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': "Let's meet at noon."
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (方位介词)',
        'description': '填入正确的方位介词',
        'questions': [
          {
            'sentence': 'The pencil is ___ the pencil case.',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'in',
              'on',
              'under'
            ],
            'voicePrompt': 'The pencil is in the pencil case.'
          },
          {
            'sentence': 'The picture is ___ the wall.',
            'blanks': [
              '___'
            ],
            'answer': 'on',
            'options': [
              'in',
              'on',
              'at'
            ],
            'voicePrompt': 'The picture is on the wall.'
          },
          {
            'sentence': 'The dog is sleeping ___ the bed.',
            'blanks': [
              '___'
            ],
            'answer': 'under',
            'options': [
              'on',
              'under',
              'behind'
            ],
            'voicePrompt': 'The dog is sleeping under the bed.'
          },
          {
            'sentence': 'The teacher is standing ___ the blackboard.',
            'blanks': [
              '___'
            ],
            'answer': 'in front of',
            'options': [
              'in front of',
              'behind',
              'next to'
            ],
            'voicePrompt': 'The teacher is standing in front of the blackboard.'
          },
          {
            'sentence': 'The supermarket is ___ the bank and the post office.',
            'blanks': [
              '___'
            ],
            'answer': 'between',
            'options': [
              'between',
              'next to',
              'behind'
            ],
            'voicePrompt': 'The supermarket is between the bank and the post office.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (时间介词)',
        'description': '填入 at / in / on',
        'questions': [
          {
            'sentence': 'We have English class ___ Monday.',
            'blanks': [
              '___'
            ],
            'answer': 'on',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'We have English class on Monday.'
          },
          {
            'sentence': 'I usually go to bed ___ 10 pm.',
            'blanks': [
              '___'
            ],
            'answer': 'at',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'I usually go to bed at 10 pm.'
          },
          {
            'sentence': 'It often rains ___ summer.',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'It often rains in summer.'
          },
          {
            'sentence': 'The meeting is ___ Friday morning.',
            'blanks': [
              '___'
            ],
            'answer': 'on',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'The meeting is on Friday morning.'
          },
          {
            'sentence': 'She gets up ___ 6:30.',
            'blanks': [
              '___'
            ],
            'answer': 'at',
            'options': [
              'at',
              'in',
              'on'
            ],
            'voicePrompt': 'She gets up at 6:30.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (介词综合)',
        'description': '根据语境填入正确的介词',
        'questions': [
          {
            'sentence': 'My mother goes to work ___ bus.',
            'blanks': [
              '___'
            ],
            'answer': 'by',
            'options': [
              'by',
              'in',
              'on'
            ],
            'voicePrompt': 'My mother goes to work by bus.'
          },
          {
            'sentence': 'I like to read books ___ bed.',
            'blanks': [
              '___'
            ],
            'answer': 'in',
            'options': [
              'in',
              'on',
              'at'
            ],
            'voicePrompt': 'I like to read books in bed.'
          },
          {
            'sentence': 'There is a bridge ___ the river.',
            'blanks': [
              '___'
            ],
            'answer': 'over',
            'options': [
              'over',
              'on',
              'in'
            ],
            'voicePrompt': 'There is a bridge over the river.'
          },
          {
            'sentence': 'She is sitting ___ me.',
            'blanks': [
              '___'
            ],
            'answer': 'next to',
            'options': [
              'next to',
              'between',
              'in front of'
            ],
            'voicePrompt': 'She is sitting next to me.'
          },
          {
            'sentence': 'The moon goes ___ the clouds.',
            'blanks': [
              '___'
            ],
            'answer': 'behind',
            'options': [
              'behind',
              'under',
              'in'
            ],
            'voicePrompt': 'The moon goes behind the clouds.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (介词)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '猫在桌子下面。',
            'blanks': [],
            'words': [
              'under',
              'The cat',
              'the desk',
              'is'
            ],
            'answer': 'The cat is under the desk.',
            'options': [],
            'voicePrompt': 'The cat is under the desk.'
          },
          {
            'sentence': '我早上七点起床。',
            'blanks': [],
            'words': [
              'I',
              "at 7 o'clock",
              'up',
              'get',
              'in the morning'
            ],
            'answer': "I get up at 7 o'clock in the morning.",
            'options': [],
            'voicePrompt': "I get up at 7 o'clock in the morning."
          },
          {
            'sentence': '学校在公园旁边。',
            'blanks': [],
            'words': [
              'The school',
              'the park',
              'next to',
              'is'
            ],
            'answer': 'The school is next to the park.',
            'options': [],
            'voicePrompt': 'The school is next to the park.'
          },
          {
            'sentence': '她在星期天去公园。',
            'blanks': [],
            'words': [
              'She',
              'to the park',
              'on Sunday',
              'goes'
            ],
            'answer': 'She goes to the park on Sunday.',
            'options': [],
            'voicePrompt': 'She goes to the park on Sunday.'
          },
          {
            'sentence': '书在桌子上吗？',
            'blanks': [],
            'words': [
              'the desk',
              'the book',
              'Is',
              'on',
              '?'
            ],
            'answer': 'Is the book on the desk?',
            'options': [],
            'voicePrompt': 'Is the book on the desk?'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (介词魔王)',
        'description': '找出并修复介词用法中的错误！',
        'questions': [
          {
            'wrongSentence': "I get up in 7 o'clock.",
            'answer': 'at',
            'options': [
              'at',
              'in',
              'on'
            ],
            'explanation': '具体时间点前用 at',
            'voicePrompt': 'at'
          },
          {
            'wrongSentence': 'We go to the park in Sunday.',
            'answer': 'on',
            'options': [
              'at',
              'in',
              'on'
            ],
            'explanation': '星期几前面用 on',
            'voicePrompt': 'on'
          },
          {
            'wrongSentence': 'The cat is on the box. (cat inside box)',
            'answer': 'in',
            'options': [
              'in',
              'on',
              'under'
            ],
            'explanation': '在箱子里面用 in',
            'voicePrompt': 'in'
          },
          {
            'wrongSentence': 'She goes to school by foot.',
            'answer': 'on',
            'options': [
              'by',
              'on',
              'in'
            ],
            'explanation': '"步行"是 on foot，不是 by foot',
            'voicePrompt': 'on'
          },
          {
            'wrongSentence': 'There is a book at the desk. (在桌子上)',
            'answer': 'on',
            'options': [
              'in',
              'on',
              'at'
            ],
            'explanation': '在桌面上用 on',
            'voicePrompt': 'on'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'futureTense',
    'name': '一般将来时',
    'icon': '🔮',
    'description': '学习 will 和 be going to 表达将来的用法',
    'unlockLevel': 3,
    'tutorial': {
      'title': '一般将来时是什么？',
      'rules': [
        {
          'rule': 'will + 动词原形',
          'example': 'I will go to Beijing next week.',
          'explanation': 'will 表达"将要"，后接动词原形'
        },
        {
          'rule': 'be going to + 动词原形',
          'example': 'She is going to buy a new book.',
          'explanation': 'be going to 表达"计划、打算做某事"'
        },
        {
          'rule': '否定和疑问',
          'example': "I will not (won't) go. / Will you come?",
          'explanation': "will not 可缩写为 won't，疑问句将 will 提前"
        }
      ],
      'tips': [
        'will 常用于"临时决定"',
        'be going to 常用于"事先计划"',
        '时间标志词：tomorrow, next week, next year, soon'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (will)',
        'description': '选择正确的 will 形式',
        'questions': [
          {
            'sentence': 'I ___ you tomorrow.',
            'blanks': [
              '___'
            ],
            'answer': 'will call',
            'options': [
              'will call',
              'call',
              'called'
            ],
            'voicePrompt': 'I will call you tomorrow.'
          },
          {
            'sentence': 'She ___ to the party next week.',
            'blanks': [
              '___'
            ],
            'answer': 'will come',
            'options': [
              'will come',
              'comes',
              'came'
            ],
            'voicePrompt': 'She will come to the party next week.'
          },
          {
            'sentence': 'They ___ a new house next year.',
            'blanks': [
              '___'
            ],
            'answer': 'will buy',
            'options': [
              'will buy',
              'buy',
              'bought'
            ],
            'voicePrompt': 'They will buy a new house next year.'
          },
          {
            'sentence': 'He ___ a doctor when he grows up.',
            'blanks': [
              '___'
            ],
            'answer': 'will be',
            'options': [
              'will be',
              'is',
              'was'
            ],
            'voicePrompt': 'He will be a doctor when he grows up.'
          },
          {
            'sentence': 'We ___ you with your homework.',
            'blanks': [
              '___'
            ],
            'answer': 'will help',
            'options': [
              'will help',
              'help',
              'helped'
            ],
            'voicePrompt': 'We will help you with your homework.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (be going to)',
        'description': '选择正确的 be going to 形式',
        'questions': [
          {
            'sentence': 'I ___ visit my grandparents this weekend.',
            'blanks': [
              '___'
            ],
            'answer': 'am going to',
            'options': [
              'am going to',
              'is going to',
              'are going to'
            ],
            'voicePrompt': 'I am going to visit my grandparents this weekend.'
          },
          {
            'sentence': 'She ___ buy a new dress.',
            'blanks': [
              '___'
            ],
            'answer': 'is going to',
            'options': [
              'is going to',
              'am going to',
              'are going to'
            ],
            'voicePrompt': 'She is going to buy a new dress.'
          },
          {
            'sentence': 'They ___ have a picnic tomorrow.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to',
            'options': [
              'are going to',
              'is going to',
              'am going to'
            ],
            'voicePrompt': 'They are going to have a picnic tomorrow.'
          },
          {
            'sentence': 'It ___ rain soon.',
            'blanks': [
              '___'
            ],
            'answer': 'is going to',
            'options': [
              'is going to',
              'am going to',
              'are going to'
            ],
            'voicePrompt': 'It is going to rain soon.'
          },
          {
            'sentence': 'We ___ learn English next year.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to',
            'options': [
              'are going to',
              'is going to',
              'am going to'
            ],
            'voicePrompt': 'We are going to learn English next year.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (将来时综合)',
        'description': '选择 will 或 be going to',
        'questions': [
          {
            'sentence': 'The phone is ringing. I ___ answer it.',
            'blanks': [
              '___'
            ],
            'answer': 'will',
            'options': [
              'will',
              'am going to',
              'am'
            ],
            'voicePrompt': 'The phone is ringing. I will answer it.'
          },
          {
            'sentence': 'She ___ take an exam next Monday.',
            'blanks': [
              '___'
            ],
            'answer': 'is going to',
            'options': [
              'will',
              'is going to',
              'is'
            ],
            'voicePrompt': 'She is going to take an exam next Monday.'
          },
          {
            'sentence': 'I promise I ___ be late again.',
            'blanks': [
              '___'
            ],
            'answer': "won't",
            'options': [
              "won't",
              "don't",
              'am not going to'
            ],
            'voicePrompt': "I promise I won't be late again."
          },
          {
            'sentence': 'We ___ travel to Japan next summer.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to',
            'options': [
              'will',
              'are going to',
              'are'
            ],
            'voicePrompt': 'We are going to travel to Japan next summer.'
          },
          {
            'sentence': '___ you come to my party?',
            'blanks': [
              '___'
            ],
            'answer': 'Will',
            'options': [
              'Will',
              'Are',
              'Do'
            ],
            'voicePrompt': 'Will you come to my party?'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (will)',
        'description': '填入 will + 动词的正确形式',
        'questions': [
          {
            'sentence': 'I ___ (be) there on time.',
            'blanks': [
              '___'
            ],
            'answer': 'will be',
            'options': [
              'will be',
              'am',
              'was'
            ],
            'voicePrompt': 'I will be (be) there on time.'
          },
          {
            'sentence': 'She ___ (not/go) to school tomorrow.',
            'blanks': [
              '___'
            ],
            'answer': "won't go",
            'options': [
              "won't go",
              "doesn't go",
              "isn't going"
            ],
            'voicePrompt': "She won't go (not/go) to school tomorrow."
          },
          {
            'sentence': '___ you help me?',
            'blanks': [
              '___'
            ],
            'answer': 'Will',
            'options': [
              'Will',
              'Do',
              'Are'
            ],
            'voicePrompt': 'Will you help me?'
          },
          {
            'sentence': 'They ___ (build) a new school next year.',
            'blanks': [
              '___'
            ],
            'answer': 'will build',
            'options': [
              'will build',
              'build',
              'built'
            ],
            'voicePrompt': 'They will build (build) a new school next year.'
          },
          {
            'sentence': 'He ___ (not/be) happy about it.',
            'blanks': [
              '___'
            ],
            'answer': "won't be",
            'options': [
              "won't be",
              "isn't",
              "wasn't"
            ],
            'voicePrompt': "He won't be (not/be) happy about it."
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (be going to)',
        'description': '填入 be going to 的正确形式',
        'questions': [
          {
            'sentence': 'I ___ (buy) a new phone.',
            'blanks': [
              '___'
            ],
            'answer': 'am going to buy',
            'options': [
              'am going to buy',
              'will buy',
              'buy'
            ],
            'voicePrompt': 'I am going to buy (buy) a new phone.'
          },
          {
            'sentence': 'She ___ (study) abroad.',
            'blanks': [
              '___'
            ],
            'answer': 'is going to study',
            'options': [
              'is going to study',
              'studies',
              'studied'
            ],
            'voicePrompt': 'She is going to study (study) abroad.'
          },
          {
            'sentence': 'We ___ (have) a meeting this afternoon.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to have',
            'options': [
              'are going to have',
              'have',
              'had'
            ],
            'voicePrompt': 'We are going to have (have) a meeting this afternoon.'
          },
          {
            'sentence': 'It ___ (snow) tonight.',
            'blanks': [
              '___'
            ],
            'answer': 'is going to snow',
            'options': [
              'is going to snow',
              'snows',
              'snowed'
            ],
            'voicePrompt': 'It is going to snow (snow) tonight.'
          },
          {
            'sentence': 'They ___ (move) to a new city.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to move',
            'options': [
              'are going to move',
              'move',
              'moved'
            ],
            'voicePrompt': 'They are going to move (move) to a new city.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (将来时综合)',
        'description': '根据语境填入正确的将来时形式',
        'questions': [
          {
            'sentence': 'Wait, I ___ (open) the door for you.',
            'blanks': [
              '___'
            ],
            'answer': 'will open',
            'options': [
              'will open',
              'am going to open',
              'open'
            ],
            'voicePrompt': 'Wait, I will open (open) the door for you.'
          },
          {
            'sentence': 'Next year, I ___ (be) 12 years old.',
            'blanks': [
              '___'
            ],
            'answer': 'will be',
            'options': [
              'will be',
              'am',
              'was'
            ],
            'voicePrompt': 'Next year, I will be (be) 12 years old.'
          },
          {
            'sentence': 'They ___ (get) married next month.',
            'blanks': [
              '___'
            ],
            'answer': 'are going to get',
            'options': [
              'are going to get',
              'will get',
              'get'
            ],
            'voicePrompt': 'They are going to get (get) married next month.'
          },
          {
            'sentence': 'I think it ___ (rain) tomorrow.',
            'blanks': [
              '___'
            ],
            'answer': 'will rain',
            'options': [
              'will rain',
              'is going to rain',
              'rains'
            ],
            'voicePrompt': 'I think it will rain (rain) tomorrow.'
          },
          {
            'sentence': 'She ___ (not/come) to the party.',
            'blanks': [
              '___'
            ],
            'answer': "won't come",
            'options': [
              "won't come",
              "doesn't come",
              "isn't coming"
            ],
            'voicePrompt': "She won't come (not/come) to the party."
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (将来时)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '我明天会打电话给你。',
            'blanks': [],
            'words': [
              'I',
              'you',
              'will call',
              'tomorrow'
            ],
            'answer': 'I will call you tomorrow.',
            'options': [],
            'voicePrompt': 'I will call you tomorrow.'
          },
          {
            'sentence': '她下星期要去北京。',
            'blanks': [],
            'words': [
              'She',
              'to Beijing',
              'is going to',
              'next week',
              'go'
            ],
            'answer': 'She is going to go to Beijing next week.',
            'options': [],
            'voicePrompt': 'She is going to go to Beijing next week.'
          },
          {
            'sentence': '你明天会来吗？',
            'blanks': [],
            'words': [
              'Will',
              'come',
              'you',
              'tomorrow',
              '?'
            ],
            'answer': 'Will you come tomorrow?',
            'options': [],
            'voicePrompt': 'Will you come tomorrow?'
          },
          {
            'sentence': '明天不会下雨。',
            'blanks': [],
            'words': [
              'It',
              'tomorrow',
              "won't",
              'rain'
            ],
            'answer': "It won't rain tomorrow.",
            'options': [],
            'voicePrompt': "It won't rain tomorrow."
          },
          {
            'sentence': '我今天晚上要做作业。',
            'blanks': [],
            'words': [
              'I',
              'tonight',
              'do',
              'am going to',
              'my homework'
            ],
            'answer': 'I am going to do my homework tonight.',
            'options': [],
            'voicePrompt': 'I am going to do my homework tonight.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (将来时魔王)',
        'description': '找出并修复将来时中的错误！',
        'questions': [
          {
            'wrongSentence': 'I will going to Beijing tomorrow.',
            'answer': 'go',
            'options': [
              'go',
              'going',
              'went'
            ],
            'explanation': 'will 后面要用动词原形，不是 -ing',
            'voicePrompt': 'go'
          },
          {
            'wrongSentence': 'She go to buy a book.',
            'answer': 'goes',
            'options': [
              'go',
              'goes',
              'going'
            ],
            'explanation': '第三人称单数主语后动词要加 -s 或 -es',
            'voicePrompt': 'goes'
          },
          {
            'wrongSentence': 'He will not comes tomorrow.',
            'answer': 'come',
            'options': [
              'come',
              'comes',
              'came'
            ],
            'explanation': 'will 后面动词用原形',
            'voicePrompt': 'come'
          },
          {
            'wrongSentence': 'I is going to visit my grandma.',
            'answer': 'am',
            'options': [
              'am',
              'is',
              'are'
            ],
            'explanation': 'I 后面 be 动词要用 am',
            'voicePrompt': 'am'
          },
          {
            'wrongSentence': 'Will she goes to school tomorrow?',
            'answer': 'go',
            'options': [
              'go',
              'goes',
              'went'
            ],
            'explanation': 'Will 后面动词用原形',
            'voicePrompt': 'go'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'pastTense',
    'name': '一般过去时',
    'icon': '📅',
    'description': '学习一般过去时的规则动词和不规则动词变化',
    'unlockLevel': 4,
    'tutorial': {
      'title': '一般过去时是什么？',
      'rules': [
        {
          'rule': '规则动词过去式加 -ed',
          'example': 'play → played, watch → watched, study → studied',
          'explanation': '一般加 -ed，以 e 结尾加 -d，辅音+y 变 y 为 i 加 -ed'
        },
        {
          'rule': '不规则动词需单独记忆',
          'example': 'go → went, eat → ate, see → saw, buy → bought',
          'explanation': '不规则动词变化没有统一规则，需要逐个记忆'
        },
        {
          'rule': 'be 动词过去式',
          'example': 'am/is → was, are → were',
          'explanation': 'I/he/she/it 用 was，you/we/they 用 were'
        }
      ],
      'tips': [
        '过去时表示已经发生的动作',
        '时间标志词：yesterday, last week, ago, in 2020',
        'be 动词过去式只有 was 和 were 两种形式'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (be动词过去式)',
        'description': '选择 was 或 were',
        'questions': [
          {
            'sentence': 'I ___ at home yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'was',
            'options': [
              'was',
              'were',
              'am'
            ],
            'voicePrompt': 'I was at home yesterday.'
          },
          {
            'sentence': 'They ___ in the park last Sunday.',
            'blanks': [
              '___'
            ],
            'answer': 'were',
            'options': [
              'was',
              'were',
              'are'
            ],
            'voicePrompt': 'They were in the park last Sunday.'
          },
          {
            'sentence': 'She ___ very happy yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'was',
            'options': [
              'was',
              'were',
              'is'
            ],
            'voicePrompt': 'She was very happy yesterday.'
          },
          {
            'sentence': 'We ___ at school yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'were',
            'options': [
              'was',
              'were',
              'are'
            ],
            'voicePrompt': 'We were at school yesterday.'
          },
          {
            'sentence': 'He ___ late for class this morning.',
            'blanks': [
              '___'
            ],
            'answer': 'was',
            'options': [
              'was',
              'were',
              'is'
            ],
            'voicePrompt': 'He was late for class this morning.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (规则动词过去式)',
        'description': '选择正确的过去式形式',
        'questions': [
          {
            'sentence': 'I ___ TV last night.',
            'blanks': [
              '___'
            ],
            'answer': 'watched',
            'options': [
              'watch',
              'watched',
              'watching'
            ],
            'voicePrompt': 'I watched TV last night.'
          },
          {
            'sentence': 'She ___ her room yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'cleaned',
            'options': [
              'clean',
              'cleaned',
              'cleaning'
            ],
            'voicePrompt': 'She cleaned her room yesterday.'
          },
          {
            'sentence': 'They ___ basketball after school.',
            'blanks': [
              '___'
            ],
            'answer': 'played',
            'options': [
              'play',
              'played',
              'playing'
            ],
            'voicePrompt': 'They played basketball after school.'
          },
          {
            'sentence': 'He ___ his homework last night.',
            'blanks': [
              '___'
            ],
            'answer': 'studied',
            'options': [
              'study',
              'studied',
              'studying'
            ],
            'voicePrompt': 'He studied his homework last night.'
          },
          {
            'sentence': 'We ___ to the park yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'walked',
            'options': [
              'walk',
              'walked',
              'walking'
            ],
            'voicePrompt': 'We walked to the park yesterday.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'verbTable',
        'title': '动词表 (不规则动词配对)',
        'description': '将动词原形与过去式配对',
        'questions': [
          {
            'sentence': '将动词原形与过去式配对',
            'prompt': '将动词原形与过去式配对',
            'baseForms': [
              'go',
              'eat',
              'see',
              'buy',
              'have'
            ],
            'pastForms': [
              'went',
              'ate',
              'saw',
              'bought',
              'had'
            ],
            'answer': 'go-went|eat-ate|see-saw|buy-bought|have-had'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (不规则动词)',
        'description': '填入动词的正确过去式',
        'questions': [
          {
            'sentence': 'I ___ (go) to the zoo yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'went',
            'options': [
              'go',
              'went',
              'gone'
            ],
            'voicePrompt': 'I went (go) to the zoo yesterday.'
          },
          {
            'sentence': 'She ___ (eat) an apple for breakfast.',
            'blanks': [
              '___'
            ],
            'answer': 'ate',
            'options': [
              'eat',
              'ate',
              'eaten'
            ],
            'voicePrompt': 'She ate (eat) an apple for breakfast.'
          },
          {
            'sentence': 'We ___ (see) a beautiful rainbow.',
            'blanks': [
              '___'
            ],
            'answer': 'saw',
            'options': [
              'see',
              'saw',
              'seen'
            ],
            'voicePrompt': 'We saw (see) a beautiful rainbow.'
          },
          {
            'sentence': 'He ___ (buy) a new book yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'bought',
            'options': [
              'buy',
              'bought',
              'buys'
            ],
            'voicePrompt': 'He bought (buy) a new book yesterday.'
          },
          {
            'sentence': 'They ___ (have) a great time at the party.',
            'blanks': [
              '___'
            ],
            'answer': 'had',
            'options': [
              'have',
              'had',
              'has'
            ],
            'voicePrompt': 'They had (have) a great time at the party.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (否定句)',
        'description': "填入 didn't + 动词原形",
        'questions': [
          {
            'sentence': 'I ___ (not/go) to school yesterday.',
            'blanks': [
              '___'
            ],
            'answer': "didn't go",
            'options': [
              "didn't go",
              'went not',
              'not went'
            ],
            'voicePrompt': "I didn't go (not/go) to school yesterday."
          },
          {
            'sentence': 'She ___ (not/eat) breakfast this morning.',
            'blanks': [
              '___'
            ],
            'answer': "didn't eat",
            'options': [
              "didn't eat",
              'ate not',
              'not ate'
            ],
            'voicePrompt': "She didn't eat (not/eat) breakfast this morning."
          },
          {
            'sentence': 'They ___ (not/play) outside yesterday.',
            'blanks': [
              '___'
            ],
            'answer': "didn't play",
            'options': [
              "didn't play",
              'played not',
              'not played'
            ],
            'voicePrompt': "They didn't play (not/play) outside yesterday."
          },
          {
            'sentence': 'He ___ (not/do) his homework.',
            'blanks': [
              '___'
            ],
            'answer': "didn't do",
            'options': [
              "didn't do",
              'did not',
              'not did'
            ],
            'voicePrompt': "He didn't do (not/do) his homework."
          },
          {
            'sentence': 'We ___ (not/watch) TV last night.',
            'blanks': [
              '___'
            ],
            'answer': "didn't watch",
            'options': [
              "didn't watch",
              'watched not',
              'not watched'
            ],
            'voicePrompt': "We didn't watch (not/watch) TV last night."
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (过去时综合)',
        'description': '根据语境填入正确的过去时形式',
        'questions': [
          {
            'sentence': 'I ___ (be) very tired last night.',
            'blanks': [
              '___'
            ],
            'answer': 'was',
            'options': [
              'was',
              'were',
              'am'
            ],
            'voicePrompt': 'I was (be) very tired last night.'
          },
          {
            'sentence': 'She ___ (begin) to learn English two years ago.',
            'blanks': [
              '___'
            ],
            'answer': 'began',
            'options': [
              'begin',
              'began',
              'begun'
            ],
            'voicePrompt': 'She began (begin) to learn English two years ago.'
          },
          {
            'sentence': 'They ___ (swim) in the sea last summer.',
            'blanks': [
              '___'
            ],
            'answer': 'swam',
            'options': [
              'swim',
              'swam',
              'swimming'
            ],
            'voicePrompt': 'They swam (swim) in the sea last summer.'
          },
          {
            'sentence': 'He ___ (write) a letter to his friend yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'wrote',
            'options': [
              'write',
              'wrote',
              'written'
            ],
            'voicePrompt': 'He wrote (write) a letter to his friend yesterday.'
          },
          {
            'sentence': 'We ___ (fly) to Beijing last week.',
            'blanks': [
              '___'
            ],
            'answer': 'flew',
            'options': [
              'fly',
              'flew',
              'flown'
            ],
            'voicePrompt': 'We flew (fly) to Beijing last week.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (过去时)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '我昨天去了动物园。',
            'blanks': [],
            'words': [
              'I',
              'to the zoo',
              'went',
              'yesterday'
            ],
            'answer': 'I went to the zoo yesterday.',
            'options': [],
            'voicePrompt': 'I went to the zoo yesterday.'
          },
          {
            'sentence': '她昨天晚上看了电视。',
            'blanks': [],
            'words': [
              'She',
              'last night',
              'watched',
              'TV'
            ],
            'answer': 'She watched TV last night.',
            'options': [],
            'voicePrompt': 'She watched TV last night.'
          },
          {
            'sentence': '他昨天没有上学。',
            'blanks': [],
            'words': [
              'He',
              'to school',
              "didn't",
              'go',
              'yesterday'
            ],
            'answer': "He didn't go to school yesterday.",
            'options': [],
            'voicePrompt': "He didn't go to school yesterday."
          },
          {
            'sentence': '你昨天吃了什么？',
            'blanks': [],
            'words': [
              'What',
              'you',
              'eat',
              'did',
              'yesterday',
              '?'
            ],
            'answer': 'What did you eat yesterday?',
            'options': [],
            'voicePrompt': 'What did you eat yesterday?'
          },
          {
            'sentence': '他们上周买了一辆车。',
            'blanks': [],
            'words': [
              'a car',
              'They',
              'last week',
              'bought'
            ],
            'answer': 'They bought a car last week.',
            'options': [],
            'voicePrompt': 'They bought a car last week.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (过去时魔王)',
        'description': '找出并修复过去时中的错误！',
        'questions': [
          {
            'wrongSentence': 'I go to the zoo yesterday.',
            'answer': 'went',
            'options': [
              'go',
              'went',
              'gone'
            ],
            'explanation': 'yesterday 是过去时间，要用过去式',
            'voicePrompt': 'went'
          },
          {
            'wrongSentence': "She didn't went to school.",
            'answer': 'go',
            'options': [
              'go',
              'went',
              'goes'
            ],
            'explanation': "didn't 后面要用动词原形",
            'voicePrompt': 'go'
          },
          {
            'wrongSentence': 'They was at home yesterday.',
            'answer': 'were',
            'options': [
              'was',
              'were',
              'are'
            ],
            'explanation': 'They 是复数，要用 were',
            'voicePrompt': 'were'
          },
          {
            'wrongSentence': 'He watch TV last night.',
            'answer': 'watched',
            'options': [
              'watch',
              'watched',
              'watching'
            ],
            'explanation': '过去时动词要用过去式',
            'voicePrompt': 'watched'
          },
          {
            'wrongSentence': 'I buyed a book yesterday.',
            'answer': 'bought',
            'options': [
              'buyed',
              'bought',
              'buy'
            ],
            'explanation': 'buy 是不规则动词，过去式是 bought',
            'voicePrompt': 'bought'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'questionForm',
    'name': '疑问句',
    'icon': '❓',
    'description': '学习一般疑问句和特殊疑问句的构成',
    'unlockLevel': 3,
    'tutorial': {
      'title': '疑问句是什么？',
      'rules': [
        {
          'rule': '一般疑问句 (Yes/No Questions)',
          'example': 'Are you a student? / Do you like apples?',
          'explanation': '用 be/do/does/can 等助动词开头，回答用 Yes/No'
        },
        {
          'rule': '特殊疑问句 (Wh- Questions)',
          'example': 'What is your name? / Where do you live?',
          'explanation': '用 What/Where/When/Why/How 等疑问词开头'
        },
        {
          'rule': '疑问词用法',
          'example': 'What(什么), Where(哪里), When(何时), Why(为什么), How(如何)',
          'explanation': '不同疑问词询问不同信息'
        }
      ],
      'tips': [
        '一般疑问句: 助动词 + 主语 + 谓语?',
        '特殊疑问句: 疑问词 + 一般疑问句语序?',
        'What 问事物，Where 问地点，When 问时间，Why 问原因'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (疑问词)',
        'description': '选择正确的疑问词',
        'questions': [
          {
            'sentence': '___ is your name?',
            'blanks': [
              '___'
            ],
            'answer': 'What',
            'options': [
              'What',
              'Where',
              'When'
            ],
            'voicePrompt': 'What is your name?'
          },
          {
            'sentence': '___ do you live?',
            'blanks': [
              '___'
            ],
            'answer': 'Where',
            'options': [
              'What',
              'Where',
              'When'
            ],
            'voicePrompt': 'Where do you live?'
          },
          {
            'sentence': '___ do you get up every day?',
            'blanks': [
              '___'
            ],
            'answer': 'When',
            'options': [
              'What',
              'Where',
              'When'
            ],
            'voicePrompt': 'When do you get up every day?'
          },
          {
            'sentence': '___ are you late?',
            'blanks': [
              '___'
            ],
            'answer': 'Why',
            'options': [
              'What',
              'Why',
              'How'
            ],
            'voicePrompt': 'Why are you late?'
          },
          {
            'sentence': '___ do you go to school?',
            'blanks': [
              '___'
            ],
            'answer': 'How',
            'options': [
              'What',
              'Who',
              'How'
            ],
            'voicePrompt': 'How do you go to school?'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'transform',
        'title': '转换题 (→一般疑问句)',
        'description': '从选项中选择正确的一般疑问句形式',
        'questions': [
          {
            'sentence': 'You are a student.',
            'prompt': '选择正确的一般疑问句：',
            'options': [
              'Are you a student?',
              'Do you are a student?',
              'You are a student?'
            ],
            'answer': 'Are you a student?'
          },
          {
            'sentence': 'She likes apples.',
            'prompt': '选择正确的一般疑问句：',
            'options': [
              'Likes she apples?',
              'Does she like apples?',
              'Does she likes apples?'
            ],
            'answer': 'Does she like apples?'
          },
          {
            'sentence': 'They play football.',
            'prompt': '选择正确的一般疑问句：',
            'options': [
              'Play they football?',
              'Do they play football?',
              'Do they plays football?'
            ],
            'answer': 'Do they play football?'
          },
          {
            'sentence': 'He can swim.',
            'prompt': '选择正确的一般疑问句：',
            'options': [
              'Can he swim?',
              'Does he can swim?',
              'He can swim?'
            ],
            'answer': 'Can he swim?'
          },
          {
            'sentence': 'We went to the park.',
            'prompt': '选择正确的一般疑问句：',
            'options': [
              'Went we to the park?',
              'Did we go to the park?',
              'Did we went to the park?'
            ],
            'answer': 'Did we go to the park?'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'transform',
        'title': '转换题 (→特殊疑问句)',
        'description': '选择正确的特殊疑问句形式',
        'questions': [
          {
            'sentence': 'My name is Tom.',
            'prompt': '对 Tom 提问：',
            'options': [
              'What is your name?',
              'What your name is?',
              'Your name is what?'
            ],
            'answer': 'What is your name?'
          },
          {
            'sentence': 'I live in Beijing.',
            'prompt': '对 Beijing 提问：',
            'options': [
              'Where you live?',
              'Where do you live?',
              'Do you live in Beijing?'
            ],
            'answer': 'Where do you live?'
          },
          {
            'sentence': "I get up at 7 o'clock.",
            'prompt': "对 at 7 o'clock 提问：",
            'options': [
              'When do you get up?',
              'What time do you get up?',
              'Do you get up at 7?'
            ],
            'answer': 'What time do you get up?'
          },
          {
            'sentence': 'I am late because I missed the bus.',
            'prompt': '对 because... 提问：',
            'options': [
              'Why are you late?',
              'What are you late?',
              'How are you late?'
            ],
            'answer': 'Why are you late?'
          },
          {
            'sentence': 'I go to school by bus.',
            'prompt': '对 by bus 提问：',
            'options': [
              'How do you go to school?',
              'What do you go to school?',
              'Where do you go?'
            ],
            'answer': 'How do you go to school?'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (疑问词)',
        'description': '填入正确的疑问词 (What/Where/When/Why/How)',
        'questions': [
          {
            'sentence': '___ is your favorite color?',
            'blanks': [
              '___'
            ],
            'answer': 'What',
            'options': [
              'What',
              'Where',
              'How'
            ],
            'voicePrompt': 'What is your favorite color?'
          },
          {
            'sentence': '___ is the supermarket?',
            'blanks': [
              '___'
            ],
            'answer': 'Where',
            'options': [
              'What',
              'Where',
              'When'
            ],
            'voicePrompt': 'Where is the supermarket?'
          },
          {
            'sentence': '___ do you usually have lunch?',
            'blanks': [
              '___'
            ],
            'answer': 'When',
            'options': [
              'What',
              'Where',
              'When'
            ],
            'voicePrompt': 'When do you usually have lunch?'
          },
          {
            'sentence': '___ are you crying?',
            'blanks': [
              '___'
            ],
            'answer': 'Why',
            'options': [
              'What',
              'Why',
              'How'
            ],
            'voicePrompt': 'Why are you crying?'
          },
          {
            'sentence': '___ many apples do you have?',
            'blanks': [
              '___'
            ],
            'answer': 'How',
            'options': [
              'What',
              'How',
              'Why'
            ],
            'voicePrompt': 'How many apples do you have?'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (一般疑问句)',
        'description': '填入 Do / Does / Are / Is / Can',
        'questions': [
          {
            'sentence': '___ you like music?',
            'blanks': [
              '___'
            ],
            'answer': 'Do',
            'options': [
              'Do',
              'Does',
              'Are'
            ],
            'voicePrompt': 'Do you like music?'
          },
          {
            'sentence': '___ she speak English?',
            'blanks': [
              '___'
            ],
            'answer': 'Does',
            'options': [
              'Do',
              'Does',
              'Is'
            ],
            'voicePrompt': 'Does she speak English?'
          },
          {
            'sentence': '___ you a teacher?',
            'blanks': [
              '___'
            ],
            'answer': 'Are',
            'options': [
              'Do',
              'Are',
              'Is'
            ],
            'voicePrompt': 'Are you a teacher?'
          },
          {
            'sentence': '___ he your brother?',
            'blanks': [
              '___'
            ],
            'answer': 'Is',
            'options': [
              'Do',
              'Are',
              'Is'
            ],
            'voicePrompt': 'Is he your brother?'
          },
          {
            'sentence': '___ you swim?',
            'blanks': [
              '___'
            ],
            'answer': 'Can',
            'options': [
              'Do',
              'Can',
              'Are'
            ],
            'voicePrompt': 'Can you swim?'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (疑问句综合)',
        'description': '根据答句填入正确的疑问词或助动词',
        'questions': [
          {
            'sentence': '___ is your best friend? — Tom is.',
            'blanks': [
              '___'
            ],
            'answer': 'Who',
            'options': [
              'What',
              'Who',
              'Where'
            ],
            'voicePrompt': 'Who is your best friend? — Tom is.'
          },
          {
            'sentence': '___ old are you? — I am 10.',
            'blanks': [
              '___'
            ],
            'answer': 'How',
            'options': [
              'What',
              'How',
              'When'
            ],
            'voicePrompt': 'How old are you? — I am 10.'
          },
          {
            'sentence': '___ color do you like? — Blue.',
            'blanks': [
              '___'
            ],
            'answer': 'What',
            'options': [
              'What',
              'How',
              'Which'
            ],
            'voicePrompt': 'What color do you like? — Blue.'
          },
          {
            'sentence': '___ are you going? — To the library.',
            'blanks': [
              '___'
            ],
            'answer': 'Where',
            'options': [
              'What',
              'Where',
              'Who'
            ],
            'voicePrompt': 'Where are you going? — To the library.'
          },
          {
            'sentence': "___ do you go to bed? — At 9 o'clock.",
            'blanks': [
              '___'
            ],
            'answer': 'When',
            'options': [
              'What',
              'When',
              'Why'
            ],
            'voicePrompt': "When do you go to bed? — At 9 o'clock."
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (疑问句)',
        'description': '拖拽单词组成正确的疑问句',
        'questions': [
          {
            'sentence': '你叫什么名字？',
            'blanks': [],
            'words': [
              'What',
              'your name',
              'is',
              '?'
            ],
            'answer': 'What is your name?',
            'options': [],
            'voicePrompt': 'What is your name?'
          },
          {
            'sentence': '你住在哪里？',
            'blanks': [],
            'words': [
              'Where',
              'you',
              'live',
              'do',
              '?'
            ],
            'answer': 'Where do you live?',
            'options': [],
            'voicePrompt': 'Where do you live?'
          },
          {
            'sentence': '你会游泳吗？',
            'blanks': [],
            'words': [
              'Can',
              'swim',
              'you',
              '?'
            ],
            'answer': 'Can you swim?',
            'options': [],
            'voicePrompt': 'Can you swim?'
          },
          {
            'sentence': '她喜欢猫吗？',
            'blanks': [],
            'words': [
              'she',
              'Does',
              'like',
              'cats',
              '?'
            ],
            'answer': 'Does she like cats?',
            'options': [],
            'voicePrompt': 'Does she like cats?'
          },
          {
            'sentence': '你为什么迟到了？',
            'blanks': [],
            'words': [
              'Why',
              'you',
              'are',
              'late',
              '?'
            ],
            'answer': 'Why are you late?',
            'options': [],
            'voicePrompt': 'Why are you late?'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (疑问句魔王)',
        'description': '找出并修复疑问句中的错误！',
        'questions': [
          {
            'wrongSentence': 'Does she likes apples?',
            'answer': 'like',
            'options': [
              'like',
              'likes',
              'liked'
            ],
            'explanation': 'Does 后面动词用原形',
            'voicePrompt': 'like'
          },
          {
            'wrongSentence': 'Are you like music?',
            'answer': 'Do',
            'options': [
              'Do',
              'Are',
              'Is'
            ],
            'explanation': 'like 是实义动词，要用 Do 提问',
            'voicePrompt': 'Do'
          },
          {
            'wrongSentence': 'Where does you live?',
            'answer': 'do',
            'options': [
              'do',
              'does',
              'are'
            ],
            'explanation': '主语 you 要用 do 提问',
            'voicePrompt': 'do'
          },
          {
            'wrongSentence': 'Why is you late?',
            'answer': 'are',
            'options': [
              'are',
              'is',
              'am'
            ],
            'explanation': 'you 的 be 动词是 are',
            'voicePrompt': 'are'
          },
          {
            'wrongSentence': 'What am your name?',
            'answer': 'is',
            'options': [
              'is',
              'are',
              'am'
            ],
            'explanation': '问名字用 What is',
            'voicePrompt': 'is'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'comparative',
    'name': '比较级和最高级',
    'icon': '📊',
    'description': '学习形容词的比较级和最高级变化规则',
    'unlockLevel': 3,
    'tutorial': {
      'title': '比较级和最高级是什么？',
      'rules': [
        {
          'rule': '比较级 (Comparative)',
          'example': 'tall → taller, big → bigger, happy → happier',
          'explanation': '两者比较用比较级，通常加 -er'
        },
        {
          'rule': '最高级 (Superlative)',
          'example': 'tall → tallest, big → biggest, happy → happiest',
          'explanation': '三者以上比较用最高级，通常加 -est，前面加 the'
        },
        {
          'rule': '多音节形容词',
          'example': 'beautiful → more beautiful, the most beautiful',
          'explanation': '多音节形容词前加 more / most 构成比较级/最高级'
        }
      ],
      'tips': [
        '比较级常用于 than 结构',
        '最高级前一定要加 the',
        '以重读闭音节结尾要双写尾字母 (big → bigger)',
        '以 y 结尾的辅音字母要变 y 为 i (happy → happier)'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (比较级)',
        'description': '选择正确的比较级形式',
        'questions': [
          {
            'sentence': 'Tom is ___ than Jerry.',
            'blanks': [
              '___'
            ],
            'answer': 'taller',
            'options': [
              'tall',
              'taller',
              'tallest'
            ],
            'voicePrompt': 'Tom is taller than Jerry.'
          },
          {
            'sentence': 'My bag is ___ than yours.',
            'blanks': [
              '___'
            ],
            'answer': 'bigger',
            'options': [
              'big',
              'bigger',
              'biggest'
            ],
            'voicePrompt': 'My bag is bigger than yours.'
          },
          {
            'sentence': 'She is ___ than me.',
            'blanks': [
              '___'
            ],
            'answer': 'happier',
            'options': [
              'happy',
              'happier',
              'happiest'
            ],
            'voicePrompt': 'She is happier than me.'
          },
          {
            'sentence': 'This book is ___ than that one.',
            'blanks': [
              '___'
            ],
            'answer': 'more interesting',
            'options': [
              'interesting',
              'more interesting',
              'most interesting'
            ],
            'voicePrompt': 'This book is more interesting than that one.'
          },
          {
            'sentence': 'Summer is ___ than spring.',
            'blanks': [
              '___'
            ],
            'answer': 'hotter',
            'options': [
              'hot',
              'hotter',
              'hottest'
            ],
            'voicePrompt': 'Summer is hotter than spring.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (最高级)',
        'description': '选择正确的最高级形式',
        'questions': [
          {
            'sentence': 'He is the ___ boy in our class.',
            'blanks': [
              '___'
            ],
            'answer': 'tallest',
            'options': [
              'tall',
              'taller',
              'tallest'
            ],
            'voicePrompt': 'He is the tallest boy in our class.'
          },
          {
            'sentence': 'This is the ___ mountain in the world.',
            'blanks': [
              '___'
            ],
            'answer': 'highest',
            'options': [
              'high',
              'higher',
              'highest'
            ],
            'voicePrompt': 'This is the highest mountain in the world.'
          },
          {
            'sentence': 'She is the ___ student in our school.',
            'blanks': [
              '___'
            ],
            'answer': 'best',
            'options': [
              'good',
              'better',
              'best'
            ],
            'voicePrompt': 'She is the best student in our school.'
          },
          {
            'sentence': 'It is the ___ day of my life.',
            'blanks': [
              '___'
            ],
            'answer': 'happiest',
            'options': [
              'happy',
              'happier',
              'happiest'
            ],
            'voicePrompt': 'It is the happiest day of my life.'
          },
          {
            'sentence': 'This is the ___ movie I have ever seen.',
            'blanks': [
              '___'
            ],
            'answer': 'most exciting',
            'options': [
              'exciting',
              'more exciting',
              'most exciting'
            ],
            'voicePrompt': 'This is the most exciting movie I have ever seen.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'verbTable',
        'title': '变形表 (形容词比较级)',
        'description': '将形容词与比较级形式配对',
        'questions': [
          {
            'sentence': '将形容词原级与比较级配对',
            'prompt': '将形容词与比较级形式配对',
            'baseForms': [
              'tall',
              'big',
              'happy',
              'beautiful',
              'good'
            ],
            'pastForms': [
              'taller',
              'bigger',
              'happier',
              'more beautiful',
              'better'
            ],
            'answer': 'tall-taller|big-bigger|happy-happier|beautiful-more beautiful|good-better'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (比较级)',
        'description': '填入正确的比较级形式',
        'questions': [
          {
            'sentence': 'This car is ___ (fast) than that one.',
            'blanks': [
              '___'
            ],
            'answer': 'faster',
            'options': [
              'faster',
              'fast',
              'fastest'
            ],
            'voicePrompt': 'This car is faster (fast) than that one.'
          },
          {
            'sentence': 'She is ___ (young) than me.',
            'blanks': [
              '___'
            ],
            'answer': 'younger',
            'options': [
              'young',
              'younger',
              'youngest'
            ],
            'voicePrompt': 'She is younger (young) than me.'
          },
          {
            'sentence': 'The weather today is ___ (good) than yesterday.',
            'blanks': [
              '___'
            ],
            'answer': 'better',
            'options': [
              'good',
              'better',
              'best'
            ],
            'voicePrompt': 'The weather today is better (good) than yesterday.'
          },
          {
            'sentence': 'He runs ___ (fast) than his brother.',
            'blanks': [
              '___'
            ],
            'answer': 'faster',
            'options': [
              'faster',
              'fast',
              'fastest'
            ],
            'voicePrompt': 'He runs faster (fast) than his brother.'
          },
          {
            'sentence': 'This question is ___ (easy) than that one.',
            'blanks': [
              '___'
            ],
            'answer': 'easier',
            'options': [
              'easy',
              'easier',
              'easiest'
            ],
            'voicePrompt': 'This question is easier (easy) than that one.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (最高级)',
        'description': '填入正确的最高级形式',
        'questions': [
          {
            'sentence': 'Mount Everest is the ___ (high) mountain.',
            'blanks': [
              '___'
            ],
            'answer': 'highest',
            'options': [
              'high',
              'higher',
              'highest'
            ],
            'voicePrompt': 'Mount Everest is the highest (high) mountain.'
          },
          {
            'sentence': 'She is the ___ (smart) girl I know.',
            'blanks': [
              '___'
            ],
            'answer': 'smartest',
            'options': [
              'smart',
              'smarter',
              'smartest'
            ],
            'voicePrompt': 'She is the smartest (smart) girl I know.'
          },
          {
            'sentence': 'This is the ___ (bad) day ever.',
            'blanks': [
              '___'
            ],
            'answer': 'worst',
            'options': [
              'bad',
              'worse',
              'worst'
            ],
            'voicePrompt': 'This is the worst (bad) day ever.'
          },
          {
            'sentence': 'He is the ___ (popular) student in our class.',
            'blanks': [
              '___'
            ],
            'answer': 'most popular',
            'options': [
              'popular',
              'more popular',
              'most popular'
            ],
            'voicePrompt': 'He is the most popular (popular) student in our class.'
          },
          {
            'sentence': 'Winter is the ___ (cold) season.',
            'blanks': [
              '___'
            ],
            'answer': 'coldest',
            'options': [
              'cold',
              'colder',
              'coldest'
            ],
            'voicePrompt': 'Winter is the coldest (cold) season.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (比较级综合)',
        'description': '根据语境填入正确的比较级或最高级形式',
        'questions': [
          {
            'sentence': 'She is ___ (tall) than her sister.',
            'blanks': [
              '___'
            ],
            'answer': 'taller',
            'options': [
              'tall',
              'taller',
              'tallest'
            ],
            'voicePrompt': 'She is taller (tall) than her sister.'
          },
          {
            'sentence': 'Which is ___ (big), the sun or the moon?',
            'blanks': [
              '___'
            ],
            'answer': 'bigger',
            'options': [
              'big',
              'bigger',
              'biggest'
            ],
            'voicePrompt': 'Which is bigger (big), the sun or the moon?'
          },
          {
            'sentence': 'He is the ___ (good) player on the team.',
            'blanks': [
              '___'
            ],
            'answer': 'best',
            'options': [
              'good',
              'better',
              'best'
            ],
            'voicePrompt': 'He is the best (good) player on the team.'
          },
          {
            'sentence': 'This book is ___ (interesting) than that one.',
            'blanks': [
              '___'
            ],
            'answer': 'more interesting',
            'options': [
              'interesting',
              'more interesting',
              'most interesting'
            ],
            'voicePrompt': 'This book is more interesting (interesting) than that one.'
          },
          {
            'sentence': 'It is the ___ (hot) day of the year.',
            'blanks': [
              '___'
            ],
            'answer': 'hottest',
            'options': [
              'hot',
              'hotter',
              'hottest'
            ],
            'voicePrompt': 'It is the hottest (hot) day of the year.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (比较级)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '汤姆比杰瑞高。',
            'blanks': [],
            'words': [
              'Tom',
              'taller',
              'is',
              'than Jerry'
            ],
            'answer': 'Tom is taller than Jerry.',
            'options': [],
            'voicePrompt': 'Tom is taller than Jerry.'
          },
          {
            'sentence': '她是我们班最高的。',
            'blanks': [],
            'words': [
              'She',
              'in our class',
              'the tallest',
              'is'
            ],
            'answer': 'She is the tallest in our class.',
            'options': [],
            'voicePrompt': 'She is the tallest in our class.'
          },
          {
            'sentence': '这本书比那本有趣。',
            'blanks': [],
            'words': [
              'This book',
              'than that one',
              'is',
              'more interesting'
            ],
            'answer': 'This book is more interesting than that one.',
            'options': [],
            'voicePrompt': 'This book is more interesting than that one.'
          },
          {
            'sentence': '夏天比冬天热。',
            'blanks': [],
            'words': [
              'Summer',
              'hotter',
              'than winter',
              'is'
            ],
            'answer': 'Summer is hotter than winter.',
            'options': [],
            'voicePrompt': 'Summer is hotter than winter.'
          },
          {
            'sentence': '这是最好的一天。',
            'blanks': [],
            'words': [
              'the best day',
              'This',
              'is'
            ],
            'answer': 'This is the best day.',
            'options': [],
            'voicePrompt': 'This is the best day.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (比较级魔王)',
        'description': '找出并修复比较级用法中的错误！',
        'questions': [
          {
            'wrongSentence': 'She is tall than me.',
            'answer': 'taller',
            'options': [
              'tall',
              'taller',
              'tallest'
            ],
            'explanation': '比较级要用 taller，不是 tall',
            'voicePrompt': 'taller'
          },
          {
            'wrongSentence': 'He is the more smart student.',
            'answer': 'smartest',
            'options': [
              'smart',
              'smarter',
              'smartest'
            ],
            'explanation': 'smart 的单音节词最高级是 smartest',
            'voicePrompt': 'smartest'
          },
          {
            'wrongSentence': 'This book is gooder than that one.',
            'answer': 'better',
            'options': [
              'good',
              'gooder',
              'better'
            ],
            'explanation': 'good 的比较级是不规则变化 better',
            'voicePrompt': 'better'
          },
          {
            'wrongSentence': 'She is beautifuller than her mother.',
            'answer': 'more beautiful',
            'options': [
              'beautifuller',
              'more beautiful',
              'most beautiful'
            ],
            'explanation': '多音节词比较级用 more',
            'voicePrompt': 'more beautiful'
          },
          {
            'wrongSentence': 'He is the most tall boy.',
            'answer': 'tallest',
            'options': [
              'tall',
              'tallest',
              'taller'
            ],
            'explanation': 'tall 的最高级是 tallest',
            'voicePrompt': 'tallest'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'article',
    'name': '冠词',
    'icon': '📌',
    'description': '学习冠词 a, an, the 以及零冠词的用法',
    'unlockLevel': 3,
    'tutorial': {
      'title': '冠词是什么？',
      'rules': [
        {
          'rule': '不定冠词 a / an',
          'example': 'a book, an apple',
          'explanation': 'a 用于辅音音素开头，an 用于元音音素开头'
        },
        {
          'rule': '定冠词 the',
          'example': 'the sun, the book on the desk',
          'explanation': '特指某人/物或独一无二的事物用 the'
        },
        {
          'rule': '零冠词',
          'example': 'I like dogs. / He goes to school.',
          'explanation': '泛指复数名词、三餐、运动、科目等不用冠词'
        }
      ],
      'tips': [
        'a 用在辅音音素前 (a university)',
        'an 用在元音音素前 (an hour)',
        'the 用于双方都知道的事物',
        '第一次提到用 a/an，再次提到用 the'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (a/an)',
        'description': '选择 a 或 an',
        'questions': [
          {
            'sentence': 'I have ___ apple.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'I have an apple.'
          },
          {
            'sentence': 'She is ___ teacher.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'She is a teacher.'
          },
          {
            'sentence': 'It is ___ hour later.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'It is an hour later.'
          },
          {
            'sentence': 'He is ___ university student.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'He is a university student.'
          },
          {
            'sentence': 'This is ___ interesting book.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an'
            ],
            'voicePrompt': 'This is an interesting book.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (the)',
        'description': '选择是否用 the',
        'questions': [
          {
            'sentence': '___ sun rises in the east.',
            'blanks': [
              '___'
            ],
            'answer': 'The',
            'options': [
              'A',
              'An',
              'The'
            ],
            'voicePrompt': 'The sun rises in the east.'
          },
          {
            'sentence': 'I have a cat. ___ cat is black.',
            'blanks': [
              '___'
            ],
            'answer': 'The',
            'options': [
              'A',
              'An',
              'The'
            ],
            'voicePrompt': 'I have a cat. The cat is black.'
          },
          {
            'sentence': 'Close ___ door, please.',
            'blanks': [
              '___'
            ],
            'answer': 'the',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'Close the door, please.'
          },
          {
            'sentence': 'She plays ___ piano.',
            'blanks': [
              '___'
            ],
            'answer': 'the',
            'options': [
              'a',
              'the',
              'no article'
            ],
            'voicePrompt': 'She plays the piano.'
          },
          {
            'sentence': 'He is ___ best student in our class.',
            'blanks': [
              '___'
            ],
            'answer': 'the',
            'options': [
              'a',
              'the',
              'no article'
            ],
            'voicePrompt': 'He is the best student in our class.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (冠词辨析)',
        'description': '选择正确的冠词或零冠词',
        'questions': [
          {
            'sentence': 'I like ___ dogs.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'a',
              'the',
              'no article'
            ],
            'voicePrompt': 'I like no article dogs.'
          },
          {
            'sentence': 'She has ___ orange.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'She has an orange.'
          },
          {
            'sentence': 'We go to ___ school every day.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'the',
              'a',
              'no article'
            ],
            'voicePrompt': 'We go to no article school every day.'
          },
          {
            'sentence': '___ moon is very bright tonight.',
            'blanks': [
              '___'
            ],
            'answer': 'The',
            'options': [
              'A',
              'An',
              'The'
            ],
            'voicePrompt': 'The moon is very bright tonight.'
          },
          {
            'sentence': 'I want to be ___ engineer.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'I want to be an engineer.'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (a/an/the)',
        'description': '填入 a / an / the',
        'questions': [
          {
            'sentence': 'I saw ___ elephant in the zoo.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'I saw an elephant in the zoo.'
          },
          {
            'sentence': '___ book on the table is mine.',
            'blanks': [
              '___'
            ],
            'answer': 'The',
            'options': [
              'A',
              'An',
              'The'
            ],
            'voicePrompt': 'The book on the table is mine.'
          },
          {
            'sentence': 'She is ___ honest girl.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'She is an honest girl.'
          },
          {
            'sentence': 'There is ___ park near my home.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'There is a park near my home.'
          },
          {
            'sentence': '___ earth goes around the sun.',
            'blanks': [
              '___'
            ],
            'answer': 'The',
            'options': [
              'A',
              'An',
              'The'
            ],
            'voicePrompt': 'The earth goes around the sun.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (零冠词)',
        'description': '判断是否需要用冠词，不用填"X"',
        'questions': [
          {
            'sentence': "I have breakfast at 7 o'clock. I love ___ breakfast.",
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'a',
              'the',
              'no article'
            ],
            'voicePrompt': "I have breakfast at 7 o'clock. I love no article breakfast."
          },
          {
            'sentence': "She goes to ___ bed at 9 o'clock.",
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'the',
              'no article',
              'a'
            ],
            'voicePrompt': "She goes to no article bed at 9 o'clock."
          },
          {
            'sentence': 'They play ___ football after school.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'the',
              'a',
              'no article'
            ],
            'voicePrompt': 'They play no article football after school.'
          },
          {
            'sentence': 'He studies ___ English every day.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'the',
              'an',
              'no article'
            ],
            'voicePrompt': 'He studies no article English every day.'
          },
          {
            'sentence': 'We have ___ lunch at noon.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'a',
              'the',
              'no article'
            ],
            'voicePrompt': 'We have no article lunch at noon.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (冠词综合)',
        'description': '根据语境填入正确的冠词或零冠词',
        'questions': [
          {
            'sentence': "I have ___ idea. Let's go to the park.",
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': "I have an idea. Let's go to the park."
          },
          {
            'sentence': '___ dog is a faithful animal.',
            'blanks': [
              '___'
            ],
            'answer': 'no article',
            'options': [
              'The',
              'A',
              'no article'
            ],
            'voicePrompt': 'no article dog is a faithful animal.'
          },
          {
            'sentence': 'She is ___ only child in her family.',
            'blanks': [
              '___'
            ],
            'answer': 'the',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'She is the only child in her family.'
          },
          {
            'sentence': 'There is ___ book on the desk. The book is red.',
            'blanks': [
              '___'
            ],
            'answer': 'a',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'There is a book on the desk. The book is red.'
          },
          {
            'sentence': 'He wants to be ___ astronaut when he grows up.',
            'blanks': [
              '___'
            ],
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'voicePrompt': 'He wants to be an astronaut when he grows up.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (冠词)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '我有一本书。这本书很有趣。',
            'blanks': [],
            'words': [
              'I',
              'a book',
              'have',
              'The book',
              'interesting',
              'is'
            ],
            'answer': 'I have a book The book is interesting',
            'options': [],
            'voicePrompt': 'I have a book. The book is interesting.'
          },
          {
            'sentence': '她是一个诚实的孩子。',
            'blanks': [],
            'words': [
              'She',
              'an honest girl',
              'is'
            ],
            'answer': 'She is an honest girl',
            'options': [],
            'voicePrompt': 'She is an honest girl.'
          },
          {
            'sentence': '太阳从东方升起。',
            'blanks': [],
            'words': [
              'The sun',
              'in the east',
              'rises'
            ],
            'answer': 'The sun rises in the east',
            'options': [],
            'voicePrompt': 'The sun rises in the east.'
          },
          {
            'sentence': '请关上门。',
            'blanks': [],
            'words': [
              'Please',
              'the door',
              'close'
            ],
            'answer': 'Please close the door',
            'options': [],
            'voicePrompt': 'Please close the door.'
          },
          {
            'sentence': '他每天上学。',
            'blanks': [],
            'words': [
              'He',
              'to school',
              'goes',
              'every day'
            ],
            'answer': 'He goes to school every day',
            'options': [],
            'voicePrompt': 'He goes to school every day.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (冠词魔王)',
        'description': '找出并修复冠词用法中的错误！',
        'questions': [
          {
            'wrongSentence': 'She is a engineer.',
            'answer': 'an',
            'options': [
              'a',
              'an',
              'the'
            ],
            'explanation': 'engineer 以元音音素开头，要用 an',
            'voicePrompt': 'an'
          },
          {
            'wrongSentence': 'The sun is a star. (太阳是恒星)',
            'answer': 'no article',
            'options': [
              'A',
              'The',
              'no article'
            ],
            'explanation': 'sun 是独一无二的，不用冠词 (作表语用 a)',
            'voicePrompt': 'no article'
          },
          {
            'wrongSentence': 'I have an university degree.',
            'answer': 'a',
            'options': [
              'a',
              'an',
              'the'
            ],
            'explanation': 'university 以辅音音素开头，要用 a',
            'voicePrompt': 'a'
          },
          {
            'wrongSentence': 'The dogs are animals. (狗是动物)',
            'answer': 'no article',
            'options': [
              'The',
              'A',
              'no article'
            ],
            'explanation': '泛指复数时不用冠词',
            'voicePrompt': 'no article'
          },
          {
            'wrongSentence': 'She is a best student in class.',
            'answer': 'the',
            'options': [
              'a',
              'an',
              'the'
            ],
            'explanation': '最高级前要用 the',
            'voicePrompt': 'the'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'basicClause',
    'name': '基础从句',
    'icon': '🔀',
    'description': '学习使用连词连接句子和基础的从句结构',
    'unlockLevel': 5,
    'tutorial': {
      'title': '从句是什么？',
      'rules': [
        {
          'rule': '并列句 (Compound Sentences)',
          'example': 'I like tea, and she likes coffee.',
          'explanation': '用 and/but/or 连接两个简单句'
        },
        {
          'rule': '原因状语从句',
          'example': 'I stayed home because it was raining.',
          'explanation': 'because 引导原因状语从句'
        },
        {
          'rule': '条件状语从句',
          'example': 'If it rains, I will stay home.',
          'explanation': 'if 引导条件状语从句'
        }
      ],
      'tips': [
        'and 表示并列/递进',
        'but 表示转折',
        'because 表示原因',
        'so 表示结果',
        'if 表示条件'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (连词选择)',
        'description': '选择正确的连词',
        'questions': [
          {
            'sentence': "I like apples ___ I don't like pears.",
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': "I like apples but I don't like pears."
          },
          {
            'sentence': 'He was tired, ___ he went to bed early.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'He was tired, so he went to bed early.'
          },
          {
            'sentence': '___ it rains, we will stay inside.',
            'blanks': [
              '___'
            ],
            'answer': 'If',
            'options': [
              'If',
              'Because',
              'So'
            ],
            'voicePrompt': 'If it rains, we will stay inside.'
          },
          {
            'sentence': 'I stayed home ___ I was sick.',
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'I stayed home because I was sick.'
          },
          {
            'sentence': 'She sings ___ she dances.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'She sings and she dances.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (连词辨析)',
        'description': '选择正确的连词填空',
        'questions': [
          {
            'sentence': 'I want to go out, ___ it is raining.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'I want to go out, but it is raining.'
          },
          {
            'sentence': 'He studied hard, ___ he passed the exam.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'He studied hard, so he passed the exam.'
          },
          {
            'sentence': '___ you work hard, you will succeed.',
            'blanks': [
              '___'
            ],
            'answer': 'If',
            'options': [
              'If',
              'Because',
              'So'
            ],
            'voicePrompt': 'If you work hard, you will succeed.'
          },
          {
            'sentence': "She didn't go to school ___ she was ill.",
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': "She didn't go to school because she was ill."
          },
          {
            'sentence': 'My brother ___ I both like football.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'My brother and I both like football.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'connector',
        'title': '连接题 (选连词)',
        'description': '选择合适的连词连接两句話',
        'questions': [
          {
            'sentence': '选择合适的连词连接句子',
            'prompt': '选择合适的连词连接句子',
            'sentences': [
              'I was tired',
              'I went to bed early'
            ],
            'options': [
              'because',
              'so',
              'but',
              'and'
            ],
            'answer': 'so'
          },
          {
            'sentence': '选择合适的连词连接句子',
            'prompt': '选择合适的连词连接句子',
            'sentences': [
              'She is rich',
              'she is not happy'
            ],
            'options': [
              'because',
              'so',
              'but',
              'and'
            ],
            'answer': 'but'
          },
          {
            'sentence': '选择合适的连词连接句子',
            'prompt': '选择合适的连词连接句子',
            'sentences': [
              'He stayed home',
              'it was raining'
            ],
            'options': [
              'because',
              'so',
              'but',
              'if'
            ],
            'answer': 'because'
          },
          {
            'sentence': '选择合适的连词连接句子',
            'prompt': '选择合适的连词连接句子',
            'sentences': [
              'You study hard',
              'you will pass'
            ],
            'options': [
              'because',
              'so',
              'but',
              'if'
            ],
            'answer': 'if'
          },
          {
            'sentence': '选择合适的连词连接句子',
            'prompt': '选择合适的连词连接句子',
            'sentences': [
              'I like singing',
              'I like dancing'
            ],
            'options': [
              'because',
              'so',
              'but',
              'and'
            ],
            'answer': 'and'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (连词填空)',
        'description': '填入正确的连词 (and/but/so/because/if)',
        'questions': [
          {
            'sentence': "I called him, ___ he didn't answer.",
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': "I called him, but he didn't answer."
          },
          {
            'sentence': 'She woke up late, ___ she missed the bus.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'She woke up late, so she missed the bus.'
          },
          {
            'sentence': "___ you are free, let's go shopping.",
            'blanks': [
              '___'
            ],
            'answer': 'If',
            'options': [
              'If',
              'Because',
              'So'
            ],
            'voicePrompt': "If you are free, let's go shopping."
          },
          {
            'sentence': "He failed the test ___ he didn't study.",
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': "He failed the test because he didn't study."
          },
          {
            'sentence': 'I bought apples ___ oranges at the store.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'I bought apples and oranges at the store.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (从句动词形式)',
        'description': '根据语境填入正确的动词形式',
        'questions': [
          {
            'sentence': 'If it ___ (rain) tomorrow, I will stay home.',
            'blanks': [
              '___'
            ],
            'answer': 'rains',
            'options': [
              'rain',
              'rains',
              'rained'
            ],
            'voicePrompt': 'If it rains (rain) tomorrow, I will stay home.'
          },
          {
            'sentence': 'I will call you when I ___ (get) home.',
            'blanks': [
              '___'
            ],
            'answer': 'get',
            'options': [
              'get',
              'gets',
              'got'
            ],
            'voicePrompt': 'I will call you when I get (get) home.'
          },
          {
            'sentence': 'She is happy because she ___ (get) a gift.',
            'blanks': [
              '___'
            ],
            'answer': 'got',
            'options': [
              'get',
              'gets',
              'got'
            ],
            'voicePrompt': 'She is happy because she got (get) a gift.'
          },
          {
            'sentence': 'If you ___ (be) tired, take a rest.',
            'blanks': [
              '___'
            ],
            'answer': 'are',
            'options': [
              'am',
              'are',
              'is'
            ],
            'voicePrompt': 'If you are (be) tired, take a rest.'
          },
          {
            'sentence': 'He stayed home because he ___ (be) sick.',
            'blanks': [
              '___'
            ],
            'answer': 'was',
            'options': [
              'is',
              'was',
              'were'
            ],
            'voicePrompt': 'He stayed home because he was (be) sick.'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (综合填空)',
        'description': '填入正确的连词或动词形式',
        'questions': [
          {
            'sentence': 'I like coffee, ___ my sister likes tea.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'I like coffee, but my sister likes tea.'
          },
          {
            'sentence': "___ you don't hurry, you will be late.",
            'blanks': [
              '___'
            ],
            'answer': 'If',
            'options': [
              'If',
              'Because',
              'So'
            ],
            'voicePrompt': "If you don't hurry, you will be late."
          },
          {
            'sentence': 'She cried ___ she watched a sad movie.',
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'She cried because she watched a sad movie.'
          },
          {
            'sentence': 'He studied hard ___ he could pass the exam.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'He studied hard so he could pass the exam.'
          },
          {
            'sentence': 'I will go to bed after I ___ (finish) my homework.',
            'blanks': [
              '___'
            ],
            'answer': 'finish',
            'options': [
              'finish',
              'finishes',
              'finished'
            ],
            'voicePrompt': 'I will go to bed after I finish (finish) my homework.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (从句)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '如果明天下雨，我就呆在家里。',
            'blanks': [],
            'words': [
              'If',
              'I will stay home',
              'it rains',
              'tomorrow'
            ],
            'answer': 'If it rains tomorrow, I will stay home.',
            'options': [],
            'voicePrompt': 'If it rains tomorrow, I will stay home.'
          },
          {
            'sentence': '她很开心因为她得到了礼物。',
            'blanks': [],
            'words': [
              'She is happy',
              'she got a gift',
              'because'
            ],
            'answer': 'She is happy because she got a gift.',
            'options': [],
            'voicePrompt': 'She is happy because she got a gift.'
          },
          {
            'sentence': '我累了所以我上床睡觉了。',
            'blanks': [],
            'words': [
              'I was tired',
              'I went to bed',
              'so'
            ],
            'answer': 'I was tired so I went to bed.',
            'options': [],
            'voicePrompt': 'I was tired so I went to bed.'
          },
          {
            'sentence': '我想去但是下雨了。',
            'blanks': [],
            'words': [
              'I want to go out',
              'it is raining',
              'but'
            ],
            'answer': 'I want to go out but it is raining.',
            'options': [],
            'voicePrompt': 'I want to go out but it is raining.'
          },
          {
            'sentence': '你努力学习就会成功。',
            'blanks': [],
            'words': [
              'If',
              'you will succeed',
              'you study hard'
            ],
            'answer': 'If you study hard, you will succeed.',
            'options': [],
            'voicePrompt': 'If you study hard, you will succeed.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (从句魔王)',
        'description': '找出并修复从句中的错误！',
        'questions': [
          {
            'wrongSentence': 'If it rain tomorrow, I will stay home.',
            'answer': 'rains',
            'options': [
              'rain',
              'rains',
              'rained'
            ],
            'explanation': 'if 条件句中第三人称单数用 rains',
            'voicePrompt': 'rains'
          },
          {
            'wrongSentence': 'I studied hard because I want to pass.',
            'answer': 'wanted',
            'options': [
              'want',
              'wanted',
              'will want'
            ],
            'explanation': '主句过去时，从句也应用过去时',
            'voicePrompt': 'wanted'
          },
          {
            'wrongSentence': 'She is happy so she got a gift.',
            'answer': 'because',
            'options': [
              'because',
              'so',
              'and'
            ],
            'explanation': '此处"因为"要用 because 连接',
            'voicePrompt': 'because'
          },
          {
            'wrongSentence': 'I want to go out and it is raining.',
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'explanation': '表示转折关系要用 but',
            'voicePrompt': 'but'
          },
          {
            'wrongSentence': 'I worked hard but I passed the exam.',
            'answer': 'so',
            'options': [
              'so',
              'but',
              'and'
            ],
            'explanation': '"所以"要用 so 连接',
            'voicePrompt': 'so'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'conjunction',
    'name': '连词塔',
    'icon': '🔗',
    'description': '掌握 and/but/or/so/because 等连词的用法！',
    'unlockLevel': 2,
    'tutorial': {
      'title': '连词是什么？',
      'rules': [
        {
          'rule': 'and 表示并列/递进',
          'example': 'I like apples and oranges.',
          'explanation': 'and 连接两个并列的成分'
        },
        {
          'rule': 'but 表示转折',
          'example': "I like apples but I don't like pears.",
          'explanation': 'but 连接表示转折关系的两部分'
        },
        {
          'rule': 'or 表示选择',
          'example': 'Do you like tea or coffee?',
          'explanation': 'or 用于连接选择项'
        },
        {
          'rule': 'so 表示结果',
          'example': 'I was tired, so I went to bed.',
          'explanation': 'so 连接因果关系中的结果'
        },
        {
          'rule': 'because 表示原因',
          'example': 'I stayed home because it was raining.',
          'explanation': 'because 连接因果关系中的原因'
        }
      ],
      'tips': [
        'and 连接肯定并列',
        'but 引出相反信息',
        'or 用于否定句和疑问句中',
        'so 前面通常有逗号',
        'because 回答 why 的提问'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (and 并列连接)',
        'description': '选择正确的 and 用法',
        'questions': [
          {
            'sentence': 'I like apples ___ oranges.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'or'
            ],
            'voicePrompt': 'I like apples and oranges.'
          },
          {
            'sentence': 'She can sing ___ dance.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'She can sing and dance.'
          },
          {
            'sentence': 'My brother ___ I both like football.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'or',
              'but'
            ],
            'voicePrompt': 'My brother and I both like football.'
          },
          {
            'sentence': 'He is smart ___ hardworking.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'because'
            ],
            'voicePrompt': 'He is smart and hardworking.'
          },
          {
            'sentence': 'We have a cat ___ a dog.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'or',
              'so'
            ],
            'voicePrompt': 'We have a cat and a dog.'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (but 转折关系)',
        'description': '选择正确的 but 用法',
        'questions': [
          {
            'sentence': "I like apples ___ I don't like pears.",
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': "I like apples but I don't like pears."
          },
          {
            'sentence': 'She is rich ___ she is not happy.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'because'
            ],
            'voicePrompt': 'She is rich but she is not happy.'
          },
          {
            'sentence': 'He studied hard ___ still failed.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'but',
              'so',
              'and'
            ],
            'voicePrompt': 'He studied hard but still failed.'
          },
          {
            'sentence': 'I want to go out ___ it is raining.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'but',
              'and',
              'or'
            ],
            'voicePrompt': 'I want to go out but it is raining.'
          },
          {
            'sentence': 'The movie is long ___ it is interesting.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'The movie is long but it is interesting.'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'choice',
        'title': '选择题 (or 选择关系)',
        'description': '选择正确的 or 用法',
        'questions': [
          {
            'sentence': 'Do you like tea ___ coffee?',
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'but'
            ],
            'voicePrompt': 'Do you like tea or coffee?'
          },
          {
            'sentence': 'You can stay ___ leave.',
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'so'
            ],
            'voicePrompt': 'You can stay or leave.'
          },
          {
            'sentence': 'Is this your book ___ his book?',
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'but'
            ],
            'voicePrompt': 'Is this your book or his book?'
          },
          {
            'sentence': "I don't like milk ___ coffee.",
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'but'
            ],
            'voicePrompt': "I don't like milk or coffee."
          },
          {
            'sentence': 'Which is bigger, a cat ___ a dog?',
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'than'
            ],
            'voicePrompt': 'Which is bigger, a cat or a dog?'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'fillBlank',
        'title': '填空题 (so/because 因果)',
        'description': '填入 so 或 because',
        'questions': [
          {
            'sentence': 'I was tired, ___ I went to bed early.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'so',
              'because',
              'but'
            ],
            'voicePrompt': 'I was tired, so I went to bed early.'
          },
          {
            'sentence': 'I stayed home ___ it was raining.',
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'so',
              'because',
              'but'
            ],
            'voicePrompt': 'I stayed home because it was raining.'
          },
          {
            'sentence': 'She woke up late, ___ she missed the bus.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'so',
              'because',
              'and'
            ],
            'voicePrompt': 'She woke up late, so she missed the bus.'
          },
          {
            'sentence': "He was sick ___ he didn't go to school.",
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'so',
              'because',
              'but'
            ],
            'voicePrompt': "He was sick because he didn't go to school."
          },
          {
            'sentence': 'He studied hard, ___ he passed the exam.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'so',
              'because',
              'but'
            ],
            'voicePrompt': 'He studied hard, so he passed the exam.'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'categorize',
        'title': '分类题 (连词分类)',
        'description': '将连词拖入正确的分类',
        'questions': [
          {
            'sentence': '将下列连词分类',
            'prompt': '将下列连词分为并列、转折、因果、选择四类',
            'items': [
              'and',
              'but',
              'because',
              'or',
              'so',
              'yet',
              'for',
              'nor'
            ],
            'categories': [
              {
                'id': 'coordinate',
                'label': '并列/递进',
                'icon': '➕'
              },
              {
                'id': 'contrast',
                'label': '转折/对比',
                'icon': '🔄'
              },
              {
                'id': 'cause',
                'label': '因果/原因',
                'icon': '➡️'
              },
              {
                'id': 'choice',
                'label': '选择/条件',
                'icon': '❓'
              }
            ],
            'answer': 'and:coordinate,but:contrast,because:cause,or:choice,so:cause,yet:contrast,for:cause,nor:coordinate'
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (连词综合)',
        'description': '填入正确的连词 (and/but/or/so/because)',
        'questions': [
          {
            'sentence': 'I like summer ___ I can go swimming.',
            'blanks': [
              '___'
            ],
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'I like summer because I can go swimming.'
          },
          {
            'sentence': 'Hurry up ___ you will be late.',
            'blanks': [
              '___'
            ],
            'answer': 'or',
            'options': [
              'and',
              'or',
              'so'
            ],
            'voicePrompt': 'Hurry up or you will be late.'
          },
          {
            'sentence': 'He ran fast, ___ he caught the bus.',
            'blanks': [
              '___'
            ],
            'answer': 'so',
            'options': [
              'because',
              'so',
              'but'
            ],
            'voicePrompt': 'He ran fast, so he caught the bus.'
          },
          {
            'sentence': 'She is kind ___ helpful.',
            'blanks': [
              '___'
            ],
            'answer': 'and',
            'options': [
              'and',
              'but',
              'or'
            ],
            'voicePrompt': 'She is kind and helpful.'
          },
          {
            'sentence': 'I like coffee ___ my sister likes tea.',
            'blanks': [
              '___'
            ],
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'voicePrompt': 'I like coffee but my sister likes tea.'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (连词)',
        'description': '拖拽单词组成正确的句子',
        'questions': [
          {
            'sentence': '我累了所以我上床睡觉了。',
            'blanks': [],
            'words': [
              'I',
              'tired',
              'was',
              'so',
              'I went to bed'
            ],
            'answer': 'I was tired so I went to bed.',
            'options': [],
            'voicePrompt': 'I was tired so I went to bed.'
          },
          {
            'sentence': '她喜欢猫和狗。',
            'blanks': [],
            'words': [
              'She',
              'dogs',
              'likes',
              'cats',
              'and'
            ],
            'answer': 'She likes cats and dogs.',
            'options': [],
            'voicePrompt': 'She likes cats and dogs.'
          },
          {
            'sentence': '你想喝茶还是咖啡？',
            'blanks': [],
            'words': [
              'you',
              'tea',
              'Do',
              'or',
              'want',
              'coffee',
              '?'
            ],
            'answer': 'Do you want tea or coffee?',
            'options': [],
            'voicePrompt': 'Do you want tea or coffee?'
          },
          {
            'sentence': '他努力学习但是考试没通过。',
            'blanks': [],
            'words': [
              'He',
              'but',
              'hard',
              'failed',
              'studied'
            ],
            'answer': 'He studied hard but failed.',
            'options': [],
            'voicePrompt': 'He studied hard but failed.'
          },
          {
            'sentence': '因为我生病了所以呆在家里。',
            'blanks': [],
            'words': [
              'I',
              'was sick',
              'home',
              'because',
              'stayed'
            ],
            'answer': 'I stayed home because I was sick.',
            'options': [],
            'voicePrompt': 'I stayed home because I was sick.'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (连词魔王)',
        'description': '找出并修复连词用法中的错误！',
        'questions': [
          {
            'wrongSentence': "I like apples so I don't like pears.",
            'answer': 'but',
            'options': [
              'and',
              'but',
              'so'
            ],
            'explanation': '表示转折用 but，不是 so',
            'voicePrompt': 'but'
          },
          {
            'wrongSentence': 'Do you like tea and coffee?',
            'answer': 'or',
            'options': [
              'and',
              'or',
              'but'
            ],
            'explanation': '疑问句中表示选择要用 or',
            'voicePrompt': 'or'
          },
          {
            'wrongSentence': 'I stayed home so I was sick.',
            'answer': 'because',
            'options': [
              'because',
              'so',
              'but'
            ],
            'explanation': '表示"因为"要用 because',
            'voicePrompt': 'because'
          },
          {
            'wrongSentence': 'I was tired because I went to bed.',
            'answer': 'so',
            'options': [
              'so',
              'because',
              'but'
            ],
            'explanation': '表示"所以"要用 so',
            'voicePrompt': 'so'
          },
          {
            'wrongSentence': 'She can sing but dance.',
            'answer': 'and',
            'options': [
              'and',
              'but',
              'or'
            ],
            'explanation': '表示并列关系要用 and',
            'voicePrompt': 'and'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'phrase',
    'name': '常用语塔',
    'icon': '💬',
    'description': '学习问候、购物、交通、就餐等场景的常用表达！',
    'unlockLevel': 1,
    'tutorial': {
      'title': '常用语是什么？',
      'rules': [
        {
          'rule': '问候 (Greetings)',
          'example': 'Good morning! How are you?',
          'explanation': '日常见面使用的礼貌用语'
        },
        {
          'rule': '购物 (Shopping)',
          'example': "How much is it? I'd like to buy...",
          'explanation': '购物时询问价格和表达需求'
        },
        {
          'rule': '交通 (Transportation)',
          'example': 'Excuse me, where is the bus stop?',
          'explanation': '问路和乘坐交通工具的表达'
        },
        {
          'rule': '就餐 (Dining)',
          'example': "I'd like to order... Check, please!",
          'explanation': '餐厅点单和结账用语'
        },
        {
          'rule': '天气 (Weather)',
          'example': "It's sunny today. What's the weather like?",
          'explanation': '谈论天气的常用表达'
        },
        {
          'rule': '爱好 (Hobbies)',
          'example': 'I like reading. What do you like to do?',
          'explanation': '谈论兴趣爱好'
        }
      ],
      'tips': [
        'Good morning 用于中午12点前',
        'How much 询问价格',
        'Excuse me 用于打扰别人',
        'Check, please 用于餐厅结账',
        'Nice to meet you 初次见面用'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'choice',
        'title': '选择题 (问候表达)',
        'description': '选择正确的问候用语',
        'questions': [
          {
            'sentence': '早上好！—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'Good morning!',
            'options': [
              'Good morning!',
              'Good night!',
              'Goodbye!'
            ],
            'voicePrompt': 'Good morning!'
          },
          {
            'sentence': '你怎么样？—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'How are you?',
            'options': [
              'How are you?',
              "What's this?",
              'Who are you?'
            ],
            'voicePrompt': 'How are you?'
          },
          {
            'sentence': '很高兴见到你！—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'Nice to meet you!',
            'options': [
              'Nice to meet you!',
              'Thank you!',
              'Sorry!'
            ],
            'voicePrompt': 'Nice to meet you!'
          },
          {
            'sentence': '你好！—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'Hello!',
            'options': [
              'Hello!',
              'Help!',
              'Bye!'
            ],
            'voicePrompt': 'Hello!'
          },
          {
            'sentence': '你叫什么名字？—— ___',
            'blanks': [
              '___'
            ],
            'answer': "What's your name?",
            'options': [
              "What's your name?",
              'How old are you?',
              'Where are you from?'
            ],
            'voicePrompt': "What's your name?"
          }
        ]
      },
      {
        'floor': 2,
        'type': 'choice',
        'title': '选择题 (购物表达)',
        'description': '选择正确的购物用语',
        'questions': [
          {
            'sentence': '这个多少钱？—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'How much is it?',
            'options': [
              'How much is it?',
              'How many are there?',
              'How old is it?'
            ],
            'voicePrompt': 'How much is it?'
          },
          {
            'sentence': '我想要买一本书。—— ___',
            'blanks': [
              '___'
            ],
            'answer': "I'd like to buy a book.",
            'options': [
              "I'd like to buy a book.",
              'I like reading books.',
              'I have a book.'
            ],
            'voicePrompt': "I'd like to buy a book."
          },
          {
            'sentence': '太贵了！—— ___',
            'blanks': [
              '___'
            ],
            'answer': "It's too expensive!",
            'options': [
              "It's too expensive!",
              "It's too cheap!",
              "It's very good!"
            ],
            'voicePrompt': "It's too expensive!"
          },
          {
            'sentence': '我要这个。—— ___',
            'blanks': [
              '___'
            ],
            'answer': "I'll take this one.",
            'options': [
              "I'll take this one.",
              "I don't like this.",
              'This is mine.'
            ],
            'voicePrompt': "I'll take this one."
          },
          {
            'sentence': '你有零钱吗？—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'Do you have change?',
            'options': [
              'Do you have change?',
              'Do you have time?',
              'Do you have a pen?'
            ],
            'voicePrompt': 'Do you have change?'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'imageChoice',
        'title': '看图题 (交通场景)',
        'description': '根据 emoji 场景选择正确的表达',
        'questions': [
          {
            'emoji': '🚌🏁',
            'sentence': 'Where is the bus stop?',
            'options': [
              'Where is the bus stop?',
              'Where is the train station?',
              'Where is the airport?'
            ],
            'answer': 'Where is the bus stop?',
            'prompt': '看图选择正确的问路用语'
          },
          {
            'emoji': '🚕➡️🏠',
            'sentence': 'Please take me to this address.',
            'options': [
              'Please take me to this address.',
              'I want to buy a ticket.',
              'Excuse me, is this seat taken?'
            ],
            'answer': 'Please take me to this address.',
            'prompt': '看图选择正确的乘车用语'
          },
          {
            'emoji': '🚇🚉',
            'sentence': 'Which line goes to the city center?',
            'options': [
              'Which line goes to the city center?',
              'How much is the ticket?',
              'Where can I get a taxi?'
            ],
            'answer': 'Which line goes to the city center?',
            'prompt': '看图选择正确的地铁用语'
          },
          {
            'emoji': '🚲🚶',
            'sentence': 'How can I get to the park?',
            'options': [
              'How can I get to the park?',
              'What time does the bus leave?',
              'Is this the right way?'
            ],
            'answer': 'How can I get to the park?',
            'prompt': '看图选择正确的问路用语'
          },
          {
            'emoji': '🎫🚂',
            'sentence': 'One ticket to Shanghai, please.',
            'options': [
              'One ticket to Shanghai, please.',
              'Where is the exit?',
              'How long does it take?'
            ],
            'answer': 'One ticket to Shanghai, please.',
            'prompt': '看图选择正确的购票用语'
          }
        ]
      },
      {
        'floor': 4,
        'type': 'match',
        'title': '配对题 (中英配对)',
        'description': '将英文常用语与中文配对',
        'questions': [
          {
            'sentence': '将英文常用语与中文翻译配对',
            'prompt': '将英文常用语与中文翻译配对',
            'pairs': [
              {
                'left': 'Good morning!',
                'right': '早上好！'
              },
              {
                'left': 'How much is it?',
                'right': '多少钱？'
              },
              {
                'left': 'Nice to meet you!',
                'right': '很高兴见到你！'
              },
              {
                'left': 'Excuse me.',
                'right': '打扰一下。'
              },
              {
                'left': 'Check, please!',
                'right': '请结账！'
              }
            ],
            'answer': 'Good morning!-早上好！|How much is it?-多少钱？|Nice to meet you!-很高兴见到你！|Excuse me.-打扰一下。|Check, please!-请结账！'
          }
        ]
      },
      {
        'floor': 5,
        'type': 'choice',
        'title': '选择题 (就餐表达)',
        'description': '选择正确的就餐用语',
        'questions': [
          {
            'sentence': '我想要点餐。—— ___',
            'blanks': [
              '___'
            ],
            'answer': "I'd like to order.",
            'options': [
              "I'd like to order.",
              "I'd like to go.",
              "I'd like to sleep."
            ],
            'voicePrompt': "I'd like to order."
          },
          {
            'sentence': '请结账！—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'Check, please!',
            'options': [
              'Check, please!',
              'Help, please!',
              'Wait, please!'
            ],
            'voicePrompt': 'Check, please!'
          },
          {
            'sentence': '今天的特色菜是什么？—— ___',
            'blanks': [
              '___'
            ],
            'answer': "What's today's special?",
            'options': [
              "What's today's special?",
              "What's your name?",
              "What's the weather like?"
            ],
            'voicePrompt': "What's today's special?"
          },
          {
            'sentence': '这个很好吃！—— ___',
            'blanks': [
              '___'
            ],
            'answer': 'This is delicious!',
            'options': [
              'This is delicious!',
              'This is terrible!',
              'This is expensive!'
            ],
            'voicePrompt': 'This is delicious!'
          },
          {
            'sentence': '我想要一杯水。—— ___',
            'blanks': [
              '___'
            ],
            'answer': "I'd like a glass of water.",
            'options': [
              "I'd like a glass of water.",
              "I'd like a bowl of rice.",
              "I'd like a piece of cake."
            ],
            'voicePrompt': "I'd like a glass of water."
          }
        ]
      },
      {
        'floor': 6,
        'type': 'fillBlank',
        'title': '填空题 (天气与爱好)',
        'description': '填入正确的天气或爱好表达',
        'questions': [
          {
            'sentence': "It's ___ today. (晴天)",
            'blanks': [
              '___'
            ],
            'answer': 'sunny',
            'options': [
              'sunny',
              'rainy',
              'cloudy'
            ],
            'voicePrompt': "It's sunny today."
          },
          {
            'sentence': 'I like ___ in my free time. (读书)',
            'blanks': [
              '___'
            ],
            'answer': 'reading',
            'options': [
              'reading',
              'running',
              'cooking'
            ],
            'voicePrompt': 'I like reading in my free time.'
          },
          {
            'sentence': "What's the weather ___ today?",
            'blanks': [
              '___'
            ],
            'answer': 'like',
            'options': [
              'like',
              'look',
              'love'
            ],
            'voicePrompt': "What's the weather like today?"
          },
          {
            'sentence': 'She enjoys ___ to music. (听音乐)',
            'blanks': [
              '___'
            ],
            'answer': 'listening',
            'options': [
              'listening',
              'listens',
              'listen'
            ],
            'voicePrompt': 'She enjoys listening to music.'
          },
          {
            'sentence': "It's getting ___ outside. (冷的)",
            'blanks': [
              '___'
            ],
            'answer': 'cold',
            'options': [
              'cold',
              'hot',
              'warm'
            ],
            'voicePrompt': "It's getting cold outside."
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (常用语)',
        'description': '拖拽单词组成正确的常用表达',
        'questions': [
          {
            'sentence': '很高兴见到你！',
            'blanks': [],
            'words': [
              'Nice',
              'meet',
              'you',
              'to'
            ],
            'answer': 'Nice to meet you!',
            'options': [],
            'voicePrompt': 'Nice to meet you!'
          },
          {
            'sentence': '请问这个多少钱？',
            'blanks': [],
            'words': [
              'How',
              'is',
              'much',
              'it',
              '?'
            ],
            'answer': 'How much is it?',
            'options': [],
            'voicePrompt': 'How much is it?'
          },
          {
            'sentence': '今天天气怎么样？',
            'blanks': [],
            'words': [
              "What's",
              'like',
              'today',
              'the weather'
            ],
            'answer': "What's the weather like today?",
            'options': [],
            'voicePrompt': "What's the weather like today?"
          },
          {
            'sentence': '请给我结账。',
            'blanks': [],
            'words': [
              'Check',
              'please',
              '!'
            ],
            'answer': 'Check, please!',
            'options': [],
            'voicePrompt': 'Check, please!'
          },
          {
            'sentence': '打扰一下，公交车站在哪里？',
            'blanks': [],
            'words': [
              'Excuse me',
              'the bus stop',
              'where',
              'is',
              '?'
            ],
            'answer': 'Excuse me, where is the bus stop?',
            'options': [],
            'voicePrompt': 'Excuse me, where is the bus stop?'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (常用语魔王)',
        'description': '找出并修复常用语用法中的错误！',
        'questions': [
          {
            'wrongSentence': 'How many is it? (想知道价格)',
            'answer': 'How much',
            'options': [
              'How much',
              'How many',
              'How old'
            ],
            'explanation': '询问价格用 How much',
            'voicePrompt': 'How much'
          },
          {
            'wrongSentence': 'Good night! (早上见面说)',
            'answer': 'Good morning',
            'options': [
              'Good morning',
              'Good night',
              'Good evening'
            ],
            'explanation': '早上见面应该说 Good morning',
            'voicePrompt': 'Good morning'
          },
          {
            'wrongSentence': 'I like to order. (想要点餐)',
            'answer': "I'd like",
            'options': [
              "I'd like",
              'I like',
              'I am like'
            ],
            'explanation': "表达礼貌的\"想要\"用 I'd like",
            'voicePrompt': "I'd like"
          },
          {
            'wrongSentence': 'What is the weather today?',
            'answer': 'like',
            'options': [
              'like',
              'look',
              'looks'
            ],
            'explanation': "询问天气用 What's the weather like?",
            'voicePrompt': 'like'
          },
          {
            'wrongSentence': 'Nice meeting you! (初次见面)',
            'answer': 'to meet',
            'options': [
              'to meet',
              'meeting',
              'meet'
            ],
            'explanation': '初次见面说 Nice to meet you!',
            'voicePrompt': 'to meet'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  },
  {
    'id': 'dialogue',
    'name': '情景对话塔',
    'icon': '🎭',
    'description': '在学校、餐厅、购物、问路等情景中练习对话！',
    'unlockLevel': 2,
    'tutorial': {
      'title': '情景对话是什么？',
      'rules': [
        {
          'rule': '注意场景 (Scene)',
          'example': '在学校用正式用语，在朋友间用非正式用语',
          'explanation': '不同场景使用不同的表达方式'
        },
        {
          'rule': '注意角色 (Role)',
          'example': '对老师要有礼貌，对朋友可以随意',
          'explanation': '对话对象决定语言风格'
        },
        {
          'rule': '注意上下文 (Context)',
          'example': '根据前文对话选择合适的回答',
          'explanation': '对话要前后呼应、合乎逻辑'
        }
      ],
      'tips': [
        '先理解场景再选择答案',
        '注意对话的礼貌程度',
        '回答要与问题内容匹配',
        '注意中英文表达习惯的差异'
      ]
    },
    'floors': [
      {
        'floor': 1,
        'type': 'dialogueChoice',
        'title': '对话选择题 (学校场景)',
        'description': '在学校场景中选择合适的对话',
        'questions': [
          {
            'scene': '在学校，你遇到新同学',
            'speaker': '你',
            'dialogue': '___',
            'context': '你想和新同学打招呼并自我介绍',
            'options': [
              'Hello! My name is Tom. Nice to meet you!',
              'Goodbye! See you later!',
              "I'm sorry, I don't know."
            ],
            'answer': 'Hello! My name is Tom. Nice to meet you!',
            'voicePrompt': 'Hello! My name is Tom. Nice to meet you!'
          },
          {
            'scene': '在课堂上，老师提问',
            'speaker': '你',
            'dialogue': '___',
            'context': '老师问了一个问题，你知道答案',
            'options': [
              "I don't know.",
              'Let me try! The answer is 10.',
              'Can I go to the bathroom?'
            ],
            'answer': 'Let me try! The answer is 10.',
            'voicePrompt': 'Let me try! The answer is 10.'
          },
          {
            'scene': '下课了，你想借同学的笔',
            'speaker': '你',
            'dialogue': '___',
            'context': '你忘带笔了，想向同桌借',
            'options': [
              'Give me your pen!',
              'Excuse me, can I borrow your pen?',
              'This pen is mine.'
            ],
            'answer': 'Excuse me, can I borrow your pen?',
            'voicePrompt': 'Excuse me, can I borrow your pen?'
          },
          {
            'scene': '在操场上，同学邀请你一起玩',
            'speaker': '你',
            'dialogue': '___',
            'context': '同学邀请你一起踢足球',
            'options': [
              "I'm busy. Go away.",
              'Sure! I love playing football!',
              'Football is boring.'
            ],
            'answer': 'Sure! I love playing football!',
            'voicePrompt': 'Sure! I love playing football!'
          },
          {
            'scene': '放学了，和老师告别',
            'speaker': '你',
            'dialogue': '___',
            'context': '放学时和老师说再见',
            'options': [
              'Goodbye, teacher! See you tomorrow!',
              "I'm hungry.",
              'Where is my bag?'
            ],
            'answer': 'Goodbye, teacher! See you tomorrow!',
            'voicePrompt': 'Goodbye, teacher! See you tomorrow!'
          }
        ]
      },
      {
        'floor': 2,
        'type': 'dialogueChoice',
        'title': '对话选择题 (餐厅场景)',
        'description': '在餐厅场景中选择合适的对话',
        'questions': [
          {
            'scene': '在餐厅，服务员迎接你',
            'speaker': '你',
            'dialogue': '___',
            'context': '服务员问"欢迎光临！请问几位？"',
            'options': [
              'Two people, please.',
              "I'm fine, thank you.",
              'This is a book.'
            ],
            'answer': 'Two people, please.',
            'voicePrompt': 'Two people, please.'
          },
          {
            'scene': '在餐厅，你想点餐',
            'speaker': '你',
            'dialogue': '___',
            'context': '你准备点一份牛排',
            'options': [
              "I'd like a steak, please.",
              "I don't like steak.",
              'Steak is expensive.'
            ],
            'answer': "I'd like a steak, please.",
            'voicePrompt': "I'd like a steak, please."
          },
          {
            'scene': '在餐厅，你想去洗手间',
            'speaker': '你',
            'dialogue': '___',
            'context': '你需要问服务员洗手间在哪里',
            'options': [
              'Where is the toilet?',
              'Give me food!',
              'I want to go home.'
            ],
            'answer': 'Where is the toilet?',
            'voicePrompt': 'Where is the toilet?'
          },
          {
            'scene': '用餐结束后想打包',
            'speaker': '你',
            'dialogue': '___',
            'context': '你吃不完想打包带走',
            'options': [
              'Can I have a doggy bag?',
              "I don't want this.",
              'Throw it away.'
            ],
            'answer': 'Can I have a doggy bag?',
            'voicePrompt': 'Can I have a doggy bag?'
          },
          {
            'scene': '在餐厅结账时',
            'speaker': '你',
            'dialogue': '___',
            'context': '你吃完饭准备结账',
            'options': [
              'Check, please!',
              "I'm leaving now.",
              'Good night!'
            ],
            'answer': 'Check, please!',
            'voicePrompt': 'Check, please!'
          }
        ]
      },
      {
        'floor': 3,
        'type': 'dialogueChoice',
        'title': '对话选择题 (购物场景)',
        'description': '在购物场景中选择合适的对话',
        'questions': [
          {
            'scene': '在服装店，你看中了一件衣服',
            'speaker': '你',
            'dialogue': '___',
            'context': '你想要知道这件衣服的价格',
            'options': [
              'How much is this?',
              'How many are there?',
              'What time is it?'
            ],
            'answer': 'How much is this?',
            'voicePrompt': 'How much is this?'
          },
          {
            'scene': '在书店，你找不到想要的书',
            'speaker': '你',
            'dialogue': '___',
            'context': '你需要店员帮忙找一本英语书',
            'options': [
              'Excuse me, do you have English books?',
              "I don't like this store.",
              'This book is boring.'
            ],
            'answer': 'Excuse me, do you have English books?',
            'voicePrompt': 'Excuse me, do you have English books?'
          },
          {
            'scene': '在鞋店，你想试穿鞋子',
            'speaker': '你',
            'dialogue': '___',
            'context': '你看中一双鞋想试穿',
            'options': [
              'Can I try these on?',
              'I want to buy these.',
              'These are too small.'
            ],
            'answer': 'Can I try these on?',
            'voicePrompt': 'Can I try these on?'
          },
          {
            'scene': '在超市结账时',
            'speaker': '你',
            'dialogue': '___',
            'context': '收银员问"Do you need a bag?"',
            'options': [
              'Yes, please.',
              "No, it's okay.",
              'How much?'
            ],
            'answer': 'Yes, please.',
            'voicePrompt': 'Yes, please.'
          },
          {
            'scene': '你买完东西想退货',
            'speaker': '你',
            'dialogue': '___',
            'context': '买的东西不合适，想退货',
            'options': [
              "I'd like to return this, please.",
              'I want to buy another one.',
              'This is a gift.'
            ],
            'answer': "I'd like to return this, please.",
            'voicePrompt': "I'd like to return this, please."
          }
        ]
      },
      {
        'floor': 4,
        'type': 'choice',
        'title': '选择题 (问路与方向)',
        'description': '选择正确的问路和指路表达',
        'questions': [
          {
            'sentence': 'Excuse me, ___ the nearest hospital?',
            'blanks': [
              '___'
            ],
            'answer': 'where is',
            'options': [
              'where is',
              'what is',
              'how is'
            ],
            'voicePrompt': 'Excuse me, where is the nearest hospital?'
          },
          {
            'sentence': 'Go straight and ___ left at the corner.',
            'blanks': [
              '___'
            ],
            'answer': 'turn',
            'options': [
              'turn',
              'take',
              'go'
            ],
            'voicePrompt': 'Go straight and turn left at the corner.'
          },
          {
            'sentence': "It's ___ the bank and the post office.",
            'blanks': [
              '___'
            ],
            'answer': 'between',
            'options': [
              'between',
              'next to',
              'behind'
            ],
            'voicePrompt': "It's between the bank and the post office."
          },
          {
            'sentence': 'How long does it ___ to get there?',
            'blanks': [
              '___'
            ],
            'answer': 'take',
            'options': [
              'take',
              'cost',
              'spend'
            ],
            'voicePrompt': 'How long does it take to get there?'
          },
          {
            'sentence': "It's about five minutes' ___ from here.",
            'blanks': [
              '___'
            ],
            'answer': 'walk',
            'options': [
              'walk',
              'run',
              'drive'
            ],
            'voicePrompt': "It's about five minutes' walk from here."
          }
        ]
      },
      {
        'floor': 5,
        'type': 'fillBlank',
        'title': '填空题 (电话用语)',
        'description': '填入正确的电话对话用语',
        'questions': [
          {
            'sentence': 'Hello! ___ I speak to Mr. Wang?',
            'blanks': [
              '___'
            ],
            'answer': 'May',
            'options': [
              'May',
              'Must',
              'Can'
            ],
            'voicePrompt': 'Hello! May I speak to Mr. Wang?'
          },
          {
            'sentence': "Who's ___ please?",
            'blanks': [
              '___'
            ],
            'answer': 'calling',
            'options': [
              'calling',
              'speaking',
              'talking'
            ],
            'voicePrompt': "Who's calling please?"
          },
          {
            'sentence': "I'm sorry, he's not ___ right now.",
            'blanks': [
              '___'
            ],
            'answer': 'available',
            'options': [
              'available',
              'here',
              'busy'
            ],
            'voicePrompt': "I'm sorry, he's not available right now."
          },
          {
            'sentence': 'Can I ___ a message?',
            'blanks': [
              '___'
            ],
            'answer': 'leave',
            'options': [
              'leave',
              'take',
              'give'
            ],
            'voicePrompt': 'Can I leave a message?'
          },
          {
            'sentence': "I'll call you ___ later.",
            'blanks': [
              '___'
            ],
            'answer': 'back',
            'options': [
              'back',
              'again',
              'soon'
            ],
            'voicePrompt': "I'll call you back later."
          }
        ]
      },
      {
        'floor': 6,
        'type': 'dialogueChoice',
        'title': '对话选择题 (医院场景)',
        'description': '在医院场景中选择合适的对话',
        'questions': [
          {
            'scene': '在医院挂号处',
            'speaker': '你',
            'dialogue': '___',
            'context': '你感觉不舒服，要看医生',
            'options': [
              "I'd like to see a doctor.",
              'I want to buy medicine.',
              "I'm looking for the exit."
            ],
            'answer': "I'd like to see a doctor.",
            'voicePrompt': "I'd like to see a doctor."
          },
          {
            'scene': '在诊室，医生问你',
            'speaker': '你',
            'dialogue': '___',
            'context': "医生问\"What's wrong with you?\"",
            'options': [
              'I have a headache.',
              "I'm very happy.",
              'I like this hospital.'
            ],
            'answer': 'I have a headache.',
            'voicePrompt': 'I have a headache.'
          },
          {
            'scene': '医生给你开药后',
            'speaker': '你',
            'dialogue': '___',
            'context': '医生开完药，你想问怎么吃',
            'options': [
              'How should I take this medicine?',
              'This medicine is bitter.',
              "I don't need medicine."
            ],
            'answer': 'How should I take this medicine?',
            'voicePrompt': 'How should I take this medicine?'
          },
          {
            'scene': '在药房取药时',
            'speaker': '你',
            'dialogue': '___',
            'context': '药剂师问"Do you have insurance?"',
            'options': [
              'Yes, I do.',
              'No, thank you.',
              'What is insurance?'
            ],
            'answer': 'Yes, I do.',
            'voicePrompt': 'Yes, I do.'
          },
          {
            'scene': '看完病准备离开',
            'speaker': '你',
            'dialogue': '___',
            'context': '看完医生，准备离开时',
            'options': [
              'Thank you, doctor. Goodbye!',
              "I'll come again tomorrow.",
              'This hospital is too big.'
            ],
            'answer': 'Thank you, doctor. Goodbye!',
            'voicePrompt': 'Thank you, doctor. Goodbye!'
          }
        ]
      },
      {
        'floor': 7,
        'type': 'dragOrder',
        'title': '排序题 (对话排序)',
        'description': '拖拽单词组成正确的对话句子',
        'questions': [
          {
            'sentence': '请问你叫什么名字？',
            'blanks': [],
            'words': [
              'your',
              "What's",
              'name',
              '?'
            ],
            'answer': "What's your name?",
            'options': [],
            'voicePrompt': "What's your name?"
          },
          {
            'sentence': '我可以试穿一下吗？',
            'blanks': [],
            'words': [
              'try',
              'Can',
              'I',
              'on',
              'this'
            ],
            'answer': 'Can I try this on?',
            'options': [],
            'voicePrompt': 'Can I try this on?'
          },
          {
            'sentence': '你感觉怎么样？',
            'blanks': [],
            'words': [
              'How',
              'feeling',
              'you',
              'are'
            ],
            'answer': 'How are you feeling?',
            'options': [],
            'voicePrompt': 'How are you feeling?'
          },
          {
            'sentence': '请稍等一下。',
            'blanks': [],
            'words': [
              'moment',
              'please',
              'one',
              'Just'
            ],
            'answer': 'Just one moment, please.',
            'options': [],
            'voicePrompt': 'Just one moment, please.'
          },
          {
            'sentence': '你能再说一遍吗？',
            'blanks': [],
            'words': [
              'you',
              'Can',
              'say',
              'that',
              'again',
              '?'
            ],
            'answer': 'Can you say that again?',
            'options': [],
            'voicePrompt': 'Can you say that again?'
          }
        ]
      },
      {
        'floor': 8,
        'type': 'bossFight',
        'title': 'BOSS战 (对话魔王)',
        'description': '找出并修复对话中的错误！',
        'questions': [
          {
            'wrongSentence': "What is your name? — I'm 10 years old.",
            'answer': 'My name is Tom.',
            'options': [
              'My name is Tom.',
              "I'm 10 years old.",
              'I like apples.'
            ],
            'explanation': '问名字要回答名字，不是年龄',
            'voicePrompt': 'My name is Tom.'
          },
          {
            'wrongSentence': 'Can I help you? — Yes, I can.',
            'answer': "Yes, I'd like to buy a book.",
            'options': [
              "Yes, I'd like to buy a book.",
              'Yes, I can.',
              "No, I can't."
            ],
            'explanation': '店员问你需要什么帮助，应说明需求',
            'voicePrompt': "Yes, I'd like to buy a book."
          },
          {
            'wrongSentence': "How much is this? — It's 10 o'clock.",
            'answer': "It's 20 dollars.",
            'options': [
              "It's 20 dollars.",
              "It's 10 o'clock.",
              "It's a book."
            ],
            'explanation': '问价格要用价格回答',
            'voicePrompt': "It's 20 dollars."
          },
          {
            'wrongSentence': "Where are you from? — I'm 12.",
            'answer': "I'm from China.",
            'options': [
              "I'm from China.",
              "I'm 12.",
              "I'm a student."
            ],
            'explanation': '问来自哪里要回答国家/城市',
            'voicePrompt': "I'm from China."
          },
          {
            'wrongSentence': 'Nice to meet you! — Goodbye!',
            'answer': 'Nice to meet you too!',
            'options': [
              'Nice to meet you too!',
              'Goodbye!',
              'Thank you!'
            ],
            'explanation': '对"很高兴见到你"应该回应相同的话',
            'voicePrompt': 'Nice to meet you too!'
          }
        ],
        'boss': {
          'name': '语法魔王',
          'icon': '👹',
          'hp': 3
        },
        'winCondition': {
          'consecutiveCorrect': 3
        }
      }
    ]
  }
];

/**
 * 根据塔 ID 获取塔数据
 * @param {string} towerId 塔标识
 * @returns {object|null} 塔数据对象
 */
export function getTowerById(towerId) {
  return grammarTowers.find(t => t.id === towerId) || null;
}

/**
 * 获取塔的指定楼层
 * @param {string} towerId 塔标识
 * @param {number} floorNumber 楼层号
 * @returns {object|null} 楼层数据
 */
export function getFloorByNumber(towerId, floorNumber) {
  const tower = getTowerById(towerId);
  if (!tower) {
    return null;
  }
  return tower.floors.find(f => f.floor === floorNumber) || null;
}

/**
 * 统计塔的总题目数
 * @param {string} towerId 塔标识
 * @returns {number} 题目总数
 */
export function countTotalQuestions(towerId) {
  const tower = getTowerById(towerId);
  if (!tower) {
    return 0;
  }
  return tower.floors.reduce((sum, floor) => sum + floor.questions.length, 0);
}

export default grammarTowers;