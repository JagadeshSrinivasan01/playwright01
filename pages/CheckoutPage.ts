import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Page
 * Contains all selectors and methods related to checkout functionality
 */
export class CheckoutPage {
    readonly page: Page;
    readonly checkoutContainer: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutContainer = page.locator('#checkout_info_container');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    /**
     * Wait for the checkout page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.checkoutContainer).toBeVisible();
    }

    /**
     * Fill in the first name field
     * @param firstName - The first name to enter
     */
    async fillFirstName(firstName: string) {
        await this.firstNameInput.clear();
        await this.firstNameInput.fill(firstName);
    }

    /**
     * Fill in the last name field
     * @param lastName - The last name to enter
     */
    async fillLastName(lastName: string) {
        await this.lastNameInput.clear();
        await this.lastNameInput.fill(lastName);
    }

    /**
     * Fill in the postal code field
     * @param postalCode - The postal code to enter
     */
    async fillPostalCode(postalCode: string) {
        await this.postalCodeInput.clear();
        await this.postalCodeInput.fill(postalCode);
    }

    /**
     * Fill in all checkout information
     * @param firstName - The first name to enter
     * @param lastName - The last name to enter
     * @param postalCode - The postal code to enter
     */
    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    /**
     * Click the continue button
     */
    async clickContinueButton() {
        await this.continueButton.click();
    }

    /**
     * Click the cancel button
     */
    async clickCancelButton() {
        await this.cancelButton.click();
    }

    /**
     * Complete the checkout information form
     * @param firstName - The first name to enter
     * @param lastName - The last name to enter
     * @param postalCode - The postal code to enter
     */
    async completeCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.fillCheckoutInformation(firstName, lastName, postalCode);
        await this.clickContinueButton();
    }

    /**
     * Get the error message text if present
     * @returns The error message text or null if not present
     */
    async getErrorMessage(): Promise<string | null> {
        try {
            await this.errorMessage.waitFor({ timeout: 5000 });
            return await this.errorMessage.textContent();
        } catch {
            return null;
        }
    }

    /**
     * Check if error message is displayed
     * @returns True if error message is visible, false otherwise
     */
    async isErrorMessageVisible(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    /**
     * Check if continue button is enabled
     * @returns True if continue button is enabled, false otherwise
     */
    async isContinueButtonEnabled(): Promise<boolean> {
        return await this.continueButton.isEnabled();
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify we are on checkout page
     * @returns True if on checkout page, false otherwise
     */
    async isOnCheckoutPage(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/checkout-step-one.html');
    }

    /**
     * Verify form fields are visible
     */
    async verifyFormFieldsVisible() {
        await expect(this.firstNameInput).toBeVisible();
        await expect(this.lastNameInput).toBeVisible();
        await expect(this.postalCodeInput).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
    }

    /**
     * Get form field values
     * @returns Object with form field values
     */
    async getFormFieldValues() {
        return {
            firstName: await this.firstNameInput.inputValue(),
            lastName: await this.lastNameInput.inputValue(),
            postalCode: await this.postalCodeInput.inputValue()
        };
    }
} 