const puppeteer = require('puppeteer');

const DEX_TOOL_URL = 'https://www.dextools.io/app/uniswap/pair-explorer/0x84383fb05f610222430f69727aa638f8fdbf5cc1';
const DEX_BOOKMARK_BTN = '//button[contains(@class, "ng-star-inserted")]';
const COIN_GEKO_URL = 'https://coinmarketcap.com/currencies/million/';

let state = {
    MAX: 100000000,
    executed: 0
};

async function delay(interval) {
    return new Promise(resolve => {
        setTimeout(resolve, interval);
    });
}

async function call() {
    console.log('dextools - add mm to favourites.');

    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: null,
        acceptDialogs: true,
        cacheEnabled: false,
        args: [
            '--incognito'
        ]
    });

    const urlOptions = {
        waitUntil: ['networkidle2']
    };

    try {
        const page = (await browser.pages())[0];
        console.log('going to url: ' + DEX_TOOL_URL);
        await page.goto(DEX_TOOL_URL, urlOptions);

        //dex tools cannot seem to click on star button if the chat pops up, seems to work if we delete the app chat from dom.
        console.log('looking for app-chat.');
        await page.waitForXPath('//app-chat', {timeout: 60000});
        const appChat = await page.$x('//app-chat');
        
        //remove chat pop up.
        await page.evaluate(selector => selector.parentNode.removeChild(selector), appChat[0]);
        console.log('removed app-chat.');

        //lets now try to press favourite buttom.
        console.log('looking for favourite btn.');        
        await page.waitForXPath(DEX_BOOKMARK_BTN, {timeout: 60000});
        const bookmark = await page.$x(DEX_BOOKMARK_BTN);
        await bookmark[1].click();
        console.log('clicked on star btn.'); 

        //browser.close();

        //repeat (.)(.)
        //call();
    } catch(ex) {
        console.error(ex);
    } finally {
        //browser.close();
    }
}

(async () => {
    if (state.executed > state.MAX) {
        return;
    }

    await call();
})();