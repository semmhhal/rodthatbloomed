import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { title, excerpt } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email");

    if (error) throw error;
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emails = subscribers.map((s: { email: string }) => s.email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "rod that bloomed <noreply@rodthatbloomed.com>",
        to: emails,
        subject: `New Entry: ${title}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; color: #2A1A0E;">
            <p style="text-align: center; color: #C4A45A; letter-spacing: 8px; font-size: 14px;">✦ ✦ ✦</p>
            <h1 style="font-size: 28px; font-weight: 300; text-align: center; color: #2A1A0E;">${title}</h1>
            <p style="font-size: 15px; line-height: 1.8; color: #5C4A3A; font-style: italic;">${excerpt}</p>
            <p style="text-align: center; margin-top: 28px;">
              <a href="https://rodthatbloomed.com" style="color: #8B6914; letter-spacing: 1px; font-size: 13px;">Continue Reading →</a>
            </p>
            <p style="text-align: center; color: #C4A45A; letter-spacing: 8px; font-size: 14px; margin-top: 28px;">✦</p>
            <p style="text-align: center; font-size: 11px; color: #A0906E; margin-top: 20px;">
              You're receiving this because you subscribed to rod that bloomed.
            </p>
          </div>
        `,
      }),
    });

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
