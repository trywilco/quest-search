xx/* eslint-disable */
const puppeteer = require("puppeteer");

describe("Check that the search box is shown only after clicking get", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  it("Shows the search box only after click", async () => {
    await page.goto("http://localhost:3001", {
      waitUntil: "load",
      timeout: 60000,
    });
    page.on("console", (log) => console.log(log.text()));

    const isSearchVisible = async (page) => {
      try {
        await page.waitForSelector("#search-box", {
          visible: true,
          timeout: 1500,
        });
        return true;
      } catch (e) {
        return false;
      }
    };

    const searchVisibleBefore = await isSearchVisible(page);

    await expect(searchVisibleBefore).toBe(false);

    const getPart = await page.$("#get-part");

    await getPart.evaluate((goPart) => goPart.click());

    const searchVisibleAfter = await isSearchVisible(page);

    await expect(searchVisibleAfter).toBe(true);
  }, 60000);
});
