"use client";

import { useEffect, useState } from "react";

type OrderSummary = {
  size: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  payment: string | null;
  price: string | null;
};

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("lastOrder");
    if (!saved) return;
    try {
      setOrder(JSON.parse(saved) as OrderSummary);
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <div className="page">
      {/* <section className="hero"> */}
        <video className="bg-video" autoPlay muted loop playsInline>
          <source src="/Intro_V2.mov" />
        </video>
        <div className="bg-overlay" aria-hidden="true" />
        {/* <div className="hero-content">
          <p>Grazie per il tuo ordine</p>
        </div> */}
      {/* </section> */}

      <main className="content">
        <section className="thankyou-card">
          <header className="card-header">
            <h1>Grazie per il tuo ordine!</h1>
            <h3>Ordine completato.</h3>
            <p className="subline">
              A breve ti contatteremo per confermare la consegna.
            </p>
          </header>

          <div className="summary-grid">
            <div>
              <span>Nome</span>
              <strong>{order?.fullName ?? "—"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{order?.email ?? "—"}</strong>
            </div>
            <div>
              <span>Telefono</span>
              <strong>{order?.phone ?? "—"}</strong>
            </div>
            <div>
              <span>Taglia</span>
              <strong>{order?.size ?? "—"}</strong>
            </div>
            <div>
              <span>Pagamento</span>
              <strong>{order?.payment ?? "—"}</strong>
            </div>
            <div>
              <span>Prezzo</span>
              <strong>{order?.price ?? "17€"}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
