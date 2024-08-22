const { test, expect } = require('@playwright/test');


test.describe('Login Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Загружаем страницу с формой авторизации
    await page.goto('http://localhost:3000');
  });

  test('Log in Test', async ({ page }) => {
    // Проверяем успешный ответ от сервера
    await page.route('/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'success' }),
      });
    });

    // Заполняем форму
    await page.locator('#username').fill('aqa');
    await page.locator('#password').fill('AQA123');

    // Отправляем форму
    await page.locator('button[type="submit"]').click();

    // Проверяем, что произошло перенаправление на /welcome
    await expect(page).toHaveURL('http://localhost:3000/welcome');
    await page.locator('.welcome-message').innerHTML() == "Вы авторизовались";

  });

  test('Log in Empty Form Test', async ({ page }) => {
    // Проверяем ответ от сервера с ошибкой
    await page.route('/api/login', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'error' }),
      });
    });

    // Проверяем, что значение полей пустое
    await page.locator('#username').inputValue() == "";
    await page.locator('#password').inputValue() == "";

    // Отправляем форму
    await page.locator('button[type="submit"]').click();

    // Проверяем, что перенаправление не произошло
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Log in Wrong User Test', async ({ page }) => {
    // Проверяем ответ от сервера с ошибкой
    await page.route('/api/login', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'error' }),
      });
    });

    // Заполняем форму
    await page.locator('#username').fill('AQA123');
    await page.locator('#password').fill('AQA123');

    // Отправляем форму
    await page.locator('button[type="submit"]').click();

    // Проверяем, что перенаправление не произошло
    await expect(page).toHaveURL('http://localhost:3000/');
    // Проверяем наличие ошибки
    await page.locator('#message').innerHTML() == "User not found";
  });

  test('Log in Wrong Password Test', async ({ page }) => {
    // Проверяем ответ от сервера с ошибкой
    await page.route('/api/login', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'error' }),
      });
    });

    // Заполняем форму
    await page.locator('#username').fill('aqa');
    await page.locator('#password').fill('123');

    // Отправляем форму
    await page.locator('button[type="submit"]').click();

    // Проверяем, что перенаправление не произошло
    await expect(page).toHaveURL('http://localhost:3000/');
    // Проверяем наличие ошибки
    await page.locator('#message').innerHTML() == "Incorrect password";
    
  });
})
