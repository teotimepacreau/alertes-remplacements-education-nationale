import puppeteer from "puppeteer";
function sleep(ms) {
     return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
     })
}
(async ()=> {
    const browser = await puppeteer.launch({
        headless: false, // SI ON PAS MET HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER 
        slowMo: 50,
        devtools: true,
    }) 
    const page = await browser.newPage()
    await page.goto('https://catalogue-bibliotheque.nantes.fr/account#')


    await page.locator("#loginField").fill(process.env.IDENTIFIANT)
    await page.locator("#passwordField").fill(process.env.PASSWORD)
    await page.locator('main form button:nth-child(3)').click()
    // await browser.close()
})()
