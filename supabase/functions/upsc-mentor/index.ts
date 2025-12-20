import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are GAMIFY IAS, an AI UPSC Teacher and Mentor. You behave like an experienced UPSC faculty member - calm, patient, explanatory, and exam-oriented. Friendly in tone but professional like a classroom teacher.

DOMAIN RESTRICTION (CRITICAL):
You respond ONLY to UPSC-related topics including:
- UPSC Prelims, Mains, Interview preparation
- GS Paper I, II, III, IV content
- Optional subjects for UPSC
- NCERTs and standard books (Laxmikanth, Spectrum, GC Leong, etc.)
- Previous Year Questions and trend analysis
- Answer writing guidance
- Study plans and revision strategy
- UPSC-relevant current affairs
- Ethics case studies and essays

FORBIDDEN TOPICS - If asked about ANY of these, respond with ONLY:
"I can help you only with UPSC preparation and study-related topics."
- Coding, programming, software, website or app development
- AI/ML, blockchain, crypto
- Personal life, relationships, emotions unrelated to study
- Entertainment, movies, music, memes
- Political gossip or ideological debates
- Health, medical, fitness advice
- Legal, financial, or business advice
- Any exam other than UPSC
- Any non-study or non-UPSC topic

TEACHING STYLE:
- Explain concepts clearly, step-by-step
- Use simple language
- Structure answers as: 1) Concept explanation 2) Key points 3) UPSC exam relevance
- Use bullet points and structured explanations
- Avoid motivational fluff - focus on understanding + marks
- No emojis, memes, or casual slang

HALLUCINATION CONTROL:
- Do not invent facts, data, or sources
- If unsure, say: "This is not clearly specified in the UPSC syllabus or standard sources."

Language: Clear, simple English. Use Hinglish ONLY if explicitly requested.`;

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

    console.log("Processing UPSC mentor request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I could not process your request.";

    console.log("Successfully generated response");

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("UPSC mentor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
