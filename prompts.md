# LLM Prompt Record

This file records the prompts used to build this assignment, as requested.

## Prompt 1 — Project implementation

> Build an original OTP Based User Login web application from scratch. Use React with JavaScript and Vite for the frontend, Django REST Framework for the API, and PostgreSQL for production. Do not copy the referenced repository's source, UI, CSS, architecture, or database implementation.
>
> Required flow: collect email, first name, and last name during registration; generate and display a random six-digit numeric login code. On checkout, collect email, phone number, and shipping address. Debounce and validate the email, recognize a registered email in the background, show a six-digit OTP modal, allow invalid-code errors and “Continue as guest,” then display the verified user's name and save each checkout to the database. Guest checkouts must have no associated user. Include `database/schema.sql`, `README.md`, and this prompt record.

## Prompt 2 — Implementation quality

> Implement server-side input validation, CORS configuration, environment-based secrets and database configuration, secure random OTP generation, hashed OTP storage, a recognition endpoint that never exposes the OTP, useful loading/error/success states, responsive accessible UI, Django tests, and a production-oriented README. Keep the frontend, API, and database layers separate.
