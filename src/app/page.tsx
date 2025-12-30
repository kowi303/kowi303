"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import TshirtViewer from "./components/TshirtViewer";

export default function Home() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    setStatus("loading");
    setMessage("");

    const formData = new FormData(formRef.current);
    const payload = {
      size: formData.get("size"),
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      payment: formData.get("payment"),
      consent: formData.get("consent") === "on",
      price: "20€",
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Errore nel salvataggio.");
      }

      formRef.current.reset();
      sessionStorage.setItem("lastOrder", JSON.stringify(payload));
      router.push("/thankyou");
    } catch (error) {
      setStatus("error");
      setMessage("Si e' verificato un errore. Riprova.");
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <video
          className="bg-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/Intro_V2.mov" />
        </video>
        <div className="bg-overlay" aria-hidden="true" />
        <div className="hero-content">
          <img src="/title.svg" alt="Aspettando high without drugs" />
        </div>
        <div className="scroll-arrow" aria-hidden="true" />
      </section>

      <main className="content">
        <section className="glass-card">
          <header className="card-header">
            <p className="eyebrow">303 - edizione limitata</p>
            <h1>KOWI'S SHIRT</h1>
            <p className="subline">
              Scegli la taglia e completa l&apos;ordine in pochi secondi.
            </p>
          </header>

          <div className="product">
            <div className="product-image">
              <TshirtViewer />
              <button
                className="expand-button"
                type="button"
                onClick={() => setViewerOpen(true)}
                aria-label="Ingrandisci anteprima 3D"
              >
                ⤢
              </button>
            </div>

            <form className="order-form" ref={formRef} onSubmit={handleSubmit}>
              <fieldset className="group">
                <legend>Taglia</legend>
                <div className="segmented">
                  <label>
                    <input type="radio" name="size" value="XS" defaultChecked />
                    <span>XS</span>
                  </label>
                  <label>
                    <input type="radio" name="size" value="S" />
                    <span>S</span>
                  </label>
                  <label>
                    <input type="radio" name="size" value="M" />
                    <span>M</span>
                  </label>
                  <label>
                    <input type="radio" name="size" value="L" />
                    <span>L</span>
                  </label>
                  <label>
                    <input type="radio" name="size" value="XL" />
                    <span>XL</span>
                  </label>
                </div>
              </fieldset>

              <div className="fields">
                <label>
                  Nome e cognome
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Mario Rossi"
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="mario@email.it"
                    required
                  />
                </label>
                <label>
                  Numero di telefono
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+39 000 000 000"
                    required
                  />
                </label>
              </div>

              <fieldset className="group">
                <legend>Pagamento</legend>
                <div className="segmented">
                  <label>
                    <input type="radio" name="payment" value="PayPal" defaultChecked />
                    <span>PayPal</span>
                  </label>
                  <label>
                    <input type="radio" name="payment" value="Contanti" />
                    <span>Contanti alla consegna</span>
                  </label>
                </div>
              </fieldset>

              <div className="price-row">
                <span>Prezzo</span>
                <strong>20€</strong>
              </div>

              <label className="consent">
                <input type="checkbox" name="consent" required />
                <span>Acconsento al trattamento dei miei dati</span>
              </label>

              <button className="cta" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Invio..." : "Completa ordine"}
              </button>
              {message ? <p className={`form-message ${status}`}>{message}</p> : null}
            </form>
          </div>
        </section>
      </main>
      {viewerOpen ? (
        <div className="viewer-modal" role="dialog" aria-modal="true">
          <div className="viewer-backdrop" onClick={() => setViewerOpen(false)} />
          <div className="viewer-panel">
            <button
              className="viewer-close"
              type="button"
              onClick={() => setViewerOpen(false)}
              aria-label="Chiudi anteprima"
            >
              ×
            </button>
            <TshirtViewer />
          </div>
        </div>
      ) : null}
    </div>
  );
}
