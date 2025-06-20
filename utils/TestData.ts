/**
 * Test Data Configuration
 * Centralized place for all test data and credentials
 */
export class TestData {
    // Base URL
    static readonly BASE_URL = 'https://www.saucedemo.com';

    // Valid User Credentials
    static readonly STANDARD_USER = {
        username: 'standard_user',
        password: 'secret_sauce'
    };

    // Invalid User Credentials for negative testing
    static readonly INVALID_USER = {
        username: 'invalid_user',
        password: 'invalid_password'
    };

    static readonly LOCKED_OUT_USER = {
        username: 'locked_out_user',
        password: 'secret_sauce'
    };

    static readonly PROBLEM_USER = {
        username: 'problem_user',
        password: 'secret_sauce'
    };

    static readonly PERFORMANCE_GLITCH_USER = {
        username: 'performance_glitch_user',
        password: 'secret_sauce'
    };

    // Checkout Flow Data
    static readonly CHECKOUT_ITEMS = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
    ];

    static readonly CHECKOUT_INFORMATION = {
        firstName: 'demo',
        lastName: 'user',
        postalCode: '12345'
    };

    // Product Information
    static readonly PRODUCTS = {
        SAUCE_LABS_BACKPACK: {
            name: 'Sauce Labs Backpack',
            price: '$29.99',
            description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
        },
        SAUCE_LABS_BIKE_LIGHT: {
            name: 'Sauce Labs Bike Light',
            price: '$9.99',
            description: 'A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.'
        },
        SAUCE_LABS_BOLT_T_SHIRT: {
            name: 'Sauce Labs Bolt T-Shirt',
            price: '$15.99',
            description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.'
        }
    };

    // Test Configuration
    static readonly TIMEOUTS = {
        DEFAULT: 30000,
        SHORT: 5000,
        LONG: 60000
    };

    // Error Messages
    static readonly ERROR_MESSAGES = {
        LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
        INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
        REQUIRED_USERNAME: 'Epic sadface: Username is required',
        REQUIRED_PASSWORD: 'Epic sadface: Password is required',
        REQUIRED_FIRST_NAME: 'Error: First Name is required',
        REQUIRED_LAST_NAME: 'Error: Last Name is required',
        REQUIRED_POSTAL_CODE: 'Error: Postal Code is required'
    };

    // Page Titles
    static readonly PAGE_TITLES = {
        LOGIN: 'Swag Labs',
        INVENTORY: 'Swag Labs',
        CART: 'Swag Labs',
        CHECKOUT: 'Swag Labs',
        CHECKOUT_OVERVIEW: 'Swag Labs',
        CHECKOUT_COMPLETE: 'Swag Labs'
    };

    // Success Messages
    static readonly SUCCESS_MESSAGES = {
        ORDER_COMPLETE: 'Thank you for your order!',
        ORDER_DISPATCHED: 'Your order has been dispatched'
    };
} 