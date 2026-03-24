import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "rod that bloomed", email: "semhal@rodthatbloomed.com" },
        to: [{ email }],
        subject: "Welcome to rod that bloomed",
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2A1A0E; padding: 40px 20px;">
            <p style="text-align: center; color: #C4A45A; letter-spacing: 8px; font-size: 14px;">✦ ✦ ✦</p>
            <h1 style="font-size: 28px; font-weight: 300; text-align: center; color: #2A1A0E; margin-bottom: 24px;">
              Welcome to rod that bloomed
            </h1>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A; font-style: italic;">
              Hi there,
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              Thank you for subscribing. This space is my open door — a place where I pour out whatever is sitting heavy on my heart and share what God has been gently teaching me through it all.
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              About faith, childhood, womanhood, relationships, the wrestling, the healing — and the slow bloom that comes from being held even when you can't feel it.
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              No performance, no polish. Just honesty, and the belief that someone out there needed to hear it too.
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              You'll hear from me whenever a new entry is published.
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A; font-style: italic;">
              With love,<br/>Semhal
            </p>
            <p style="text-align: center; margin-top: 32px;">
              <a href="https://rodthatbloomed.com" style="color: #8B6914; letter-spacing: 1px; font-size: 13px; text-decoration: none;">Visit rod that bloomed →</a>
            </p>
            <p style="text-align: center; color: #C4A45A; letter-spacing: 8px; font-size: 14px; margin-top: 28px;">✦</p>
          </div>
        `,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
