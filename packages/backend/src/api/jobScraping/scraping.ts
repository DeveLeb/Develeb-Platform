import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { logger } from 'src/server';

const linkedin =
  'https://www.linkedin.com/jobs/search?keywords=Software%20Developer&location=Lebanon&geoId=101834488&f_TPR=r86400&position=1&pageNum=0';
const xpert4 = 'https://xperts4.com/job/?filter-category=30&filter-date-posted=24hours';
const bayt =
  'https://www.bayt.com/en/lebanon/jobs/developer-jobs/?filters%5Bjb_last_modification_date_interval%5D%5B%5D=3';
const remocate =
  'https://www.remocate.app/?Search=developer&Location=%F0%9F%93%8D+Any+Location&Category=%F0%9F%8C%9F+Any+Category#job-board';
const smartRecruiters = 'https://jobs.smartrecruiters.com/?keyword=Developer&locationType=remote';
const remoteSource = 'https://jobs.remotesource.com/jobs?jobTypes=Software+Engineer&postedSince=P1D';
const lbTalent = 'https://lb.talent.com/en/jobs?k=Software+Developer&l=&date=1d&radius=50&id=f37a4c7ad142';
export function filterLanguagesAndFrameworks(paragraph: string) {
  const languages = [
    'JavaScript',
    'TypeScript',
    'Objective-C',
    'C++',
    'C#',
    'Python',
    'Java',
    'Ruby',
    'PHP',
    'Swift',
    'Go',
    'Rust',
    'Kotlin',
    'Dart',
    'R',
    'C',
    'Perl',
    'Scala',
    'Haskell',
  ];

  const frameworks = [
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Express.js',
    'Django',
    'Flask',
    'Spring Boot',
    'Ruby on Rails',
    'Laravel',
    'Symfony',
    'ASP.NET',
    'Nuxt.js',
    'Nest.js',
    'Flutter',
    'React Native',
    'Electron',
    'Meteor',
    'Backbone.js',
    'Ember.js',
    'Fast API',
    'Bootstrap',
    '.NET Core',
  ];

  const escapedLanguages = languages.map((lang) => lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const escapedFrameworks = frameworks.map((framework) => framework.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  const languagesRegex = new RegExp(`(?<![\\w])(${escapedLanguages.join('|')})(?![\\w])`, 'gi');
  const frameworksRegex = new RegExp(`(?<![\\w])(${escapedFrameworks.join('|')})(?![\\w])`, 'gi');

  const foundLanguages = paragraph.match(languagesRegex) || [];
  const foundFrameworks = paragraph.match(frameworksRegex) || [];

  const normalizeAndDeduplicate = (items: string[], reference: string[]): string[] => {
    const normalizedItems = items.map(
      (item) => reference.find((ref) => ref.toLowerCase() === item.toLowerCase()) || item
    );
    return Array.from(new Set(normalizedItems));
  };

  return {
    languages: normalizeAndDeduplicate(foundLanguages, languages),
    frameworks: normalizeAndDeduplicate(foundFrameworks, frameworks),
  };
}

interface Job {
  title: string;
  languages?: string[];
  frameworks?: string[];
  applicationLink: string;
}

async function shortenLink(link: any) {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
  const shortenedLink = await response.text();
  return shortenedLink;
}

async function initializePage(link: string) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--incognito'],
  });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: 'domcontentloaded' });
  return { browser, page };
}

export const xpert4Scrape = async (): Promise<Job[] | null> => {
  const { browser, page } = await initializePage(xpert4);
  const links: string[] = [];
  const jobs: Job[] = [];

  try {
    await page.waitForSelector('.jobs-wrapper.items-wrapper');

    const jobListings = await page.$$('.item-job');
    for (const listing of jobListings) {
      const link = await listing.$eval(' h2:nth-child(1) > a:nth-child(1)', (x) => x.href);
      links.push(link);
    }

    for (const link of links) {
      try {
        await page.goto(link);
        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('.job-detail-title').text().trim();
        const descriptionDiv = $('#bsf_rt_marker');

        let descriptionText = '';

        descriptionDiv.find('p').each((_i, element) => {
          descriptionText += $(element).text().trim() + '\n';
        });

        descriptionDiv.find('ul').each((_i, element) => {
          $(element)
            .find('li')
            .each((_j, li) => {
              descriptionText += '- ' + $(li).text().trim() + '\n';
            });
        });
        const { languages, frameworks } = filterLanguagesAndFrameworks(descriptionText);

        const applicationLink = await shortenLink(link);

        jobs.push({
          title,
          languages,
          frameworks,
          applicationLink,
        });
      } catch (error) {
        logger.error(`Error processing job link ${link}:, ${error}`);
      }
    }
  } catch (error) {
    logger.error(`Error scraping xpert4:, ${error}`);
  } finally {
    await browser.close();
  }

  return jobs;
};

export const remocateScrape = async (): Promise<Job[] | null> => {
  const { browser, page } = await initializePage(remocate);
  const links: string[] = [];
  const jobs: Job[] = [];

  try {
    await page.waitForSelector('.board-list.w-dyn-items');
    const jobLinks = await page.$$('.w-dyn-item[role="listitem"] a.job-card.w-inline-block');

    for (const linkElement of jobLinks) {
      const postDate = await linkElement.$eval('div.job-card-right div.job-date.home-date', (el) =>
        el.textContent?.trim()
      );
      if (postDate === 'Today') {
        const href = await linkElement.evaluate((el) => el.href);
        links.push(href);
      }
    }

    for (const link of links) {
      try {
        await page.goto(link);
        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('.top-title-job').text().trim();
        const description = $('.text-rich-text > ul').text();
        const { languages, frameworks } = filterLanguagesAndFrameworks(description);
        const applicationLink = await shortenLink(link);

        jobs.push({ title, languages, frameworks, applicationLink });
      } catch (error) {
        logger.error(`Error processing job link ${link}:, ${error}`);
      }
    }
  } catch (error) {
    logger.error(`Error scraping remocate:,${error}`);
  } finally {
    await browser.close();
  }

  return jobs;
};

export const smartRecruitersScrape = async (): Promise<Job[] | null> => {
  const { browser, page } = await initializePage(smartRecruiters);
  const jobLinks: string[] = [];
  const jobs: Job[] = [];

  try {
    await page.waitForSelector('.jobs-item');

    const jobListings = await page.$$('.jobs-item');
    for (const link of jobListings) {
      const postDate = await link.$eval('.job-details li:nth-child(2)', (el) => el.textContent?.trim());
      if (postDate?.includes('hours') || postDate?.includes('minutes')) {
        const href = await link.$eval('a', (el) => el.href);
        jobLinks.push(href);
      }
    }
    for (const link of jobLinks) {
      await page.goto(link);
      const html = await page.content();
      const $ = cheerio.load(html);

      const title = $('.job-title').text().trim();
      const description = $(
        '#st-companyDescription > div:nth-child(2) > p , #st-jobDescription > div:nth-child(2) > p, #st-jobDescription > div:nth-child(2) > ul:nth-child(3) > li , #st-additionalInformation > div:nth-child(2) > ul:nth-child(2) > li'
      )
        .text()
        .trim();
      const { languages, frameworks } = filterLanguagesAndFrameworks(description);

      const applicationLink = await shortenLink(link);

      jobs.push({ title, languages, frameworks, applicationLink });
    }
  } catch (error) {
    logger.error(`Error scraping smartRecruiters:, ${error}`);
  } finally {
    await browser.close();
  }

  return jobs;
};

export const baytScrape = async (): Promise<Job[] | null> => {
  const { browser, page } = await initializePage(bayt);
  const jobLinks: string[] = [];
  const jobs: Job[] = [];

  try {
    await page.waitForSelector('#results_inner_card');

    const jobListings = await page.$$('.has-pointer-d');
    for (const link of jobListings) {
      const href = await link.$eval('a', (el) => el.href);
      jobLinks.push(href);
    }

    for (const link of jobLinks) {
      try {
        await page.goto(link);
        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('#job_title').text().trim();
        const description = $('div.t-break').text().trim();

        const { languages, frameworks } = filterLanguagesAndFrameworks(description);

        const applicationLink = await shortenLink(link);

        jobs.push({ title, languages, frameworks, applicationLink });
      } catch (error) {
        logger.error(`Error processing job link ${link}:, ${error}`);
      }
    }
  } catch (error) {
    logger.error(`Error scraping bayt:, ${error}`);
  } finally {
    await browser.close();
  }

  return jobs;
};

//TODO:fix filtering the locations to get the remote jobs only
export const remoteSourceScrape = async () => {
  const { browser, page } = await initializePage(remoteSource);

  await page.waitForSelector('.grouped-job-result');

  const jobListings = await page.$$('.grouped-job-result');
  logger.info(`Found ${jobListings.length} job listings`);

  for (const job of jobListings) {
    const location = await job.evaluate(() => {
      return document.querySelector('.job-list-company-meta-item.job-list-company-meta-locations')?.textContent;
    });

    logger.info(`Location: ${location}`);

    if (location?.split('-').includes('Remote')) {
      logger.info('Location is remote');

      await page.click('div.grouped-job-result:nth-child(4) > button:nth-child(4)');

      const title = await page.$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)',
        (el) => el.textContent
      );

      logger.info(`Title: ${title}`);

      const description = await page.$$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > span',
        (spans) => spans.map((span) => span.innerText).join(' ')
      );
      const { languages, frameworks } = filterLanguagesAndFrameworks(description);
      const link = await page.$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)',
        (el) => el.href
      );

      const applicationLink = await shortenLink(link);

      logger.info(`Application link: ${applicationLink}`);
      logger.info({ title, languages, frameworks, applicationLink });
    }
  }
  await browser.close();
};

export const lbTalentScrape = async () => {
  const { browser, page } = await initializePage(lbTalent);
  const links: string[] = [];
  const jobs: Job[] = [];
  await page.waitForSelector('#nv-jobs');

  try {
    const jobListings = await page.$$('.card.card__job');

    const link = 'https://lb.talent.com/en/jobs?k=Software+Developer&l=&date=1d&radius=50&id=';
    for (const job of jobListings) {
      try {
        const dataId = await job.evaluate((el) => el.getAttribute('data-id'));
        dataId ? links.push(link + dataId) : logger.warn('No data-id found for a job listing');
      } catch (error: any) {
        logger.error(`Error extracting data-id: ${error.message}`);
      }
    }

    for (const link of links) {
      try {
        await page.goto(link);

        await page.waitForSelector('.jobsPreview');
        const html = await page.content();
        const $ = cheerio.load(html);
        const title = $('.jobPreview__header--title').text().trim();
        const description = $('.jobPreview__body.jobPreview__body--wrapper').text().trim();
        const { languages, frameworks } = filterLanguagesAndFrameworks(description);
        const applicationLink = await shortenLink(link);
        jobs.push({ title, languages, frameworks, applicationLink });
      } catch (error) {
        logger.error(`Error fetching jobs from ${link}: ${error}`);
      }
    }
  } catch (error) {
    logger.error(`Error fetching jobs from lbTalent: ${error}`);
  } finally {
    await browser.close();
  }
  return jobs;
};

export const linkedinScrape = async (): Promise<Job[] | null> => {
  const jobsLink: string[] = [];
  const jobs: Job[] = [];

  const { browser, page } = await initializePage(linkedin);
  await setTimeout(async () => {
    await page.mouse.click(100, 200);
  }, 2000);

  try {
    const jobListings = await page.$$('.base-card.relative.job-search-card');

    for (const job of jobListings) {
      const href = await job.$eval('a.base-card__full-link', (el) => el.href);
      jobsLink.push(href);
    }

    for (const link of jobsLink) {
      try {
        await page.goto(link, { waitUntil: 'networkidle0' });

        await page.waitForSelector('.top-card-layout__title');

        try {
          await page.click(
            'button.show-more-less-html__button--more[aria-expanded="false"][data-tracking-control-name="public_jobs_show-more-html-btn"]'
          );
        } catch (clickError) {
          logger.info('Show more button not found or not clickable');
        }

        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('.top-card-layout__title').text().trim();
        const description = $('.show-more-less-html__markup').text().trim();
        const { languages, frameworks } = await filterLanguagesAndFrameworks(description);
        const applicationLink = await shortenLink(link);

        jobs.push({
          title,
          languages,
          frameworks,
          applicationLink,
        });
      } catch (error) {
        logger.error(`Error processing job link ${link}:, ${error}`);
      }
    }
  } catch (error) {
    logger.error(`Error scraping linkedin:, ${error}`);
  } finally {
    await browser.close();
  }

  return jobs;
};
