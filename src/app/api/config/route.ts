import { NextRequest, NextResponse } from 'next/server';
import { getSiteConfig, getNavigation, getSocialMedia, getContactInfo, getSiteInfo } from '@/lib/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get('section');
  
  try {
    // Если указана конкретная секция, возвращаем только её
    if (section) {
      switch (section) {
        case 'navigation': {
          const type = searchParams.get('type') as 'main' | 'footer' | null;
          const navigation = await getNavigation(type || 'main');
          return NextResponse.json(navigation);
        }
        case 'social':
          return NextResponse.json(await getSocialMedia());
        case 'contacts':
          return NextResponse.json(await getContactInfo());
        case 'site':
          return NextResponse.json(await getSiteInfo());
        default:
          return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
      }
    }
    
    // Иначе возвращаем всю конфигурацию
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' }, 
      { status: 500 }
    );
  }
} 