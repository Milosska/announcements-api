# REST API дошки оголошень

REST API для дошки оголошень із JWT-автентифікацією та перевіркою прав користувача. Проєкт написано на Node.js і TypeScript і використовує Express 5, Prisma та PostgreSQL.

Анонімні користувачі можуть переглядати список і деталі оголошень. Для створення оголошення потрібен access token. Редагувати й видаляти оголошення може лише його автор.

## Технології

- Node.js і TypeScript
- Express 5
- Prisma 7 і PostgreSQL через `@prisma/adapter-pg`
- Zod для валідації запитів
- bcrypt для хешування паролів
- jsonwebtoken для access-токенів
- cookie-parser для refresh-токена
- Swagger UI та `@asteasolutions/zod-to-openapi`

## Встановлення та запуск

### 1. Встановити залежності

```bash
npm install
```

### 2. Налаштувати змінні середовища

Скопіюйте [`.env.example`](.env.example) у `.env`:

```bash
Copy-Item .env.example .env
```

Приклад вмісту:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/announcements
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=3000
```

`DATABASE_URL` і `JWT_SECRET` є обов'язковими. `PORT` необов'язковий і за замовчуванням дорівнює `3000`.

### 3. Застосувати міграції

```bash
npm run prisma:migrate
```

Для оновлення згенерованого Prisma Client після змін у `prisma/schema.prisma`:

```bash
npm run prisma:generate
```

### 4. Запустити сервер

Режим розробки з автоматичним перезапуском:

```bash
npm run dev
```

Запуск через `tsx`:

```bash
npm start
```

Після запуску API доступне за адресою `http://localhost:3000`, а Swagger UI — за `http://localhost:3000/api-docs`.

## Автентифікація

- Access token передається в заголовку `Authorization: Bearer <token>`.
- Refresh token зберігається в HttpOnly-cookie `refreshToken` та в базі даних.
- Refresh endpoint приймає token із cookie або поля `refreshToken` у JSON-тілі.
- При оновленні refresh token перезаписується для поточного користувача.
- Logout видаляє refresh token поточного користувача з бази даних.

## Маршрути

### Автентифікація

| Метод | Шлях             | Опис                          | Авторизація |
| ----- | ---------------- | ----------------------------- | ----------- |
| POST  | `/auth/register` | Створення користувача         | Ні          |
| POST  | `/auth/login`    | Вхід за username і password   | Ні          |
| POST  | `/auth/refresh`  | Оновлення пари токенів        | Ні          |
| GET   | `/auth/me`       | Дані поточного користувача    | Bearer      |
| POST  | `/auth/logout`   | Видалення refresh token сесії | Bearer      |

### Оголошення

| Метод  | Шлях                 | Опис                                     | Авторизація |
| ------ | -------------------- | ---------------------------------------- | ----------- |
| GET    | `/announcements`     | Список оголошень із пошуком і пагінацією | Ні          |
| GET    | `/announcements/:id` | Отримання оголошення за ID               | Ні          |
| POST   | `/announcements`     | Створення оголошення                     | Bearer      |
| PATCH  | `/announcements/:id` | Оновлення власного оголошення            | Bearer      |
| DELETE | `/announcements/:id` | Видалення власного оголошення            | Bearer      |

## Формати запитів

### Реєстрація

`POST /auth/register`

```json
{
  "username": "Johny_Not_Depp",
  "email": "john@example.com",
  "password": "myPassword_12345",
  "name": "John Doe"
}
```

| Поле       | Вимоги                           |
| ---------- | -------------------------------- |
| `username` | рядок, 3–30 символів, унікальний |
| `email`    | коректний email, унікальний      |
| `password` | рядок, мінімум 6 символів        |
| `name`     | рядок, 2–50 символів             |

### Вхід

`POST /auth/login`

```json
{
  "username": "Johny_Not_Depp",
  "password": "myPassword_12345"
}
```

### Оновлення токенів

`POST /auth/refresh`

Refresh token може передаватися через cookie або необов'язкове поле тіла:

```json
{
  "refreshToken": "refresh-token-from-cookie-or-login-response"
}
```

### Список оголошень

`GET /announcements`

| Параметр | Тип     | Значення за замовчуванням | Опис                                    |
| -------- | ------- | ------------------------- | --------------------------------------- |
| `search` | string  | —                         | Пошук за назвою без урахування регістру |
| `sort`   | enum    | `newest`                  | `newest` або `oldest`                   |
| `page`   | integer | `1`                       | Номер сторінки, більше 0                |
| `limit`  | integer | `10`                      | Кількість записів на сторінку, більше 0 |

Приклад:

```text
GET /announcements?search=desk&sort=newest&page=1&limit=10
```

### Створення оголошення

`POST /announcements`

```json
{
  "title": "Vintage wooden desk",
  "description": "A well-maintained wooden desk with two drawers.",
  "price": 4500,
  "category": "Furniture"
}
```

| Поле          | Вимоги                |
| ------------- | --------------------- |
| `title`       | рядок, 3–100 символів |
| `description` | рядок, 3–500 символів |
| `price`       | число більше 0        |
| `category`    | рядок, 3–20 символів  |

`PATCH /announcements/:id` приймає ті самі поля, але всі поля необов'язкові. Принаймні одне поле має бути передано.

## Відповіді та помилки

- Валідація тіла запиту: `422 Validation failed`
- Некоректний JSON: `400 Validation failed`
- Ресурс не знайдено: `404`
- Порушення прав доступу: `403 Access denied`
- Некоректні облікові дані або токен: `401`
- Порушення унікальності: `409`
- Внутрішня помилка сервера: `500`

Маршрут створення оголошення повертає об'єкт у полі `announcement`, а оновлення — у полі `newAnnouncement`.

## Структура проєкту

```text
announcements-api/
├── app.ts
├── prisma/
│   ├── schema.prisma
│   ├── client.ts
│   └── migrations/
├── generated/
│   └── prisma/
├── src/
│   ├── constants/
│   │   └── constants.ts
│   ├── controllers/
│   │   ├── announcementsControllers.ts
│   │   └── authController.ts
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   ├── index.ts
│   │   ├── validateBody.ts
│   │   ├── validateParams.ts
│   │   └── validateQuery.ts
│   ├── routes/
│   │   ├── announcementsRouter.ts
│   │   └── authRouter.ts
│   ├── services/
│   │   └── authService.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── validators/
│   │   ├── announcementsValidator.ts
│   │   ├── authValidator.ts
│   │   └── config.ts
│   └── openapi.ts
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

## Моделі даних

`User`

- `id`, `username`, `email`, `password`, `name`
- `createdAt`, `updatedAt`
- зв'язки: refresh token і оголошення

`RefreshToken`

- `id`, `token`, `expiresAt`, `createdAt`, `updatedAt`
- один активний запис на користувача

`Announcement`

- `id`, `title`, `description`, `price`, `category`
- `createdAt`, `updatedAt`
- зв'язок із автором оголошення

## Документація API

Swagger UI доступний за адресою:

```text
http://localhost:3000/api-docs
```

## Доступні npm-скрипти

| Команда                   | Опис                                     |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Запуск сервера з `tsx --watch`           |
| `npm start`               | Запуск сервера через `tsx app.ts`        |
| `npm run prisma:migrate`  | Створення й застосування Prisma міграцій |
| `npm run prisma:generate` | Генерація Prisma Client у `generated/`   |

## Ліцензія

ISC
