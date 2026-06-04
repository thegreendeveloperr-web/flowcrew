import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getAppUrl, getStripe, getStripeProPriceId } from "@/lib/stripe";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.redirect(`${getAppUrl()}/login?next=/api/stripe/checkout`);
    }

    const stripe = getStripe();
    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      line_items: [
        {
          price: getStripeProPriceId(),
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        plan: "pro",
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan: "pro",
        },
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/#prezzi`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Non riesco a creare il checkout Stripe." },
        { status: 500 },
      );
    }

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("FlowCrew Stripe checkout failed", error);

    return NextResponse.json(
      { error: "Non riesco ad aprire Stripe Checkout in questo momento." },
      { status: 500 },
    );
  }
}
7