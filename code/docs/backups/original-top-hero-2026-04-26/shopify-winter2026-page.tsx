"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RenaissanceThreeScene } from "./renaissance-three-scene";
import styles from "./shopify-winter2026.module.css";

type Feature = {
  title: string;
  body: string;
  cta?: string;
  image?: string;
  tall?: boolean;
};

type Section = {
  id: string;
  label: string;
  roman: string;
  headline: string;
  summary: string;
  theme: "dark" | "light";
  layout?: "cards" | "scene" | "split";
  sceneMode?: "sidekick" | "agentic" | "retail" | "marketing" | "developer";
  sceneImage?: string;
  height?: number;
  features: Feature[];
  updates: string[];
};

const navItems = [
  ["sidekick", "Sidekick", "I"],
  ["agentic", "Agentique", "II"],
  ["online", "En ligne", "III"],
  ["retail", "Retail", "IV"],
  ["marketing", "Marketing", "V"],
  ["checkout", "Paiement", "VI"],
  ["operations", "Opérations", "VII"],
  ["shop-app", "Shop app", "VIII"],
  ["b2b", "B2B", "IX"],
  ["finance", "Finance", "X"],
  ["shipping", "Expédition", "XI"],
  ["developer", "Développeurs", "XII"],
] as const;

const sectionHeights: Record<string, number> = {
  sidekick: 8844,
  agentic: 2735,
  online: 6075,
  retail: 8259,
  marketing: 4229,
  checkout: 2207,
  operations: 3108,
  "shop-app": 2456,
  b2b: 3043,
  finance: 2542,
  shipping: 2327,
  developer: 8886,
};

const sidekickVideoSrc = "/reference/video/sidekick-dreamina.mp4";

const sections: Section[] = [
  {
    id: "sidekick",
    label: "Sidekick",
    roman: "I",
    headline: "L’expert Shopify assisté par l’IA, tout aussi passionné que vous par votre entreprise.",
    summary:
      "Sidekick Pulse, la génération d’applis, les workflows et les recommandations se présentent comme un copilote intégré au quotidien marchand.",
    theme: "light",
    layout: "scene",
    sceneMode: "sidekick",
    sceneImage:
      "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/apps-bg-image.png?v=1763934791&width=1200&height=521&crop=center",
    features: [
      {
        title: "Suggestions intelligentes",
        body: "Sidekick Pulse fournit des recommandations personnalisées et les prochaines étapes en utilisant les tendances du marché et les données de votre boutique.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/compressed-pulseDesktopPoster-desktop.webp?v=1765345989&width=600&height=312&crop=center",
      },
      {
        title: "Génération d’applis personnalisées",
        body: "Demandez à Sidekick de créer des applications adaptées aux besoins de votre entreprise.",
        cta: "Afficher l’aide",
      },
      {
        title: "Automatisation des flux de travail",
        body: "Créez des automatisations dans Shopify Flow sans sortir de votre flux de travail.",
        cta: "Obtenir l’application",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/default_abdd996f-1b4e-44a5-bfcc-8addca857894.png?v=1765164459&width=600&height=590&crop=center",
      },
      {
        title: "Rapports d’analyse personnalisés",
        body: "Sidekick peut générer des rapports personnalisés et des visualisations de données directement dans l’éditeur de requêtes ShopifyQL.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/fr_5820e043-0d1f-4302-95b9-fff758b07629.png?v=1765309078&width=600&height=495&crop=center",
      },
      {
        title: "Aide à la segmentation",
        body: "Sidekick peut vous aider à créer des segments ou à les générer à partir de zéro.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/compressed-u2poster_12_9.webp?v=1765315033&width=600&height=495&crop=center",
      },
      {
        title: "Designs affinés",
        body: "Modifiez les thèmes, les images et les e-mails avec des invites qui conservent le contexte de la boutique.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U16_Sidekick_edits_email_sections_fr.png?v=1765338424&width=600&height=1036&crop=center",
        tall: true,
      },
    ],
    updates: ["Mode large", "Découverte d’applications", "Sélection de la cible", "Meilleure mémoire"],
  },
  {
    id: "agentic",
    label: "Agentique",
    roman: "II",
    headline: "Vendez directement dans les chats d’IA.",
    summary:
      "Les boutiques en ligne agentiques diffusent les produits vers ChatGPT, Copilot, Perplexity et d’autres canaux à partir d’une configuration unique.",
    theme: "dark",
    layout: "scene",
    sceneMode: "agentic",
    features: [
      {
        title: "Boutiques en ligne agentiques de Shopify",
        body: "Gérez la façon dont votre marque apparaît aux millions d’utilisateurs qui font leurs achats dans les chats d’IA.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/chatgptdesktopposter_12_10.webp?v=1765374017&width=600&height=580&crop=center",
      },
      {
        title: "Boutiques en ligne agentiques",
        body: "Configurez vos données une seule fois et Shopify Agentic Storefronts présentera vos produits dans tous les chats d’IA.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/5aa1f17e22044052af94fde4bb1d052c.thumbnail.0000000000.jpg?v=1765338996&width=1300&crop=center",
      },
    ],
    updates: ["ChatGPT", "Copilot", "Perplexity", "Catalogues prêts pour l’IA"],
  },
  {
    id: "online",
    label: "En ligne",
    roman: "III",
    headline: "Validez les modifications de votre boutique avant la mise en ligne.",
    summary:
      "Rollouts, SimGym, l’éditeur de thème et WordPress transforment les lancements en expériences testables.",
    theme: "light",
    features: [
      {
        title: "Testez et programmez vos lancements avec Rollouts",
        body: "Programmez les modifications de thème et les tests A/B directement dans l’interface administrateur.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/BG-B1.png?v=1762365507&width=700&height=467&crop=center",
      },
      {
        title: "Gérer les détails de la boutique dans l’éditeur de thème",
        body: "Apportez des modifications aux produits, collections, marchés et champs méta sans quitter l’éditeur de thème.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U37_Integrated_theme_editor_desktop-fallback_fr.png?v=1765338480&width=700&height=521&crop=center",
      },
      {
        title: "Générer des thèmes sur mobile",
        body: "Concevez votre boutique depuis l’appli Shopify mobile en générant un thème, en le prévisualisant et en le publiant.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U47_Theme_index_on_mobile_fr.png?v=1765338466&width=300&height=519&crop=center",
        tall: true,
      },
      {
        title: "Vendre sur WordPress",
        body: "Ajoutez des produits, des collections, un panier et un paiement Shopify à votre site WordPress.",
        cta: "Afficher l’aide",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U230_WordPress_fr.png?v=1765338473&width=300&height=348&crop=center",
      },
    ],
    updates: ["Plus de 250 améliorations du thème Horizon", "2048 variantes par produit", "Recherche de noms de domaine assistée par l’IA"],
  },
  {
    id: "retail",
    label: "Retail",
    roman: "IV",
    headline: "Nouveau matériel en boutique offrant une fiabilité à toute épreuve.",
    summary:
      "Le POS Hub associe la fiabilité filaire, la puissance de traitement et des connexions conçues pour le commerce physique.",
    theme: "dark",
    layout: "scene",
    sceneMode: "retail",
    features: [
      {
        title: "Des connexions qui ne se coupent jamais",
        body: "Branchez lecteurs de cartes, imprimantes et lecteurs pour une connexion plus forte. Aucun jumelage requis.",
      },
      {
        title: "Lecteurs compatibles avec le POS Hub",
        body: "Choisissez parmi de nouveaux lecteurs de codes-barres ou des lecteurs HID compatibles.",
        cta: "Visiter la boutique de matériel",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U254_Scanner_support.png?v=1765339280&width=700&height=547&crop=center",
      },
      {
        title: "Abonnements sur POS",
        body: "Permettez aux clients de s’inscrire à des abonnements en magasin depuis Shopify POS.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U49_Sell_subscriptions_on_Shopify_POS_fr.png?v=1765338517&width=700&height=539&crop=center",
      },
      {
        title: "Personnalisation de POS",
        body: "La grille intelligente, l’écran de verrouillage, le reçu et l’affichage client se personnalisent dans un seul éditeur.",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/a4e62b15748ef030101e2e0d47a25500.png?width=700&crop=center",
      },
    ],
    updates: ["MFI", "MPU ARM Cortex-A7", "Reprise automatique après erreur", "3 ports USB-A et 1 port USB-C"],
  },
  {
    id: "marketing",
    label: "Marketing",
    roman: "V",
    headline: "Augmentez vos ventes grâce à un réseau de produits unique.",
    summary:
      "Shopify Product Network, Shop Campaigns, SMS et formulaires traduits étendent les surfaces de découverte.",
    theme: "dark",
    layout: "scene",
    sceneMode: "marketing",
    features: [
      {
        title: "Shopify Product Network",
        body: "Affichez instantanément les produits d’autres marques Shopify dans votre recherche, vos collections, vos e-mails et vos pages après achat.",
        cta: "Obtenir l’application",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/e070354fb7caa429f72b9832bd9ed574.png?width=700&crop=center",
      },
      {
        title: "Shopify Messaging prend en charge le SMS",
        body: "Créez, programmez, envoyez et suivez des campagnes de marketing par SMS.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U105_Shopify_Email_SMS_marketing_fr.png?v=1765338532&width=700&height=671&crop=center",
      },
      {
        title: "Traduction automatique pour Shopify Forms",
        body: "Traduisez automatiquement les formulaires de l’anglais vers 19 autres langues.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U109_Forms_translations_fr.png?v=1765338524&width=700&height=509&crop=center",
      },
      {
        title: "Recherche de modèles de segmentation",
        body: "Parcourez, recherchez et filtrez une bibliothèque actualisée de modèles de segmentation client.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U98_Search_and_filter_segmentation_templates_fr.png?v=1765338539&width=700&height=410&crop=center",
      },
    ],
    updates: ["Shop Campaigns sur plus de canaux", "Segmentation par catégories", "Vue calendrier pour la messagerie"],
  },
  {
    id: "checkout",
    label: "Paiement",
    roman: "VI",
    headline: "Convertissez vos clients avec des expériences de paiement personnalisées.",
    summary:
      "Shop Pay, Apple Pay, Global-e et des configurations par marché densifient l’expérience de paiement.",
    theme: "dark",
    features: [
      {
        title: "Bouton Shop personnalisé",
        body: "Les quatre derniers chiffres de la carte enregistrée du client s’affichent sur son bouton Shop Pay.",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/636625d9478b086fa7e92df2bd966cd1.png?width=700&crop=center",
      },
      {
        title: "Personnalisation par marché",
        body: "Personnalisez les pages de paiement et de compte client pour différents pays et acheteurs B2B.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U94_Markets_in_the_Checkout_fr.png?v=1765338734&width=700&height=411&crop=center",
      },
    ],
    updates: ["Paiement en plusieurs fois au Royaume-Uni", "Apple Pay dans Shop Pay", "Rappels pour les abonnements Shop Pay"],
  },
  {
    id: "operations",
    label: "Opérations",
    roman: "VII",
    headline: "Améliorez les flux de travail quotidiens.",
    summary:
      "Inventaire flexible, vente rapide mobile, Apple Watch et analyse rendent les opérations plus réactives.",
    theme: "light",
    features: [
      {
        title: "Transferts de stock flexibles",
        body: "Recevez des articles provenant d’emplacements non spécifiés et modifiez les envois en transit.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U143_Flexible_inventory_transfers_fr.png?v=1765338582&width=500&height=460&crop=center",
      },
      {
        title: "Vente rapide dans Shopify Mobile",
        body: "Vendez en personne instantanément avec Tap to Pay ou des liens de paiement.",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/8ff1cb42222b3b221f8ca7afa64d78e1.png?width=500&crop=center",
        tall: true,
      },
      {
        title: "Apple Watch",
        body: "Surveillez votre boutique depuis votre poignet avec des widgets personnalisables.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U133_Apple_watch_app_redesign_fr.png?v=1765338587&width=500&height=559&crop=center",
      },
    ],
    updates: ["Gestion des rétrofacturations assistée par l’IA", "Connexion sans mot de passe", "Cartes thermiques dans l’analyse"],
  },
  {
    id: "shop-app",
    label: "Shop app",
    roman: "VIII",
    headline: "Atteignez des millions d’acheteurs à forte intention.",
    summary:
      "Shop devient une surface plus personnalisée avec des boutiques dynamiques, des offres, des vidéos et des pages produit enrichies.",
    theme: "dark",
    features: [
      {
        title: "Flux d’offres",
        body: "Mettez en avant réductions, baisses de prix et Shop Campaigns dans le flux Offres.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U153_Offers_in_Shop_fr.png?v=1765338570&width=500&height=747&crop=center",
        tall: true,
      },
      {
        title: "Vidéos achetables",
        body: "Ajoutez des vidéos achetables à Shop et laissez l’IA optimiser leur distribution.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/aaef2125e294401f9e0ec81f0a1d8a57.thumbnail.0000000000.jpg?v=1765219681&width=500&crop=center",
      },
    ],
    updates: ["Boutiques en ligne dynamiques", "Pages de produit personnalisables", "Suivi dans 21 pays supplémentaires"],
  },
  {
    id: "b2b",
    label: "B2B",
    roman: "IX",
    headline: "Développez la vente en gros à l’international.",
    summary:
      "Collective, ACH, annuaire détaillant et paiements par traitement de commande rendent le B2B plus fluide.",
    theme: "light",
    features: [
      {
        title: "Shopify Collective disponible dans le monde entier",
        body: "Approvisionnez-vous et vendez d’autres marques Shopify depuis l’interface administrateur.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U71_Shopify_Collective_globally_available.png?v=1765381201&width=700&height=532&crop=center",
      },
      {
        title: "Paiements ACH pour le B2B",
        body: "Acceptez les paiements bancaires ACH au moment du paiement avec Shopify Payments.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U75_b2b_ACH_payments_fr.png?v=1765338602&width=700&height=532&crop=center",
      },
      {
        title: "Les fournisseurs découvrent des détaillants",
        body: "Contactez de nouveaux partenaires commerciaux grâce à l’annuaire Shopify Collective.",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/0f19e308eaacb14de1836f362d526e0b.png?width=700&crop=center",
      },
    ],
    updates: ["Crédit en magasin pour le B2B", "Retrait en magasin", "Modalités et acomptes dynamiques"],
  },
  {
    id: "finance",
    label: "Finance",
    roman: "X",
    headline: "Des outils financiers modernes pour optimiser vos revenus.",
    summary:
      "Capital, Balance, cartes employés et suivi des marges donnent un meilleur contrôle financier.",
    theme: "dark",
    features: [
      {
        title: "Financement continu avec Capital",
        body: "Faites une seule demande pour un accès continu au financement et ne payez des frais que sur le solde restant.",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/7bf3d01dd7c5342db620f6e53dc9ac7f.png?width=700&crop=center",
      },
      {
        title: "Transferts automatiques dans Shopify Balance",
        body: "Répartissez automatiquement chaque versement entre frais, stock, marketing et épargne.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U158_Automated_transfers_for_Shopify_Balance_payouts_fr.png?v=1765338609&width=300&height=355&crop=center",
      },
      {
        title: "Cartes pour les employés",
        body: "Émettez des cartes Shopify Balance et définissez des contrôles de dépenses.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U163_Spend_controls_cardholders_for_Balance_fr.png?v=1765338623&width=300&height=436&crop=center",
      },
    ],
    updates: ["Shopify Capital dans plus de pays européens", "Crédits USDC", "Transferts ACH le jour même"],
  },
  {
    id: "shipping",
    label: "Expédition",
    roman: "XI",
    headline: "Expédiez en toute confiance et à la vitesse de l’éclair.",
    summary:
      "Plus d’options d’étiquettes, de partenaires et de transporteurs accélèrent les opérations de livraison.",
    theme: "light",
    features: [
      {
        title: "Étiquettes de retour FedEx",
        body: "Créez, envoyez et suivez des étiquettes de retour FedEx dans l’interface administrateur.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U117_FedEx_One_Rate_and_Return_Labels_6-col_fr.png?v=1765338630&width=700&height=516&crop=center",
      },
      {
        title: "Colis par défaut par variante",
        body: "Définissez un colis par défaut pour chaque variante afin d’obtenir des tarifs plus précis.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U122_Variant_default_packaging_fr.png?v=1765338638&width=700&height=516&crop=center",
      },
    ],
    updates: ["Nom d’expéditeur personnalisé", "Plus de partenaires logistiques", "Statut du traitement en cours"],
  },
  {
    id: "developer",
    label: "Développeurs",
    roman: "XII",
    headline: "Une nouvelle façon de développer pour le commerce grâce à l’IA.",
    summary:
      "Agents, Catalog, Checkout Kit, extensions Sidekick et Dev MCP déplacent le développement commerce vers des flux plus agentiques.",
    theme: "light",
    layout: "scene",
    sceneMode: "developer",
    sceneImage:
      "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U271_checkout_mcp_fr.png?v=1765338683&width=1200&height=1027&crop=center",
    features: [
      {
        title: "Créer des agents de commerce",
        body: "Intégrez une expérience d’achat native aux conversations avec l’IA grâce à l’API Shopify Catalog et au MCP de paiement.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U271_checkout_mcp_fr.png?v=1765338683&width=700&height=599&crop=center",
      },
      {
        title: "Checkout Kit pour le web",
        body: "Intégrez le paiement d’un marchand à n’importe quel flux agentique dans un navigateur.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U183_Checkout_for_web_fr.png?v=1765338721&width=700&height=599&crop=center",
      },
      {
        title: "Sidekick recommande des applis",
        body: "Les marchands trouvent et installent des applis directement dans Sidekick.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/loc-asset_U226_Sidekick_app_discovery_fr.png?v=1765338696&width=700&height=533&crop=center",
      },
      {
        title: "Importations de données en bloc",
        body: "Des opérations bulk plus rapides pour les catalogues, produits et données de commerce.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U191_Faster_bulk_data_imports.png?v=1764969366&width=700&height=649&crop=center",
      },
    ],
    updates: ["Shopify Catalog pour tous", "Extensions d’appli Sidekick", "Dev MCP", "Tangle"],
  },
];

function ShopifyBagIcon() {
  return (
    <svg viewBox="0 0 18 19" aria-hidden="true" className={styles.bagIcon}>
      <path
        fill="currentColor"
        d="M11.98 2.42 11.43 2.6a3.7 3.7 0 0 0-.25-.64C10.8 1.23 10.24.84 9.56.84h-.14A1.7 1.7 0 0 0 8.1.25C6.66.25 5.75 1.74 5.46 2.5l-1.75.54c-.53.17-.55.18-.62.68L1.55 16.1l9.88 1.85 4.27-1.05S14.48 5.13 14.43 4.7c-.05-.43-.32-.5-.66-.6l-1.8-.57Zm-2.6-.68h.1c.92 0 1.34 1.16 1.46 1.72l-1.48.46c-.02-.72-.12-1.55-.42-2.14.12-.02.23-.04.34-.04ZM8.1 1.15c.28 0 .52.18.7.52.27.5.36 1.45.36 2.33l-2.7.84c.28-1.08 1.05-3.69 1.64-3.69Zm-.32 7.4c-.23-.13-.47-.2-.72-.2-1.2 0-1.85 1.03-1.85 2.1 0 1.31.96 2.16 2.23 2.16 1.52 0 2.7-.93 2.7-2.82 0-1.57-.76-2.94-2.57-4.1l.83-.26c1.58 1.12 2.55 2.53 2.55 4.4 0 2.44-1.7 3.74-3.67 3.74-1.76 0-3.1-1.17-3.1-3 0-1.76 1.18-3.13 2.88-3.13.38 0 .72.07 1.02.2l-.3.91Z"
      />
    </svg>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true" className={styles.arrowIcon}>↗</span>;
}

function SectionCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <article
      className={`${styles.featureCard} ${feature.tall ? styles.tallCard : ""}`}
      style={{ "--card-index": index } as CSSProperties}
    >
      {feature.image ? (
        <div className={styles.cardMedia}>
          <img src={feature.image} alt="" loading="lazy" />
        </div>
      ) : (
        <div className={styles.promptStack} aria-hidden="true">
          <span>Crée une appli qui recommande les produits à commander.</span>
          <span>Crée un outil de suivi des tâches pour toute l’équipe.</span>
          <span>Crée un importateur B2B depuis un fichier CSV.</span>
        </div>
      )}
      <div className={styles.cardCopy}>
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
        <h3>{feature.title}</h3>
        <p>{feature.body}</p>
        {feature.cta ? (
          <a href="#" className={styles.smallButton}>
            {feature.cta}
            <ArrowIcon />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function RenaissanceWebGL({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_scroll;

      float line(float value, float width) {
        return smoothstep(width, 0.0, abs(value));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 centered = uv - 0.5;
        float aspect = u_resolution.x / u_resolution.y;
        centered.x *= aspect;

        float phi = 1.61803398875;
        float ring = line(length(centered) - (0.24 + u_scroll * 0.08), 0.0014);
        float ring2 = line(length(centered - vec2(0.28, -0.12)) - (0.36 - u_scroll * 0.05), 0.001);
        float v1 = line(fract((uv.x + u_scroll * 0.02) * phi) - 0.5, 0.002);
        float v2 = line(fract((uv.y - u_time * 0.006) * phi) - 0.5, 0.0014);
        float diag = line(centered.y + centered.x * 0.58 + sin(u_time * 0.18) * 0.02, 0.001);
        float spiral = line(sin(atan(centered.y, centered.x) * 3.0 + log(length(centered) + 0.02) * 6.0 + u_time * 0.16), 0.012);
        float star = step(0.996, fract(sin(dot(floor(uv * vec2(90.0, 54.0)), vec2(12.9898,78.233))) * 43758.5453));
        float alpha = max(max(ring, ring2), max(diag, spiral * 0.28));
        alpha = max(alpha, max(v1 * 0.08, v2 * 0.08));
        alpha = max(alpha, star * 0.45);
        vec3 color = mix(vec3(0.92, 0.86, 0.70), vec3(1.0), star);
        gl_FragColor = vec4(color, alpha * 0.42);
      }
    `;

    const makeShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = makeShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = makeShader(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const scroll = gl.getUniformLocation(program, "u_scroll");

    let frame = 0;
    const render = (now: number) => {
      const scale = window.devicePixelRatio || 1;
      const width = Math.floor(canvas.clientWidth * scale);
      const height = Math.floor(canvas.clientHeight * scale);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, now * 0.001);
      gl.uniform1f(scroll, progressRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} className={styles.webglCanvas} aria-hidden="true" />;
}

function ScrollVideoScene({ progress, src }: { progress: number; src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef(progress);
  const motionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef = useRef(0);
  const durationRef = useRef(0);

  const scheduleSync = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const video = videoRef.current;
      if (!video || !durationRef.current) return;
      const targetTime = clamp(progressRef.current) * Math.max(durationRef.current - 0.04, 0);
      if (Math.abs(video.currentTime - targetTime) > 0.025) {
        video.currentTime = targetTime;
      }
    });
  };

  useEffect(() => {
    progressRef.current = progress;
    scheduleSync();
  }, [progress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const syncMetadata = () => {
      durationRef.current = Number.isFinite(video.duration) ? video.duration : 0;
      scheduleSync();
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = video.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      motionRef.current.targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      motionRef.current.targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * -2, -1, 1);
    };

    let motionFrame = 0;
    const renderMotion = () => {
      motionFrame = 0;
      const state = motionRef.current;
      const deltaX = state.targetX - state.x;
      const deltaY = state.targetY - state.y;
      state.x += (state.targetX - state.x) * 0.14;
      state.y += (state.targetY - state.y) * 0.14;
      video.style.setProperty("--video-x", `${state.x * 18}px`);
      video.style.setProperty("--video-y", `${state.y * 12}px`);
      video.style.setProperty("--video-tilt-x", `${state.y * -1.2}deg`);
      video.style.setProperty("--video-tilt-y", `${state.x * 1.5}deg`);
      if (Math.abs(deltaX) + Math.abs(deltaY) > 0.003) {
        motionFrame = requestAnimationFrame(renderMotion);
      }
    };
    const scheduleMotion = () => {
      if (!motionFrame) {
        motionFrame = requestAnimationFrame(renderMotion);
      }
    };

    video.pause();
    video.preload = "auto";
    video.addEventListener("loadedmetadata", syncMetadata);
    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      scheduleMotion();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    scheduleMotion();
    syncMetadata();

    return () => {
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(motionFrame);
      video.removeEventListener("loadedmetadata", syncMetadata);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className={styles.scrollVideoScene} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.scrollVideo}
        src={src}
        muted
        playsInline
        preload="auto"
      />
      <div className={styles.scrollVideoGlow} />
    </div>
  );
}

function GoldenGrid() {
  return (
    <svg className={styles.goldenGrid} viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 350H1440M550 0V900M890 0V900M0 0L1440 900M1440 0L0 900" />
      <circle cx="720" cy="450" r="250" />
      <circle cx="550" cy="350" r="340" />
      <circle cx="890" cy="550" r="340" />
    </svg>
  );
}

function ScrollScene({ section, progress }: { section: Section; progress: number }) {
  const isSidekickVideo = section.sceneMode === "sidekick";
  const sceneShift = `${(0.5 - progress) * 180}px`;
  const sceneScale = 1.05 - progress * 0.035;
  const phase = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;

  return (
    <div
      className={`${styles.immersiveScene} ${styles[`scene-${section.sceneMode ?? "default"}`] ?? ""}`}
      style={
        {
          "--scene-shift": sceneShift,
          "--scene-scale": sceneScale,
          "--scene-progress": progress,
          "--act-shift": `${(0.5 - progress) * 120}px`,
          "--prompt-left": `${progress * -40}px`,
          "--prompt-right": `${progress * 40}px`,
        } as CSSProperties
      }
    >
      {isSidekickVideo ? (
        <ScrollVideoScene progress={progress} src={sidekickVideoSrc} />
      ) : (
        <RenaissanceThreeScene
          variant={section.sceneMode ?? "sidekick"}
          progress={progress}
          className={styles.chapterThreeScene}
        />
      )}
      <GoldenGrid />
      {section.sceneMode !== "sidekick" ? (
        <div className={styles.sceneAct}>
          <span>{section.roman}</span>
          <strong>{section.label}</strong>
          <p>{section.updates[phase] ?? section.summary}</p>
        </div>
      ) : null}
      {section.sceneMode === "retail" ? (
        <div className={styles.hardwareStack}>
          <span>POS Hub</span>
          <strong>{Math.round(99 + progress)}%</strong>
          <small>Fiabilité filaire</small>
        </div>
      ) : null}
      {section.sceneMode === "developer" ? (
        <div className={styles.codePanel}>
          <span>shopify catalog --agent</span>
          <code>{`await checkout.create({ buyer, cart, market: "FR" })`}</code>
        </div>
      ) : null}
    </div>
  );
}

export function ShopifyWinter2026Page() {
  const [activeId, setActiveId] = useState("hero");
  const [railVisible, setRailVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  const activeSection = useMemo(() => sections.find((section) => section.id === activeId), [activeId]);
  const topbarLight = activeId !== "hero" && activeSection?.theme === "light";
  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items = sections.flatMap((section) => [
      {
        id: section.id,
        title: section.label,
        body: section.headline,
      },
      ...section.features.map((feature) => ({
        id: section.id,
        title: feature.title,
        body: feature.body,
      })),
      ...section.updates.map((update) => ({
        id: section.id,
        title: update,
        body: section.label,
      })),
    ]);
    if (!normalizedQuery) return items.slice(0, 8);
    return items
      .filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 10);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.08, 0.2, 0.4] },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const updateScrollState = () => {
      setRailVisible(window.scrollY > window.innerHeight * 0.72);
      setHeroProgress(clamp(window.scrollY / Math.max(window.innerHeight * 1.2, 1)));
      if (window.scrollY < window.innerHeight * 0.4) {
        setActiveId("hero");
      }

      const nextProgress: Record<string, number> = {};
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const denominator = Math.max(rect.height - window.innerHeight, 1);
        nextProgress[section.id] = clamp((window.innerHeight * 0.5 - rect.top) / denominator);
      });
      setSectionProgress(nextProgress);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScrollState);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className={styles.page}>
      <header className={`${styles.topbar} ${topbarLight ? styles.topbarLight : ""}`}>
        <a href="#hero" className={styles.logo}>
          <ShopifyBagIcon />
          <span>Shopify Editions</span>
          <span className={styles.dim}>Hiver 2026</span>
        </a>
        <button type="button" className={styles.navButton} onClick={() => setMenuOpen((value) => !value)}>
          Editions <span aria-hidden="true">⌄</span>
        </button>
        <div className={styles.searchDock}>
          {searchOpen ? (
            <label className={styles.searchField}>
              <span className={styles.visuallyHidden}>Rechercher</span>
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher"
              />
              <button type="button" onClick={() => setSearchQuery("")}>
                EFFACER
              </button>
              <span aria-hidden="true">⌕</span>
            </label>
          ) : (
            <button type="button" className={styles.navButton} onClick={() => setSearchOpen(true)}>
              Rechercher <span aria-hidden="true">⌕</span>
            </button>
          )}
          {searchOpen ? (
            <div className={styles.searchResults}>
              {searchResults.map((item) => (
                <a
                  key={`${item.id}-${item.title}`}
                  href={`#${item.id}`}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.topbarSpacer} />
        <a href="https://www.shopify.com/fr" className={styles.navButton}>
          Shopify.com
        </a>
        <a href="https://admin.shopify.com/signup?locale=fr&language=fr" className={styles.primaryButton}>
          Démarrer gratuitement
        </a>
        <button type="button" className={styles.mobileToggle} onClick={() => setMobileOpen(true)}>
          <span aria-hidden="true">☰</span>
          <span className={styles.visuallyHidden}>Menu</span>
        </button>
      </header>

      {menuOpen ? (
        <div className={styles.editionsMenu}>
          <a href="#hero">
            <img src="https://cdn.shopify.com/s/files/1/0951/3130/4218/files/favicon_256.png?v=1760634627" alt="" />
            <span>Hiver 2026</span>
            <small>Renaissance</small>
          </a>
          <a href="https://www.shopify.com/fr/editions/summer2025">
            <img src="https://cdn.shopify.com/s/files/1/0921/8919/6588/files/Summer2025.svg?v=1760667315" alt="" />
            <span>Été 2025</span>
            <small>Horizons</small>
          </a>
          <a href="https://www.shopify.com/fr/editions/winter2025">
            <img src="https://cdn.shopify.com/s/files/1/0702/3204/7829/files/Editions-Winter-25-compressed.svg?v=1733331674" alt="" />
            <span>Hiver 2025</span>
            <small>Boring</small>
          </a>
          <a href="https://www.shopify.com/fr/editions/summer2024">
            <img src="https://cdn.shopify.com/s/files/1/0842/2601/5254/files/Editions_Summer_24.svg?v=1716836623" alt="" />
            <span>Été 2024</span>
            <small>Unified</small>
          </a>
          <a href="https://www.shopify.com/fr/editions">Afficher toutes les Editions</a>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className={styles.mobilePanel}>
          <button type="button" className={styles.closeButton} onClick={() => setMobileOpen(false)}>
            Fermer
          </button>
          {navItems.map(([id, label, roman]) => (
            <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}>
              <span>{label}</span>
              <small>{roman}</small>
            </a>
          ))}
        </div>
      ) : null}

      <aside
        className={`${styles.leftRail} ${topbarLight ? styles.railLight : ""} ${railVisible ? "" : styles.hiddenRail}`}
        aria-label="Navigation de section"
      >
        <a href="#hero" className={styles.railTitle}>
          The <em>Renaissance</em> Edition
        </a>
        <nav>
          {navItems.map(([id, label, roman]) => (
            <a key={id} href={`#${id}`} className={activeId === id ? styles.activeRailLink : ""}>
              <span>{label}</span>
              <small>{roman}</small>
            </a>
          ))}
        </nav>
        <div className={styles.railFooter}>
          <strong>© Shopify Inc</strong>
          <a href="https://www.shopify.com/fr/legal/terms">Conditions de service</a>
          <a href="https://www.shopify.com/fr/legal/privacy">Politique de confidentialité</a>
        </div>
      </aside>

      <section
        id="hero"
        className={styles.hero}
        style={
          {
            "--hero-progress": heroProgress,
            "--hero-shift": `${heroProgress * -110}px`,
            "--hero-frame-shift": `${heroProgress * -36}px`,
            "--hero-scale": 1 + heroProgress * 0.08,
          } as CSSProperties
        }
      >
        <RenaissanceThreeScene
          variant="hero"
          progress={heroProgress}
          className={styles.heroThreeScene}
        />
        <GoldenGrid />
        <div className={styles.heroFrame}>
          <h1>
            The <em>Renaissance</em> Edition
          </h1>
          <p>Une nouvelle ère pour le commerce. Plus de 150 mises à jour produit.</p>
          <nav className={styles.heroNav} aria-label="Sections">
            {navItems.map(([id, label, roman]) => (
              <a key={id} href={`#${id}`}>
                <span>{label}</span>
                <small>{roman}</small>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`${styles.section} ${section.theme === "light" ? styles.lightSection : styles.darkSection} ${
            section.layout === "scene" ? styles.sceneSection : ""
          } ${section.id === "sidekick" ? styles.sidekickSection : ""}`}
          style={
            {
              "--section-height": `${section.height ?? sectionHeights[section.id] ?? 2600}px`,
              "--section-progress": sectionProgress[section.id] ?? 0,
            } as CSSProperties
          }
        >
          {section.layout === "scene" ? <ScrollScene section={section} progress={sectionProgress[section.id] ?? 0} /> : null}
          <div className={styles.sectionIndex}>
            <span>{section.roman}</span>
          </div>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>{section.label}</p>
            <h2>{section.headline}</h2>
            <p>{section.summary}</p>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.cardGrid}>
              {section.features.map((feature, index) => (
                <SectionCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
            <div className={styles.updateStrip}>
              {section.updates.map((update) => (
                <a key={update} href="#">
                  <span>{update}</span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
