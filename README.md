# Visualisation du Flux Patient - Service Urologie

## 📋 Description du Projet

Application interactive de visualisation du parcours patient dans un service de consultations d'urologie. Ce projet a été développé dans le cadre d'une étude de cas pour IMT Mines Albi, permettant d'analyser et de visualiser le parcours complet d'un patient à travers différentes salles et étapes du service.

## 🎯 Objectifs de l'Étude

L'application répond à plusieurs questions d'analyse :

- **Q1** : Identification du patient avec le séjour le plus long
- **Q2** : Calcul du temps de séjour total
- **Q3** : Représentation en graphe orienté du parcours
- **Q4** : Superposition sur un plan architectural réel
- **Q5** : Calcul de la distance parcourue via le maillage des couloirs

## 🚀 Fonctionnalités Principales

### Trois Modes de Visualisation

#### 1. **Mode Graphe (Q3)**
- Graphe orienté avec 18 nœuds numérotés
- Nœuds **draggables** : déplacez-les par glissé-déposé
- Arcs **élastiques** : restent connectés pendant le déplacement
- Labels affichant le nom de chaque étape

#### 2. **Mode Plan Architectural (Q4)**
- Plan basé sur le layout réel du service d'urologie
- Échelle précise : **1 pixel = 5 cm** (box de consultation = 70px = 3,50m)
- Nœuds positionnés sur les **points de référence** (centres des salles)
- Couleurs différenciées par type de salle :
  - 🟡 Jaune : Consultations et attentes
  - 🔵 Bleu : Bureaux administratifs
  - 💙 Bleu clair : Salles d'examen
  - 🟢 Vert : Débitmétrie et entrée
  - 🔴 Rouge : Sortie

#### 3. **Mode Maillage (Q5)**
- Visualisation du **réseau de couloirs** (lignes médianes)
- Calcul automatique du chemin sur le maillage
- Affichage de la **distance totale parcourue** en mètres
- Algorithme de pathfinding basé sur la topologie réelle

## 📊 Données du Patient

**Patient #185** (séjour le plus long)
- **Durée totale** : 352,19 minutes (~5h52)
- **Nombre d'étapes** : 18
- **Parcours** :
  1. Entrée → Accueil
  2. Consultations URO (boxes #5 et #2)
  3. Débitmétrie
  4. Salles d'examen (#2 et #3)
  5. Bureau d'annonce
  6. Sortie administrative

## 🎮 Contrôles Interactifs

### Navigation
- **🖱️ Molette** : Zoom avant/arrière
- **🖱️ Clic + Glisser** : Déplacer la vue (pan)
- **📍 Bouton Centre** : Réinitialiser la vue

### Animation
- **▶️ Play/Pause** : Lance/arrête l'animation automatique
- **🔄 Reset** : Retourne à la première étape
- **⏱️ Vitesse** : 1,5 seconde par étape

### Mode Graphe
- **Drag & Drop** : Cliquez et déplacez les nœuds numérotés

### Navigation Étapes
- Cliquez sur une étape dans la chronologie pour y accéder directement
- Barre de progression interactive


### Composants Clés

#### `roomLayout`
Définit toutes les salles avec :
- Position (x, y)
- Dimensions (width, height)
- Label et couleur

#### `corridorNetwork`
Réseau de 27 segments de couloirs formant le maillage complet du service.

#### `findPathOnGrid(from, to)`
Algorithme de pathfinding :
1. Rejoint le couloir le plus proche
2. Se déplace horizontalement
3. Change de niveau si nécessaire (couloir examens)
4. Rejoint la destination

## 🎨 Design et UX

### Palette de Couleurs
- **Bleu** (#3b82f6) : Nœuds et chemins principaux
- **Rouge** (#ef4444) : Étape courante
- **Vert** (#10b981) : Entrée et plan architectural
- **Dégradés** : Interface moderne et professionnelle

### Responsive Design
- Adapté mobile, tablette et desktop
- Grille flexible (grid-cols-1 md:grid-cols-3)
- Canvas redimensionnable

### Accessibilité
- Labels clairs et contrastés
- Taille de police adaptative
- Icônes Lucide React pour clarté visuelle

## 📐 Échelle et Mesures

- **Échelle** : 1 pixel = 5 cm
- **Box consultation** : 70px × 70px = 3,50m × 3,50m
- **Distance calculée** : Basée sur le chemin réel via couloirs
- **Plan** : Proportions fidèles au layout original

## 🔍 Points Techniques Importants

### Rendu Canvas
- Utilisation de `ctx.save()` et `ctx.restore()` pour transformations
- Gestion du zoom et pan avec matrices de transformation
- Rendu optimisé avec `clearRect` avant chaque frame

### Gestion des États
- `useEffect` pour animation automatique
- `useRef` pour accès direct au canvas
- État local pour drag & drop

### Calcul de Distance
```javascript
// Échelle : 1px = 0.05m (5cm)
const distanceMeters = totalPixels * 0.05;
```

## 📦 Dépendances

- **React** : Framework UI
- **Lucide React** : Bibliothèque d'icônes
- **Canvas API** : Rendu graphique

## 🚦 Comment Utiliser

1. **Lancer l'application** : L'interface s'affiche avec le mode Plan par défaut
2. **Choisir un mode** : Cliquez sur Q3, Q4 ou Q5 pour changer de vue
3. **Naviguer** :
   - Utilisez Play pour animation automatique
   - Cliquez sur la chronologie pour sauter à une étape
   - Zoomez et déplacez pour explorer les détails
4. **Mode Graphe** : Réorganisez les nœuds par drag & drop
5. **Analyser** : Consultez les métriques et la distance parcourue

## 📈 Métriques Affichées

- **Patient ID** : 185
- **Durée totale** : 352 minutes
- **Nombre d'étapes** : 18
- **Distance parcourue** : Calculée en temps réel selon le mode
- **Progression** : Barre de progression en pourcentage

## 🎓 Contexte Académique

Ce projet démontre :
- Analyse de données de flux patient
- Visualisation interactive de processus
- Représentation spatiale et temporelle
- Application de graphes orientés
- Calcul de métriques opérationnelles

Développé pour l'étude de cas IMT Mines Albi - Test de recrutement stage.

## 📝 Notes de Développement

- Le plan architectural est basé sur un layout réel fourni
- Les positions des salles ont été mesurées manuellement
- Le réseau de couloirs suit les lignes médianes du plan
- L'échelle permet des calculs de distance réalistes
- Les trois modes offrent des perspectives complémentaires

