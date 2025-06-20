import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Inventory Page
 * Contains all selectors and methods related to inventory functionality
 */
export class InventoryPage {
    readonly page: Page;
    readonly inventoryContainer: Locator;
    readonly cartButton: Locator;
    readonly cartBadge: Locator;
    readonly sortDropdown: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;

    // Product selectors
    readonly sauceLabsBackpack: Locator;
    readonly sauceLabsBikeLight: Locator;
    readonly sauceLabsBoltTShirt: Locator;
    readonly sauceLabsFleeceJacket: Locator;
    readonly sauceLabsOnesie: Locator;
    readonly testAllTheThingsTShirt: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryContainer = page.locator('#inventory_container');
        this.cartButton = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.sortDropdown = page.locator('[data-test="product_sort_container"]');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');

        // Product selectors
        this.sauceLabsBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.sauceLabsBikeLight = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.sauceLabsBoltTShirt = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
        this.sauceLabsFleeceJacket = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        this.sauceLabsOnesie = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
        this.testAllTheThingsTShirt = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
    }

    /**
     * Wait for the inventory page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.inventoryContainer).toBeVisible();
        await expect(this.cartButton).toBeVisible();
    }

    /**
     * Add Sauce Labs Backpack to cart
     */
    async addBackpackToCart() {
        await this.sauceLabsBackpack.click();
    }

    /**
     * Add Sauce Labs Bike Light to cart
     */
    async addBikeLightToCart() {
        await this.sauceLabsBikeLight.click();
    }

    /**
     * Add Sauce Labs Bolt T-Shirt to cart
     */
    async addBoltTShirtToCart() {
        await this.sauceLabsBoltTShirt.click();
    }

    /**
     * Add multiple items to cart
     * @param items - Array of item names to add
     */
    async addItemsToCart(items: string[]) {
        for (const item of items) {
            switch (item.toLowerCase()) {
                case 'sauce labs backpack':
                    await this.addBackpackToCart();
                    break;
                case 'sauce labs bike light':
                    await this.addBikeLightToCart();
                    break;
                case 'sauce labs bolt t-shirt':
                    await this.addBoltTShirtToCart();
                    break;
                default:
                    throw new Error(`Unknown item: ${item}`);
            }
        }
    }

    /**
     * Get the cart item count from the badge
     * @returns The number of items in cart
     */
    async getCartItemCount(): Promise<number> {
        try {
            const badgeText = await this.cartBadge.textContent();
            return badgeText ? parseInt(badgeText) : 0;
        } catch {
            return 0;
        }
    }

    /**
     * Click the cart button to navigate to cart page
     */
    async clickCartButton() {
        await this.cartButton.click();
    }

    /**
     * Verify cart badge shows expected count
     * @param expectedCount - Expected number of items in cart
     */
    async verifyCartItemCount(expectedCount: number) {
        const actualCount = await this.getCartItemCount();
        expect(actualCount).toBe(expectedCount);
    }

    /**
     * Check if cart badge is visible
     * @returns True if cart badge is visible, false otherwise
     */
    async isCartBadgeVisible(): Promise<boolean> {
        return await this.cartBadge.isVisible();
    }

    /**
     * Get current page URL
     * @returns Current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify we are on inventory page
     * @returns True if on inventory page, false otherwise
     */
    async isOnInventoryPage(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/inventory.html');
    }

    /**
     * Logout from the application
     */
    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }
} 