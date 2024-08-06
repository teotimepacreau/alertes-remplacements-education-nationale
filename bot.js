import puppeteer from "puppeteer";

const generateRandomUA = () => {
    // Array of random user agents
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
    ];
    // Get a random index based on the length of the user agents array 
    const randomUAIndex = Math.floor(Math.random() * userAgents.length);
    // Return a random user agent using the index above
    return userAgents[randomUAIndex];
  }

(async ()=> {
    const browser = await puppeteer.launch({
        headless: false, // SI ON PAS MET HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER 
        slowMo: 120,
    })
    const page = await browser.newPage()

      // Custom user agent from generateRandomUA() function
  const customUA = generateRandomUA();
 
  // Set custom user agent
  await page.setUserAgent(customUA);


    await page.goto('https://catalogue-bibliotheque.nantes.fr/account#')


    await page.locator("#loginField").fill(process.env.IDENTIFIANT)//filling username input
    await page.locator("#passwordField").fill(process.env.PASSWORD)//filling password input

    await page.locator('#passwordField').scroll({
        scrollDown: 10,
      });
    
    //   hover btn Connexion
    await page.locator('main form button:nth-child(3)').hover()
    
    // click btn Connexion
    await page.locator('main form button:nth-child(3)').click()
    
    // click sur btn "Emprunts en cours"
    await page.locator('#app > div > div:nth-child(3) > div > div > div > div > div > div > div > div._c8-1 > div > div._0-0 > div > div._c9-0 > main > div > div > div > div > ul > div:nth-child(4) > div:nth-child(2) > div').click()

    function ddmmyyyyToDate(dateString) {
        const parts = dateString.split('/');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Les mois en JavaScript commencent à 0
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    
    let arrayDateDeRetourDeChaqueEmprunt = await page.$$eval("::-p-text(Date de retour)",
        (elements) => {
            return Array.from(elements).map((element) => {
               return element.previousElementSibling.textContent
            });//chaque date est en string
        }
    )
    
    let arrayConvertiEnDateJS = arrayDateDeRetourDeChaqueEmprunt.map(dateString => ddmmyyyyToDate(dateString))

    console.log(arrayConvertiEnDateJS)
    // let elementLivreReserve = await page.evaluate('#searchresult > div:nth-child(1) > div.jss938 > div.jss940 > div:nth-child(2) > div > ul > div:nth-child(2) > li > div.jss1009 > *', elements => {
    //     return elements.forEach((element)=> element.textContent)
    // })
    // console.log(elementLivreReserve)


    // let retour = await page.evaluate((element) => {
    //     return element.textContent
    // },elementLivreReserve)

    


    // let dateRetour = ddmmyyyyToDate(retour)

    // console.log(dateRetour)

    // let dateAujourdhui = new Date()
    // console.log(dateAujourdhui)

    // let troisJours = 1000 * 60 * 60 * 24 * 3//nb de millisecondes dans 3 jours


    // // Calculer la différence en jours entre la date de retour et aujourd'hui
    // let differenceInDays = Math.ceil((dateRetour - dateAujourdhui) / troisJours);
    // console.log(differenceInDays)

    // // Vérifier si la différence est supérieure ou égale à 3 jours
    // if (differenceInDays >= 3) {
    //     console.log('ne pas cliquer sur renouveler')
    // } else {
    //     console.log('cliquer sur renouveler')
    // //cliquer sur Renouveler
    // }

    
    // await browser.close()
})()
