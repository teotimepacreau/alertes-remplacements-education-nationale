import puppeteer from "puppeteer";
function sleep(ms) {
     return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
     })
}
(async ()=> {
    const browser = await puppeteer.launch({headless: false})// SI ON PAS MET HEADLESS FALSE ON NE VERRA PAS LE NAVIGATEUR S'OUVRIR ET EXÉCUTER  
    const page = await browser.newPage()
    await page.goto('https://eservices.nantesmetropole.fr/web/guest/accueil-particuliers')


    await page.click('#sign-in')
    await sleep(2000)

    await page.type("[name='user']", process.env.IDENTIFIANT)
    await page.type("[name='password']", process.env.PASSWORD)
    await page.click("#submitLDAP")
    await sleep(6000)

    await browser.close()
})()
