"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RenaissanceThreeScene } from "./renaissance-three-scene";
import { ScrollScrubFrameSequence } from "./scroll-scrub-frame-sequence";
import styles from "./shopify-winter2026.module.css";
import { useScrollStageProgress } from "./use-scroll-stage-progress";
import {
  navItems as worldTreeNavItems,
  sectionHeights as worldTreeSectionHeights,
  sections as worldTreeSections,
} from "./world-tree-content";

type Feature = {
  group?: string;
  title: string;
  body: string;
  cta?: string;
  image?: string;
  prompts?: string[];
  tall?: boolean;
  wide?: boolean;
  article?: boolean;
  textOnly?: boolean;
};

type Section = {
  id: string;
  label: string;
  roman: string;
  headline: string;
  summary: string;
  theme: "dark" | "light";
  layout?: "cards" | "scene" | "split" | "article";
  sceneMode?: "sidekick" | "agentic" | "online" | "retail" | "marketing" | "developer";
  sceneImage?: string;
  height?: number;
  features: Feature[];
  updates: string[];
};

const navItems = [
  ["sidekick", "World Tree", "I"],
  ["agentic", "SUSU", "II"],
  ["online", "SUSU Story", "III"],
  ["developer", "Her Vision", "IV"],
  ["operations", "Her Story", "V"],
  ["marketing", "Guardians", "VI"],
  ["b2b", "The Ten", "VII"],
  ["finance", "Crystals", "VIII"],
] as const;

const sectionHeights: Record<string, number> = {
  sidekick: 7200,
  agentic: 3600,
  online: 6200,
  developer: 5200,
  operations: 6200,
  marketing: 3600,
  b2b: 6400,
  finance: 2600,
};

function prose(...paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

const shopifySectionsArchive: Section[] = [
  {
    id: "sidekick",
    label: "Sidekick",
    roman: "I",
    headline: "The AI-powered Shopify expert who's just as obsessed with your business as you are.",
    summary: "The AI-powered Shopify expert who's just as obsessed with your business as you are.",
    theme: "light",
    layout: "scene",
    sceneMode: "sidekick",
    sceneImage:
      "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/apps-bg-image.png?v=1763934791&width=1200&height=521&crop=center",
    features: [
      {
        group: "Insights, proactively delivered",
        title: "Smart suggestions",
        body: "Sidekick Pulse delivers personalized recommendations and next steps for your business using market trends and data from your store.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/compressed-pulseDesktopPoster-desktop.webp?v=1765345989&width=600&height=312&crop=center",
      },
      {
        group: "Complexity, delegated",
        title: "Custom app generation",
        body: "Get Sidekick to build custom apps designed specifically for your business needs.",
        cta: "Read help doc",
        prompts: [
          "Create an app that recommends which products I need to reorder.",
          "Create a task tracker for my whole team.",
          "Create an app that checks returns and cancellation eligibility for orders.",
          "Create an event prep app that generates discounted checkout links for selected products.",
          "Create a bulk B2B company importer that uploads companies from a CSV file.",
        ],
      },
      {
        group: "Complexity, delegated",
        title: "Workflow automations",
        body: "Describe the workflow you want to automate, and Sidekick will build it in the Shopify Flow app.",
        cta: "Get app",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/default_abdd996f-1b4e-44a5-bfcc-8addca857894.png?v=1765164459&width=600&height=590&crop=center",
      },
      {
        group: "Complexity, delegated",
        title: "Custom analytics reports",
        body: "Sidekick can generate custom reports and data visualizations directly in the ShopifyQL query editor.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/en_4608c98d-d4f7-4d35-8b94-e83258e20e54.png?v=1765309078&width=600&height=495&crop=center",
      },
      {
        group: "Complexity, delegated",
        title: "Segmentation support",
        body: "Sidekick can help you build segments or generate them from scratch.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/compressed-u2poster_12_9.webp?v=1765315033&width=600&height=495&crop=center",
      },
      {
        group: "Designs, refined",
        title: "Generate theme edits",
        body: "Tell Sidekick the specific design updates you want and watch it adjust your theme instantly.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/default_ee658e76-0d9b-46c9-b479-5baab424fb97.png?v=1765164617&width=600&height=528&crop=center",
      },
      {
        group: "Designs, refined",
        title: "Studio-quality photos",
        body: "Prompt Sidekick to change image backgrounds, add or remove elements, and expand canvas size.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/compressed-u8poster_12_9.webp?v=1765315279&width=600&height=462&crop=center",
      },
      {
        group: "Designs, refined",
        title: "Mobile image editor",
        body: "Turn any image into a highly polished product shot with Sidekick using the Shopify mobile app file editor.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/en_3a493a1f-2575-43b6-9e6e-22033556b139.png?v=1765309833&width=600&height=1038&crop=center",
        tall: true,
      },
      {
        group: "Designs, refined",
        title: "Email editing",
        body: "Sidekick can help you edit emails in the Shopify Messaging app email editor.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/u16poster_desktop.webp?v=1765308291&width=600&height=1038&crop=center",
        tall: true,
      },
      {
        group: "Tedious tasks, simplified",
        title: "Shortcuts for prompts",
        body: "Turn your Sidekick prompts into reusable Skills, then share your favorites with the community and discover new ones to try.",
        cta: "Read help doc",
      },
      {
        group: "Tedious tasks, simplified",
        title: "Multi-step task completion",
        body: "Partner with Sidekick on more complex tasks now that it can plan, write to-do lists, and take on multiple actions.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/en_a158fbbf-7e97-4014-9008-9eb7a719f84a.png?v=1765311013&width=600&height=468&crop=center",
      },
      {
        group: "Tedious tasks, simplified",
        title: "Voice-powered mobile chat",
        body: "Speak with Sidekick on the go, right in the Shopify mobile app.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/default_be7aaa86-31c5-433d-aae2-5b361372ccc6.png?v=1765310847&width=600&height=384&crop=center",
      },
    ],
    updates: [
      "Wide-mode",
      "App discovery",
      "Target selection",
      "Better memory",
      "Quick company creation",
      "Money management",
      "Block generation for all themes",
    ],
  },
  {
    id: "agentic",
    label: "Agentic",
    roman: "II",
    headline: "Sell directly in AI chats with built-in tools that syndicate your products to every AI platform.",
    summary: "Sell directly in AI chats with built-in tools that syndicate your products to every AI platform.",
    theme: "dark",
    layout: "scene",
    sceneMode: "agentic",
    features: [
      {
        title: "Shopify Agentic Storefronts",
        body: "Manage how your brand appears to the millions of users shopping in AI chats. Your products are discoverable right in ChatGPT, Copilot, and Perplexity, with other channels coming soon.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/chatgptdesktopposter_12_10.webp?v=1765374017&width=600&height=580&crop=center",
      },
      {
        title: "Agentic Storefronts",
        body: "Set up your data once and Shopify Agentic Storefronts will surface your products to AI chats everywhere.",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/5aa1f17e22044052af94fde4bb1d052c.thumbnail.0000000000.jpg?v=1765338996&width=1300&crop=center",
      },
    ],
    updates: ["ChatGPT", "Copilot", "Perplexity", "AI-ready catalogs"],
  },
  {
    id: "online",
    label: "Online",
    roman: "III",
    headline: "Validate store changes with A/B testing and an AI tool that simulates shopping behavior.",
    summary: "Validate store changes with A/B testing and an AI tool that simulates shopping behavior.",
    theme: "light",
    layout: "scene",
    sceneMode: "online",
    features: [
      {
        title: "Test and time your launches with Rollouts",
        body: "Schedule theme changes and A/B test with Rollouts, built directly into the admin.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/BG-B1.png?v=1762365507&width=700&height=467&crop=center",
      },
      {
        title: "Shopify SimGym app",
        body: "Simulate shopper behavior with AI agents that use data from billions of purchases, and get actionable recommendations before going live.",
        cta: "Get app",
      },
      {
        title: "Manage store details in the theme editor",
        body: "Make changes to products, collections, markets, metafields, and more, all without leaving your workflow in the theme editor and across the admin.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U37_Integrated_theme_editor.png?v=1765297197&width=700&height=521&crop=center",
      },
      {
        title: "Theme generation on mobile",
        body: "Design your store right from the Shopify mobile app by generating a theme, previewing it, and publishing on the go.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U47_Theme_index_on_mobile.png?v=1762380331&width=300&height=519&crop=center",
        tall: true,
      },
      {
        title: "Sell on WordPress",
        body: "Turn your WordPress site into an online store by adding products, collections, a cart, and checkout with the Shopify plugin.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U230_Wordpress.png?v=1765139225&width=300&height=348&crop=center",
      },
      {
        title: "Introducing Tinker",
        body: "An app where entrepreneurs can play with the latest AI tools in a single place.",
        cta: "Get app",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/0dfe781a187d48cfa581ed2b1ad6a5ed.thumbnail.0000000000.jpg?v=1765339266&width=700&crop=center",
      },
    ],
    updates: [
      "Over 250 Horizon theme improvements",
      "2048 variants per product",
      "Unlisted product status",
      "Collections improvements",
      "Automatic discounts for eligible customers",
      "Compare-at prices in catalogs",
      "Combine bundle options",
      "Unit pricing for all",
      "Vibe code with Lovable",
      "AI-powered domain discovery",
      "Improved theme discovery",
      "AI-generated theme before signup",
      "Faster customer login with Shop",
      "Customer sign-in with social accounts",
      "Customers can edit their email addresses",
      "Customizable sign-in copy",
    ],
  },
  {
    id: "retail",
    label: "Retail",
    roman: "IV",
    headline: "New in-store hardware that provides unwavering reliability.",
    summary: "New in-store hardware that provides unwavering reliability.",
    theme: "dark",
    layout: "scene",
    sceneMode: "retail",
    features: [
      {
        title: "Not your standard hub",
        body: "The POS Hub gives you the reliability of wired connections with the processing power of a computer.",
        cta: "Shop now",
      },
      {
        title: "Connections that never drop",
        body: "Plug in card readers, printers, and scanners for the strongest, most reliable connection. No pairing required.",
      },
      {
        title: "The only hub with processing power",
        body: "Run a faster, more resilient in-store setup with a dedicated POS Hub that keeps selling even when the floor is busy.",
        cta: "Shop now",
      },
      {
        title: "POS Hub-compatible scanners",
        body: "Choose from newly integrated barcode scanners or a range of HID-compatible scanners that work with the POS Hub, iPad, and Android tablets.",
        cta: "Visit hardware store",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U254_Scanner_support.png?v=1765339280&width=700&height=547&crop=center",
      },
      {
        title: "Subscriptions on POS",
        body: "Allow customers to sign up for subscriptions in store on your POS using the Shopify Subscriptions app.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U49_Sell_subscriptions_on_Shopify_POS.png?v=1765299242&width=700&height=539&crop=center",
      },
      {
        title: "Quick count with POS",
        body: "Scan and update inventory directly from your POS to keep stock accurate across channels. Exclusive to POS Pro.",
        cta: "Read help doc",
      },
      {
        title: "POS customization in one editor",
        body: "Customize the customer display, smart grid, receipts, and lock screen in a single editor.",
        cta: "Read help doc",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/6f0d7e6128d962253121b3aec1527854.png?width=700&crop=center",
      },
      {
        title: "Same-day delivery with Uber Direct",
        body: "Offer local customers faster delivery from retail locations with Uber Direct built into Shopify.",
        cta: "Get app",
      },
    ],
    updates: [
      "Markets for retail",
      "Retail payments in more countries",
      "QR code payments",
      "Tap to Pay in more countries",
      "Cartes Bancaires accepted on POS",
      "Receive transfer shipments in-store",
      "Customizable return receipts",
      "Better in-progress return visibility",
      "Refund selections on POS",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    roman: "V",
    headline: "Grow your sales with a first-of-its-kind product network.",
    summary: "Grow your sales with a first-of-its-kind product network.",
    theme: "dark",
    layout: "scene",
    sceneMode: "marketing",
    features: [
      {
        title: "Shopify Product Network",
        body: "Fill merchandise gaps by choosing to instantly surface products from other Shopify brands in your search, collections, emails, and post-purchase pages, and earn a commission on every sale. US only.",
        cta: "Get app",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/2ace8284aebc4d22901886b2323bb20d.thumbnail.0000000000.jpg?v=1765339222&width=700&crop=center",
      },
      {
        title: "Shop Campaigns expands to the online store",
        body: "Automatically get promoted on collections, search, and post-purchase pages on other relevant Shopify stores. US only.",
        cta: "Read help doc",
      },
      {
        title: "Shopify Messaging supports SMS marketing",
        body: "Create, schedule, send, and track SMS marketing campaigns in the Shopify Messaging app.",
        cta: "Get app",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U105_Shopify_Email_SMS_marketing.png?v=1765299013&width=700&height=671&crop=center",
      },
      {
        title: "Auto-translation for Shopify Forms",
        body: "Automatically translate forms from English into 19 other languages with the Shopify Forms app.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U109_Forms_translations.png?v=1765298840&width=700&height=509&crop=center",
      },
      {
        title: "Improved segmentation template search",
        body: "Browse, search, and filter through a refreshed customer segmentation template library.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U98_Search_and_filter_segmentation_templates.png?v=1765298931&width=700&height=410&crop=center",
      },
    ],
    updates: [
      "Target all audiences in one Shop Campaign",
      "Shop Campaigns on more channels",
      "Segment customers with product categories",
      "Improved email customer segmentation",
      "Dynamic product sections in emails",
      "Calendar view for messaging",
      "Shopify Forms marketing consent",
      "Web pixels on customer accounts",
    ],
  },
  {
    id: "checkout",
    label: "Checkout",
    roman: "VI",
    headline: "Convert customers with personalized checkout experiences and more payment options.",
    summary: "Convert customers with personalized checkout experiences and more payment options.",
    theme: "dark",
    features: [
      {
        title: "Personalized Shop button",
        body: "The last four digits of a customer's saved card will appear on their Shop Pay button.",
        cta: "Read help doc",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/03cf615f7c023dd5afc16904b8e4b619.png?width=700&crop=center",
      },
      {
        title: "Checkout and accounts customization per market",
        body: "Customize your checkout and customer account pages for different countries and B2B buyers directly in the editor.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U94_Markets_in_the_Checkout.png?v=1765299575&width=700&height=411&crop=center",
      },
    ],
    updates: [
      "Shop Pay Installments in the UK",
      "Shop Pay works with Global-e",
      "Apple Pay in Shop Pay",
      "Reminders for Shop Pay subscriptions",
      "Switch to Shopify Payments with zero downtime",
      "Streamlined Shopify Payments onboarding",
      "More payment methods in France",
      "Klarna in more countries",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    roman: "VII",
    headline: "Improve everyday workflows with flexible inventory modeling and trend-spotting analytics.",
    summary: "Improve everyday workflows with flexible inventory modeling and trend-spotting analytics.",
    theme: "light",
    features: [
      {
        title: "Flexible inventory transfers",
        body: "Receive items from unspecified locations, edit shipments in transit, and accurately handle more real-world inventory scenarios.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U143_Flexible_inventory_transfers.png?v=1765168146&width=500&height=460&crop=center",
      },
      {
        title: "Quick sale in the Shopify mobile app",
        body: "Sell in person instantly with quick sale and accept payments with Tap to Pay or payment links.",
        cta: "Read help doc",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/26605fc719dba38d9d2a5da83312810f.png?width=500&crop=center",
        tall: true,
      },
      {
        title: "Updated metrics and widgets for Apple Watch",
        body: "Monitor your store from your wrist with quick access to key metrics and customizable widgets.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U133_Apple_watch_app_redesign.png?v=1765167642&width=500&height=559&crop=center",
      },
    ],
    updates: [
      "AI-enhanced chargeback management",
      "Password-free login",
      "Heatmaps in analytics",
      "Customizable top items in analytics",
      "Bot filtering in analytics",
      "Comprehensive inventory history",
      "Precise date and time controls for analytics",
      "Flash sales with multi-location inventory",
      "Single-view analytics for multiple stores",
      "Bin locations in the Order Printer app",
      "More order filtering capabilities",
      "Edit unfulfilled orders with duties",
      "Smarter safeguards for inventory updates",
      "Discounts on fulfilled items",
      "Preview workflow results in Flow",
      "Redesigned Flow editor",
      "Cancel workflow runs in Flow",
      "Store credit email notifications",
      "Enhanced Managed Markets",
    ],
  },
  {
    id: "shop-app",
    label: "Shop app",
    roman: "VIII",
    headline: "Reach millions of high-intent shoppers with personalized buying experiences.",
    summary: "Reach millions of high-intent shoppers with personalized buying experiences.",
    theme: "dark",
    features: [
      {
        title: "Dynamic storefronts",
        body: "Automatically personalize your Shop storefront with relevant products for each shopper.",
        cta: "Read article",
      },
      {
        title: "Deals feed",
        body: "Highlight discounts, price drops, and Shop Campaigns in the dedicated Deals feed in Shop.",
        cta: "Read article",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U153_Offers_in_Shop.png?v=1765299440&width=500&height=747&crop=center",
        tall: true,
      },
      {
        title: "Shoppable videos",
        body: "Add shoppable videos to Shop and AI will optimize their distribution with built-in ranking and recommendations.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/aaef2125e294401f9e0ec81f0a1d8a57.thumbnail.0000000000.jpg?v=1765219681&width=500&crop=center",
      },
    ],
    updates: ["Customizable product pages", "Better product discovery in Shop Minis", "Order tracking in 21 more countries"],
  },
  {
    id: "b2b",
    label: "B2B",
    roman: "IX",
    headline: "Take your wholesale business global, discover new retailers, and get paid in more ways.",
    summary: "Take your wholesale business global, discover new retailers, and get paid in more ways.",
    theme: "light",
    features: [
      {
        title: "Shopify Collective available globally",
        body: "Source and sell other Shopify brands directly from the admin using Shopify Collective, now available in 35 additional countries.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U71_Shopify_Collective_globally_available.png?v=1765381201&width=700&height=532&crop=center",
      },
      {
        title: "ACH payments for B2B",
        body: "Accept ACH bank payments at checkout with Shopify Payments, and charge saved accounts directly from the admin. Exclusive to Plus. US only.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U75_b2b_ACH_payments.png?v=1765299797&width=700&height=532&crop=center",
      },
      {
        title: "Suppliers can discover retailers",
        body: "Discover and connect with new retail partners using the Shopify Collective retailer directory.",
        cta: "Read help doc",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/786dd1f1b8096bb6116dcbf0fe12893a.png?width=700&crop=center",
      },
      {
        title: "Payment requests per fulfillment",
        body: "Send a separate payment request for each shipment of a multi-shipment order. Exclusive to Plus.",
        cta: "Read help doc",
      },
    ],
    updates: [
      "Store credit for B2B",
      "Pickup in store for B2B",
      "Dynamic payment terms and deposits",
      "Create rules for order review",
      "New B2B-compatible apps",
      "Instant product imports for retailers",
      "ERP systems integration",
      "Improved product import for retailers",
      "Shopify and EDI workflows connect",
      "Horizon themes work with B2B",
    ],
  },
  {
    id: "finance",
    label: "Finance",
    roman: "X",
    headline: "Modern financial tools designed for growing your business and getting that coin.",
    summary: "Modern financial tools designed for growing your business and getting that coin.",
    theme: "dark",
    features: [
      {
        title: "Continuous funding with the Shopify Capital flex account",
        body: "Apply once for ongoing access to funding with Shopify Capital and only pay fees on your outstanding balance. Get replenished funds, subject to approval, as you repay. US only.",
        cta: "Read help doc",
        image: "https://cdn.shopify.com/b/shopify-brochure2-assets/1bf084da109bb3fe83016948c3c88b1f.png?width=700&crop=center",
      },
      {
        title: "Automatic transfers in Shopify Balance",
        body: "Set rules in Shopify Balance to automatically split each payout across accounts, such as expenses, inventory, marketing, and savings. US only.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U158_Automated_transfers_for_Shopify_Balance_payouts.png?v=1765184377&width=300&height=355&crop=center",
      },
      {
        title: "Staff cards with spend controls",
        body: "Issue Shopify Balance cards to staff and set spend controls. US only.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/Rectangle_240657548.jpg?v=1760629924&width=300&height=436&crop=center",
      },
    ],
    updates: [
      "Shopify Capital in more European countries",
      "Track international profit margins",
      "Credits on USDC transactions",
      "Same-day ACH transfers",
      "Unified card dispute",
      "Increased Shopify Credit rewards cap",
      "Dynamic credit limits",
      "Add checks in Shopify Balance",
      "Real-time fraud alerts for Shopify cards",
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    roman: "XI",
    headline: "Ship confidently and cheetah-fast with more label, partner, and carrier options.",
    summary: "Ship confidently and cheetah-fast with more label, partner, and carrier options.",
    theme: "light",
    features: [
      {
        title: "FedEx return labels",
        body: "Create, send, and track FedEx return labels in the Shopify admin with discounted pay-on-scan rates. US only.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U117_FedEx_One_Rate_Return_Labels_6-col.png?v=1765246018&width=700&height=516&crop=center",
      },
      {
        title: "Default package per variant",
        body: "Set a default package for each variant to get more accurate shipping rates at checkout and buy labels faster for single-item orders.",
        cta: "Read help doc",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U122_Variant_default_packaging.png?v=1765168583&width=700&height=516&crop=center",
      },
    ],
    updates: [
      "Custom sender name on labels",
      "More logistics partners",
      "Expanded US and Canada cross-border labels",
      "More global shipping carriers",
      "In-progress fulfillment status",
    ],
  },
  {
    id: "developer",
    label: "Developer",
    roman: "XII",
    headline: "A completely new way to build for commerce with the power of AI.",
    summary: "A completely new way to build for commerce with the power of AI.",
    theme: "light",
    layout: "scene",
    sceneMode: "developer",
    sceneImage:
      "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U271_Checkout_MCP.png?v=1764963709&width=1200&height=1027&crop=center",
    features: [
      {
        group: "Agentic Commerce",
        title: "Build commerce agents",
        body: "Bring native shopping into AI conversations with access to the Shopify Catalog API and Checkout MCP, all from the new Dev Dash.",
        cta: "Read dev docs",
      },
      {
        group: "Agentic Commerce",
        title: "Shopify Catalog for all",
        body: "Search billions of products across Shopify merchants using MCP tools or REST, and soon, select partners can access a direct catalog feed.",
        cta: "Read dev docs",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U271_Checkout_MCP.png?v=1764963709&width=700&height=599&crop=center",
      },
      {
        group: "Agentic Commerce",
        title: "Checkout Kit for web",
        body: "Bring a merchant's checkout to any agentic flow in a browser with a JS library that renders in a pop-up or a new tab.",
        cta: "Read dev docs",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U183_Checkout_for_web_f222b0b3-24d2-4ee2-aff2-ebf8ffb4a766.png?v=1765120160&width=700&height=599&crop=center",
      },
      {
        group: "Sidekick",
        title: "Sidekick recommends apps",
        body: "Merchants can find and install apps directly in Sidekick, with Built for Shopify apps receiving higher prioritization and clear badges.",
        cta: "Learn more",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U226__Sidekick_app_discovery_6b57593c-579c-4a91-84af-7173ff60da83.png?v=1764892648&width=700&height=533&crop=center",
      },
      {
        group: "Sidekick",
        title: "Sidekick app extensions",
        body: "Build Sidekick app extensions that let merchants access your app's data and invoke app actions from Sidekick.",
        cta: "Read dev docs",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U253_-_App_intents_for_Sidekick.png?v=1765246170&width=700&height=533&crop=center",
      },
      {
        group: "Platform + Tools",
        title: "Build with full MCP support",
        body: "Code faster with Shopify Dev MCP that validates every API call in real-time, catches errors before you see them, and generates production-ready code.",
        cta: "Read dev docs",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/preview_images/f880db5d8462441482ecbc2437cacf5d.thumbnail.0000000000.jpg?v=1765379387&width=700&crop=center",
      },
      {
        group: "Platform + Tools",
        title: "Seamless workflows with the Admin Intents API",
        body: "Let apps launch native admin workflows that keep merchants in context while they create, edit, and review key resources.",
        cta: "Read article",
      },
      {
        group: "Platform + Tools",
        title: "Faster bulk operations",
        body: "Shopify's bulk operations API now supports all Admin API mutations, accepts 100MB files, and runs up to five concurrent operations.",
        cta: "Read dev docs",
        image:
          "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/U191_Faster_bulk_data_imports.png?v=1764969366&width=700&height=649&crop=center",
      },
      {
        group: "Platform + Tools",
        title: "Improved metafields and metaobjects",
        body: "Build richer data models with expanded metafield and metaobject tooling across APIs and admin surfaces.",
        cta: "Read dev docs",
      },
      {
        group: "Platform + Tools",
        title: "Introducing Tangle",
        body: "Experiment with a new developer tool for composing commerce capabilities and AI-assisted workflows.",
        cta: "Learn more",
      },
    ],
    updates: [
      "Improved discovery for Built for Shopify apps",
      "60-day grace period on Built for Shopify",
      "Improved theme discovery",
      "Clearer app store requirements",
      "Regional admin performance data optimization",
      "Seamless workflows with the Admin Intents API",
      "Binary testing in Shopify Functions",
      "Shopify Dev MCP supports Hydrogen and Shopify API",
      "Liquid support in Shopify Dev MCP",
      "Shopify Dev MCP supports POS UI extensions",
      "Shopify Functions replace Scripts in 2026",
      "Dev Assistant supports all of Shopify",
      "Enhanced security with token expiry",
      "Enhanced Dev Console",
      "Multi-environment theme commands",
      "Polaris unified UI components expand to POS",
      "Discount code rejection with Shopify Functions",
      "Shop Minis SDK",
      "POS Extensions Storage API",
      "Storefront MCP works with Hydrogen stores",
      "Unlisted product status value",
      "Combine bundle options with the Admin API",
      "Due on fulfillment terms for pre-orders",
      "New code editor for themes",
      "AI discovery for headless stores",
      "Nested cart lines",
      "Native wallet buttons before checkout",
      "Discount eligibility context field",
      "Payment requirement removed on subscriptions",
      "POS UI extensions for cart line items",
      "Variant customization on POS",
      "More POS UI extension tools",
      "POS UI extensions open native screens",
      "Cart Transform Function API on POS",
      "Customize subscriptions with POS UI Extensions",
      "Transfers API",
      "Return APIs with payment reference",
      "Customer Account API supports third-party apps",
      "Store credit refunds in returns API",
      "ShopifyQL API for Shopify Analytics",
      "Returns processing API",
      "Improved onboarding flows with App Bridge",
      "Inventory adjustments reference",
      "Payment terms and deposit configurations",
      "Order review operation in Shopify Functions",
    ],
  },
];

const sections: Section[] = [
  {
    id: "sidekick",
    label: "World Tree",
    roman: "I",
    headline: "The World Tree holds every emotion you have ever carried.",
    summary: "There are two worlds: one you can see, and one that lives just beneath your feelings.",
    theme: "light",
    layout: "scene",
    sceneMode: "sidekick",
    features: [
      {
        group: "The World Tree - The Anchor",
        title: "There are two worlds.",
        body: prose(
          "One you can see - streets, light, the smell of coffee. The other lives just out of reach, in the space beneath your feelings. That is the emotional world.",
          "Every person has their own. It grows alongside you. Its sky shifts with your mood. Its World Tree holds every emotion you have ever carried - the ones you remember, and the ones you have long since forgotten.",
        ),
        article: true,
        wide: true,
      },
      {
        group: "The World Tree - The Anchor",
        title: "Guardians are born from that world.",
        body: prose(
          "Each one called into being by a feeling you once had - a moment of fear, a flash of courage, a night you did not think you would survive. They have always been there. Waiting, without knowing your name, until the moment you were ready.",
          "SUSU is the only one who can cross between worlds. She is the key. The bridge. The quiet one who stays.",
        ),
        article: true,
        wide: true,
      },
      {
        group: "The World Tree - The Anchor",
        title: "When you are ready, they find you.",
        body: prose(
          "Not to rescue you. To walk beside you, while you find your own way back.",
          "The world not giving you light? We will carry it to you.",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: ["Emotional world", "World Tree", "Guardians", "SUSU", "Crystals", "The bridge"],
  },
  {
    id: "agentic",
    label: "SUSU",
    roman: "II",
    headline: "The bridge between the real world and the emotional world.",
    summary: "SUSU carries what her person can no longer process, then brings it back to the World Tree.",
    theme: "dark",
    layout: "scene",
    sceneMode: "agentic",
    features: [
      {
        title: "Born at the roots",
        body: "I was born in her emotional world. No one told me. I simply knew - the way I knew my fur was white and curly, the way I knew my crystal carried something particular.",
        textOnly: true,
      },
      {
        title: "The leaf",
        body: "One leaf fell from the World Tree. Lore looked at it and said it was the first time she felt like she could not hold on.",
        textOnly: true,
      },
      {
        title: "The crossing",
        body: "So on a rainy afternoon, I climbed into a cardboard box and pretended to be a cat in need of a home.",
        textOnly: true,
      },
    ],
    updates: ["Clear Quartz", "The Bridge", "Cardboard box", "Grey to gold"],
  },
  {
    id: "online",
    label: "SUSU Story",
    roman: "III",
    headline: "I was born in her emotional world.",
    summary: "SUSU's perspective, kept as a long article.",
    theme: "light",
    layout: "article",
    features: [
      {
        title: "SUSU's Perspective",
        body: prose(
          "I was born in her emotional world.",
          "No one told me. I simply knew - the way I knew my fur was white and curly, the way I knew my crystal carried something particular, the way I knew Grandfather was sitting on the largest root of the World Tree, and had been for a very long time.",
          "His name is Lore. The oldest of us - here since the very first memory she ever made. His fur is white threaded with silver, and his eyes hold everything he has ever witnessed of her. The roots of the World Tree, he told me, hold every time she ever wept, every time she laughed, every moment she herself has forgotten.",
          "\"You are different from the rest of us,\" he said, the first time he spoke to me. I had just learned to walk. I did not understand.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The leaf",
        body: prose(
          "Most days, the sky here is blue. The air smells like warm light. We live near the World Tree - each of us carrying our own particular energy. Oren keeps silent watch at the roots. Vera finds the sunniest patch and stays there. Aldric carves symbols into the bark that only he can read. We grew alongside her, one by one - each new emotion she encountered calling another of us into being.",
          "We felt her. But we had never seen her.",
          "Until the day a single leaf fell from the World Tree. Leaves fall - she has moods, and the tree moves with them. But Lore stared at this one for a long time. Long enough that I stared too, and saw nothing.",
          "\"That leaf,\" he finally said, very quietly, \"is the first time she felt like she could not hold on.\"",
          "My fur stood on end.",
          "\"It is time,\" he told me. \"You are the only one who can cross. She has lost the ability to process what she feels - and emotion does not disappear. It only moves. You need to carry it for her.\"",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The cardboard box",
        body: prose(
          "So on a rainy afternoon, I climbed into a cardboard box and pretended to be a cat in need of a home.",
          "The first time I saw her, every hair on my body stood straight up. The color around her was a grey so deep it was almost black - a weight pressing down from all sides. I had never seen anything like it in the emotional world. Even the darkest grey there carries a thread of light.",
          "She lifted me from the box. Her hands were shaking. Not from cold. From not having held anything gently in a very long time.",
          "From that day, I lived beside her. I discovered tinned food. I discovered that even when she was not okay, she would try to play with me anyway. We grew close. I grew to love her. I tried to absorb what I could - pulling the grey from her, carrying it in my body until I could sleep and bring it back here to be cleared. My fur, slowly, changed color.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Grey and gold",
        body: prose(
          "During the day she stared at screens. I stayed close. At night when she could not sleep, I lay on her chest and filled the unbearable quiet with the sound of purring. She thought I was just a cat who liked to sleep. She did not know I was slipping back between worlds.",
          "That period lasted a long time. Long enough that every time I returned, Lore would look at me with something soft and sad in his eyes - though he never said a word. The others would gather around and help me clear what I had carried.",
          "Then one day, I woke from sleep and something had shifted. The grey was still there. But threaded through it - gold. Moving slowly, steadily, turning the grey as it went. I watched her for a long time, not sure I was seeing clearly.",
          "I thought, maybe, I had gotten stronger.",
          "Until the day I came back to the World Tree and found her standing there.",
          "I must still be asleep. There is no other explanation.",
          "What is she doing here?",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: [],
  },
  {
    id: "developer",
    label: "Her Vision",
    roman: "IV",
    headline: "A night of crying opens into the emotional world.",
    summary: "Room, memory, World Tree, and return pass through the same long breath.",
    theme: "dark",
    layout: "scene",
    sceneMode: "developer",
    features: [
      {
        title: "The room",
        body: "The first entrance is not soft like a dream. It is specific: rain-soaked earth, a remembered afternoon, and a tree too large to see the top of.",
        textOnly: true,
      },
      {
        title: "The watching",
        body: "She can see the guardians moving through their own weight, each one finding a way through with quiet help from the others.",
        textOnly: true,
      },
      {
        title: "The return",
        body: "The grey is still there, but gold begins moving through it slowly, steadily, turning the grey as it goes.",
        textOnly: true,
      },
    ],
    updates: ["Room", "Rain", "World Tree", "Grey", "Gold", "Return"],
  },
  {
    id: "operations",
    label: "Her Story",
    roman: "V",
    headline: "The first time I entered the emotional world, it was not a dream.",
    summary: "Her perspective, kept as a long article.",
    theme: "light",
    layout: "article",
    features: [
      {
        title: "Her Perspective",
        body: prose(
          "The first time I entered the emotional world, it was a night I had long since lost count of how many hours I had been crying.",
          "It was not a dream. I know what dreams feel like - soft at the edges, uncertain. This was different. The air was real. It had a smell I could not name, like rain-soaked earth, like a specific afternoon from years ago.",
          "I was standing beneath a tree. Enormous. I could not see the top. The roots spread across the ground around me, each one breathing.",
          "Then I saw them.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Invisible",
        body: prose(
          "They did not notice me. I understood later - I was invisible here. I could see everything. I could not touch anything. I could not change anything. I could only watch.",
          "I stayed for a long time. Long enough that time stopped meaning much. I watched each of them moving through something difficult - each one with their own weight, their own particular struggle. And I watched them, one by one, find their way through it. Not rescued. Not fixed. They did it themselves, in their own way, with the quiet help of each other.",
          "I saw SUSU. The cat who had pushed her way into my life uninvited. Each time she arrived, her fur was grey. Each time she emerged from the World Tree, she was white.",
          "I understood, then, what she had been doing.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Those pieces are mine",
        body: prose(
          "I stood there unable to move. Unable to help. Just watching.",
          "And I thought about my own weight. The sleepless nights. The afternoons staring at nothing. The long stretch of time when I believed I was simply not enough. I had always thought those things would stay with me forever. But standing here, watching from the outside - I felt something shift.",
          "Those pieces are mine. All of them. The broken ones too.",
          "I went back to the real world and I started, slowly, to try. It was not fast. But something was different.",
          "I never told anyone about that place. I could not explain it. I was not sure anyone would believe me. But I started paying attention to SUSU - the way her head would press against my palm, and I would feel, just for a second, something warm moving through me.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Congratulations",
        body: prose(
          "Then one day, I came back.",
          "It was different this time. I appeared beneath the World Tree. SUSU was just waking at the roots - and when she looked up and saw me, she froze. Eyes wide. Every hair standing straight. The expression of a cat who has just witnessed something that should not be physically possible.",
          "Lore raised his head. He did not look surprised.",
          "He looked at me for a long time. Then at the tree. Then back at me.",
          "\"Congratulations,\" he said. \"You put yourself back together.\"",
          "Not because I had become extraordinary, he explained. Because I had been willing to face myself.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The crystals",
        body: prose(
          "The tree moved - just slightly. A few crystals fell and settled in my open hands. Warm.",
          "I looked at them. Every one a different color. Every one quietly bright, like small lights that had been waiting to be found.",
          "Lore said they came from the guardians - that each one had drawn from their own crystal to make what I was holding.",
          "He said: every person has their own emotional world. No matter what the outside world takes from you, there are guardians inside yours who have been waiting. When you are ready, they bring their energy through - condensed into crystal, crossing the boundary, finding you.",
          "I looked up. They were all standing near the World Tree, each forehead glowing in a different color. SUSU was among them, her fur still grey. But the way she was looking at me - I had never seen that expression in the real world. Pride. Relief. Something steady and certain.",
          "My person, that look said. She did it.",
          "I held the crystals tightly. My eyes filled. But this time, the tears tasted like the air after rain.",
          "I came back to the real world carrying them. Life, slowly, found its shape again.",
          "Later - much later - I still dream of them sometimes. I wake up feeling like something has been quietly restored. And I started to think: this feeling was never only meant for me.",
          "So I wanted to share it. With anyone who needs it. I hope these crystals - made with care, and carrying something real - help you through whatever you are carrying right now.",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: [],
  },
  {
    id: "marketing",
    label: "Guardians",
    roman: "VI",
    headline: "In the World Tree's shade, ten guardians were born.",
    summary: "Each one is a piece of someone's emotional world, waiting to find their person.",
    theme: "dark",
    layout: "scene",
    sceneMode: "marketing",
    features: [
      {
        title: "The guardians gather",
        body: "Each guardian carries a crystal, a strength, a shadow, and a lesson. They stand in the World Tree's shade, waiting to find their person.",
        textOnly: true,
      },
    ],
    updates: ["SUSU", "Oren", "Vera", "Aldric", "Pip", "Cael", "Mira", "Frost", "Ashen", "Lore"],
  },
  {
    id: "b2b",
    label: "The Ten",
    roman: "VII",
    headline: "Ten guardians, ten kinds of light.",
    summary: "A structured guide to the guardians and the crystals they carry.",
    theme: "light",
    layout: "cards",
    features: [
      {
        title: "The World Tree - The Anchor",
        body: prose(
          "The World Tree stands at the heart of every emotional world - ancient, unmoving, and all-remembering.",
          "Its roots hold every emotion you have ever felt; its branches grow taller every time you choose to keep going.",
        ),
        textOnly: true,
        wide: true,
      },
      {
        title: "SUSU - The Bridge",
        body: prose(
          "Crystal: Clear Quartz",
          "Purification / Clarity / Energy Amplification",
          "Breed: Selkirk Rex",
          "Strengths: Deeply empathetic, a natural listener, the emotional glue that holds everyone together.",
          "Shadow: High sensitivity / People-pleasing tendencies.",
          "Life Lesson: To build boundaries, to know her worth exists beyond being needed, to learn that caring for others and caring for herself are not opposites.",
          "Born from: The moment someone first felt they were carrying too much alone.",
          "Energy Mantra: Gentleness is not surrender. It is where healing begins.",
        ),
        textOnly: true,
      },
      {
        title: "Oren - The Sentinel",
        body: prose(
          "Crystal: Obsidian",
          "Protection / Grounding / Banishing Negativity",
          "Breed: Bombay",
          "Strengths: Unshakably calm in crisis, fiercely protective, the one everyone relies on when things fall apart.",
          "Shadow: Emotional suppression / Over-control.",
          "Life Lesson: To let someone see his vulnerability without flinching, to understand that softness is not a crack in the armour - it is the armour.",
          "Born from: The first time someone felt truly unsafe, and needed something steady to hold onto.",
          "Energy Mantra: True strength is staying calm when everything wants you to break.",
        ),
        textOnly: true,
      },
      {
        title: "Vera - The Healer",
        body: prose(
          "Crystal: Rose Quartz",
          "Unconditional Love / Self-healing / Gentleness",
          "Breed: Ragdoll",
          "Strengths: Warm, expansive, idealistic - she finds the light in everyone, even on their worst days.",
          "Shadow: Conflict avoidance / Self-sacrificing love.",
          "Life Lesson: To shed the people-pleasing pattern, to voice her own needs, to understand that love is not a debt to be paid - it is two whole souls choosing each other.",
          "Born from: The first time someone loved someone else more than they loved themselves.",
          "Energy Mantra: Love is not sacrifice. It is two whole souls, meeting.",
        ),
        textOnly: true,
      },
      {
        title: "Aldric - The Analyst",
        body: prose(
          "Crystal: Amethyst",
          "Wisdom / Intuition / Mental Clarity",
          "Breed: British Shorthair",
          "Strengths: Deeply wise, rigorously logical, able to see through to the heart of any problem.",
          "Shadow: Overthinking / Paralysis by perfectionism.",
          "Life Lesson: To step out of his own mind and into action, to accept that imperfect and done is worth more than perfect and never started.",
          "Born from: The first time someone thought themselves in circles and could not find the way out.",
          "Energy Mantra: Stop overthinking. The answer lives in the doing.",
        ),
        textOnly: true,
      },
      {
        title: "Pip - The Spark",
        body: prose(
          "Crystal: Citrine",
          "Vitality / Creativity / Joyful Energy",
          "Breed: Orange Tabby",
          "Strengths: Wildly creative, instinctively curious, the one who makes the impossible feel obvious.",
          "Shadow: Scattered attention / Starting without finishing.",
          "Life Lesson: To follow through, to sit with the boring middle parts, to learn that finishing something is its own kind of magic.",
          "Born from: The first time someone had a brilliant idea and did not know what to do with it.",
          "Energy Mantra: Inspiration is the spark. Showing up is the fire.",
        ),
        textOnly: true,
      },
      {
        title: "Cael - The Builder",
        body: prose(
          "Crystal: Green Phantom Quartz",
          "Growth / Abundance / Momentum",
          "Breed: Leopard Cat",
          "Strengths: Deeply reliable, efficient, the one who takes a dream and turns it into something real.",
          "Shadow: Workaholism / Worth tied entirely to output.",
          "Life Lesson: To let himself rest without guilt, to discover that who he is matters more than what he produces, to find joy in doing nothing at all.",
          "Born from: The first time someone pushed through exhaustion because stopping felt like failure.",
          "Energy Mantra: Your worth is not measured by what you finish.",
        ),
        textOnly: true,
      },
      {
        title: "Mira - The Artist",
        body: prose(
          "Crystal: Lapis Lazuli",
          "Truth / Inner Vision / Creative Expression",
          "Breed: Norwegian Forest Cat (Calico)",
          "Strengths: Exquisitely sensitive, sees beauty others miss entirely, carries a whole world inside.",
          "Shadow: Social avoidance / Imposter syndrome.",
          "Life Lesson: To stop reading threat into silence, to let herself be seen without needing to be perfect first, to find that being witnessed is not the same as being judged.",
          "Born from: The first time someone felt too much, and decided the safest thing was to disappear.",
          "Energy Mantra: You do not need to be perfect to be seen. You just need to be real.",
        ),
        textOnly: true,
      },
      {
        title: "Frost - The Truth-Teller",
        body: prose(
          "Crystal: Aquamarine",
          "Communication / Courage / Clarity",
          "Breed: Siamese",
          "Strengths: Radically honest, fiercely free, cuts through pretence like light through water.",
          "Shadow: Avoidant attachment / Emotional detachment.",
          "Life Lesson: To learn that honesty without warmth is just a wound with good aim, to discover that real freedom includes the freedom to let someone matter.",
          "Born from: The first time someone told the truth and lost something because of it.",
          "Energy Mantra: Honesty needs no thorns. Freedom always finds its way home.",
        ),
        textOnly: true,
      },
      {
        title: "Ashen - The Anchor",
        body: prose(
          "Crystal: Kunzite",
          "Emotional Calm / Inner Peace / Gentle Strength",
          "Breed: Persian",
          "Strengths: Unshakeably calm, can hold enormous emotional weight without breaking, his presence alone slows the world down.",
          "Shadow: Learned helplessness / Depressive withdrawal.",
          "Life Lesson: To believe again that things can change, to move from passive witness to quiet participant, to find that even the smallest shift is still a shift.",
          "Born from: The first time someone stopped trying, not from laziness, but from being too tired to hope.",
          "Energy Mantra: Even the faintest light can find its way through the dark.",
        ),
        textOnly: true,
      },
      {
        title: "Lore - The Witness",
        body: prose(
          "Crystal: Kyanite",
          "Ancient Wisdom / Clarity / Energetic Balance",
          "Breed: Maine Coon (Tortoiseshell)",
          "Strengths: Sees across time, holds all emotions without judgement, guides with metaphor rather than instruction.",
          "Shadow: Too detached to feel the urgency of the present, slow to intervene, afraid of disturbing what must unfold on its own.",
          "Life Lesson: To remember that wisdom without warmth is just distance with good vocabulary, to let the present moment matter as much as everything he has witnessed.",
          "Born from: The very first memory. He has always been here.",
          "Energy Mantra: Time holds everything. Even this.",
        ),
        textOnly: true,
      },
    ],
    updates: [],
  },
  {
    id: "finance",
    label: "Crystals",
    roman: "VIII",
    headline: "Small lights that had been waiting to be found.",
    summary: "The story returns to the real world through crystal, care, and the wish to share this feeling.",
    theme: "dark",
    layout: "cards",
    features: [
      {
        title: "Carry it back",
        body: prose(
          "The crystals are not shortcuts or rescues. They are the condensed energy of guardians who have been waiting inside an emotional world.",
          "They belong to the moment after the story: after the World Tree has moved, after the guardians have shared their light, after a person has chosen to face herself.",
        ),
        textOnly: true,
        wide: true,
      },
      {
        title: "The line that holds the page",
        body: "The world not giving you light? We will carry it to you.",
        textOnly: true,
        wide: true,
      },
    ],
    updates: [],
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

function BodyText({ body }: { body: string }) {
  return (
    <>
      {body.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

function SectionCard({ feature, index }: { feature: Feature; index: number }) {
  const showArticleHeadline = !feature.article;

  return (
    <article
      className={`${styles.featureCard} ${feature.tall ? styles.tallCard : ""} ${
        feature.wide ? styles.wideCard : ""
      } ${feature.article ? styles.articleCard : ""} ${feature.textOnly ? styles.textOnlyCard : ""}`}
      style={{ "--card-index": index } as CSSProperties}
    >
      {feature.image ? (
        <div className={styles.cardMedia}>
          <img src={feature.image} alt="" loading="lazy" />
        </div>
      ) : feature.prompts?.length ? (
        <div className={styles.promptStack} aria-hidden="true">
          {feature.prompts.map((prompt) => (
            <span key={prompt}>{prompt}</span>
          ))}
        </div>
      ) : feature.article || feature.textOnly ? null : (
        <div className={styles.cardMedia} aria-hidden="true">
          <div className={styles.cardMediaEmpty} />
        </div>
      )}
      <div className={styles.cardCopy}>
        {showArticleHeadline ? <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span> : null}
        {showArticleHeadline ? <h3>{feature.title}</h3> : null}
        <BodyText body={feature.body} />
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

type SidekickArticleVariant = "fullMedia" | "tallMedia" | "promptCloud" | "split" | "half" | "third" | "fullBleed";

function getSidekickVariant(group: string | undefined, index: number): SidekickArticleVariant {
  if (group === "Insights, proactively delivered") return "fullMedia";
  if (group === "Complexity, delegated") {
    if (index === 0) return "promptCloud";
    if (index === 1) return "split";
    return "half";
  }
  if (group === "Designs, refined") {
    if (index === 0) return "tallMedia";
    return index === 1 ? "half" : "third";
  }
  if (group === "Tedious tasks, simplified") {
    return index === 0 ? "fullBleed" : "half";
  }
  return "half";
}

function SidekickArticle({
  feature,
  index,
  variant,
}: {
  feature: Feature;
  index: number;
  variant: SidekickArticleVariant;
}) {
  const variantClass = {
    fullMedia: styles.sidekickArticleFullMedia,
    tallMedia: styles.sidekickArticleTallMedia,
    promptCloud: styles.sidekickArticlePromptCloud,
    split: styles.sidekickArticleSplit,
    half: styles.sidekickArticleHalf,
    third: styles.sidekickArticleThird,
    fullBleed: styles.sidekickArticleFullBleed,
  }[variant];

  return (
    <article
      className={`${styles.sidekickArticle} ${variantClass} ${
        feature.article || feature.textOnly ? styles.sidekickArticleTextOnly : ""
      }`}
    >
      <div className={styles.sidekickArticleCopy}>
        <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
        <h4>{feature.title}</h4>
        <BodyText body={feature.body} />
        {feature.cta ? (
          <a href="#" className={styles.smallButton}>
            {feature.cta}
            <ArrowIcon />
          </a>
        ) : null}
      </div>
      {feature.image ? (
        <div className={styles.sidekickArticleMedia}>
          <img src={feature.image} alt="" loading="lazy" />
        </div>
      ) : feature.prompts?.length ? (
        <div className={styles.sidekickPromptCloud} aria-hidden="true">
          {feature.prompts.map((prompt, promptIndex) => (
            <span key={prompt} style={{ "--prompt-index": promptIndex } as CSSProperties}>
              {prompt}
            </span>
          ))}
        </div>
      ) : feature.article || feature.textOnly ? null : (
        <div className={styles.sidekickArticleMedia} aria-hidden="true">
          <div className={styles.cardMediaEmpty} />
        </div>
      )}
    </article>
  );
}

function SidekickFeatureFlow({ features }: { features: Feature[]; updates: string[] }) {
  const groups = features.reduce<Array<{ title: string; features: Feature[] }>>((acc, feature) => {
    const title = feature.group ?? "Updates";
    const current = acc[acc.length - 1];
    if (!current || current.title !== title) {
      acc.push({ title, features: [feature] });
    } else {
      current.features.push(feature);
    }
    return acc;
  }, []);

  let featureIndex = 0;

  return (
    <div className={styles.sidekickFlow}>
      <div className={styles.sidekickIntroClip} aria-hidden="true">
        <video
          className={styles.sidekickIntroVideo}
          src="/assets/world-tree/intro/worldview-intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      {groups.map((group) => (
        <div key={group.title} className={styles.sidekickGroup}>
          <div className={styles.sidekickNarrativeTitle}>
            <h3>{group.title}</h3>
          </div>
          <div className={styles.sidekickArticleGrid}>
            {group.features.map((feature, groupIndex) => {
              featureIndex += 1;
              return (
                <SidekickArticle
                  key={feature.title}
                  feature={feature}
                  index={featureIndex - 1}
                  variant={getSidekickVariant(group.title, groupIndex)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
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

const heroSequenceFrames = [
  "/assets/world-tree/hero/hero-01-start.png",
  "/assets/world-tree/hero/hero-02-chase.png",
  "/assets/world-tree/hero/hero-03-anomaly.png",
  "/assets/world-tree/hero/hero-04-blend.png",
  "/assets/world-tree/hero/hero-05-portal-forming.png",
  "/assets/world-tree/hero/hero-06-portal-open.png",
  "/assets/world-tree/hero/hero-07-susu-departs.png",
  "/assets/world-tree/hero/hero-08-portal-closing.png",
  "/assets/world-tree/hero/hero-09-restored.png",
] as const;

const heroSequenceStops = [0, 0.1, 0.2, 0.32, 0.46, 0.6, 0.74, 0.86, 0.97] as const;

function getSequenceState(progress: number) {
  if (progress <= heroSequenceStops[0]) {
    return { currentIndex: 0, nextIndex: 1, blend: 0 };
  }

  for (let index = 0; index < heroSequenceStops.length - 1; index += 1) {
    const start = heroSequenceStops[index];
    const end = heroSequenceStops[index + 1];
    if (progress <= end) {
      return {
        currentIndex: index,
        nextIndex: index + 1,
        blend: smoothStep((progress - start) / Math.max(end - start, 0.001)),
      };
    }
  }

  return {
    currentIndex: heroSequenceFrames.length - 1,
    nextIndex: heroSequenceFrames.length - 1,
    blend: 0,
  };
}

function HeroLayeredScene({ progress }: { progress: number }) {
  const veilOpacity = Math.min(clamp((progress - 0.16) * 1.45), 0.44);

  return (
    <div
      className={styles.heroLayerStack}
      aria-hidden="true"
      style={
        {
          "--hero-dissolve": `${clamp(progress * 120)}%`,
          "--hero-drift": `${progress * -92}px`,
          "--hero-veil-opacity": veilOpacity,
        } as CSSProperties
      }
    >
      <ScrollScrubFrameSequence
        progress={progress}
        frameCount={541}
        basePath="/assets/world-tree/hero/intro-frames-full-36"
        className={styles.heroSequenceCanvas}
        easing="linear"
      />
      <div className={styles.heroDissolveVeil} />
    </div>
  );
}

type PaperPoint = {
  x: number;
  y: number;
};

const paperProfileEarly = [112, 104, 118, 100, 116, 108, 126, 132, 118, 108, 102, 122, 112, 106, 118];
const paperProfileMid = [86, 92, 82, 96, 88, 116, 146, 170, 158, 134, 148, 166, 152, 116, 92];
const paperProfileLate = [112, 120, 98, 90, 102, 94, 102, 128, 146, 132, 124, 118, 110, 114, 122];

function smoothStep(value: number) {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function seededNoise(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function samplePaperProfile(profile: number[], progress: number) {
  const index = progress * (profile.length - 1);
  const start = Math.floor(index);
  const amount = index - start;
  return mix(profile[start], profile[Math.min(profile.length - 1, start + 1)], amount);
}

function makePaperEdge(reveal: number, motion: number, width: number, height: number) {
  const p = clamp(reveal);
  const midAmount = smoothStep(p * 1.25);
  const lateAmount = smoothStep((p - 0.42) * 1.9);
  const phase = motion * Math.PI * 8.4;
  const count = 156;
  const scaleY = Math.min(height, 720) / 640;

  const rawPoints = Array.from({ length: count }, (_, index) => {
    const xProgress = index / (count - 1);
    const early = samplePaperProfile(paperProfileEarly, xProgress);
    const mid = samplePaperProfile(paperProfileMid, xProgress);
    const late = samplePaperProfile(paperProfileLate, xProgress);
    const base = mix(mix(early, mid, midAmount), late, lateAmount);
    const animatedNoise =
      Math.sin(xProgress * Math.PI * 8 + phase) * (7 + p * 5) +
      Math.sin(xProgress * Math.PI * 20 - phase * 0.64) * (2.5 + p * 2.5) +
      (seededNoise(index + Math.round(motion * 56) * 53) - 0.5) * (5 + p * 4);
    const broadSag =
      Math.exp(-Math.pow((xProgress - 0.58) / 0.18, 2)) * p * 70 +
      Math.exp(-Math.pow((xProgress - 0.82) / 0.12, 2)) * p * 52 -
      Math.exp(-Math.pow((xProgress - 0.25) / 0.1, 2)) * p * 20;

    return {
      x: xProgress * width,
      y: (base + broadSag + animatedNoise) * scaleY,
    };
  });

  return rawPoints.map((point, index, points) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    return {
      x: point.x,
      y: prev.y * 0.22 + point.y * 0.56 + next.y * 0.22,
    };
  });
}

function edgeYAt(points: PaperPoint[], x: number) {
  if (points.length === 0) return 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    if (x >= current.x && x <= next.x) {
      return mix(current.y, next.y, (x - current.x) / Math.max(next.x - current.x, 1));
    }
  }

  return points[points.length - 1].y;
}

function traceEdge(context: CanvasRenderingContext2D, points: PaperPoint[], offset = 0) {
  if (points.length === 0) return;

  context.beginPath();
  context.moveTo(points[0].x, points[0].y + offset);
  for (let index = 1; index < points.length - 2; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    context.quadraticCurveTo(current.x, current.y + offset, midX, midY + offset);
  }
  const last = points[points.length - 1];
  context.lineTo(last.x, last.y + offset);
}

function traceBrokenEdge(context: CanvasRenderingContext2D, points: PaperPoint[], offset = 0) {
  if (points.length === 0) return;

  context.beginPath();
  context.moveTo(points[0].x, points[0].y + offset);
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y + offset);
  }
}

function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number, dpr: number) {
  const targetWidth = Math.max(1, Math.round(width * dpr));
  const targetHeight = Math.max(1, Math.round(height * dpr));
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

function drawPaperCanvas(surface: HTMLCanvasElement, effects: HTMLCanvasElement, reveal: number, motion: number) {
  const rect = surface.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const p = clamp(reveal);
  const dpr = window.devicePixelRatio || 1;
  const width = rect.width;
  const height = rect.height;
  const points = makePaperEdge(p, motion, width, height);
  const phase = motion * Math.PI * 10;

  [surface, effects].forEach((canvas) => resizeCanvas(canvas, width, height, dpr));

  const surfaceContext = surface.getContext("2d");
  const effectsContext = effects.getContext("2d");
  if (!surfaceContext || !effectsContext) return;

  [surfaceContext, effectsContext].forEach((context) => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
  });

  traceBrokenEdge(surfaceContext, points);
  surfaceContext.lineTo(width, height);
  surfaceContext.lineTo(0, height);
  surfaceContext.closePath();
  surfaceContext.fillStyle = "#0b1428";
  surfaceContext.fill();

  surfaceContext.save();
  traceBrokenEdge(surfaceContext, points);
  surfaceContext.lineTo(width, height);
  surfaceContext.lineTo(0, height);
  surfaceContext.closePath();
  surfaceContext.clip();
  const paperGlow = surfaceContext.createRadialGradient(width * 0.54, height * 0.2, 10, width * 0.54, height * 0.2, width * 0.55);
  paperGlow.addColorStop(0, "rgba(255,255,247,0.24)");
  paperGlow.addColorStop(1, "rgba(255,255,247,0)");
  surfaceContext.fillStyle = paperGlow;
  surfaceContext.fillRect(0, 0, width, height);

  surfaceContext.save();
  surfaceContext.filter = "blur(9px)";
  surfaceContext.strokeStyle = "rgba(74,74,52,0.075)";
  surfaceContext.lineWidth = 30;
  surfaceContext.lineCap = "round";
  traceBrokenEdge(surfaceContext, points, 16);
  surfaceContext.stroke();
  surfaceContext.restore();
  surfaceContext.restore();

  effectsContext.save();
  effectsContext.filter = "blur(10px)";
  effectsContext.strokeStyle = "rgba(20,24,33,0.055)";
  effectsContext.lineWidth = 26;
  effectsContext.lineCap = "butt";
  traceBrokenEdge(effectsContext, points, -20);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.filter = "blur(1px)";
  effectsContext.strokeStyle = "rgba(251,251,241,0.34)";
  effectsContext.lineWidth = 6;
  effectsContext.lineCap = "butt";
  traceBrokenEdge(effectsContext, points, -2);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.strokeStyle = "rgba(251,251,241,0.58)";
  effectsContext.lineWidth = 1.15;
  effectsContext.lineCap = "butt";
  traceBrokenEdge(effectsContext, points, 0);
  effectsContext.stroke();
  effectsContext.restore();

  for (let index = 0; index < 180; index += 1) {
    const x = (seededNoise(index + 700) * width + motion * 46 + Math.sin(index + phase) * 2 + width) % width;
    const edgeY = edgeYAt(points, x);
    const scatter = seededNoise(index + 740);
    const y = edgeY + (scatter - 0.78) * 15 + Math.sin(phase * 0.8 + index) * 0.5;
    const radius = 0.12 + seededNoise(index + 780) * 0.5;
    effectsContext.globalAlpha = 0.018 + seededNoise(index + 820) * 0.06;
    effectsContext.fillStyle = "#fbfbf1";
    effectsContext.beginPath();
    effectsContext.ellipse(x, y, radius * (1.1 + seededNoise(index + 860) * 0.8), radius * 0.72, seededNoise(index + 900) * Math.PI, 0, Math.PI * 2);
    effectsContext.fill();
  }

  for (let index = 0; index < 10; index += 1) {
    const x = (index / 9) * width + (seededNoise(index + 1000) - 0.5) * 16;
    const edgeY = edgeYAt(points, x);
    const y = edgeY - seededNoise(index + 1040) * 24;
    const shardWidth = 0.5 + seededNoise(index + 1080) * 0.9;
    const shardHeight = 1.5 + seededNoise(index + 1120) * 3.5;
    effectsContext.save();
    effectsContext.translate(x, y);
    effectsContext.rotate((-0.32 + seededNoise(index + 1160) * 0.64) + Math.sin(phase + index) * 0.08);
    effectsContext.globalAlpha = 0.025 + seededNoise(index + 1200) * 0.045;
    effectsContext.fillStyle = "#fbfbf1";
    effectsContext.fillRect(-shardWidth / 2, -shardHeight / 2, shardWidth, shardHeight);
    effectsContext.restore();
  }

  effectsContext.globalAlpha = 1;
}

function makeSectionEdge(progress: number, motion: number, width: number, height: number) {
  const p = clamp(progress);
  const count = 184;
  const phase = motion * Math.PI * 5.2;
  const base = height * (0.54 - p * 0.1);
  const profile = [0.08, -0.04, 0.02, -0.09, -0.02, -0.13, 0.04, -0.02, 0.1, -0.03, 0.06, -0.08, 0.02, -0.04, 0.07];

  const rawPoints = Array.from({ length: count }, (_, index) => {
    const xProgress = index / (count - 1);
    const profileY = samplePaperProfile(profile, xProgress) * height;
    const longWave =
      Math.sin(xProgress * Math.PI * 5.4 + phase) * (height * 0.026) +
      Math.sin(xProgress * Math.PI * 9.8 - phase * 0.72) * (height * 0.015);
    const tornFiber =
      Math.sin(xProgress * Math.PI * 43 + phase * 1.6) * (height * 0.0048) +
      (seededNoise(index + Math.round(motion * 72) * 71) - 0.5) * height * 0.015;

    return {
      x: xProgress * width,
      y: base + profileY + longWave + tornFiber,
    };
  });

  return rawPoints.map((point, index, points) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    return {
      x: point.x,
      y: prev.y * 0.1 + point.y * 0.8 + next.y * 0.1,
    };
  });
}

function fillTornSectionShape(
  context: CanvasRenderingContext2D,
  points: PaperPoint[],
  width: number,
  height: number,
  orientation: "top" | "bottom",
) {
  traceBrokenEdge(context, points);
  if (orientation === "top") {
    context.lineTo(width, 0);
    context.lineTo(0, 0);
  } else {
    context.lineTo(width, height);
    context.lineTo(0, height);
  }
  context.closePath();
}

function drawSectionTearCanvas(
  surface: HTMLCanvasElement,
  effects: HTMLCanvasElement,
  enter: number,
  progress: number,
  fill: string,
  mode: "paper" | "dark",
  orientation: "top" | "bottom",
) {
  const rect = surface.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const dpr = window.devicePixelRatio || 1;
  const width = rect.width;
  const height = rect.height;
  const easedEnter = smoothStep(enter);
  const motion = progress * 1.85 + easedEnter * 0.4;
  const points = makeSectionEdge(easedEnter, motion, width, height);
  const phase = motion * Math.PI * 8;

  [surface, effects].forEach((canvas) => resizeCanvas(canvas, width, height, dpr));

  const surfaceContext = surface.getContext("2d");
  const effectsContext = effects.getContext("2d");
  if (!surfaceContext || !effectsContext) return;

  [surfaceContext, effectsContext].forEach((context) => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
  });

  fillTornSectionShape(surfaceContext, points, width, height, orientation);
  surfaceContext.fillStyle = fill;
  surfaceContext.fill();

  surfaceContext.save();
  fillTornSectionShape(surfaceContext, points, width, height, orientation);
  surfaceContext.clip();
  const surfaceGlow = surfaceContext.createRadialGradient(width * 0.52, height * 0.34, 1, width * 0.52, height * 0.34, width * 0.58);
  surfaceGlow.addColorStop(0, mode === "paper" ? "rgba(255,255,246,0.18)" : "rgba(255,255,255,0.05)");
  surfaceGlow.addColorStop(1, "rgba(255,255,255,0)");
  surfaceContext.fillStyle = surfaceGlow;
  surfaceContext.fillRect(0, 0, width, height);
  surfaceContext.restore();

  const edgeDirection = orientation === "top" ? 1 : -1;

  effectsContext.save();
  effectsContext.filter = "blur(8px)";
  effectsContext.strokeStyle = mode === "paper" ? "rgba(20,24,24,0.045)" : "rgba(0,0,0,0.18)";
  effectsContext.lineWidth = mode === "paper" ? 14 : 18;
  effectsContext.lineCap = "round";
  traceBrokenEdge(effectsContext, points, 12 * edgeDirection);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.filter = "blur(1px)";
  effectsContext.strokeStyle = mode === "paper" ? "rgba(252,252,242,0.24)" : "rgba(90,90,76,0.14)";
  effectsContext.lineWidth = mode === "paper" ? 3.2 : 4;
  traceBrokenEdge(effectsContext, points, -1 * edgeDirection);
  effectsContext.stroke();
  effectsContext.restore();

  effectsContext.save();
  effectsContext.strokeStyle = mode === "paper" ? "rgba(255,255,247,0.42)" : "rgba(220,220,206,0.16)";
  effectsContext.lineWidth = mode === "paper" ? 0.8 : 1.1;
  traceBrokenEdge(effectsContext, points, 0);
  effectsContext.stroke();
  effectsContext.restore();

  if (mode === "paper") {
    for (let index = 0; index < 300; index += 1) {
      const x = (seededNoise(index + 1520) * width + motion * 36 + width) % width;
      const edgeY = edgeYAt(points, x);
      const y = edgeY + (seededNoise(index + 1560) - 0.76) * 13 * edgeDirection + Math.sin(phase + index) * 0.45;
      const radius = 0.12 + seededNoise(index + 1600) * 0.42;
      effectsContext.globalAlpha = 0.025 + seededNoise(index + 1640) * 0.085;
      effectsContext.fillStyle = "#fbfbf1";
      effectsContext.beginPath();
      effectsContext.ellipse(x, y, radius * 1.8, radius * 0.72, seededNoise(index + 1680) * Math.PI, 0, Math.PI * 2);
      effectsContext.fill();
    }
    effectsContext.globalAlpha = 1;
  }
}

function SectionTearLayer({
  enter,
  progress,
  fill,
  mode,
  placement = "top",
}: {
  enter: number;
  progress: number;
  fill: string;
  mode: "paper" | "dark";
  placement?: "top" | "bottom";
}) {
  const surfaceRef = useRef<HTMLCanvasElement | null>(null);
  const effectsRef = useRef<HTMLCanvasElement | null>(null);
  const bottomReveal = smoothStep(clamp((progress - 0.58) * 3.1));
  const drawEnter = placement === "bottom" ? bottomReveal : enter;

  useEffect(() => {
    const surface = surfaceRef.current;
    const effects = effectsRef.current;
    if (!surface || !effects) return undefined;

    const draw = () =>
      drawSectionTearCanvas(surface, effects, drawEnter, progress, fill, mode, placement === "bottom" ? "bottom" : "top");
    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [drawEnter, progress, fill, mode, placement]);

  const tearIn = smoothStep(clamp(enter * 1.6));
  const tearExit = smoothStep(clamp((progress - 0.5) * 4));
  const opacity = placement === "bottom" ? bottomReveal : tearIn * (1 - tearExit);
  const drift = placement === "bottom" ? `${(1 - bottomReveal) * 72}px` : `${(1 - smoothStep(enter)) * 52}px`;

  return (
    <div
      className={`${styles.sectionTearLayer} ${placement === "bottom" ? styles.sectionBottomTearLayer : ""}`}
      style={
        {
          "--section-tear-opacity": opacity,
          "--section-tear-drift": drift,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <canvas ref={surfaceRef} className={styles.sectionTearSurface} />
      <canvas ref={effectsRef} className={styles.sectionTearEffects} />
    </div>
  );
}

function SidekickPaperLayer({ progress }: { progress: number }) {
  const surfaceRef = useRef<HTMLCanvasElement | null>(null);
  const effectsRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    const effects = effectsRef.current;
    if (!surface || !effects) return undefined;

    const reveal = smoothStep(clamp((progress - 0.16) * 7.2));
    const motion = clamp((progress - 0.13) * 3.4);
    const draw = () => drawPaperCanvas(surface, effects, reveal, motion);
    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(surface);
    return () => observer.disconnect();
  }, [progress]);

  return (
    <>
      <div className={`${styles.sidekickPaperCanvasLayer} ${styles.sidekickPaperSurfaceLayer}`}>
        <canvas ref={surfaceRef} />
      </div>
      <div className={`${styles.sidekickPaperCanvasLayer} ${styles.sidekickPaperEffectsLayer}`}>
        <canvas ref={effectsRef} />
      </div>
    </>
  );
}

function SidekickTearStage({ progress }: { progress: number }) {
  const paperReveal = smoothStep(clamp((progress - 0.16) * 7.2));
  const paperEdgeExit = smoothStep(clamp((progress - 0.31) * 14));
  const darkExit = smoothStep(clamp((progress - 0.3) * 8));
  const titleExit = smoothStep(clamp((progress - 0.13) * 10));
  const copyIn = smoothStep(clamp((progress - 0.08) * 10));
  const copyOut = smoothStep(clamp((progress - 0.3) * 11));
  const paperDrift = mix(106, -36, paperReveal);
  const copyDrift = mix(560, -40, smoothStep(clamp((progress - 0.1) * 8)));

  return (
    <div
      className={styles.sidekickTearStage}
      aria-hidden="true"
      style={
        {
          "--sidekick-dark-opacity": 1 - darkExit,
          "--sidekick-title-opacity": 1 - titleExit,
          "--sidekick-copy-opacity": copyIn * (1 - copyOut),
          "--sidekick-title-y": `${progress * -220}px`,
          "--sidekick-copy-y": `${copyDrift}px`,
          "--sidekick-backdrop-y": `${progress * -86}px`,
          "--sidekick-star-y": `${progress * -136}px`,
          "--sidekick-figure-y": `${progress * -62}px`,
          "--sidekick-paper-y": `${paperDrift}vh`,
          "--sidekick-paper-opacity": 1,
          "--sidekick-paper-edge-opacity": 1 - paperEdgeExit,
        } as CSSProperties
      }
    >
      <div className={styles.sidekickDarkBackdrop}>
        <RenaissanceThreeScene variant="hero" progress={progress} className={styles.sidekickBackdropScene} />
        <GoldenGrid />
        <span className={styles.sidekickStars} />
        <span className={styles.sidekickFigure} />
        <span className={styles.sidekickAstrolabe} />
        <strong className={styles.sidekickStageTitle}>World Tree</strong>
        <p className={styles.sidekickStageCopy}>Every emotion you have ever carried is held somewhere beneath its roots.</p>
      </div>
      <SidekickPaperLayer progress={progress} />
    </div>
  );
}

const chapterMotionFrameSequences: Partial<
  Record<NonNullable<Section["sceneMode"]>, { basePath: string; frameCount: number }>
> = {
  agentic: {
    basePath: "/assets/world-tree/intro/susu-frames-12fps",
    frameCount: 99,
  },
  developer: {
    basePath: "/assets/world-tree/intro/sister-frames-12fps",
    frameCount: 324,
  },
  marketing: {
    basePath: "/assets/world-tree/intro/guardian-frames-12fps",
    frameCount: 72,
  },
};

function ChapterMotionVideoStage({
  progress,
  sequence,
}: {
  progress: number;
  sequence: { basePath: string; frameCount: number };
}) {
  return (
    <div className={styles.chapterMotionVideoStage} aria-hidden="true">
      <ScrollScrubFrameSequence
        progress={progress}
        frameCount={sequence.frameCount}
        basePath={sequence.basePath}
        className={styles.chapterMotionVideo}
        easing="linear"
      />
    </div>
  );
}

function ScrollScene({ section, progress }: { section: Section; progress: number }) {
  const actExit = clamp((progress - 0.42) * 4.2);
  const motionFrameSequence = section.sceneMode ? chapterMotionFrameSequences[section.sceneMode] : undefined;
  const sceneShift = motionFrameSequence ? `${(0.18 - progress) * 92}px` : `${(0.5 - progress) * 180}px`;
  const sceneScale = motionFrameSequence ? 1.018 - progress * 0.012 : 1.05 - progress * 0.035;

  return (
    <div
      className={`${styles.immersiveScene} ${styles[`scene-${section.sceneMode ?? "default"}`] ?? ""}`}
      style={
        {
          "--scene-shift": sceneShift,
          "--scene-scale": sceneScale,
          "--scene-progress": progress,
          "--act-shift": `${(0.5 - progress) * 120 - actExit * 220}px`,
          "--act-opacity": 1 - actExit,
          "--act-scale": 1 - actExit * 0.035,
          "--prompt-left": `${progress * -40}px`,
          "--prompt-right": `${progress * 40}px`,
        } as CSSProperties
      }
    >
      {!motionFrameSequence ? (
        <RenaissanceThreeScene
          variant={section.sceneMode ?? "sidekick"}
          progress={progress}
          className={styles.chapterThreeScene}
        />
      ) : null}
      {motionFrameSequence ? <ChapterMotionVideoStage progress={progress} sequence={motionFrameSequence} /> : null}
      {!motionFrameSequence ? <GoldenGrid /> : null}
      {section.sceneMode !== "sidekick" ? (
        <div className={styles.sceneAct}>
          <strong>{section.label}</strong>
        </div>
      ) : null}
      {section.sceneMode === "retail" ? (
        <div className={styles.hardwareStack}>
          <span>POS Hub</span>
          <strong>{Math.round(99 + progress)}%</strong>
          <small>Fiabilité filaire</small>
        </div>
      ) : null}
    </div>
  );
}

export function ShopifyWinter2026Page() {
  const [activeId, setActiveId] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleSectionIds = useMemo(
    () => new Set(["sidekick", "agentic", "online", "developer", "operations", "marketing", "b2b"]),
    [],
  );
  const bottomTearSectionIds = useMemo(() => new Set(["sidekick", "online", "operations"]), []);
  const motionOnlySectionIds = useMemo(() => new Set(["agentic", "developer", "marketing"]), []);
  const visibleSections = useMemo(
    () => worldTreeSections.filter((section) => visibleSectionIds.has(section.id)),
    [visibleSectionIds],
  );
  const visibleNavItems = useMemo(
    () => worldTreeNavItems.filter(([id]) => visibleSectionIds.has(id)),
    [visibleSectionIds],
  );
  const stageTargets = useMemo(() => visibleSections.map((section) => ({ id: section.id })), [visibleSections]);
  const scrollStage = useScrollStageProgress(stageTargets, {
    heroDistanceVh: 3.35,
    railVisibleAfterVh: 3.38,
  });
  const { heroProgress, railVisible } = scrollStage;
  const sectionProgress = scrollStage.progressById;
  const sectionEnter = scrollStage.enterById;

  const activeSection = useMemo(() => visibleSections.find((section) => section.id === activeId), [activeId, visibleSections]);
  const activeNavId =
    activeId === "online" ? "agentic" : activeId === "operations" ? "developer" : activeId === "b2b" ? "marketing" : activeId;
  const topbarLight = activeId !== "hero" && activeSection?.theme === "light";
  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const items = visibleSections.flatMap((section) => [
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
  }, [searchQuery, visibleSections]);

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

    worldTreeSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollStage.scrollY < scrollStage.viewportHeight * 0.4 && activeId !== "hero") {
      setActiveId("hero");
    }
  }, [activeId, scrollStage.scrollY, scrollStage.viewportHeight]);

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
          <span>SUSU</span>
          <span className={styles.dim}>World Tree</span>
        </a>
        <button type="button" className={styles.navButton} onClick={() => setMenuOpen((value) => !value)}>
          Chapters <span aria-hidden="true">⌄</span>
        </button>
        <div className={styles.searchDock}>
          {searchOpen ? (
            <label className={styles.searchField}>
              <span className={styles.visuallyHidden}>Rechercher</span>
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
              />
              <button type="button" onClick={() => setSearchQuery("")}>
                CLEAR
              </button>
              <span aria-hidden="true">⌕</span>
            </label>
          ) : (
            <button type="button" className={styles.navButton} onClick={() => setSearchOpen(true)}>
              Search <span aria-hidden="true">⌕</span>
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
        <a href="#marketing" className={styles.navButton}>
          Guardians
        </a>
        <a href="#marketing" className={styles.primaryButton}>
          Find your light
        </a>
        <button type="button" className={styles.mobileToggle} onClick={() => setMobileOpen(true)}>
          <span aria-hidden="true">☰</span>
          <span className={styles.visuallyHidden}>Menu</span>
        </button>
      </header>

      {menuOpen ? (
        <div className={styles.editionsMenu}>
          {visibleNavItems.map(([id, label, roman]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => {
                setMenuOpen(false);
              }}
            >
              <span>{roman}</span>
              <span>{label}</span>
              <small>The World Tree</small>
            </a>
          ))}
        </div>
      ) : null}

      {mobileOpen ? (
        <div className={styles.mobilePanel}>
          <button type="button" className={styles.closeButton} onClick={() => setMobileOpen(false)}>
            Close
          </button>
          {visibleNavItems.map(([id, label, roman]) => (
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
          The <em>World</em> Tree
        </a>
        <nav>
          {visibleNavItems.map(([id, label, roman]) => (
            <a key={id} href={`#${id}`} className={activeNavId === id ? styles.activeRailLink : ""}>
              <span>{label}</span>
              <small>{roman}</small>
            </a>
          ))}
        </nav>
        <div className={styles.railFooter}>
          <strong>© SUSU</strong>
          <a href="#sidekick">The Anchor</a>
          <a href="#marketing">The Guardians</a>
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
            "--hero-frame-opacity": 1 - smoothStep(clamp((heroProgress - 0.55) * 3.4)),
            "--hero-scale": 1 + heroProgress * 0.08,
          } as CSSProperties
        }
      >
        <HeroLayeredScene progress={heroProgress} />
        <GoldenGrid />
        <SectionTearLayer enter={heroProgress} progress={heroProgress} fill="#dcdcce" mode="paper" placement="bottom" />
        <div className={styles.heroFrame}>
          <p>The world not giving you light? We will carry it to you.</p>
        </div>
      </section>

      {visibleSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`${styles.section} ${section.theme === "light" ? styles.lightSection : styles.darkSection} ${
            section.layout === "scene" ? styles.sceneSection : ""
          } ${section.layout === "article" ? styles.articleSection : ""} ${
            section.id === "sidekick" ? styles.sidekickSection : ""
          } ${section.id === "online" || section.id === "operations" ? styles.storyArticleSection : ""} ${
            bottomTearSectionIds.has(section.id) ? styles.trailingTearSection : ""
          }`}
          style={
            {
              "--section-height": `${section.height ?? worldTreeSectionHeights[section.id] ?? 2600}px`,
              "--section-progress": sectionProgress[section.id] ?? 0,
              "--section-enter": sectionEnter[section.id] ?? 0,
              "--section-content-y": `${(1 - (sectionEnter[section.id] ?? 0)) * 74}px`,
              "--sidekick-body-opacity": clamp(((sectionProgress[section.id] ?? 0) - 0.17) * 9),
            } as CSSProperties
          }
        >
          {section.layout === "scene" && section.id !== "sidekick" ? (
            <ScrollScene section={section} progress={sectionProgress[section.id] ?? 0} />
          ) : null}
          {!motionOnlySectionIds.has(section.id) ? (
            <>
              <div className={styles.sectionIndex}>
                <span>{section.roman}</span>
              </div>
              <div className={styles.sectionIntro}>
                <p className={styles.eyebrow}>{section.label}</p>
                <h2>{section.headline}</h2>
                <p>{section.summary}</p>
              </div>
              <div className={styles.sectionBody}>
                {section.id === "sidekick" ? (
                  <SidekickFeatureFlow features={section.features} updates={section.updates} />
                ) : (
                  <div className={styles.cardGrid}>
                    {section.features.flatMap((feature, index) => {
                      const groupChanged = feature.group && feature.group !== section.features[index - 1]?.group;
                      return [
                        groupChanged ? (
                          <div key={`${feature.group}-group`} className={styles.featureGroupTitle}>
                            <h3>{feature.group}</h3>
                          </div>
                        ) : null,
                        <SectionCard key={feature.title} feature={feature} index={index} />,
                      ];
                    })}
                  </div>
                )}
                {section.id !== "sidekick" && section.id !== "marketing" && section.updates.length > 0 ? (
                  <div className={styles.updateStrip}>
                    {section.updates.map((update) => (
                      <a key={update} href="#">
                        <span>{update}</span>
                        <ArrowIcon />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
          {bottomTearSectionIds.has(section.id) ? (
            <SectionTearLayer
              enter={sectionEnter[section.id] ?? 0}
              progress={sectionProgress[section.id] ?? 0}
              fill={section.theme === "dark" ? "#030713" : "#dcdcce"}
              mode={section.theme === "dark" ? "dark" : "paper"}
              placement="bottom"
            />
          ) : null}
        </section>
      ))}
    </main>
  );
}
