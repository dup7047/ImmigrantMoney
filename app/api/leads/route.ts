import {NextResponse} from "next/server";
import {z} from "zod";
import {locales} from "@/i18n/routing";
import {createSupabaseServerClient} from "@/lib/supabase";

const leadSchema = z.object({
  email: z.string().email(),
  locale: z.enum(locales),
  sourceTool: z.string().min(1),
  consent: z.boolean(),
  website: z.string().max(0).optional()
});

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success || !parsed.data.consent) {
    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  if (parsed.data.website) {
    return NextResponse.json({ok: true});
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ok: false, reason: "Supabase not configured"}, {status: 202});
  }

  const {error} = await supabase.from("leads").insert({
    email: parsed.data.email,
    locale: parsed.data.locale,
    source_tool: parsed.data.sourceTool
  });

  if (error) {
    return NextResponse.json({error: "Could not save lead"}, {status: 500});
  }

  return NextResponse.json({ok: true});
}
