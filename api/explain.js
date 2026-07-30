const { GoogleGenerativeAI } = require('@google/generative-ai');

const MAX_TOPIC_LENGTH = 200;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY орнотулган эмес. Vercel environment variables текшериңиз.' });
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
- "checkAnswer": ошол суроонун туура жообу (кыска, 1 сөз же сан болсо жакшы)

Жообуңду так JSON форматында бер, башка эч нерсе кошпо.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            simple: { type: 'string' },
            standard: { type: 'string' },
            deep: { type: 'string' },
            checkQuestion: { type: 'string' },
            checkAnswer: { type: 'string' },
          },
          required: ['simple', 'standard', 'deep', 'checkQuestion', 'checkAnswer'],
        },
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    res.status(200).json(data);
  } catch (error) {
    console.error('Gemini API ката:', error);
    res.status(502).json({ error: 'Түшүндүрмө алууда ката кетти. Кайра аракет кылыңыз.' });
  }
};
