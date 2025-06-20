import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Overview Page
 * Contains all selectors and methods related to checkout overview functionality
 */
export class CheckoutOverviewPage {
    readonly page: Page;
    readonly checkoutOverviewContainer: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly paymentInformation: Locator;
    readonly shippingInformation: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutOverviewContainer = page.locator('#checkout_summary_container');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.cartItems = page.locator('.cart_item');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.cartItemPrices = page.locator('.inventory_item_price');
        this.cartItemQuantities = page.locator('.cart_quantity');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.paymentInformation = page.locator('.summary_info');
        this.shippingInformation = page.locator('.summary_info');
    }

    /**
     * Wait for the checkout overview page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.checkoutOverviewContainer).toBeVisible();
    }

    /**
     * Click the finish button
     */
    async clickFinishButton() {
        await this.finishButton.click();
    }

    /**
     * Click the cancel button
     */
    async clickCancelButton() {
        await this.cancelButton.click();
    }

    /**
     * Get all cart item names
     * @returns Array of cart item names
     */
    async getCartItemNames(): Promise<string[]> {
        const names = await this.cartItemNames.allTextContents();
        return names.map((name: string) => name.trim());
    }

    /**
     * Get all cart item prices
     * @returns Array of cart item prices
     */
    async getCartItemPrices(): Promise<string[]> {
        const prices = await this.cartItemPrices.allTextContents();
        return prices.map((price: string) => price.trim());
    }

    /**
     * Get cart item count
     * @returns Number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Verify specific items are in the overview
     * @param expectedItems - Array of expected item names
     */
    async verifyOrderItems(expectedItems: string[]) {
        const actualItems = await this.getCartItemNames();
        
        for (const expectedItem of expectedItems) {
            expect(actualItems).toContain(expectedItem);
        }
        
        expect(actualItems.length).toBe(expectedItems.length);
    }

    /**
     * Verify cart item count
     * @param expectedCount - Expected number of items
     */
    async verifyCartItemCount(expectedCount: number) {
        const actualCount = await this.getCartItemCount();
        expect(actualCount).toBe(expectedCount);
    }

    /**
     * Check if finish button is enabled
     * @returns True if finish button is enabled, false otherwise
     */
    async isFinishButtonEnabled(): Promise<boolean> {
        return await this.finishButton.isEnabled();
    }

    /**
     * Get subtotal amount
     * @returns Subtotal amount as string
     */
    async getSubtotal(): Promise<string> {
        const subtotalText = await this.subtotalLabel.textContent();
        return subtotalText ? subtotalText.trim() : '';
    }

    /**
     * Get tax amount
     * @returns Tax amount as string
     */
    async getTax(): Promise<string> {
        const taxText = await this.taxLabel.textContent();
        return taxText ? taxText.trim() : '';
    }

    /**
     * Get total amount
     * @returns Total amount as string
     */
    async getTotal(): Promise<string> {
        const totalText = await this.totalLabel.textContent();
        return totalText ? totalText.trim() : '';
    }

    /**
     * Verify payment information is displayed
     */
    async verifyPaymentInformationVisible() {
        await expect(this.paymentInformation).toBeVisible();
    }

    /**
     * Verify shipping information is displayed
     */
    async verifyShippingInformationVisible() {
        await expect(this.shippingInformation).toBeVisible();
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify we are on checkout overview page
     * @returns True if on checkout overview page, false otherwise
     */
    async isOnCheckoutOverviewPage(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/checkout-step-two.html');
    }

    /**
     * Calculate total price from item prices
     * @returns Calculated total price
     */
    async calculateTotalFromItems(): Promise<number> {
        const prices = await this.getCartItemPrices();
        let total = 0;
        
        for (const price of prices) {
            const numericPrice = parseFloat(price.replace('$', ''));
            total += numericPrice;
        }
        
        return total;
    }

    /**
     * Verify total calculation matches displayed total
     */
    async verifyTotalCalculation() {
        const calculatedTotal = await this.calculateTotalFromItems();
        const displayedTotal = await this.getTotal();
        const totalAmount = parseFloat(displayedTotal.replace(/[^0-9.]/g, ''));
        
        // Allow for small rounding differences
        expect(Math.abs(calculatedTotal - totalAmount)).toBeLessThan(0.01);
    }
} 