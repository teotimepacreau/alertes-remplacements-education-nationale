import puppeteer from "puppeteer";

const generateRandomUA = () => {
  // Array of random user agents
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  ];
  // Get a random index based on the length of the user agents array
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  // Return a random user agent using the index above
  return userAgents[randomUAIndex];
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // SI ON PAS MET HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER
    slowMo: 10,
  });
  const page = await browser.newPage();

  // Custom user agent from generateRandomUA() function
  const customUA = generateRandomUA();

  // Set custom user agent
  await page.setUserAgent(customUA);

  //   PSEUDO CODE : 1.sélectionner tous les items ayant pour lieu "Nantes". 2. les mettre dans un array 3. faire tourner un Cron qui m'alerte de façon hebdomadaire par mail de toutes les nouvelles annonces

  await page.goto(
    "https://airtable.com/appJ0iqC65HrCo7A6/shrfFRrRZhIXsOcS8/tbl8kFVxkghdGWbTc"
  );

  let arrayAnnoncesLieuNantes = await page.$$("[aria-label='Fiche de galerie']");

  console.log(arrayAnnoncesLieuNantes);

  // await browser.close()
})();
