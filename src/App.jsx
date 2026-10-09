import React from "react";
import { Header, Footer, WhatsAppFloat } from "./components/Layout.jsx";
import { Home, Services, Service, Work, Case, Results, Agency, Contact, NotFound } from "./pages/Pages.jsx";
import { useReveal } from "./lib/hooks.js";

const PAGES = { home: Home, services: Services, service: Service, work: Work, case: Case, results: Results, agency: Agency, contact: Contact, notFound: NotFound };

export default function App({ route }) {
  useReveal();
  const Page = PAGES[route.page];
  return (
    <div className="app-root" data-page={route.page}>
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        <Page route={route} />
      </main>
      <Footer route={route} />
      <WhatsAppFloat lang={route.lang} />
    </div>
  );
}
