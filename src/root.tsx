import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import AppProviders from "./stores/app-providers";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;500;700;900&family=Rubik:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <RouterHead />
      </head>
      <body lang="en">
        <AppProviders>
          <RouterOutlet />
        </AppProviders>
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
