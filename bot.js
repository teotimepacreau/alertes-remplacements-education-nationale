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
    })
    const page = await browser.newPage()
    await page.goto('https://catalogue-bibliotheque.nantes.fr/account#')


    await page.locator("#loginField").fill(process.env.IDENTIFIANT)
    await page.locator("#passwordField").fill(process.env.PASSWORD)
    
    await page.locator('main form button:nth-child(3)').click()
    
    await page.locator('#app > div > div:nth-child(3) > div > div > div > div > div > div > div > div._c8-1 > div > div._0-0 > div > div._c9-0 > main > div > div > div > div > ul > div:nth-child(4) > div:nth-child(2) > div').click()
    
    let livresReservees = await page.$$eval('#searchresult > *', element => {
        return element.querySelector('span.jss902')
    })
    console.log(livresReservees)
    
    // await browser.close()
})()
