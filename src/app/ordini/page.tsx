"use client";

import { useState } from "react";

type Order = {
  id: string;
  size: string;
  fullName: string;
  email: string;
  phone: string;
  payment: string;
  price: string;
  createdAt: string;
};

export default function OrdersPage() {
  const PASSWORD = "admin303170725";
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    if (!password) {
      setMessage("Inserisci la password.");
      setStatus("error");
      return;
    }

    if (password !== PASSWORD) {
      setMessage("Password errata.");
      setStatus("error");
      setOrders([]);
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        throw new Error("Password errata.");
      }

      const data = (await response.json()) as { orders: Order[] };
      setOrders(data.orders ?? []);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage("Accesso negato.");
      setOrders([]);
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-card">
        <h1>Ordini</h1>
        <p className="subline">
          Inserisci la password per vedere tutti gli ordini salvati.
        </p>
        <div className="orders-login">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="button" className="cta" onClick={loadOrders}>
            Carica ordini
          </button>
        </div>
        {message ? <p className="form-message error">{message}</p> : null}

        <div className="orders-table">
          <div className="orders-row orders-head">
            <span>Data</span>
            <span>Nome</span>
            <span>Email</span>
            <span>Telefono</span>
            <span>Taglia</span>
            <span>Pagamento</span>
            <span>Prezzo</span>
          </div>
          {orders.length === 0 ? (
            <p className="orders-empty">
              {status === "loading" ? "Caricamento..." : "Nessun ordine."}
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="orders-row">
                <span>
                  {new Date(order.createdAt).toLocaleString("it-IT")}
                </span>
                <span>{order.fullName}</span>
                <span>{order.email}</span>
                <span>{order.phone}</span>
                <span>{order.size}</span>
                <span>{order.payment}</span>
                <span>{order.price ?? "17€"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
