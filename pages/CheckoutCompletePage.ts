import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Complete Page
 * Contains all selectors and methods related to checkout complete functionality
 */
export class CheckoutCompletePage {
    readonly page: Page;
    readonly checkoutCompleteContainer: Locator;
    readonly backHomeButton: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly ponyExpressImage: Locator;
    readonly thankYouMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutCompleteContainer = page.locator('#checkout_complete_container');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.ponyExpressImage = page.locator('.pony_express');
        this.thankYouMessage = page.locator('.complete-header');
    }

    /**
     * Wait for the checkout complete page to be fully loaded
     */
    async waitForPageLoad(): Promise<boolean> {
        await this.page.waitForLoadState('networkidle');
        return await this.checkoutCompleteContainer.isVisible();
    }

    /**
     * Click the back home button
     */
    async clickBackHomeButton() {
        await this.backHomeButton.click();
    }

    /**
     * Get the complete header text
     * @returns The complete header text
     */
    async getCompleteHeaderText(): Promise<string> {
        const headerText = await this.completeHeader.textContent();
        return headerText ? headerText.trim() : '';
    }

    /**
     * Get the complete text
     * @returns The complete text
     */
    async getCompleteText(): Promise<string> {
        const completeText = await this.completeText.textContent();
        return completeText ? completeText.trim() : '';
    }

    /**
     * Verify checkout completion message
     */
    async verifyCheckoutCompletion(): Promise<boolean> {
        const headerText = await this.getCompleteHeaderText();
        const completeText = await this.getCompleteText();
        
        return headerText === 'Thank you for your order!' && 
               completeText.includes('Your order has been dispatched');
    }

    /**
     * Verify all completion page elements are visible
     */
    async verifyCompletionPageElements(): Promise<boolean> {
        const elements = [
            this.checkoutCompleteContainer,
            this.backHomeButton,
            this.completeHeader,
            this.completeText,
            this.ponyExpressImage
        ];
        
        for (const element of elements) {
            if (!(await element.isVisible())) return false;
        }
        return true;
    }

    /**
     * Check if back home button is enabled
     * @returns True if back home button is enabled, false otherwise
     */
    async isBackHomeButtonEnabled(): Promise<boolean> {
        return await this.backHomeButton.isEnabled();
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify we are on checkout complete page
     * @returns True if on checkout complete page, false otherwise
     */
    async isOnCheckoutCompletePage(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/checkout-complete.html');
    }

    /**
     * Verify order completion and navigate back to inventory
     */
    async completeOrderAndReturnToInventory(): Promise<boolean> {
        // Verify checkout completion
        const isComplete = await this.verifyCheckoutCompletion();
        if (!isComplete) return false;
        
        // Click back home button
        await this.clickBackHomeButton();
        return true;
    }

    /**
     * Verify the thank you message is displayed
     */
    async verifyThankYouMessage(): Promise<boolean> {
        const headerText = await this.getCompleteHeaderText();
        return headerText === 'Thank you for your order!';
    }

    /**
     * Verify the order dispatch message is displayed
     */
    async verifyOrderDispatchMessage(): Promise<boolean> {
        const completeText = await this.getCompleteText();
        return completeText.includes('Your order has been dispatched') &&
               completeText.includes('will arrive just as fast as the pony can get there!');
    }
} 