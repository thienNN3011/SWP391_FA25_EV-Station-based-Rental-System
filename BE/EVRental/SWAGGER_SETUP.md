# Swagger Setup - EVRental

## Truy cập

```
http://localhost:8080/EVRental/swagger-ui.html
```

## Authentication

1. Login tại **POST /auth/login**
2. Copy JWT token
3. Click **Authorize** 🔓
4. Nhập: `Bearer <token>`
5. Test endpoints

## API Groups

- Authentication
- User Management
- Station Management
- Vehicle Model Management
- Vehicle Management
- Tariff Management
- Booking Management
- Payment Management
- Incident Report Management
- System Configuration
- Health Check

## Setup

✅ SpringDoc OpenAPI 2.3.0
✅ JWT authentication support
✅ All controllers tagged
✅ Security configured

## Troubleshooting

**Swagger UI không hiển thị?**
- Check application started
- Verify path: `/EVRental/swagger-ui.html`

**401 Unauthorized?**
- Login first
- Click Authorize
- Enter: `Bearer <token>`

