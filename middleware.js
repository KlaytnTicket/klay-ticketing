import { NextResponse, userAgent } from 'next/server';

export async function middleware(request) {
  const agent = userAgent(request);

  if (agent.isBot) {
    return NextResponse.json({ message: "Bot can't access." }, { status: 403 });
  }

  // 로그인 세션 분기 처리

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};
