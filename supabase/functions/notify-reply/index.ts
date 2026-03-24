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
    const { email, commenterName, replyName, replyMessage, postTitle } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "No email provided" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const unsubUrl = `https://petexirslmjvjefzfcuv.supabase.co/functions/v1/unsubscribe?email=${encodeURIComponent(email)}`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Semhal", email: "semhal@rodthatbloomed.com" },
        replyTo: { name: "Semhal", email: "semhal@rodthatbloomed.com" },
        to: [{ email }],
        subject: `${replyName} replied to your reflection`,
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
        },
        textContent: `Hi ${commenterName},

${replyName} replied to your reflection on "${postTitle}":

"${replyMessage}"

Read more at: https://rodthatbloomed.com

Unsubscribe: ${unsubUrl}`,
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2A1A0E; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: 300; text-align: center; color: #2A1A0E; margin-bottom: 24px;">
              Someone replied to your reflection
            </h1>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              Hi ${commenterName},
            </p>
            <p style="font-size: 15px; line-height: 1.9; color: #5C4A3A;">
              <strong>${replyName}</strong> replied to your reflection on <em>${postTitle}</em>:
            </p>
            <div style="border-left: 3px solid #D4A55A; padding: 12px 16px; margin: 16px 0; background: #FAF6EE;">
              <p style="font-size: 14px; line-height: 1.8; color: #5C4A3A; margin: 0;">${replyMessage}</p>
            </div>
            <p style="text-align: center; margin-top: 28px;">
              <a href="https://rodthatbloomed.com" style="color: #8B6914; font-size: 13px; text-decoration: none;">Visit rod that bloomed</a>
            </p>
            <p style="text-align: center; font-size: 11px; color: #A0906E; margin-top: 24px;">
              <a href="${unsubUrl}" style="color: #A0906E; text-decoration: underline;">Unsubscribe</a>
            </p>
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
