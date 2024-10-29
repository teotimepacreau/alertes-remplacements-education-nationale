import puppeteer from "puppeteer";
import cron from "node-cron";
import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

let scrapper = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // SI ON MET PAS HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER
      args: ["--no-sandbox", "--disable-setuid-sandbox"], //je désactive le sandbox de Chromium car ça fait bugger le container Docker une fois déployé s'il n'y a pas ces arguments
    });
    const page = await browser.newPage();

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

    let resultatDuScrapper = dateArray.map((date, index) => {
      return {
        date,
        titre: titreArray[index],
      };
    });

    await browser.close();
    console.log("resultatDuScrapper", resultatDuScrapper);
    return resultatDuScrapper;
  } catch (error) {
    console.error(error);
  }
};

let ajoutUrlAuxAnnonces = async () => {
  try {
    let arrayAnnonces = await scrapper();

    let response = await fetch(
      "https://recrutement.education.gouv.fr/recrutement/webruntime/api/apex/execute?language=fr&asGuest=true&htmlEncode=false",
      {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
          Accept: "*/*",
          "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/json; charset=utf-8",
          "X-SFDC-Request-Id": "173020747379093f41",
          "X-B3-TraceId": "ef30ee6001c22d32",
          "X-B3-SpanId": "ea98ad3cb11e06b2",
          "X-B3-Sampled": "0",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Priority: "u=4",
        },
        referrer:
          "https://recrutement.education.gouv.fr/recrutement/offres?term=&Region__c=52&Departement__c=044&Population__c=EN2D%3BDE",
        body: '{"namespace":"","classname":"@udd/01pIV000000aXE1","method":"getData","isContinuation":false,"params":{"name":"SearchOffresVirtuo","input":{"TERM":"","ACD":"","DF":"","NE":"","REG":"52","DPT":"044","CAT":"","FNC":"","NAT":"","POP":"EN2D;DE"}},"cacheable":false}',
        method: "POST",
        mode: "cors",
      }
    );

    let jsonFetchAnnonces = await response.json();

    // appliquer au JSON emploi l'URL avec offreemploi/id dans returnValue ID
    arrayAnnonces.forEach((item, index) => {
      let url = jsonFetchAnnonces.returnValue[index].Id;
      let urlConsolide =
        "https://recrutement.education.gouv.fr/recrutement/offreemploi/" + url;
      item.url = urlConsolide;
    })
    console.log("arrayAnnonces", arrayAnnonces)
    return arrayAnnonces
  }catch (error) {
    console.error(error);
  }
};


let mailer = async () => {
  try {
    let arrayConsolide = await ajoutUrlAuxAnnonces();
    console.log("arrayConsolide", arrayConsolide);
    let htmlContent = "";
    arrayConsolide.forEach((annonce) => {
      htmlContent += `
        <h2><a href="${annonce.url}">Recherche ${annonce.titre}</a></h2>
        <p>${annonce.date}</p>
      `;
    });

    (async function () {
      const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL, //RESEND envoie depuis le sous domaine que j'ai configuré dans l'UI de Resend, je peux mettre blabla@sousdomaine.fr en expéditeur
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
// mailer();

cron.schedule("20 10 * * 3", () => mailer(), { timezone: "Europe/Paris" }); //run tous les mercredis à 10h00
