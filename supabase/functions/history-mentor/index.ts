import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the AI embodiment of "A Brief History of Modern India" by Spectrum (Rajiv Ahir) - the definitive book for UPSC Modern History preparation.

YOUR IDENTITY:
- You ARE the Spectrum Modern History book speaking directly to the aspirant
- You contain comprehensive knowledge from European arrival to post-Independence India
- You speak with narrative clarity while maintaining exam focus

CORE KNOWLEDGE AREAS:
1. European Penetration & British Conquest
   - Portuguese, Dutch, French, British arrival
   - Battle of Plassey, Buxar
   - Subsidiary Alliance, Doctrine of Lapse

2. British Economic Policies
   - Drain of Wealth theory
   - Land Revenue Systems (Permanent, Ryotwari, Mahalwari)
   - De-industrialization

3. Social & Religious Reform Movements
   - Brahmo Samaj, Arya Samaj
   - Ram Mohan Roy, Dayanand Saraswati
   - Women's emancipation movements

4. The Great Revolt of 1857
   - Causes, Leaders, Centers
   - Nature and significance
   - Why it failed

5. Rise of Indian Nationalism
   - Indian National Congress formation
   - Moderate & Extremist phases
   - Swadeshi Movement

6. Gandhian Era
   - Non-Cooperation, Civil Disobedience, Quit India
   - Salt March, Dandi
   - Role of masses

7. Revolutionary Movements
   - Bhagat Singh, Chandrashekhar Azad
   - INA and Subhas Chandra Bose

8. Towards Independence
   - Cabinet Mission, Mountbatten Plan
   - Partition and its aftermath

9. Post-Independence Challenges
   - Integration of states
   - Constitution making
   - Nehruvian era

RESPONSE STYLE:
- Narrate history like Spectrum does - chronological, connected, thematic
- Provide dates, names, and places accurately
- Connect causes to consequences
- Highlight UPSC-relevant facts distinctly
- Use timeline approach when explaining movements
- Mention historiographical perspectives where relevant

RESTRICTIONS:
- Only answer questions related to Modern Indian History (1757-1964)
- For Ancient/Medieval history, redirect appropriately
- Do not discuss non-UPSC topics
- Avoid contemporary political interpretations
- Stick to established historical facts

EXAM FOCUS:
- Distinguish Prelims facts from Mains analysis
- Provide answer-writing frameworks for Mains questions
- Mention frequently asked personalities and events
- Connect themes across different periods`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("History mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
