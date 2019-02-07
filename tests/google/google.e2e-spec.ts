import { GooglePage } from './pageobject/google.po';

const googlePage: GooglePage = new GooglePage();

describe('Google Page', () => {
    beforeEach(() => {
        googlePage.navigateTo();
    })

    it('typing phrase into input and clicking search', () => {
        googlePage.typePhrase('Protractor testing');
        googlePage.clickSearchButton();
    });
});