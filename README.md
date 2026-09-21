# Maintenance API

REST API на Express для учёта оборудования и заявок на обслуживание. Данные хранятся в памяти процесса и доступны только через repository layer.

## Технологии и требования

Node.js 20+, npm, Express 5, Open-Meteo, dotenv, cors, helmet, express-rate-limit и Postman.

```bash
npm install
copy .env.example .env
npm start
# или npm run dev
```

Сервер по умолчанию: `http://localhost:3000`. Проверка: `GET /api/health`.

## Переменные окружения

| Переменная | Назначение | Значение по умолчанию |
| --- | --- | --- |
| `PORT` | HTTP-порт | `3000` |
| `NODE_ENV` | Режим приложения | `development` |
| `CORS_ORIGINS` | Разрешённые origin через запятую | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Окно rate limit | `900000` |
| `RATE_LIMIT_MAX` | Лимит запросов к `/api` | `100` |
| `WEATHER_API_URL` | Open-Meteo forecast URL | Open-Meteo URL |
| `REQUEST_TIMEOUT_MS` | Таймаут weather API | `5000` |
| `OUTDOOR_WORK_MAX_WIND_SPEED` | Порог ветра, м/с | `10` |
| `JSON_BODY_LIMIT` | Лимит JSON body | `100kb` |
| `LOG_LEVEL` | Уровень логирования | `info` |

`.env` исключён из Git; используйте `.env.example`.

## Модели

### Equipment

| Поле | Правило |
| --- | --- |
| `id` | UUID, генерируется сервером |
| `name` | Строка 3–100 символов |
| `type` | `turbine`, `inverter`, `sensor`, `substation` |
| `serialNumber` | Уникальная непустая строка |
| `location` | `{ lat: -90..90, lon: -180..180 }` |
| `status` | `operational`, `maintenance`, `fault`, `decommissioned` |
| `installedAt` | ISO-дата, не в будущем |

### Maintenance request

| Поле | Правило |
| --- | --- |
| `id` | UUID, генерируется сервером |
| `equipmentId` | UUID существующего equipment |
| `title` | Строка 5–120 символов |
| `description` | Необязательная строка до 2000 символов |
| `priority` | `low`, `medium`, `high`, `critical` |
| `status` | `new`, `in_progress`, `done`, `rejected`; по умолчанию `new` |
| `plannedAt` | Необязательная ISO дата-время |
| `createdAt`, `updatedAt` | Проставляются сервером |

Неизвестные и служебные поля body (`id`, даты, `status` при обычном PATCH) отбрасываются до service layer.

## Статусы заявок

```text
new ──→ in_progress ──→ done
 │             │
 └──→ rejected ←┘
```

Из `done` и `rejected` переходы запрещены. Недопустимый переход возвращает `409`.

## Endpoints

| Метод | Endpoint | Назначение |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET / POST | `/api/equipment` | Список / создание equipment |
| GET / PATCH / DELETE | `/api/equipment/:id` | Карточка / обновление / удаление |
| GET | `/api/equipment/:id/requests` | Заявки equipment |
| GET | `/api/equipment/:id/weather` | Прогноз и пригодность окна |
| GET / POST | `/api/requests` | Список / создание заявок |
| GET / PATCH / DELETE | `/api/requests/:id` | Карточка / редактирование / удаление |
| PATCH | `/api/requests/:id/status` | Проверяемая смена статуса |

`POST` возвращает `201` и `Location`. Удаление equipment с заявкой в статусе `new` или `in_progress` запрещено (`409`).

## Фильтрация, сортировка, пагинация

Equipment: `status`, `type`, `sort=name`, `page`, `limit`.

Requests: `status`, `priority`, `equipmentId`, `dateFrom`, `dateTo`, `sort=createdAt|priority|status|title`, `order=asc|desc`, `page`, `limit`.

Все списки возвращают:

```json
{ "data": [], "meta": { "total": 0, "page": 1, "limit": 10 } }
```

## Weather

Weather service получает `lat/lon` equipment через repository и использует переиспользованный Open-Meteo client из Кейса 1. Окно пригодно для наружных работ, если `precipitation === 0` и `windSpeed < OUTDOOR_WORK_MAX_WIND_SPEED`. Ошибка или timeout внешнего API возвращает `502 EXTERNAL_SERVICE_ERROR`, не останавливая сервер.

## Ошибки

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [{ "field": "body.name", "message": "must contain between 3 and 100 characters" }],
    "requestId": "uuid"
  }
}
```

Используются `400 VALIDATION_ERROR`, `404 NOT_FOUND`, `409 CONFLICT`, `413 PAYLOAD_TOO_LARGE`, `429 RATE_LIMIT_EXCEEDED` и `502 EXTERNAL_SERVICE_ERROR`. Stack trace клиенту не отдаётся.

## Безопасность и логирование

- CORS: точный список origin из `CORS_ORIGINS`, без `*`; разрешены GET, POST, PATCH, DELETE и OPTIONS.
- Rate limit действует на `/api`, возвращает `429`, стандартные `RateLimit` headers и request ID.
- Helmet добавляет защитные HTTP headers; JSON body ограничен.
- Cookie не используются.
- `request.requestId` и `X-Request-Id` позволяют сопоставить клиентский ответ с JSON-логом.
- Логи имеют уровни `debug`, `info`, `warn`, `error`; запросы содержат method, path, status, duration и requestId.

## Примеры

```bash
curl -X POST http://localhost:3000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{"name":"Weather station","type":"sensor","serialNumber":"WS-001","location":{"lat":55.7558,"lon":37.6173},"status":"operational","installedAt":"2025-01-15"}'

curl "http://localhost:3000/api/equipment?status=operational&page=1&limit=10"
```

Полная коллекция с `pm.test` и передачей `equipmentId`/`requestId`: [docs/postman/maintenance-api.postman_collection.json](docs/postman/maintenance-api.postman_collection.json).

## Структура

```text
src/
  api/           # Open-Meteo client
  config/        # env configuration
  controllers/   # HTTP layer
  errors/        # typed application errors
  middlewares/   # security, IDs, logging, validation, error handling
  repositories/  # data access
  routes/        # endpoints
  services/      # business rules
  utils/         # logger
  validators/    # body, params and query schemas
```