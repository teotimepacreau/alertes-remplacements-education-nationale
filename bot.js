import puppeteer from "puppeteer";
function sleep(ms) {
     return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
     })
}
(async ()=> {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://eservices.nantesmetropole.fr/web/guest/accueil-particuliers')


    await page.click('#sign-in')
    await sleep(5000)

    await browser.close()
})()
