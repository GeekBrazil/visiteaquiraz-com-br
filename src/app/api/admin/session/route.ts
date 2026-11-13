import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_DEV,
  COOKIE_HOST,
  createSessionToken,
  isAdminRequest,
  verifyAdminCredential,
} from "@/lib/auth";

function isHttpsRequest(req: NextRequest): boolean {
  const proto = req.headers.get("x-forwarded-proto") || "";
  return proto.includes("https") || req.url.startsWith("https://");
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isAdminRequest(req) });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { password?: string; secret?: string };
    const candidate = (body.password || body.secret || "").trim();
    if (!verifyAdminCredential(candidate)) {
      return NextResponse.json(
        { error: "Senha de administrador inválida." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const https = isHttpsRequest(req);
    const cookieName = https ? COOKIE_HOST : COOKIE_DEV;

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: cookieName,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: https,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao autenticar." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const https = isHttpsRequest(req);
  const res = NextResponse.json({ ok: true });
  for (const name of [COOKIE_HOST, COOKIE_DEV]) {
    res.cookies.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: https,
      path: "/",
      maxAge: 0,
    });
  }
  return res;
}
