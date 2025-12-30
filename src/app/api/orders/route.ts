import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Order = {
  id: string;
  size: string;
  fullName: string;
  email: string;
  phone: string;
  payment: string;
  consent: boolean;
  price: string;
  createdAt: string;
};

export const runtime = "nodejs";

const dataFile = path.join(process.cwd(), "data", "orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(orders, null, 2), "utf8");
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Order>;

  if (
    !body.size ||
    !body.fullName ||
    !body.email ||
    !body.phone ||
    !body.payment
  ) {
    return NextResponse.json(
      { error: "Campi mancanti." },
      { status: 400 }
    );
  }

  const orders = await readOrders();
  const order: Order = {
    id: crypto.randomUUID(),
    size: body.size,
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    payment: body.payment,
    consent: Boolean(body.consent),
    price: body.price ?? "20€",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  await writeOrders(orders);

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const orders = await readOrders();
  return NextResponse.json({ orders });
}
