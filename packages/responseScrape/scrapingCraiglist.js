const request = require("request-promise");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");

const url = "https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof";

const scrapeSample = {
  title: " Code Coach for theCoderSchool",
  description:
  "Who We Are theCoderSchool is an after-school drop-off program for kids learning to code with several Bay Area locations and growing",
  datePosted: new Date("2020-11-13"),
  url:
  "https://sfbay.craigslist.org/sby/sof/d/cupertino-code-coach-for-thecoderschool/7230692188.html",
  hood: "(cupertino)",
  //address: "10057 Saich Way near Stevens Creek",
  compensation: "TBD - depends on experience"
};

const scrapeResults = [];

async function scrapeJobHeader() {
  try {
    const htmlResult = await request.get(url);
    const $ = await cheerio.load(htmlResult);

    $(".result-info").each((index, element) => {
      const resultTitle = $(element).children(".result-title");
      const title = resultTitle.text();
      const url = resultTitle.attr("href");
      const datePosted = $(element)
        .children("time")
        .attr("datetime");

      const hood = $(element)
        .find(".result-hood")
        .text();
      const scrapeResult = { title, url, datePosted, hood };
      scrapeResults.push(scrapeResult);
    });
    return scrapeResults;
  } catch (err) {
    console.error(err);
  }
}

async function scrapeDescription(jobsWithHeaders) {
  return await Promise.all(
    jobsWithHeaders.map(async job => {
      try {
        const htmlResult = await request.get(job.url);
        const $ = await cheerio.load(htmlResult);
        $(".print-qrcode-container").remove();
        job.description = $("#postingbody").text();
        //job.address = $("div.mapaddress").text();
        const compensationText = $(".attrgroup")
          .children()
          .first()
          .text();
        job.compensation = compensationText.replace("compensation: ", "");
        return job;
      } catch (error) {
        console.error(error);
      }
    })
  );
}

async function createCsvFile(data) {
  let csv = new ObjectsToCsv(data);

  // Save to file:
  await csv.toDisk("./test.csv");
}

async function scrapeCraigslist() {
  const jobsWithHeaders = await scrapeJobHeader();
  const jobsFullData = await scrapeDescription(jobsWithHeaders);
  await createCsvFile(jobsFullData);
}

scrapeCraigslist();