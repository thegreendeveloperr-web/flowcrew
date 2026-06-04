import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

export function getStripeProPriceId() {
  const priceId = process.env.STRIPE_PRO_PRICE_ID?.trim();

  if (!priceId) {
    throw new Error("Missing STRIPE_PRO_PRICE_ID.");
  }

  return priceId;
}

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
}