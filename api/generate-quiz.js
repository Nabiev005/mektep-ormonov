import Anthropic from '@anthropic-ai/sdk';
import { isFirebaseAdmin, isRateLimited, verifyFirebaseToken } from './_auth.js';

const MAX_TOPIC_LENGTH = 200;
const MIN_COUNT = 3;
const MAX_COUNT = 15;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
        },
        required: ['question', 'answer'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY орнотулган эмес. Vercel environment variables текшериңиз.' });
    return;
  }

  const session = await verifyFirebaseToken(req);
  if (!session || !(await isFirebaseAdmin(session))) {
    res.status(403).json({ error: 'Суроо түзүү админдер үчүн гана.' });
    return;
  }
  if (isRateLimited(session.uid, 10)) {
    res.status(429).json({ error: 'Өтө көп суроо жөнөттүңүз. Бир мүнөттөн кийин кайра аракет кылыңыз.' });
    return;
  }

  const { subject, topic, count } = req.body || {};
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    res.status(400).json({ error: 'Предмет көрсөтүлгөн жок.' });
    return;
  }
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Тема көрсөтүлгөн жок.' });
    return;
  }
  if (topic.length > MAX_TOPIC_LENGTH) {
    res.status(400).json({ error: 'Тема өтө узун.' });
    return;
  }

  const safeCount = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Number.isFinite(Number(count)) ? Math.round(Number(count)) : 5));

  const prompt = `Сен кыргыз мектебинин "Ким акылдуу?" викторина оюну үчүн суроо түзгөн жардамчысың.

Предмет: "${subject.trim()}"
Тема: "${topic.trim()}"

Так ${safeCount} даана суроо-жооп жубун кыргыз тилинде түз.

Талаптар:
- Ар бир суроо мектеп окуучусуна ылайык, так жана кыска болсун.
- Жооп 1-3 сөз же сан болсун (узун сүйлөм эмес), кичине тамга менен жаз.
- Суроолор бири-биринен айырмалуу болсун, кайталанбасын.`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      output_config: {
        format: {
          type: 'json_schema',
          schema: RESPONSE_SCHEMA,
        },
      },
    });

    if (response.stop_reason === 'refusal') {
      res.status(502).json({ error: 'AI бул темага суроо түзө алган жок. Башка тема менен аракет кылыңыз.' });
      return;
    }

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock) {
      throw new Error('Claude текст жообун кайтарган жок.');
    }

    const data = JSON.parse(textBlock.text);
    res.status(200).json(data);
  } catch (error) {
    console.error('Claude API ката (generate-quiz):', error);
    res.status(502).json({ error: 'Суроолорду түзүүдө ката кетти. Бир аздан кийин кайра аракет кылыңыз.' });
  }
}
