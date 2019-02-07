import { browser, $ } from 'protractor';

export class GooglePage {
    navigateTo() {
        return browser.get('http://google.pl');
    }

    typePhrase(phrase: string) {
        const input = $('.search-input');
        return input.sendKeys(phrase);
    }

    clickSearchButton() {
        const searchButton = $('.search-button');
        return searchButton.click();
    }
}