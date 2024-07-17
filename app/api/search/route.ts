import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookName = searchParams.get('bookName');

  if (!bookName) {
    return NextResponse.json({ error: 'Book name is required' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(bookName)}+buy+book`);

    // Extract data from Google search results
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.tF2Cxc'));
      return items.map(item => {
        const titleElement = item.querySelector('.DKV0Md');
        const linkElement = item.querySelector('.yuRUbf a') as HTMLAnchorElement;

        const title = titleElement ? titleElement.textContent : null;
        const link = linkElement ? linkElement.href : null;

        return { title, link };
      });
    });

    await browser.close();

    // Filter results to include only those likely to sell books
    const filteredResults = results.filter(result => 
      result.link && (
        result.link.includes('book') || 
        result.link.includes('shop') || 
        result.link.includes('store')
      )
    );

    return NextResponse.json(filteredResults, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error occurred while searching' }, { status: 500 });
  }
}