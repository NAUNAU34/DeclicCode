# Déclic Code

Une application pour apprendre **JavaScript, Python et C#** par leçons de 3 minutes, avec des mini-jeux.

- 16 leçons par langage : 9 leçons « Les bases » puis 7 leçons « Aller plus loin »
- 6 types de mini-jeux, un défi mixte et un sprint de 60 secondes
- Fonctionne sans internet une fois installée, la progression reste sur l'appareil

## Mettre l'application sur ton téléphone

1. Sur GitHub, ouvre ce dépôt puis **Settings → Pages**.
2. Dans « Build and deployment », choisis **Deploy from a branch**.
3. Choisis la branche qui contient ce fichier et le dossier **/docs**, puis clique sur **Save**.
4. Attends une à deux minutes, le temps que GitHub publie le site à l'adresse
   **https://naunau34.github.io/DeclicCode/**
5. Ouvre cette adresse sur ton téléphone :
   - **Android (Chrome)** : menu ⋮ → « Ajouter à l'écran d'accueil » ou « Installer l'application ».
   - **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».

Avec un compte GitHub gratuit, GitHub Pages demande que le dépôt soit **public**.

## Contenu du dépôt

- `docs/` : l'application prête à être publiée (page, icônes, manifeste, mode hors-ligne).
- `source/declic-code.html` : le code de l'application (leçons et moteur du jeu).
- `source/build.js` : reconstruit `docs/` avec `node source/build.js docs` (nécessite Playwright pour dessiner les icônes).
