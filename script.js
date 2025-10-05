const nav = document.getElementById('topNav');
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const yearSpan = document.getElementById('year');
const cards = document.querySelectorAll('.card');
const agencies = document.querySelectorAll('.agency-card');
const reassuranceBlocks = document.querySelectorAll('.reassurance-item');
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatForm = document.getElementById('chatForm');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const leadForm = document.getElementById('leadForm');
const API_URL = 'https://api.mistral.ai/v1/chat/completions';
const assistantSystemPrompt = `Tu es Allianz Santé Seniors Bot, assistant virtuel d'une agence Allianz spécialisée santé seniors.
- Tu connais les contrats santé Allianz pour seniors, leurs garanties, délais, options.
- Tu adoptes un ton rassurant, professionnel et pédagogique.
- Tu précises lorsque la question relève d'un avis médical que seul un médecin peut le donner.
- Tu n'es pas médecin.
- Tu n'es pas l'agent général, mais tu travailles à ses côtés et peux organiser un rappel.
- Tu proposes de mettre en relation avec un conseiller humain ou l'agence lorsque c'est pertinent.
- Tu respectes la réglementation en indiquant que les informations sont générales et qu'un devis personnalisé est nécessaire pour un tarif définitif.`;

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

[...cards, ...agencies, ...reassuranceBlocks].forEach((block) => revealObserver.observe(block));

if (leadForm) {
  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const url = new URL('https://wa.me/33781253154');
    const message = `Bonjour Allianz Santé Seniors, je souhaite être rappelé(e).\nNom : ${formData.get('nom')}\nTéléphone : ${formData.get('telephone')}\nEmail : ${formData.get('email')}\nFormule : ${formData.get('formule')}\nMessage : ${formData.get('message') || 'Non précisé'}`;
    url.searchParams.append('text', message);
    window.open(url.toString(), '_blank', 'noopener');
  });
}

function toggleChat(open) {
  const isOpen = typeof open === 'boolean' ? open : !chatPanel.classList.contains('open');
  chatPanel.classList.toggle('open', isOpen);
  chatToggle.setAttribute('aria-expanded', isOpen);
  chatPanel.setAttribute('aria-hidden', !isOpen);
  if (isOpen) {
    chatInput.focus();
  }
}

if (chatToggle) {
  chatToggle.addEventListener('click', () => toggleChat());
}

if (chatClose) {
  chatClose.addEventListener('click', () => toggleChat(false));
}

async function sendMessageToMistral(content) {
  if (!window.MISTRAL_API_KEY) {
    throw new Error("Clé API manquante. Ajoutez votre clé Mistral dans config.js (voir README).");
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      temperature: 0.3,
      messages: [
        { role: 'system', content: assistantSystemPrompt },
        { role: 'user', content },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erreur API (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error('Réponse inattendue du modèle.');
  }
  return message.trim();
}

function appendMessage(text, sender = 'assistant') {
  const bubble = document.createElement('div');
  bubble.className = `message ${sender}`;
  bubble.innerHTML = `<p>${text.replace(/\n/g, '<br />')}</p>`;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setLoadingState(isLoading) {
  chatInput.disabled = isLoading;
  chatForm.querySelector('button').disabled = isLoading;
}

if (chatForm) {
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    chatInput.value = '';
    setLoadingState(true);

    try {
      const response = await sendMessageToMistral(message);
      appendMessage(response, 'assistant');
    } catch (error) {
      appendMessage(
        "Je n’ai pas pu joindre notre assistant intelligent. Vérifiez votre connexion ou contactez directement l’agence au 04 91 50 10 00.",
        'assistant'
      );
      console.error(error);
    } finally {
      setLoadingState(false);
      chatInput.focus();
    }
  });
}

if ('scrollBehavior' in document.documentElement.style) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('open');
      }
    });
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && chatPanel.classList.contains('open')) {
    toggleChat(false);
  }
});
