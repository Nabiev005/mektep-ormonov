import Anthropic from '@anthropic-ai/sdk';

const MAX_TOPIC_LENGTH = 200;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    simple: { type: 'string' },
    standard: { type: 'string' },
    deep: { type: 'string' },
    checkQuestion: { type: 'string' },
    checkAnswer: { type: 'string' },
  },
  required: ['simple', 'standard', 'deep', 'checkQuestion', 'checkAnswer'],
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

  const { topic, subject } = req.body || {};
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Тема көрсөтүлгөн жок.' });
    return;
  }
  if (topic.length > MAX_TOPIC_LENGTH) {
    res.status(400).json({ error: 'Тема өтө узун.' });
    return;
  }

  const safeSubject = typeof subject === 'string' ? subject.slice(0, 100) : '';

  const prompt = `Сен кыргыз мектебинин окуучуларына сабак темаларын түшүндүргөн жардамчысың. Төмөнкү теманы${safeSubject ? ` (предмет: ${safeSubject})` : ''} 3 деңгээлде кыргыз тилинде түшүндүр:

Тема: "${topic.trim()}"

Талаптар:
- "simple": жөнөкөй тил менен, күнүмдүк жашоодон аналогия менен (2-4 сүйлөм)
- "standard": мектеп программасына ылайык стандарттуу түшүндүрмө (4-6 сүйлөм)
- "deep": тереӊ, деталдуу түшүндүрмө, мисалдар менен (6-10 сүйлөм)
- "checkQuestion": окуучунун түшүнгөнүн текшерүү үчүн бир кыска суроо
- "checkAnswer": ошол суроонун туура жообу (кыска, 1 сөз же сан болсо жакшы)`;

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
      res.status(502).json({ error: 'AI бул суроого жооп бере албады. Башка тема менен аракет кылыңыз.' });
      return;
    }

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock) {
      throw new Error('Claude текст жообун кайтарган жок.');
    }

    const data = JSON.parse(textBlock.text);
    res.status(200).json(data);
  } catch (error) {
    console.error('Claude API ката:', error);
    const detail = error instanceof Error ? error.message : String(error);
    res.status(502).json({ error: `Түшүндүрмө алууда ката кетти: ${detail}` });
  }
}
