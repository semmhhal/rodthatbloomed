import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(page("Missing email", "No email address was provided."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (req.method === "GET") {
    return new Response(page(
      "Unsubscribe",
      `<p>Are you sure you want to unsubscribe <strong>${email}</strong> from rod that bloomed?</p>
       <form method="POST">
         <input type="hidden" name="email" value="${email}" />
         <button type="submit" style="background:#5C3A1E;color:#F7F0E3;border:none;padding:12px 28px;font-family:Georgia,serif;font-size:14px;cursor:pointer;border-radius:4px;margin-top:16px;">Yes, unsubscribe me</button>
       </form>`
    ), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Handle POST - actually unsubscribe
  try {
    const formData = await req.formData();
    const formEmail = formData.get("email") as string || email;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("email", formEmail);

    if (error) throw error;

    return new Response(page(
      "Unsubscribed",
      `<p>You've been unsubscribed. You won't receive any more emails from rod that bloomed.</p>
       <p style="margin-top:20px;"><a href="https://rodthatbloomed.com" style="color:#8B6914;text-decoration:none;">Visit rod that bloomed</a></p>`
    ), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (e) {
    return new Response(page("Error", `<p>Something went wrong. Please try again.</p>`), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
});

function page(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - rod that bloomed</title></head>
<body style="font-family:Georgia,serif;max-width:520px;margin:60px auto;padding:20px;color:#2A1A0E;text-align:center;">
  <h1 style="font-size:24px;font-weight:300;margin-bottom:20px;">${title}</h1>
  <div style="font-size:15px;line-height:1.8;color:#5C4A3A;">${body}</div>
</body>
</html>`;
}
