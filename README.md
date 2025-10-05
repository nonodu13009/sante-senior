# Allianz Santé Seniors Marseille

Site vitrine moderne optimisé pour la génération de leads santé seniors pour les agences Allianz de Marseille.

## Démarrer

1. Servez le site statique (ex. `python -m http.server 8000`).
2. Ouvrez `http://localhost:8000` dans votre navigateur.

## Assistant conversationnel Mistral

1. Copiez `config.example.js` en `config.js` :
   ```bash
   cp config.example.js config.js
   ```
2. Remplacez `VOTRE_CLE_API_MISTRAL` par la clé API fournie par Mistral.
3. Rechargez le site : le bot peut répondre aux questions santé seniors.

⚠️ La clé API ne doit pas être versionnée dans Git.

## Fonctionnalités principales

- Design immersif inspiré de bolt.new avec effets "wow" (glassmorphisme, animations, gradients).
- Mise en avant des tarifs, de la proximité des agences et de la solidité Allianz.
- Formulaire de rappel connecté à WhatsApp avec message pré-rempli.
- Appels à l'action multiples : devis en ligne, appel téléphonique, WhatsApp, formulaire.
- Chatbot spécialisé santé seniors (Mistral) avec rappel du cadre non médical.
- Sections rassurantes : offres modulaires, agences, accompagnement, témoignage, FAQ.
