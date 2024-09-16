import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const xpert4 = 'https://xperts4.com/job/?filter-category=30&filter-date-posted=24hours';
const bayt =
  'https://www.bayt.com/en/lebanon/jobs/developer-jobs/?filters%5Bjb_last_modification_date_interval%5D%5B%5D=3';
const remocate =
  'https://www.remocate.app/?Search=developer&Location=%F0%9F%93%8D+Any+Location&Category=%F0%9F%8C%9F+Any+Category#job-board';
const smartRecruiters = 'https://jobs.smartrecruiters.com/?keyword=Developer&locationType=remote';
const remoteSource = 'https://jobs.remotesource.com/jobs?jobTypes=Software+Engineer&postedSince=P1D';

function filterLanguagesAndFrameworks(paragraph: string) {
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
    'Express',
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

  // Ensure special characters are escaped (C++, C#)
  const escapedLanguages = languages.map((lang) => lang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const escapedFrameworks = frameworks.map((framework) => framework.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // Join into a regex that matches any of the languages or frameworks
  const languagesRegex = new RegExp(`(?<![\\w])(${escapedLanguages.join('|')})(?![\\w])`, 'gi');
  const frameworksRegex = new RegExp(`(?<![\\w])(${escapedFrameworks.join('|')})(?![\\w])`, 'gi');

  const foundLanguages = paragraph.match(languagesRegex) || [];
  const foundFrameworks = paragraph.match(frameworksRegex) || [];

  return {
    languages: [...new Set(foundLanguages)], // Removing duplicates
    frameworks: [...new Set(foundFrameworks)], // Removing duplicates
  };
}

async function shortenLink(link: any) {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`);
  const shortenedLink = await response.text();
  return shortenedLink;
}

export const xpert4Scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the page with job listings
  await page.goto(xpert4);
  const links = [];
  // Wait for the job listings to load
  await page.waitForSelector('.jobs-wrapper.items-wrapper');

  // Get all job listing elements
  const jobListings = await page.$$('.item-job');

  for (const listing of jobListings) {
    const link = await listing.$eval(' h2:nth-child(1) > a:nth-child(1)', (x) => x.href);
    links.push(link);
  }

  const jobs = [];

  for (const link of links) {
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
  }

  await browser.close();
  return jobs;
};

export const remocateScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(remocate);

  await page.waitForSelector('.board-list.w-dyn-items');
  const jobLinks = await page.$$('.w-dyn-item[role="listitem"] a.job-card.w-inline-block');

  const links = [];
  for (const linkElement of jobLinks) {
    const postDate = await linkElement.$eval('div.job-card-right div.job-date.home-date', (el) =>
      el.textContent?.trim()
    );
    if (postDate === 'Today') {
      const href = await linkElement.evaluate((el) => el.href);
      links.push(href);
    }
  }

  const jobs = [];

  for (const link of links) {
    await page.goto(link);
    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $('.top-title-job').text().trim();
    const description = $('.text-rich-text > ul').text();
    const { languages, frameworks } = filterLanguagesAndFrameworks(description);
    const applicationLink = await shortenLink(link);

    jobs.push({ title, languages, frameworks, applicationLink });
  }
  await browser.close();
  return jobs;
};

export const smartRecruitersScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(smartRecruiters);

  await page.waitForSelector('.jobs-item');

  const jobLinks: any[] = [];

  const jobListings = await page.$$('.jobs-item');
  for (const link of jobListings) {
    const postDate = await link.$eval('.job-details li:nth-child(2)', (el) => el.textContent?.trim());
    if (postDate?.includes('hours')) {
      const href = await link.$eval('a', (el) => el.href);
      jobLinks.push(href);
    }
  }

  const jobs: any[] = [];

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

  await browser.close();
  return jobs;
};

export const baytScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.goto(bayt);

  await page.waitForSelector('#results_inner_card');

  const jobLinks: any[] = [];

  const jobListings = await page.$$('.has-pointer-d');
  for (const link of jobListings) {
    const href = await link.$eval('a', (el) => el.href);
    jobLinks.push(href);
  }

  const jobs: any[] = [];

  for (const link of jobLinks) {
    await page.goto(link);
    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $('#job_title').text().trim();
    const description = $('div.t-break').text().trim();

    const { languages, frameworks } = filterLanguagesAndFrameworks(description);

    const applicationLink = await shortenLink(link);

    jobs.push({ title, languages, frameworks, applicationLink });
  }
  await browser.close();
  return jobs;
};

//TODO:fix filtering the locations to get the remote jobs only
export const remoteSourceScrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.goto(remoteSource);

  await page.waitForSelector('.grouped-job-result');

  const jobListings = await page.$$('.grouped-job-result');
  console.log(`Found ${jobListings.length} job listings`);

  for (const job of jobListings) {
    const location = await job.evaluate(() => {
      return document.querySelector('.job-list-company-meta-item.job-list-company-meta-locations')?.textContent;
    });

    console.log(`Location: ${location}`);

    if (location?.split('-').includes('Remote')) {
      console.log('Location is remote');

      await page.click('div.grouped-job-result:nth-child(4) > button:nth-child(4)');

      const title = await page.$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)',
        (el) => el.textContent
      );

      console.log(`Title: ${title}`);

      const description = await page.$$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > span',
        (spans) => spans.map((span) => span.innerText).join(' ')
      );

      console.log(`Description: ${description}`);

      const { languages, frameworks } = filterLanguagesAndFrameworks(description);

      console.log(`Languages: ${languages}`);
      console.log(`Frameworks: ${frameworks}`);

      const link = await page.$eval(
        'div.grouped-job-result:nth-child(4) > div:nth-child(5) > div:nth-child(1) > h2:nth-child(1) > a:nth-child(1)',
        (el) => el.href
      );

      console.log(`Link: ${link}`);

      const applicationLink = await shortenLink(link);

      console.log(`Application link: ${applicationLink}`);
      console.log({ title, languages, frameworks, applicationLink });
    }
  }
};
