# Зайил Ормонов атындагы мектептин сайты

Баткен району, Кан айылындагы мектептин расмий санарип порталы: жаңылыктар, расписание, мугалимдер,
окуучу/мугалим панелдери, ЖРТга даярдык, IT жана тил курстары, билим оюндары жана AI жардамчы.

## Технологиялар

- React 19 + TypeScript + Vite
- Firebase: Authentication (Google — окуучулар, email — админ), Firestore, Storage
- Vercel: хостинг жана `api/` ичиндеги serverless функциялар (Claude API)

## Иштетүү

```bash
npm install
npm run dev        # фронтенд гана (http://localhost:5173)
vercel dev         # /api функциялары менен бирге (AI түшүндүрмө, AI тест)
```

Текшерүүлөр: `npm run lint`, `npm test`, `npm run build`.

## Чөйрө өзгөрмөлөрү

`.env.example` караңыз. Vercel'де орнотулушу керек:

| Өзгөрмө | Каякта колдонулат |
| --- | --- |
| `ANTHROPIC_API_KEY` | `api/explain.js`, `api/generate-quiz.js` |
| `VITE_IMGBB_API_KEY` | Админ панелде сүрөт жүктөө |

## Түзүлүшү

- `src/components/Layout/` — сайдбар, топбар, мобилдик меню. Меню пункттары `navigation.ts` ичинде.
- `src/index.css` — дизайн токендери (`--primary`, `--surface`, `--border` ж.б.). Жаңы баракчалар ушуларды колдонсун.
- `src/pages/` — баракчалар, ар бири өз CSS модулу менен.
- `src/utils/studentAccount.ts` — окуучунун профили, XP жана курс прогресси.
- `api/` — Vercel функциялары. `_auth.js` Firebase ID токенин текшерет: AI түшүндүрмөгө кирген колдонуучу гана, AI тест түзүүгө админ гана кире алат.
- `firestore.rules` — коопсуздук эрежелери.

## Firestore эрежелерин жүктөө

Эрежелер өзгөргөндөн кийин:

```bash
firebase deploy --only firestore:rules
```

Админ кошуу: Firestore'до `admins/{uid}` документин кол менен түзүңүз.
Мугалим кошуу: админ панелден же `teachers/{uid}` документи аркылуу.
