import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Login Page
 * Contains all selectors and methods related to login functionality
 */
export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly loginLogo: Locator;
    readonly botImage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.loginLogo = page.locator('.login_logo');
        this.botImage = page.locator('.bot_column');
    }

    /**
     * Navigate to the login page
     */
    async goto() {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }

    /**
     * Wait for the login page to be fully loaded
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await expect(this.loginLogo).toBeVisible();
        await expect(this.botImage).toBeVisible();
    }

    /**
     * Fill in the username field
     * @param username - The username to enter
     */
    async fillUsername(username: string) {
        await this.usernameInput.clear();
        await this.usernameInput.fill(username);
    }

    /**
     * Fill in the password field
     * @param password - The password to enter
     */
    async fillPassword(password: string) {
        await this.passwordInput.clear();
        await this.passwordInput.fill(password);
    }

    /**
     * Click the login button
     */
    async clickLogin() {
        await this.loginButton.click();
    }

    /**
     * Perform complete login with provided credentials
     * @param username - The username to use for login
     * @param password - The password to use for login
     */
    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLogin();
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
     * Check if login button is enabled
     * @returns True if login button is enabled, false otherwise
     */
    async isLoginButtonEnabled(): Promise<boolean> {
        return await this.loginButton.isEnabled();
    }

    /**
     * Get the current URL to verify navigation
     * @returns The current page URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Wait for successful login (redirect to inventory page)
     */
    async waitForSuccessfulLogin() {
        await this.page.waitForURL('**/inventory.html');
    }

    /**
     * Verify that login was successful by checking URL
     * @returns True if successfully logged in, false otherwise
     */
    async isLoggedIn(): Promise<boolean> {
        const currentUrl = await this.getCurrentUrl();
        return currentUrl.includes('/inventory.html');
    }
} 