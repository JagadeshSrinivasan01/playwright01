import { Page, expect } from '@playwright/test';

/**
 * Utility functions for common test operations
 */
export class TestHelpers {
    /**
     * Wait for element to be visible with custom timeout
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param timeout - Timeout in milliseconds
     */
    static async waitForElement(page: Page, selector: string, timeout: number = 10000) {
        await page.waitForSelector(selector, { state: 'visible', timeout });
    }

    /**
     * Wait for element to be hidden
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param timeout - Timeout in milliseconds
     */
    static async waitForElementHidden(page: Page, selector: string, timeout: number = 10000) {
        await page.waitForSelector(selector, { state: 'hidden', timeout });
    }

    /**
     * Wait for network idle state
     * @param page - Playwright page object
     */
    static async waitForNetworkIdle(page: Page) {
        await page.waitForLoadState('networkidle');
    }

    /**
     * Take a screenshot with timestamp
     * @param page - Playwright page object
     * @param name - Screenshot name
     */
    static async takeScreenshot(page: Page, name: string) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await page.screenshot({ 
            path: `test-results/screenshots/${name}-${timestamp}.png`,
            fullPage: true 
        });
    }

    /**
     * Retry function with exponential backoff
     * @param fn - Function to retry
     * @param maxRetries - Maximum number of retries
     * @param baseDelay - Base delay in milliseconds
     */
    static async retryWithBackoff<T>(
        fn: () => Promise<T>, 
        maxRetries: number = 3, 
        baseDelay: number = 1000
    ): Promise<T> {
        let lastError: Error;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt === maxRetries) {
                    throw lastError;
                }
                
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError!;
    }

    /**
     * Assert element is visible with custom timeout
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param timeout - Timeout in milliseconds
     */
    static async assertElementVisible(page: Page, selector: string, timeout: number = 10000) {
        await expect(page.locator(selector)).toBeVisible({ timeout });
    }

    /**
     * Assert element is hidden
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param timeout - Timeout in milliseconds
     */
    static async assertElementHidden(page: Page, selector: string, timeout: number = 10000) {
        await expect(page.locator(selector)).toBeHidden({ timeout });
    }

    /**
     * Assert text content matches
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param expectedText - Expected text content
     */
    static async assertTextContent(page: Page, selector: string, expectedText: string) {
        await expect(page.locator(selector)).toHaveText(expectedText);
    }

    /**
     * Assert URL contains expected path
     * @param page - Playwright page object
     * @param expectedPath - Expected path in URL
     */
    static async assertUrlContains(page: Page, expectedPath: string) {
        await expect(page).toHaveURL(new RegExp(expectedPath));
    }

    /**
     * Handle flaky element interactions
     * @param page - Playwright page object
     * @param selector - Element selector
     * @param action - Action to perform on element
     */
    static async handleFlakyElement(
        page: Page, 
        selector: string, 
        action: (element: any) => Promise<void>
    ) {
        await this.retryWithBackoff(async () => {
            const element = page.locator(selector);
            await element.waitFor({ state: 'visible' });
            await action(element);
        });
    }

    /**
     * Generate random string for test data
     * @param length - Length of random string
     * @returns Random string
     */
    static generateRandomString(length: number = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Log test step with timestamp
     * @param step - Test step description
     */
    static logStep(step: string) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] STEP: ${step}`);
    }
} 