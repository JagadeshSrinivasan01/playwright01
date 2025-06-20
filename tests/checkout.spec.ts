import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { TestData } from '../utils/TestData';
import { TestHelpers } from '../utils/TestHelpers';

/**
 * Test suite for Sauce Demo Complete Checkout Flow
 * Tests the entire checkout process from adding items to completing the order
 */

test.describe('Sauce Demo Complete Checkout Flow', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;
    let checkoutOverviewPage: CheckoutOverviewPage;
    let checkoutCompletePage: CheckoutCompletePage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        TestHelpers.logStep('Setting up test environment');
        
        // Initialize all page objects
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);

        // Login to the application
        await loginPage.goto();
        await loginPage.login(
            TestData.STANDARD_USER.username,
            TestData.STANDARD_USER.password
        );
        await loginPage.waitForSuccessfulLogin();
    });

    test('Complete checkout flow - Add items to cart, checkout, and complete order @smoke @checkout @e2e', async () => {
        TestHelpers.logStep('Starting complete checkout flow test');

        // Flow 1: Add items to cart and navigate to cart
        TestHelpers.logStep('Flow 1: Adding items to cart');
        
        // Wait for inventory page to load
        await inventoryPage.waitForPageLoad();
        
        // Add the specified items to cart
        await inventoryPage.addItemsToCart(TestData.CHECKOUT_ITEMS);
        
        // Verify cart badge shows correct count
        await inventoryPage.verifyCartItemCount(TestData.CHECKOUT_ITEMS.length);
        
        // Click cart button to navigate to cart page
        await inventoryPage.clickCartButton();

        // Flow 2: Validate cart items and proceed to checkout
        TestHelpers.logStep('Flow 2: Validating cart items');
        
        // Wait for cart page to load
        await cartPage.waitForPageLoad();
        
        // Verify we are on cart page
        const isOnCartPage = await cartPage.isOnCartPage();
        expect(isOnCartPage).toBeTruthy();
        
        // Verify the correct items are in cart
        await cartPage.verifyCartItems(TestData.CHECKOUT_ITEMS);
        
        // Verify cart item count
        await cartPage.verifyCartItemCount(TestData.CHECKOUT_ITEMS.length);
        
        // Click checkout button
        await cartPage.clickCheckoutButton();

        // Flow 3: Fill checkout information
        TestHelpers.logStep('Flow 3: Filling checkout information');
        
        // Wait for checkout page to load
        await checkoutPage.waitForPageLoad();
        
        // Verify we are on checkout page
        const isOnCheckoutPage = await checkoutPage.isOnCheckoutPage();
        expect(isOnCheckoutPage).toBeTruthy();
        
        // Verify form fields are visible
        await checkoutPage.verifyFormFieldsVisible();
        
        // Fill in checkout information
        await checkoutPage.completeCheckoutInformation(
            TestData.CHECKOUT_INFORMATION.firstName,
            TestData.CHECKOUT_INFORMATION.lastName,
            TestData.CHECKOUT_INFORMATION.postalCode
        );

        // Flow 4: Validate order items and complete checkout
        TestHelpers.logStep('Flow 4: Validating order items');
        
        // Wait for checkout overview page to load
        await checkoutOverviewPage.waitForPageLoad();
        
        // Verify we are on checkout overview page
        const isOnCheckoutOverviewPage = await checkoutOverviewPage.isOnCheckoutOverviewPage();
        expect(isOnCheckoutOverviewPage).toBeTruthy();
        
        // Verify the correct items are in the order
        await checkoutOverviewPage.verifyOrderItems(TestData.CHECKOUT_ITEMS);
        
        // Verify cart item count
        await checkoutOverviewPage.verifyCartItemCount(TestData.CHECKOUT_ITEMS.length);
        
        // Verify payment and shipping information is displayed
        await checkoutOverviewPage.verifyPaymentInformationVisible();
        await checkoutOverviewPage.verifyShippingInformationVisible();
        
        // Verify total calculation
        await checkoutOverviewPage.verifyTotalCalculation();
        
        // Click finish button
        await checkoutOverviewPage.clickFinishButton();

        // Flow 5: Validate checkout completion
        TestHelpers.logStep('Flow 5: Validating checkout completion');
        
        // Wait for checkout complete page to load
        await checkoutCompletePage.waitForPageLoad();
        
        // Verify we are on checkout complete page
        const isOnCheckoutCompletePage = await checkoutCompletePage.isOnCheckoutCompletePage();
        expect(isOnCheckoutCompletePage).toBeTruthy();
        
        // Verify completion page elements are visible
        await checkoutCompletePage.verifyCompletionPageElements();
        
        // Verify checkout completion message
        await checkoutCompletePage.verifyCheckoutCompletion();
        
        // Verify thank you message
        await checkoutCompletePage.verifyThankYouMessage();
        
        // Verify order dispatch message
        await checkoutCompletePage.verifyOrderDispatchMessage();
        
        // Click back home button
        await checkoutCompletePage.clickBackHomeButton();
        
        // Verify we are back on inventory page
        await inventoryPage.waitForPageLoad();
        const isBackOnInventoryPage = await inventoryPage.isOnInventoryPage();
        expect(isBackOnInventoryPage).toBeTruthy();

        TestHelpers.logStep('Complete checkout flow test finished successfully');
    });

    test('Verify individual checkout steps work correctly @checkout @unit', async () => {
        TestHelpers.logStep('Starting individual checkout steps verification');

        // Test adding items to cart
        TestHelpers.logStep('Testing add items to cart');
        await inventoryPage.waitForPageLoad();
        await inventoryPage.addBackpackToCart();
        await inventoryPage.verifyCartItemCount(1);
        
        await inventoryPage.addBikeLightToCart();
        await inventoryPage.verifyCartItemCount(2);
        
        await inventoryPage.addBoltTShirtToCart();
        await inventoryPage.verifyCartItemCount(3);

        // Test cart validation
        TestHelpers.logStep('Testing cart validation');
        await inventoryPage.clickCartButton();
        await cartPage.waitForPageLoad();
        await cartPage.verifyCartItems(TestData.CHECKOUT_ITEMS);
        await cartPage.verifyCartItemCount(3);

        // Test checkout information form
        TestHelpers.logStep('Testing checkout information form');
        await cartPage.clickCheckoutButton();
        await checkoutPage.waitForPageLoad();
        await checkoutPage.verifyFormFieldsVisible();
        
        // Test form field values
        await checkoutPage.fillCheckoutInformation(
            TestData.CHECKOUT_INFORMATION.firstName,
            TestData.CHECKOUT_INFORMATION.lastName,
            TestData.CHECKOUT_INFORMATION.postalCode
        );
        
        const formValues = await checkoutPage.getFormFieldValues();
        expect(formValues.firstName).toBe(TestData.CHECKOUT_INFORMATION.firstName);
        expect(formValues.lastName).toBe(TestData.CHECKOUT_INFORMATION.lastName);
        expect(formValues.postalCode).toBe(TestData.CHECKOUT_INFORMATION.postalCode);

        // Test checkout overview
        TestHelpers.logStep('Testing checkout overview');
        await checkoutPage.clickContinueButton();
        await checkoutOverviewPage.waitForPageLoad();
        await checkoutOverviewPage.verifyOrderItems(TestData.CHECKOUT_ITEMS);
        await checkoutOverviewPage.verifyCartItemCount(3);

        // Test checkout completion
        TestHelpers.logStep('Testing checkout completion');
        await checkoutOverviewPage.clickFinishButton();
        await checkoutCompletePage.waitForPageLoad();
        await checkoutCompletePage.verifyCheckoutCompletion();

        TestHelpers.logStep('Individual checkout steps verification completed');
    });

    test('Verify cart badge updates correctly when adding items @ui @checkout', async ({ page }) => {
        TestHelpers.logStep('Starting cart badge verification test');

        await inventoryPage.waitForPageLoad();

        // Verify cart badge is not visible initially
        const isBadgeVisibleInitially = await inventoryPage.isCartBadgeVisible();
        expect(isBadgeVisibleInitially).toBeFalsy();

        // Add first item
        await inventoryPage.addBackpackToCart();
        await inventoryPage.verifyCartItemCount(1);
        
        let isBadgeVisible = await inventoryPage.isCartBadgeVisible();
        expect(isBadgeVisible).toBeTruthy();

        // Add second item
        await inventoryPage.addBikeLightToCart();
        await inventoryPage.verifyCartItemCount(2);

        // Add third item
        await inventoryPage.addBoltTShirtToCart();
        await inventoryPage.verifyCartItemCount(3);

        // Navigate to cart and verify items
        await inventoryPage.clickCartButton();
        await cartPage.waitForPageLoad();
        await cartPage.verifyCartItems(TestData.CHECKOUT_ITEMS);

        TestHelpers.logStep('Cart badge verification test completed');
    });

    test('Verify checkout form validation @negative @checkout', async ({ page }) => {
        TestHelpers.logStep('Starting checkout form validation test');

        // Add items and navigate to checkout
        await inventoryPage.waitForPageLoad();
        await inventoryPage.addBackpackToCart();
        await inventoryPage.clickCartButton();
        await cartPage.waitForPageLoad();
        await cartPage.clickCheckoutButton();
        await checkoutPage.waitForPageLoad();

        // Test empty form submission
        await checkoutPage.clickContinueButton();
        
        // Verify error message is displayed
        const isErrorVisible = await checkoutPage.isErrorMessageVisible();
        expect(isErrorVisible).toBeTruthy();

        // Test partial form filling
        await checkoutPage.fillFirstName(TestData.CHECKOUT_INFORMATION.firstName);
        await checkoutPage.clickContinueButton();
        
        const isErrorVisible2 = await checkoutPage.isErrorMessageVisible();
        expect(isErrorVisible2).toBeTruthy();

        TestHelpers.logStep('Checkout form validation test completed');
    });
}); 