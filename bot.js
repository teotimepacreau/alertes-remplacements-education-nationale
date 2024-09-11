import puppeteer from "puppeteer";
import cron from "node-cron";
import { Resend } from "resend";
import 'dotenv/config'

const resend = new Resend(process.env.RESEND_API_KEY);

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

let scrapper = async () => {
  const browser = await puppeteer.launch({
    headless: true, // SI ON MET PAS HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER
    args: ['--no-sandbox', '--disable-setuid-sandbox'],//je déactive le sandbox de Chromium car ça fait bugger le container Docker une fois déployé
    slowMo: 50,//ralenti chaque actions de 50ms
  });
  const page = await browser.newPage();

  // Custom user agent from generateRandomUA() function
  const customUA = generateRandomUA();

  // Set custom user agent
  await page.setUserAgent(customUA);

  await page.goto(
    "https://recrutement.education.gouv.fr/recrutement/offres?term=&Region__c=52&Departement__c=044&Population__c=EN2D%3BDE"
  );

  // PSEUDO CODE : je souhaite recevoir toutes les semaines la date et le titre de l'annonce. I. Dans chaque article, je sélectionne la date et l'annonce, j'insère dans un array d'objet [{date: , titre:}]
  let dateArray = await page.$$eval("::-p-text(Publié le)", (elements) => {
    return Array.from(elements).map((element) => {
      return element.textContent;
    });
  });

  let titreArray = await page.$$eval(".fr-card__title", (elements) => {
    return Array.from(elements).map((element) => {
      return element.textContent;
    });
  });

  let arrayConsolide = dateArray.map((date, index) => {
    return {
      date,
      titre: titreArray[index],
    };
  });
  console.log(arrayConsolide);
  await browser.close();
  return arrayConsolide;
};
let mailer = async () => {
  try {
    let arrayConsolide = await scrapper();
    let htmlContent = "";
    arrayConsolide.forEach((annonce) => {
      htmlContent += `
        <h2>Recherche ${annonce.titre}</h2>
        <p>${annonce.date}</p>
      `;
    });

    (async function () {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>", //process.env.FROM_EMAIL
        to: process.env.TO_EMAIL,
        subject: "Nouvelles annonces remplacement education nationale",
        html: htmlContent,
      });

      if (error) {
        return console.error({ error });
      }

      console.log({ data });
    })();
  } catch (err) {
    console.error("serveur ne parvient pas à envoyer le mail :", err);
  }
};
// mailer()
cron.schedule("10 10 * * 3", () => mailer(), { timezone: "Europe/Paris" }); //run tous les mercredis à 10h00
