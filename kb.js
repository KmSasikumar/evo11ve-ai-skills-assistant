/* Knowledge base for the Evo11ve AI Skills Program assistant.
 *
 * EVERY program fact below comes from the official program page
 * https://www.evo11ve.ai/for-ai (fetched 29 Oct 2026). Nothing has been
 * added from elsewhere. Where the page does not state something, the entry
 * says so explicitly and the assistant offers an escalation path instead
 * of guessing.
 *
 * Pure logic: no DOM access, so this file can be unit-tested with node.
 */
(function (root) {
  'use strict';

  var PROGRAM_URL = 'https://www.evo11ve.ai/for-ai';

  var ENTRIES = [
    {
      id: 'price',
      keywords: ['price', 'cost', 'fee', 'charge', 'pricing', 'much', 'pay', 'payment', '9999', 'rupees', 'expensive'],
      answer: 'The AI Skills Program costs \u20B99,999 per student, as listed on the program page\u2019s price card. It is for students in Classes 6\u201312.'
    },
    {
      id: 'hours',
      keywords: ['hour', 'duration', 'long', 'structure', 'session', 'live', 'project-building', 'doubt', 'clearing', 'weekly', 'schedule'],
      answer: 'The program is 50 hours of guided, hands-on learning: 12 hours of live, interactive mentor-led sessions, 36 hours of guided project-building time, and 2 hours of dedicated doubt-clearing sessions. Batch dates and weekly timings are not stated on the program page \u2014 if you need those, I can raise a callback request so the team can confirm.'
    },
    {
      id: 'eligibility',
      keywords: ['eligible', 'eligibility', 'who', 'class', 'grade', 'student', 'children', 'kid', 'beginner', 'experience', 'prerequisite', 'coding'],
      answer: 'The program is for students in Classes 6\u201312. No prior coding experience is needed \u2014 the page states students go from a blank page to a finished, working project with mentors by their side, and no templates are used.'
    },
    {
      id: 'curriculum',
      keywords: ['curriculum', 'learn', 'syllabus', 'teach', 'topic', 'subject', 'content', 'course', 'ethics', 'tools', 'design', 'thinking'],
      answer: 'Students learn by building with AI in practice: hands-on experience with AI tools across creativity, productivity, automation, research, and problem-solving, plus AI ethics and responsible technology use \u2014 covering AI bias, privacy, responsible use, and academic integrity. Every project starts with design thinking: understanding the problem, asking the right questions, and making intentional creative choices before any tool is opened.'
    },
    {
      id: 'capstone',
      keywords: ['capstone', 'portfolio', 'final', 'build', 'working', 'real'],
      answer: 'Every student builds 1 portfolio-ready capstone project \u2014 a meaningful real-world project such as a website, chatbot, film, tool, or creative experience. The page states 100% of students leave with a live, working project they built themselves.'
    },
    {
      id: 'categories',
      keywords: ['categories', 'project', 'option', 'choice', 'idea', 'type', 'website', 'chatbot', 'movie', 'comic', 'news', 'planner', 'survey', 'habit', 'ecommerce', 'e-com', 'animated', 'tracker', 'feed', 'study'],
      answer: 'The program page lists 9 project categories: (1) Design and Host a Basic Website, (2) Create an Animated Movie, (3) Build a Simple Chatbot, (4) Build and Host an E-Com Website, (5) Create a Comic, (6) Build a Curated News Feed, (7) Create a Personal Study Planner, (8) Create a Smart Survey, and (9) Build a Habit Tracker. All are built using vibe coding and AI tools where the page says so.'
    },
    {
      id: 'certificate',
      keywords: ['certificate', 'certification', 'certified', 'blockchain', 'proof', 'credential', 'verifiable', 'recognition'],
      answer: 'Students receive a verifiable blockchain-backed certificate recognising participation, project work, and practical AI skill development.'
    },
    {
      id: 'mentors',
      keywords: ['mentor', 'teacher', 'support', 'help', 'guidance', 'doubt', 'month', 'ongoing'],
      answer: 'Mentors lead 12 hours of live, interactive sessions, and students get 12 months of ongoing mentor support after the program \u2014 guidance for projects, questions, future ideas, and next steps.'
    },
    {
      id: 'showcase',
      keywords: ['showcase', 'display', 'publish', 'social', 'media', 'visibility', 'feature'],
      answer: 'Selected student projects are showcased on Evo11ve\u2019s website and social media, giving learners visibility and recognition for their work.'
    },
    {
      id: 'outcomes',
      keywords: ['outcome', 'result', 'benefit', 'job', 'salary', 'wage', 'future', 'career', 'stats', 'number', 'trained', 'why', 'now', 'partnered'],
      answer: 'The page highlights: 350+ students trained, 30+ partnered, 100% hands-on learning, and 100% of students leaving with a live, working project. It also cites wider context: 85% of the jobs that will exist in 2030 don\u2019t exist today (World Economic Forum, 2023); 97M new jobs created by AI (PwC AI Jobs Barometer 2025); +25% higher wages for AI-skilled workers (LinkedIn Future of Work 2025); and 38% growth in AI job postings (Evo11ve student outcomes).'
    },
    {
      id: 'seats',
      keywords: ['seat', 'cohort', 'limited', 'availability', 'fill', 'filling', 'fast', 'hurry', 'batch'],
      answer: 'Seats per cohort are limited, and the page says the next batch is filling fast. Exact seat numbers and batch dates are not stated on the page \u2014 I can raise a callback request so the team can confirm.'
    },
    {
      id: 'dates',
      keywords: ['date', 'start', 'when', 'timing', 'deadline', 'enroll', 'register'],
      answer: 'The program page does not state batch start dates, weekly timings, or an enrollment deadline \u2014 it only says seats per cohort are limited and the next batch is filling fast. I can raise a callback request so the team can confirm dates.'
    },
    {
      id: 'mode',
      keywords: ['online', 'offline', 'person', 'location', 'venue', 'where', 'city', 'centre', 'center', 'classroom'],
      answer: 'The program page does not state whether sessions are online or in person, or where they are held. I can escalate this question to the program team so they can confirm.'
    },
    {
      id: 'refund',
      keywords: ['refund', 'discount', 'offer', 'coupon', 'plan', 'installment', 'emi', 'cancel', 'money', 'back'],
      answer: 'The program page does not mention refunds, discounts, or payment plans \u2014 only the \u20B99,999 per-student price. I can escalate this question to the program team.'
    }
  ];

  var INTENTS = [
    { id: 'enroll', keywords: ['enroll', 'enrol', 'join', 'sign up', 'signup', 'admission', 'admit', 'apply now', 'i want to join'] },
    { id: 'callback', keywords: ['callback', 'call me', 'call back', 'phone me', 'ring me', 'contact me', 'reach me'] },
    { id: 'human', keywords: ['human', 'talk to', 'speak to', 'representative', 'support team', 'contact the team', 'escalate', 'real person', 'live agent'] }
  ];

  var STOPWORDS = {
    a: 1, an: 1, the: 1, is: 1, are: 1, was: 1, were: 1, do: 1, does: 1, did: 1,
    what: 1, when: 1, where: 1, which: 1, who: 1, how: 1, why: 1, can: 1, could: 1,
    i: 1, me: 1, my: 1, we: 1, you: 1, your: 1, it: 1, its: 1, this: 1, that: 1,
    about: 1, for: 1, of: 1, to: 1, in: 1, on: 1, and: 1, or: 1, please: 1, tell: 1,
    know: 1, want: 1, get: 1, give: 1
  };

  function normalize(text) {
    return (text || '').toLowerCase().replace(/[^a-z0-9₹\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function tokens(text) {
    return normalize(text).split(' ').filter(function (t) { return t && !STOPWORDS[t]; });
  }

  function detectIntent(query) {
    var q = normalize(query);
    for (var i = 0; i < INTENTS.length; i++) {
      var intent = INTENTS[i];
      for (var j = 0; j < intent.keywords.length; j++) {
        if (q.indexOf(intent.keywords[j]) !== -1) return intent.id;
      }
    }
    return null;
  }

  // Generic words count for less, so a specific fact beats a generic one
  // when a question contains both (e.g. "certificate" beats "student").
  var WEIGHTS = { student: 0.5, project: 0.5, when: 0.5 };

  function matchEntry(query) {
    var q = normalize(query);
    var qt = tokens(query);
    if (!qt.length) return null;
    // "Who is it for?"-style questions are eligibility questions, unless
    // they are really about contacting someone.
    if (/\bwho\b/.test(q) && /\bfor\b/.test(q) &&
        q.indexOf('contact') === -1 && q.indexOf('call') === -1 &&
        q.indexOf('email') === -1 && q.indexOf('phone') === -1) {
      for (var e = 0; e < ENTRIES.length; e++) {
        if (ENTRIES[e].id === 'eligibility') return ENTRIES[e];
      }
    }
    var best = null;
    var bestScore = 0;
    var bestHits = 0;
    for (var i = 0; i < ENTRIES.length; i++) {
      var entry = ENTRIES[i];
      var score = 0;
      var hits = 0;
      for (var j = 0; j < entry.keywords.length; j++) {
        var kw = entry.keywords[j];
        if (q.indexOf(kw) !== -1) {
          hits++;
          score += (WEIGHTS[kw] || 1);
        }
      }
      if (score > bestScore || (score === bestScore && score > 0 && hits > bestHits)) {
        bestScore = score; bestHits = hits; best = entry;
      }
    }
    if (!best || bestScore <= 0) return null;
    return best;
  }

  function answer(query) {
    var intent = detectIntent(query);
    if (intent) return { type: intent, entry: null };
    var entry = matchEntry(query);
    if (entry) return { type: 'answer', entry: entry };
    return { type: 'unknown', entry: null };
  }

  var api = {
    PROGRAM_URL: PROGRAM_URL,
    ENTRIES: ENTRIES,
    normalize: normalize,
    tokens: tokens,
    detectIntent: detectIntent,
    matchEntry: matchEntry,
    answer: answer
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.EvoKB = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
