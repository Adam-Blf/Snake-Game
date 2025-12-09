[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/adambeloucif/) ![Visitor Badge](https://visitor-badge.laobi.icu/badge?page_id=Adam-Blf.Snake-Game)

![Dernier commit](https://img.shields.io/badge/Dernier%20commit-09/12/2025-brightgreen) ![Langage principal](https://img.shields.io/badge/Langage%20principal-JavaScript-blue) ![Nombre de langages](https://img.shields.io/badge/Nombre%20de%20langages-3-orange)

### Construit avec les outils et technologies : 
![JavaScript](https://img.shields.io/badge/-JavaScript-lightgrey) ![CSS](https://img.shields.io/badge/-CSS-lightgrey) ![HTML](https://img.shields.io/badge/-HTML-lightgrey)

🇫🇷 Français | 🇬🇧 Anglais | 🇪🇸 Espagnol | 🇮🇹 Italien | 🇵🇹 Portugais | 🇷🇺 Russe | 🇩🇪 Allemand | 🇹🇷 Turc

# 🐍 Snake Game

Jeu Snake classique revisité avec système de niveaux, obstacles dynamiques, classement et paramètres personnalisables.

## 🌟 Fonctionnalités

### Gameplay
- 🐍 **Serpent fluide** avec animations et yeux directionnels
- 🍎 **Nourriture** : Collectez pour grandir et marquer des points
- 📈 **Système de niveaux** : Progression avec augmentation de vitesse
- 🧱 **Obstacles dynamiques** : Apparition aléatoire aux niveaux élevés
- 🏆 **Système de score** : Points multipliés par le niveau

### Modes et Paramètres
- ⚙️ **4 Niveaux de difficulté** :
  - 🟢 Facile (lent)
  - 🟡 Moyen (normal)
  - 🔴 Difficile (rapide)
  - 💀 Extrême (très rapide)
- 🎯 **3 Tailles de grille** : 15x15, 20x20, 25x25
- 🧱 **Murs activables** : Game Over ou traversée (wrap-around)
- 🔊 **Effets sonores** : Activables/désactivables

### Fonctionnalités Avancées
- 🏆 **Classement** : Top 10 des meilleurs scores sauvegardés
- 💾 **Sauvegarde locale** : LocalStorage pour scores et préférences
- ⏸️ **Pause** : Menu de pause avec statistiques
- 🎮 **Contrôles doubles** : Flèches ou WASD
- 📱 **Responsive** : Adaptation mobile et desktop
- 🎨 **Animations** : Dégradés, wiggle du titre, effets visuels

## 🚀 Technologies

- **HTML5 Canvas** : Rendu graphique optimisé
- **JavaScript ES6** : Logique de jeu complète
- **CSS3** : Interface moderne avec animations
- **LocalStorage API** : Persistance des données
- **Web Audio API** : Effets sonores procéduraux

## 💻 Installation

### Cloner le Projet

```bash
git clone https://github.com/Adam-Blf/Snake-Game.git
cd Snake-Game
```

### Lancer le Jeu

Ouvrez `index.html` dans votre navigateur :

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Ou avec un serveur local :

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Puis ouvrez [http://localhost:8000](http://localhost:8000)

## 🎮 Contrôles

### Déplacement
- **Flèches ↑ ↓ ← →** : Diriger le serpent
- **W A S D** : Alternative pour diriger

### Actions Globales
- **Espace** : Pause / Reprendre
- **R** : Recommencer
- **Boutons interface** : Navigation complète

## 📂 Structure du Projet

```
Snake-Game/
│
├── index.html          # Structure HTML du jeu
├── style.css           # Styles et animations CSS
├── script.js           # Logique du jeu
├── README.md           # Documentation
└── .gitignore          # Fichiers à ignorer
```

## 🎨 Aperçu des Fonctionnalités

### Grille de Jeu
- Canvas 600x600px adaptatif
- Grille visible avec lignes subtiles
- Tailles configurables (15, 20, 25 cases)

### Serpent
- Tête avec yeux qui suivent la direction
- Corps avec dégradé de transparence
- Collision avec soi-même détectée
- Croissance à chaque nourriture

### Système de Score

```
Points = 10 × Niveau actuel
```

**Exemple :**
- Niveau 1 : 10 points par nourriture
- Niveau 5 : 50 points par nourriture

### Progression de Niveaux

- **Niveau up** : Tous les 5 nourritures (50 points)
- **Vitesse** : Augmente de 10ms par niveau (minimum 40ms)
- **Obstacles** : Apparaissent aléatoirement (30% de chance) à partir du niveau 3

## 🎯 Règles du Jeu

1. **Objectif** : Manger la nourriture (pomme rouge) pour grandir
2. **Game Over** : 
   - Collision avec les murs (si activés)
   - Collision avec son propre corps
   - Collision avec un obstacle
3. **Niveaux** : Progression automatique tous les 50 points
4. **Obstacles** : Blocs gris qui apparaissent aux niveaux élevés

## 🔧 Fonctionnement Interne

### Boucle de Jeu

```javascript
setInterval(() => {
    update();  // Logique de jeu
    render();  // Rendu graphique
}, gameSpeed);
```

### Vitesses par Difficulté

| Difficulté | Intervalle (ms) | FPS |
|-----------|-----------------|-----|
| Facile | 150 | ~6.7 |
| Moyen | 100 | 10 |
| Difficile | 60 | ~16.7 |
| Extrême | 40 | 25 |

### Placement de la Nourriture

Algorithme garantissant une position valide :

```javascript
while (!validPosition) {
    food.x = Math.floor(Math.random() * gridSize);
    food.y = Math.floor(Math.random() * gridSize);
    
    // Vérifier que la position n'est pas sur le serpent ou obstacle
    validPosition = !collisionWithSnake && !collisionWithObstacles;
}
```

### Direction et Prévention de Retour

```javascript
// Empêche le serpent de faire demi-tour instantané
if (newDirection.x === -currentDirection.x && 
    newDirection.y === -currentDirection.y) {
    return; // Direction invalide
}
```

## 🏆 Système de Classement

### Sauvegarde

Chaque partie est enregistrée avec :
- **Score** : Points totaux
- **Niveau** : Niveau atteint
- **Longueur** : Taille finale du serpent
- **Difficulté** : Mode de jeu
- **Date** : Date de la partie

### Affichage

Top 10 des meilleurs scores avec médailles :
- 🥇 1ère place
- 🥈 2ème place
- 🥉 3ème place
- Positions 4-10

### Stockage

```javascript
localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
localStorage.setItem('snakeHighScore', highScore);
```

## 🎵 Effets Sonores

Sons procéduraux générés avec Web Audio API :

- **Manger** : Son court à 400 Hz (0.1s)
- **Level Up** : Son moyen à 600 Hz (0.3s)
- **Game Over** : Son grave à 200 Hz (0.5s)

Tous les sons sont désactivables dans les paramètres.

## 🌐 Compatibilité

| Navigateur | Version Minimale |
|-----------|------------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

## 🚀 Améliorations Futures

- [ ] **Power-ups** : Vitesse, invincibilité, raccourcissement
- [ ] **Thèmes visuels** : Différents styles graphiques
- [ ] **Mode multijoueur** : 2 serpents sur la même grille
- [ ] **Obstacles prédéfinis** : Niveaux avec patterns
- [ ] **Mode infini** : Sans augmentation de vitesse
- [ ] **Statistiques détaillées** : Temps de jeu, meilleures séries
- [ ] **Contrôles tactiles** : Support mobile complet
- [ ] **Replay** : Revoir les meilleures parties

## 📊 Optimisations Techniques

### Performance
- Canvas rendering optimisé
- Collision detection en O(n)
- Pas de re-render inutiles
- Intervalles plutôt que RAF pour contrôle précis de la vitesse

### Responsive
- Canvas adaptatif
- Interface modulaire
- Menus overlay

### Code
- Separation of concerns (rendering, logic, UI)
- Event-driven architecture
- LocalStorage pour persistance

## 🎓 Concepts Utilisés

### JavaScript
- Canvas 2D API (fillRect, arc, gradients)
- setInterval pour game loop
- Event listeners (keyboard, clicks)
- LocalStorage API
- Web Audio API
- Array methods (some, forEach, push, pop)

### Algorithmique
- Détection de collision
- Placement aléatoire valide
- Queue (snake body management)
- Grid-based movement

### Design Patterns
- State management
- Configuration objects
- Modular functions

## 🤝 Contribution

Contributions bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/NewFeature`)
3. Committez (`git commit -m 'Add NewFeature'`)
4. Push (`git push origin feature/NewFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Projet open source - libre d'utilisation pour projets personnels ou éducatifs.

## 👤 Auteur

**Adam Beloucif**
- GitHub: [@Adam-Blf](https://github.com/Adam-Blf)
- Portfolio: [Voir mes projets](https://github.com/Adam-Blf?tab=repositories)

## 🙏 Remerciements

- Inspiré du jeu Snake original (Nokia, 1997)
- Design moderne basé sur Material Design
- Algorithmes de collision classiques

---

⭐ **Mettez une étoile si vous aimez ce projet !** ⭐