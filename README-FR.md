# Vending Machine Frontend

Une application frontend moderne et responsive pour un système de machine distributrice numérique, développée avec **Next.js** et **TypeScript**. Cette interface propose une expérience utilisateur intuitive simulant l'utilisation d'une véritable machine distributrice.

## Vue d'ensemble

Cette application frontend sert d’interface utilisateur pour un système de machine distributrice, permettant aux clients de :

* Insérer de l'argent avec différentes coupures de dirham marocain
* Parcourir et sélectionner des produits via une grille interactive
* Visualiser le solde et les informations de transaction en temps réel
* Finaliser leurs achats et recevoir un reçu numérique
* Annuler une transaction et obtenir un remboursement

## Fonctionnalités

### Fonctionnalités Principales

* **Gestion de l’argent** : Prise en charge des coupures de 0,5, 1, 2, 5 et 10 dirhams
* **Sélection de produits** : Grille interactive affichant les produits disponibles avec l’état du stock en temps réel
* **Traitement des transactions** : Cycle complet de la transaction depuis l’insertion d’argent jusqu’à la distribution du produit
* **Suivi du solde** : Calcul en temps réel du solde restant après la sélection de produits
* **Génération de reçus** : Reçus numériques avec détails des transactions et de la monnaie rendue

### Expérience Utilisateur

* **Design réaliste** : Apparence authentique de machine distributrice avec un style professionnel
* **Mise en page responsive** : Optimisée pour tous types d’écrans et d’appareils
* **Mises à jour en temps réel** : Synchronisation avec le backend pour une gestion précise de l’état
* **Gestion des erreurs** : Messages d’erreur complets et indications pour les utilisateurs
* **Accessibilité** : Rétroaction visuelle claire et navigation intuitive

### Aspects Techniques

* **Intégration Backend** : Communication via API REST pour toutes les opérations
* **Gestion d’état** : Gestion robuste des états pour des flux de transaction complexes
* **Sécurité typée** : Implémentation complète en TypeScript pour plus de fiabilité
* **Performance** : Rendu optimisé et récupération efficace des données

## Pile Technologique

* **Framework** : Next.js 15.3.3
* **Langage** : TypeScript
* **Stylisation** : Tailwind CSS
* **Gestionnaire de paquets** : npm

## Captures d'écran

### État Initial – Aucun Argent Inséré

![No Money Inserted](screenshots/no_money_inserted.png)

État initial de la machine lorsque aucun argent n’a été inséré. Les produits sont visibles mais désactivés, et le système invite l’utilisateur à insérer de l’argent pour commencer.

### Argent Inséré – Produits Disponibles

![Products Can Be Bought](screenshots/can_be_bought.png)

Après insertion d'argent, les produits deviennent interactifs selon le solde restant. Les bordures vertes indiquent les produits abordables, tandis que les bordures orange signalent ceux nécessitant des fonds supplémentaires.

### Sélection de Produit

![Product Selection](screenshots/select_product.png)

Les produits sélectionnés sont surlignés avec une bordure jaune et une coche. Le panneau de transaction affiche le solde actuel, les articles sélectionnés et le coût total.

### Reçu de Transaction

![Receipt](screenshots/receipt.png) ![Receipt Details](screenshots/receipt2.png)

Reçu numérique affiché après la finalisation de la transaction, indiquant les articles achetés, les détails du paiement et la monnaie rendue.

## Utilisation

### Développement

Lancer le serveur de développement :

```bash
npm run dev
```

L’application sera disponible à l’adresse `http://localhost:3000`.

### Production

Construire et démarrer le serveur de production :

```bash
npm run build
npm start
```

### Tests

Exécuter la suite de tests :

```bash
npm test
```

Exécuter les tests avec couverture :

```bash
npm run test:coverage
```

## Intégration de l'API

Le frontend communique avec une API backend pour toutes les opérations :

* **GET /api/products** - Récupérer les produits disponibles
* **POST /api/transaction/money** - Insérer de l’argent
* **GET /api/transaction/money** - Obtenir le montant inséré
* **POST /api/products/{id}** - Sélectionner un produit
* **GET /api/transaction/products/selected** - Obtenir les produits sélectionnés
* **GET /api/transaction/products/unselect/{id}** - Désélectionner un produit
* **POST /api/transaction/complete** - Finaliser la transaction
* **POST /api/transaction/cancel** - Annuler la transaction

## Configuration

### Devises prises en charge

L’application prend en charge le dirham marocain (MAD) avec les coupures suivantes :

* 0,5 MAD
* 1 MAD
* 2 MAD
* 5 MAD
* 10 MAD

## Architecture

### Structure des Composants

* **VendingMachine** : Composant conteneur principal gérant l’état global de l’application
* **ProductGrid** : Grille interactive des produits avec capacités de sélection
* **TransactionPanel** : Insertion d’argent, affichage du solde et contrôles de transaction
* **MoneyInput** : Interface pour saisir les coupures de monnaie
* **Receipt** : Affichage du reçu après finalisation d’une transaction

### Gestion de l’état

L’application utilise la gestion d’état intégrée de React avec une structure centralisée :

* Inventaire des produits et disponibilité
* État de la transaction et articles sélectionnés
* Insertion d’argent et suivi du solde
* États de chargement et gestion des erreurs
