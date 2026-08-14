# RentNest Frontend - API Integration Map

## Authentication
- `POST /api/auth/register` ➔ `app/(auth)/register/page.tsx`
- `POST /api/auth/login` ➔ `app/(auth)/login/page.tsx`

## Public Properties
- `GET /api/properties` ➔ `app/(public)/page.tsx` & `app/(public)/properties/page.tsx`
- `GET /api/properties/:id` ➔ `app/(public)/properties/[id]/page.tsx`

## Tenant Actions
- `GET /api/rentals` ➔ `app/dashboard/tenant/page.tsx`
- `POST /api/rentals/request` ➔ `app/(public)/properties/[id]/page.tsx`
- `POST /api/payments/create` ➔ `app/dashboard/tenant/page.tsx`

## Landlord Actions
- `GET /api/landlord/properties` ➔ `app/dashboard/landlord/page.tsx`
- `POST /api/landlord/properties` ➔ `app/dashboard/landlord/properties/new/page.tsx`
- `PATCH /api/landlord/requests/:id` ➔ `app/dashboard/landlord/requests/page.tsx`

## Admin Moderation
- `GET /api/admin/users` ➔ `app/dashboard/admin/page.tsx`
- `PATCH /api/admin/users/:id` ➔ `app/dashboard/admin/page.tsx`