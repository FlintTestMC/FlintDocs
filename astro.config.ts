import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // site: "https://steel-foundation.github.io/SteelDocs/",
  base: "/FlintDocs/",

  integrations: [
    starlight({
      customCss: ["./src/styles/global.css"],
      favicon: "favicon.png",
      title: {
        en: "Flint-Docs",
        de: "Flint-Doku",
      },
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/MwChEHnAbh",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Steel-Foundation/SteelMC",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          translations: { de: "Erste Schritte" },
          items: [
            {
              slug: "flint/introduction",
              label: "Introduction",
              translations: { de: "Einführung" },
            },
            {
              slug: "flint/quickstart",
              label: "Quickstart",
              translations: { de: "Schnellstart" },
            },
          ],
        },
        {
          label: "Test Format",
          translations: { de: "Testformat" },
          autogenerate: { directory: "flint/testformat" },
        },
        {
          label: "Guides",
          translations: { de: "Anleitungen" },
          autogenerate: { directory: "flint/guides" },
        },
        {
          label: "Tools",
          translations: { de: "Werkzeuge" },
          autogenerate: { directory: "flint/tools" },
        },
        {
          label: "Advanced",
          translations: { de: "Fortgeschritten" },
          items: [
            {
              slug: "flint/integration",
              label: "Server Integration",
              translations: { de: "Server-Integration" },
            },
            {
              slug: "flint/contributing",
              label: "Contributing",
              translations: { de: "Beitragen" },
            },
            {
              slug: "flint/env",
              label: "Environment Variables",
              translations: { de: "Environment Variablen" },
            },
          ],
        },
      ],
      editLink: {
        baseUrl: "https://github.com/FlintTestMC",
      },
      lastUpdated: true,
      defaultLocale: "root",
      locales: {
        // English docs in `src/content/docs/`
        root: {
          label: "English",
          lang: "en",
        },
        // Sprich Deutsch, du Hurensohn :O) `src/content/docs/de/`
        de: {
          label: "Deutsch",
          lang: "de",
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});