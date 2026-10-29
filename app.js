/* Evo11ve AI Skills Program — voice conversational assistant (browser app).
 *
 * Architecture: fully static, client-side. No server, no API keys, no paid
 * services. The knowledge base (kb.js) is scored against the visitor's
 * question; voice uses the browser's built-in Web Speech APIs; email
 * triggers hand a complete, ready-to-send email to the visitor's own mail
 * app (mailto). Nothing is ever reported as "sent" unless a mail provider
 * confirms it, which mailto cannot do — the status therefore always reads
 * "Prepared".
 *
 * EMAIL WIRING POINT: to send automatically from a server instead, replace
 * sendViaMailto() with a POST to EMAIL_ENDPOINT, a backend that sends
 * through the program team's mailbox. No credentials are bundled here.
 */
(function () {
  'use strict';

  // Recipient: the program team's contact from the assessment correspondence.
  // Change this one constant to re-point escalation mail elsewhere.
  var EMAIL_RECIPIENT = 'vaishnavidevi.k@evo11ve.ai';
  var EMAIL_ENDPOINT = null; // set to a backend URL to enable server-side sends

  var chatEl = document.getElementById('chat');
  var inputEl = document.getElementById('question');
  var sendBtn = document.getElementById('sendBtn');
  var micBtn = document.getElementById('micBtn');
  var voiceToggle = document.getElementById('voiceToggle');
  var emailPanel = document.getElementById('emailPanel');
  var emailKind = document.getElementById('emailKind');
  var emailTo = document.getElementById('emailTo');
  var emailSubject = document.getElementById('emailSubject');
  var emailBody = document.getElementById('emailBody');
  var emailStatus = document.getElementById('emailStatus');
  var mailtoBtn = document.getElementById('mailtoBtn');
  var copyBtn = document.getElementById('copyBtn');
  var nameEl = document.getElementById('visitorName');
  var classEl = document.getElementById('visitorClass');
  var contactEl = document.getElementById('visitorContact');

  var currentDraft = null;
  var recognizing = false;
  var recognition = null;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function addMessage(role, text, actions) {
    var div = document.createElement('div');
    div.className = 'msg ' + role;
    div.innerHTML = '<div class="bubble">' + esc(text) + '</div>';
    if (actions) {
      var row = document.createElement('div');
      row.className = 'actions';
      actions.forEach(function (a) {
        var b = document.createElement('button');
        b.textContent = a.label;
        b.addEventListener('click', a.onClick);
        row.appendChild(b);
      });
      div.appendChild(row);
    }
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
    return div;
  }

  function speak(text) {
    if (!voiceToggle.checked) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-IN';
      window.speechSynthesis.speak(u);
    } catch (e) { /* voice output is best-effort; text always works */ }
  }

  function buildDraft(kind) {
    var name = (nameEl.value || '').trim() || '[Your name]';
    var cls = classEl.value || '[Class]';
    var contact = (contactEl.value || '').trim() || '[Your email or phone]';
    var drafts = {
      enroll: {
        label: 'Enrollment request',
        subject: 'Enrollment request — Evo11ve AI Skills Program',
        body: 'Hello Evo11ve team,\n\nI would like to enroll in the AI Skills Program (Rs 9,999 per student, for Classes 6-12).\n\nName: ' + name + '\nClass: ' + cls + '\nContact: ' + contact + '\n\nPlease confirm the next steps for enrollment, including batch dates and timings.\n\nThank you.'
      },
      callback: {
        label: 'Callback request',
        subject: 'Callback request — Evo11ve AI Skills Program',
        body: 'Hello Evo11ve team,\n\nPlease call me back about the AI Skills Program.\n\nName: ' + name + '\nClass: ' + cls + '\nContact: ' + contact + '\n\nI have a question about the program that the assistant could not answer from the program page.\n\nThank you.'
      },
      human: {
        label: 'Escalation to a human',
        subject: 'Question about the Evo11ve AI Skills Program',
        body: 'Hello Evo11ve team,\n\nI have a question about the AI Skills Program that the assistant could not answer from the program page, and I would like to speak with a human.\n\nName: ' + name + '\nClass: ' + cls + '\nContact: ' + contact + '\n\nPlease get back to me at your earliest convenience.\n\nThank you.'
      }
    };
    return drafts[kind];
  }

  function showDraft(kind) {
    var d = buildDraft(kind);
    currentDraft = d;
    emailKind.textContent = d.label;
    emailTo.textContent = EMAIL_RECIPIENT;
    emailSubject.textContent = d.subject;
    emailBody.textContent = d.body;
    emailStatus.textContent = 'Prepared — nothing has been sent yet. Opening it in your mail app lets you review it and press Send.';
    emailPanel.classList.remove('hidden');
    emailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function sendViaMailto() {
    if (!currentDraft) return;
    if (EMAIL_ENDPOINT) {
      emailStatus.textContent = 'Server-side sending is configured (EMAIL_ENDPOINT) but not wired to a live mailbox in this demo — the mailto handoff below is the working route.';
    }
    var url = 'mailto:' + encodeURIComponent(EMAIL_RECIPIENT) +
      '?subject=' + encodeURIComponent(currentDraft.subject) +
      '&body=' + encodeURIComponent(currentDraft.body);
    window.location.href = url;
    emailStatus.textContent = 'Opened in your mail app with the full email filled in. Press Send there to deliver it — this page cannot confirm delivery, so it never reports the email as sent.';
  }

  function ask(raw) {
    var q = (raw || '').trim();
    if (!q) return;
    addMessage('user', q);
    var res = window.EvoKB.answer(q);
    if (res.type === 'enroll' || res.type === 'callback' || res.type === 'human') {
      var labels = {
        enroll: 'I can prepare an enrollment email for the program team. Fill in your details below (optional) and use the email panel to review it before sending.',
        callback: 'I can prepare a callback request for the program team. Fill in your details below (optional) and use the email panel to review it before sending.',
        human: 'I can prepare an escalation email to a human on the program team. Fill in your details below (optional) and use the email panel to review it before sending.'
      };
      showDraft(res.type);
      addMessage('assistant', labels[res.type]);
      speak(labels[res.type]);
    } else if (res.type === 'answer') {
      addMessage('assistant', res.entry.answer);
      speak(res.entry.answer);
    } else {
      addMessage('assistant', 'I couldn\u2019t find that on the official AI Skills Program page, so I won\u2019t guess. You can ask the program team directly \u2014 request a callback or escalate to a human below, or read the page itself: ' + window.EvoKB.PROGRAM_URL, [
        { label: 'Request a callback', onClick: function () { showDraft('callback'); } },
        { label: 'Escalate to a human', onClick: function () { showDraft('human'); } }
      ]);
      speak('I couldn\u2019t find that on the official program page, so I won\u2019t guess. You can request a callback or escalate to a human.');
    }
  }

  function setupVoice() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      micBtn.title = 'Voice input is not supported in this browser — type your question instead.';
      micBtn.addEventListener('click', function () {
        addMessage('assistant', 'Voice input isn\u2019t supported in this browser, so please type your question instead — text chat works everywhere.');
      });
      return;
    }
    recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = function (ev) {
      var text = '';
      for (var i = 0; i < ev.results.length; i++) text += ev.results[i][0].transcript;
      inputEl.value = text;
      if (ev.results[ev.results.length - 1].isFinal) {
        stopMic();
        ask(text);
        inputEl.value = '';
      }
    };
    recognition.onerror = function () { stopMic(); };
    recognition.onend = function () { stopMic(); };
    micBtn.addEventListener('click', function () {
      if (recognizing) { stopMic(); return; }
      try {
        recognition.start();
        recognizing = true;
        micBtn.classList.add('listening');
        micBtn.textContent = '\u25CF Listening\u2026 tap to stop';
      } catch (e) { stopMic(); }
    });
  }

  function stopMic() {
    recognizing = false;
    micBtn.classList.remove('listening');
    micBtn.textContent = '\uD83C\uDFA4 Speak';
  }

  sendBtn.addEventListener('click', function () {
    var q = inputEl.value;
    inputEl.value = '';
    ask(q);
  });
  inputEl.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { var q = inputEl.value; inputEl.value = ''; ask(q); }
  });
  document.querySelectorAll('[data-q]').forEach(function (chip) {
    chip.addEventListener('click', function () { ask(chip.getAttribute('data-q')); });
  });
  document.querySelectorAll('[data-draft]').forEach(function (btn) {
    btn.addEventListener('click', function () { showDraft(btn.getAttribute('data-draft')); });
  });
  mailtoBtn.addEventListener('click', sendViaMailto);
  copyBtn.addEventListener('click', function () {
    if (!currentDraft) return;
    var text = 'To: ' + EMAIL_RECIPIENT + '\nSubject: ' + currentDraft.subject + '\n\n' + currentDraft.body;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        emailStatus.textContent = 'Email text copied. Paste it into any mail app to send it — this page does not report it as sent.';
      });
    } else {
      emailStatus.textContent = 'Copy not supported here — the full email text is shown above; select and copy it manually.';
    }
  });

  setupVoice();

  // Welcome message (real assistant greeting, not a scripted conversation).
  addMessage('assistant', 'Hi! I\u2019m the Evo11ve AI Skills assistant. Ask me about the AI Skills Program \u2014 price, hours, projects, certification, mentors, or who it\u2019s for. I answer only from the official program page, and if the page doesn\u2019t cover something, I\u2019ll say so and offer to contact the team. Tap a suggestion below, type, or use the mic.');

  // Shareable question links: #ask=<question> auto-submits on load.
  // This is a shipped feature (documented in README), used for demos too.
  if (window.location.hash.indexOf('#ask=') === 0) {
    try {
      var preset = decodeURIComponent(window.location.hash.slice(5).replace(/\+/g, ' '));
      if (preset) setTimeout(function () { ask(preset); }, 400);
    } catch (e) { /* ignore malformed hash */ }
  }
})();
