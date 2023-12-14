import { Controller, Get, Header } from '@nestjs/common';
import { TopPageService } from '../top-page/top-page.service';
import { ConfigService } from '@nestjs/config';
import { Builder } from 'xml2js';
import { format, subDays } from 'date-fns';
import { TopPageModelDocument } from '../top-page/top-page.model';
import { CATEGORY_URL } from './sitemap.constans';

@Controller('sitemap')
export class SitemapController {
  public domain: string;
  constructor(
    private readonly topPageService: TopPageService,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? 'http://localhost:3000';
  }

  @Get('xml')
  @Header('content-Type', 'text/xml')
  async sitemap() {
    const fomatString = "yyyy-MM-dd'T'HH:mm:00.000xxx";
    let res = [
      {
        loc: this.domain,
        lastmod: format(subDays(new Date(), 1), fomatString),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${this.domain}/courses`,
        lastmod: format(subDays(new Date(), 1), fomatString),
        changefreq: 'daily',
        priority: '1.0',
      },
    ];
    const pages = await this.topPageService.findAll();
    res = res.concat(
      pages.map((page: TopPageModelDocument & { updatedAt: string }) => {
        return {
          loc: `${this.domain}${CATEGORY_URL[page.firstCategory]}/${
            page.alias
          }`,
          lastmod: format(new Date(page.updatedAt ?? new Date()), fomatString),
          changefreq: 'weekly',
          priority: '0.7',
        };
      }),
    );

    const builder = new Builder({
      xmldec: { version: '1.0', encoding: 'UTF-8' },
    });

    return builder.buildObject({
      urlset: {
        $: {
          xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
        },
        url: res,
      },
    });
  }
}
