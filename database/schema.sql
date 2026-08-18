
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    otp_code VARCHAR(256) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE checkout_orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX checkout_orders_user_id_idx ON checkout_orders(user_id);
CREATE INDEX checkout_orders_email_idx ON checkout_orders(email);
