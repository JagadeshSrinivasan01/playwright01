import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Cart Page
 * Contains all selectors and methods related to cart functionality
 */
export class CartPage {
    readonly page: Page;
    readonly cartContainer: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly removeButtons: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartContainer = page.locator('#cart_contents_container');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.cartItems = page.locator('.cart_item');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.cartItemPrices = page.locator('.inventory_item_price');
        this.cartItemQuantities = page.locator('.cart_quantity');
        this.removeButtons = page.locator('[data-test^="remove-"]');
    }

    /**
     * Wait for the cart page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.cartContainer).toBeVisible();
    }

    /**
     * Click the checkout button
     */
    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }

    /**
     * Click the continue shopping button
     */
    async clickContinueShoppingButton() {
        await this.continueShoppingButton.click();
    }

    /**
     * Get all cart item names
     * @returns Array of cart item names
     */
    async getCartItemNames(): Promise<string[]> {
        const names = await this.cartItemNames.allTextContents();
        return names.map(name => name.trim());
    }

    /**
     * Get all cart item prices
     * @returns Array of cart item prices
     */
    async getCartItemPrices(): Promise<string[]> {
        const prices = await this.cartItemPrices.allTextContents();
        return prices.map(price => price.trim());
    }

    /**
     * Get cart item count
     * @returns Number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Verify specific items are in cart
     * @param expectedItems - Array of expected item names
     */
    async verifyCartItems(expectedItems: string[]) {
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
     * Check if checkout button is enabled
     * @returns True if checkout button is enabled, false otherwise
     */
    async isCheckoutButtonEnabled(): Promise<boolean> {
        return await this.checkoutButton.isEnabled();
    }

    /**
     * Check if cart is empty
     * @returns True if cart is empty, false otherwise
     */
    async isCartEmpty(): Promise<boolean> {
        const itemCount = await this.getCartItemCount();
        return itemCount === 0;
    }

    /**
     * Remove item from cart by name
     * @param itemName - Name of the item to remove
     */
    async removeItemFromCart(itemName: string) {
        const items = await this.cartItems.all();
        
        for (const item of items) {
            const name = await item.locator('.inventory_item_name').textContent();
            if (name?.trim() === itemName) {
                const removeButton = item.locator('[data-test^="remove-"]');
                await removeButton.click();
                break;
            }
        }
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify we are on cart page
     * @returns True if on cart page, false otherwise
     */
    async isOnCartPage(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/cart.html');
    }

    /**
     * Get total price of all items in cart
     * @returns Total price as string
     */
    async getTotalPrice(): Promise<string> {
        const prices = await this.getCartItemPrices();
        let total = 0;
        
        for (const price of prices) {
            const numericPrice = parseFloat(price.replace('$', ''));
            total += numericPrice;
        }
        
        return `$${total.toFixed(2)}`;
    }
} 