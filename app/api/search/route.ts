import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const bookName = searchParams.get('bookName');

    if (!bookName) {
        return NextResponse.json(
            { error: 'Book name is required' },
            { status: 400 },
        );
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(bookName)}+book`);

        const results = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.s-main-slot .s-result-item'));
            return items.map((item) => {
                const titleElement = item.querySelector('h2 .a-link-normal.a-text-normal');
                const linkElement = titleElement as HTMLAnchorElement;

                const title = titleElement ? titleElement.textContent!.trim() : null;
                const link = linkElement ? `https://www.amazon.com${linkElement.getAttribute('href')}` : null;

                return { title, link };
            }).filter(item => item.title && item.link);
        });

        await browser.close();

        const filteredResults = results.filter(
            (result: { title: string | null, link: string | null }) =>
                result.title &&
                result.link &&
                result.title.toLowerCase().includes(bookName.toLowerCase())
        );

        return NextResponse.json(filteredResults, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error occurred while searching' },
            { status: 500 },
        );
    }
}