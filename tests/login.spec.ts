import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestData } from '../utils/TestData';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * Test suite for Sauce Demo Login functionality
 * Tests various login scenarios including valid and invalid credentials
 */
test.describe('Sauce Demo Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Setting up test environment');
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should successfully login with valid credentials @smoke @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting successful login test');
        
        // Perform login with valid credentials
        await loginPage.login(
            TestData.STANDARD_USER.username,
            TestData.STANDARD_USER.password
        );

        // Wait for successful login
        await loginPage.waitForSuccessfulLogin();

        // Verify successful login
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();

        // Verify URL contains inventory page
        await TestHelpers.assertUrlContains(page, '/inventory.html');

        TestHelpers.logStep('Login test completed successfully');
    });

    test('should display error message for invalid credentials @negative @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting invalid credentials test');
        
        // Perform login with invalid credentials
        await loginPage.login(
            TestData.INVALID_USER.username,
            TestData.INVALID_USER.password
        );

        // Verify error message is displayed
        const isErrorVisible = await loginPage.isErrorMessageVisible();
        expect(isErrorVisible).toBeTruthy();

        // Verify error message content
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(TestData.ERROR_MESSAGES.INVALID_CREDENTIALS);

        // Verify still on login page
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toContain('/');

        TestHelpers.logStep('Invalid credentials test completed');
    });

    test('should display error message for locked out user @negative @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting locked out user test');
        
        // Perform login with locked out user
        await loginPage.login(
            TestData.LOCKED_OUT_USER.username,
            TestData.LOCKED_OUT_USER.password
        );

        // Verify error message is displayed
        const isErrorVisible = await loginPage.isErrorMessageVisible();
        expect(isErrorVisible).toBeTruthy();

        // Verify error message content
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(TestData.ERROR_MESSAGES.LOCKED_OUT);

        // Verify still on login page
        const currentUrl = await loginPage.getCurrentUrl();
        expect(currentUrl).toContain('/');

        TestHelpers.logStep('Locked out user test completed');
    });

    test('should display error message for empty username @negative @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting empty username test');
        
        // Fill only password
        await loginPage.fillPassword(TestData.STANDARD_USER.password);
        await loginPage.clickLogin();

        // Verify error message is displayed
        const isErrorVisible = await loginPage.isErrorMessageVisible();
        expect(isErrorVisible).toBeTruthy();

        // Verify error message content
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(TestData.ERROR_MESSAGES.REQUIRED_USERNAME);

        TestHelpers.logStep('Empty username test completed');
    });

    test('should display error message for empty password @negative @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting empty password test');
        
        // Fill only username
        await loginPage.fillUsername(TestData.STANDARD_USER.username);
        await loginPage.clickLogin();

        // Verify error message is displayed
        const isErrorVisible = await loginPage.isErrorMessageVisible();
        expect(isErrorVisible).toBeTruthy();

        // Verify error message content
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(TestData.ERROR_MESSAGES.REQUIRED_PASSWORD);

        TestHelpers.logStep('Empty password test completed');
    });

    test('should verify login page elements are visible @ui @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting UI elements verification test');
        
        // Verify login page elements are visible
        await expect(loginPage.loginLogo).toBeVisible();
        await expect(loginPage.botImage).toBeVisible();
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();

        // Verify login button is enabled
        const isButtonEnabled = await loginPage.isLoginButtonEnabled();
        expect(isButtonEnabled).toBeTruthy();

        // Verify page title
        await expect(page).toHaveTitle(TestData.PAGE_TITLES.LOGIN);

        TestHelpers.logStep('UI elements verification test completed');
    });

    test('should handle login with performance glitch user @performance @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting performance glitch user test');
        
        // Perform login with performance glitch user
        await loginPage.login(
            TestData.PERFORMANCE_GLITCH_USER.username,
            TestData.PERFORMANCE_GLITCH_USER.password
        );

        // Wait for successful login with longer timeout
        await loginPage.waitForSuccessfulLogin();

        // Verify successful login
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();

        TestHelpers.logStep('Performance glitch user test completed');
    });

    test('should clear form fields when page is refreshed @ui @login', async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Starting form clear test');
        
        // Fill form fields
        await loginPage.fillUsername(TestData.STANDARD_USER.username);
        await loginPage.fillPassword(TestData.STANDARD_USER.password);

        // Verify fields are filled
        await expect(loginPage.usernameInput).toHaveValue(TestData.STANDARD_USER.username);
        await expect(loginPage.passwordInput).toHaveValue(TestData.STANDARD_USER.password);

        // Refresh page
        await page.reload();
        await loginPage.waitForPageLoad();

        // Verify fields are cleared
        await expect(loginPage.usernameInput).toHaveValue('');
        await expect(loginPage.passwordInput).toHaveValue('');

        TestHelpers.logStep('Form clear test completed');
    });
}); 