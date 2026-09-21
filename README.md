# Maintenance API

REST API на Express для учёта оборудования и заявок на техническое обслуживание. Данные хранятся в памяти процесса; доступ к ним изолирован репозиториями, поэтому хранилище можно заменить без изменения controllers.

## Технологии

Node.js, Express 5, dotenv, cors, helmet, Open-Meteo API и Postman.

## Требования и запуск

Требуется Node.js 20+ (используются встроенные `fetch` и `node:crypto`) и npm.

```bash
npm install
copy .env.example .env
npm start
```

Для разработки:

```bash
npm run dev
```

API по умолчанию доступен по `http://localhost:3000`. Проверка доступности:

```bash
curl http://localhost:3000/api/health
```

## Переменные окружения

| Переменная | Назначение | По умолчанию |
| --- | --- | --- |
| `PORT` | Порт HTTP-сервера | `3000` |
| `NODE_ENV` | Режим приложения | `development` |
| `CORS_ORIGINS` | Разрешённые browser origin через запятую | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Окно rate limit | `900000` |
| `RATE_LIMIT_MAX` | Число запросов в окне | `100` |
| `WEATHER_API_URL` | URL Open-Meteo forecast API | Open-Meteo |
| `REQUEST_TIMEOUT_MS` | Таймаут погодного API, мс | `5000` |
| `OUTDOOR_WORK_MAX_WIND_SPEED` | Максимальный ветер для наружных работ, м/с | `10` |
| `JSON_BODY_LIMIT` | Максимальный размер JSON body | `100kb` |
| `LOG_LEVEL` | Минимальный уровень логов | `info` |

`.env` не добавляется в Git; шаблон находится в `.env.example`.

## Модели

### Equipment

| Поле | Тип |
| --- | --- |
| `id` | UUID, создаётся сервером |
| `name` | Строка |
| `type` | Строка |
| `serialNumber` | Уникальная строка |
| `location` | Объект `{ lat, lon }` |
| `status` | `active`, `maintenance` или `inactive` |
| `installedAt` | ISO-дата |

### Maintenance request

| Поле | Тип |
| --- | --- |
| `id` | UUID, создаётся сервером |
| `equipmentId` | UUID существующего оборудования |
| `title` | Строка |
| `description` | Строка |
| `priority` | `low`, `medium` или `high` |
| `status` | `new`, `in_progress`, `done`, `rejected`; создаётся как `new` |
| `plannedAt` | ISO дата-время |
| `createdAt` | ISO дата-время, создаётся сервером |

Переходы статуса:

```text
new ──→ in_progress ──→ done
 │             │
 └──→ rejected ←┘
```

Из `done` и `rejected` переходы запрещены и возвращают `409`.

## Endpoints

| Метод | Путь | Назначение |
| --- | --- | --- |
| GET | `/api/health` | Health-check |
| GET | `/api/equipment` | Список оборудования |
| POST | `/api/equipment` | Создать оборудование |
| GET | `/api/equipment/:id` | Получить оборудование |
| PATCH | `/api/equipment/:id` | Изменить оборудование |
| DELETE | `/api/equipment/:id` | Удалить оборудование |
| GET | `/api/equipment/:id/requests` | Заявки оборудования |
| GET | `/api/equipment/:id/weather` | Прогноз и пригодность окна |
| GET | `/api/requests` | Список заявок |
| POST | `/api/requests` | Создать заявку |
| GET | `/api/requests/:id` | Получить заявку |
| PATCH | `/api/requests/:id` | Изменить заявку (без `status`) |
| PATCH | `/api/requests/:id/status` | Изменить статус заявки |
| DELETE | `/api/requests/:id` | Удалить заявку |

## Фильтрация, сортировка и пагинация

`GET /api/equipment` поддерживает `status`, `type`, `sort=name`, `page`, `limit`.

`GET /api/requests` поддерживает `status`, `priority`, `equipmentId`, `dateFrom`, `dateTo`, `sort=createdAt|priority|status|title`, `order=asc|desc`, `page`, `limit`.

Списки имеют формат:

```json
{
  "data": [],
  "meta": { "total": 0, "page": 1, "limit": 10 }
}
```

## Weather

`GET /api/equipment/:id/weather` получает координаты оборудования из repository, вызывает сервис Open-Meteo и возвращает прогноз и `outdoorWork.workWindows`.

Окно пригодно для наружных работ, если одновременно:

```text
осадки = 0
и
максимальный ветер < OUTDOOR_WORK_MAX_WIND_SPEED
```

По умолчанию порог — `10 м/с`. Ошибка внешнего API передаётся в central error handler, поэтому процесс сервера не завершается.

## Ошибки

Все ошибки имеют единый формат и содержат ID запроса:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [{ "field": "body.name", "message": "is required" }],
    "requestId": "b1f2c3d4-0000-4000-8000-000000000000"
  }
}
```

Примеры: `400 VALIDATION_ERROR` для невалидных входных данных, `404 NOT_FOUND` для неизвестного ресурса, `409 CONFLICT` для дублирующего серийного номера или недопустимого перехода, `413 PAYLOAD_TOO_LARGE` для body выше лимита.

## Безопасность и логирование

- CORS разрешает только точные origin из `CORS_ORIGINS`; `*` не используется.
- Helmet добавляет защитные HTTP-заголовки.
- JSON body ограничен `JSON_BODY_LIMIT`.
- Каждому запросу присваивается UUID: он доступен как `request.requestId`, возвращается в `X-Request-Id` и в JSON ошибки.
- В stdout/stderr пишутся JSON-логи уровней `debug`, `info`, `warn`, `error`. Запись запроса содержит method, path, status, duration и requestId.
- Cookie не используются.

## Примеры

```bash
curl -X POST http://localhost:3000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{"name":"Weather station","type":"sensor","serialNumber":"WS-001","location":{"lat":55.7558,"lon":37.6173},"status":"active","installedAt":"2025-01-15"}'

curl "http://localhost:3000/api/equipment?status=active&page=1&limit=10"
```

Полная экспортированная коллекция с `pm.test` находится в [docs/postman/maintenance-api.postman_collection.json](docs/postman/maintenance-api.postman_collection.json). Она сохраняет `equipmentId` и `requestId` между запросами.

## Структура проекта

```text
src/
  api/           # клиент внешнего Open-Meteo API
  config/        # переменные окружения
  controllers/   # HTTP-ответы
  errors/        # типизированные ошибки приложения
  middlewares/   # ID, логирование, validation, error handling
  repositories/  # доступ к хранилищу
  routes/        # HTTP-маршруты
  services/      # бизнес-логика
  utils/         # logger
  validators/    # схемы body, params и query
```

## Известные расхождения с PDF задания

Перед сдачей требуется закрыть следующие пункты: rate limit на `/api` с `429` и headers не подключён; удаление оборудования с открытой заявкой пока не запрещено. Также текущая валидация отличается от модели PDF: перечисления `Equipment`, `critical` для priority, ограничения длины, `installedAt` не в будущем, optional `plannedAt`, `updatedAt`, игнорирование неизвестных body-полей и `Location` для `201` ещё не приведены к требованиям. Поэтому соответствующие негативные Postman-тесты добавлены, но два теста на `429` и удаление с открытой заявкой до реализации будут падать.