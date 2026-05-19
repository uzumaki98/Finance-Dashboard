-- Mock data: Bangalore software engineer, Feb–May 2026
-- Income: ~₹71,000 take-home/month (mid-level, 5 yrs exp)
-- Rent: ₹30,000/month (1BHK, Koramangala area)
-- Occasional freelance top-ups

-- ─── FEBRUARY 2026 ───────────────────────────────────────────────────────────

INSERT INTO transactions (occurred_on, description, amount_paise, category_id, notes) VALUES

-- Income
('2026-02-01', 'Salary - February',          7100000, (SELECT id FROM categories WHERE name='Income'),   'Monthly take-home after TDS'),
('2026-02-15', 'Freelance - API integration', 1500000, (SELECT id FROM categories WHERE name='Income'),   'Side project for startup'),

-- Rent
('2026-02-01', 'Rent - Koramangala 1BHK',   -3000000, (SELECT id FROM categories WHERE name='Rent'),     NULL),

-- Utilities
('2026-02-05', 'BESCOM electricity bill',     -250000, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-02-06', 'Airtel broadband',            -104900, (SELECT id FROM categories WHERE name='Utilities'), '200 Mbps plan'),
('2026-02-07', 'Mobile recharge - Jio',        -26600, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-02-10', 'Piped gas (Indane)',            -85000, (SELECT id FROM categories WHERE name='Utilities'), NULL),

-- Groceries
('2026-02-03', 'DMart - weekly groceries',    -185000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-02-10', 'DMart - weekly groceries',    -210000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-02-17', 'Zepto - quick grocery run',    -92000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-02-22', 'DMart - monthly restock',     -230000, (SELECT id FROM categories WHERE name='Groceries'), NULL),

-- Transport
('2026-02-04', 'Ola cab - office commute',     -35000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-02-08', 'Namma Metro monthly pass',    -130000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-02-12', 'Rapido bike taxi',             -18000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-02-18', 'Petrol - Honda Activa',        -72000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-02-25', 'Ola cab - airport drop',       -55000, (SELECT id FROM categories WHERE name='Transport'), NULL),

-- Dining
('2026-02-02', 'Swiggy - dinner',              -45000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-02-07', 'Truffles - weekend brunch',    -85000, (SELECT id FROM categories WHERE name='Dining'), 'Koramangala'),
('2026-02-09', 'Zomato - lunch',               -38000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-02-13', 'Chai Point - coffee/snacks',   -22000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-02-15', 'Meghana Foods - biryani night',-75000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-02-20', 'Swiggy - dinner',              -52000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-02-23', 'Social - friends hangout',    -120000, (SELECT id FROM categories WHERE name='Dining'), 'Split bill'),
('2026-02-27', 'Starbucks - work from cafe',   -58000, (SELECT id FROM categories WHERE name='Dining'), NULL),

-- Entertainment
('2026-02-08', 'PVR - movie (Dune 3)',         -55000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-02-14', 'BookMyShow - stand-up comedy', -80000, (SELECT id FROM categories WHERE name='Entertainment'), 'Valentine''s Day'),
('2026-02-21', 'Steam - game purchase',        -65000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-02-28', 'Netflix subscription',         -64900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),

-- Health
('2026-02-11', 'Cult.fit monthly membership', -199900, (SELECT id FROM categories WHERE name='Health'), NULL),
('2026-02-19', 'PharmEasy - vitamins/meds',    -45000, (SELECT id FROM categories WHERE name='Health'), NULL),

-- Shopping
('2026-02-06', 'Amazon - USB-C hub',          -185000, (SELECT id FROM categories WHERE name='Shopping'), 'Work from home setup'),
('2026-02-16', 'Myntra - casual shirts x2',   -160000, (SELECT id FROM categories WHERE name='Shopping'), NULL);

-- ─── MARCH 2026 ──────────────────────────────────────────────────────────────

INSERT INTO transactions (occurred_on, description, amount_paise, category_id, notes) VALUES

-- Income
('2026-03-01', 'Salary - March',             7100000, (SELECT id FROM categories WHERE name='Income'), 'Monthly take-home after TDS'),

-- Rent
('2026-03-01', 'Rent - Koramangala 1BHK',   -3000000, (SELECT id FROM categories WHERE name='Rent'), NULL),

-- Utilities
('2026-03-04', 'BESCOM electricity bill',     -280000, (SELECT id FROM categories WHERE name='Utilities'), 'Higher AC usage'),
('2026-03-05', 'Airtel broadband',            -104900, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-03-06', 'Mobile recharge - Jio',        -26600, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-03-09', 'Piped gas (Indane)',            -80000, (SELECT id FROM categories WHERE name='Utilities'), NULL),

-- Groceries
('2026-03-01', 'DMart - weekly groceries',    -195000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-03-08', 'Blinkit - quick order',        -75000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-03-15', 'DMart - weekly groceries',    -220000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-03-22', 'DMart - monthly restock',     -245000, (SELECT id FROM categories WHERE name='Groceries'), 'Holi stocking up'),
('2026-03-29', 'Zepto - quick run',            -68000, (SELECT id FROM categories WHERE name='Groceries'), NULL),

-- Transport
('2026-03-03', 'Namma Metro monthly pass',    -130000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-03-07', 'Petrol - Honda Activa',        -68000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-03-14', 'Ola cab - late night',         -42000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-03-20', 'Rapido bike taxi',             -15000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-03-28', 'Ola cab - airport pick up',    -60000, (SELECT id FROM categories WHERE name='Transport'), NULL),

-- Dining
('2026-03-03', 'Swiggy - dinner',              -55000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-03-07', 'Holi lunch - Punjabi Dhaba',  -110000, (SELECT id FROM categories WHERE name='Dining'), 'Holi celebration'),
('2026-03-10', 'Zomato - lunch',               -42000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-03-13', 'Starbucks',                    -55000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-03-18', 'Toit Brewpub - evening out',  -165000, (SELECT id FROM categories WHERE name='Dining'), 'Indiranagar'),
('2026-03-22', 'Swiggy - dinner',              -48000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-03-26', 'Chai Point',                   -18000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-03-30', 'Zomato - weekend brunch',      -95000, (SELECT id FROM categories WHERE name='Dining'), NULL),

-- Entertainment
('2026-03-08', 'Spotify Premium',              -11900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-03-15', 'PVR - Holi special movie',     -60000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-03-22', 'Xbox Game Pass',               -50000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-03-28', 'Netflix subscription',         -64900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-03-29', 'Laughter Factory - comedy show', -90000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),

-- Health
('2026-03-03', 'Cult.fit monthly membership', -199900, (SELECT id FROM categories WHERE name='Health'), NULL),
('2026-03-15', 'Apollo pharmacy - allergy meds', -35000, (SELECT id FROM categories WHERE name='Health'), 'Seasonal allergies'),

-- Shopping
('2026-03-05', 'Holi colors + pichkari',       -45000, (SELECT id FROM categories WHERE name='Shopping'), 'Festival purchase'),
('2026-03-12', 'Flipkart - laptop stand',      -145000, (SELECT id FROM categories WHERE name='Shopping'), NULL),
('2026-03-25', 'Nykaa - grooming products',    -85000, (SELECT id FROM categories WHERE name='Shopping'), NULL);

-- ─── APRIL 2026 ──────────────────────────────────────────────────────────────

INSERT INTO transactions (occurred_on, description, amount_paise, category_id, notes) VALUES

-- Income
('2026-04-01', 'Salary - April',             7100000, (SELECT id FROM categories WHERE name='Income'), 'Monthly take-home after TDS'),
('2026-04-20', 'Referral bonus - payout',    2000000, (SELECT id FROM categories WHERE name='Income'), 'Referred 2 candidates'),

-- Rent
('2026-04-01', 'Rent - Koramangala 1BHK',   -3000000, (SELECT id FROM categories WHERE name='Rent'), NULL),

-- Utilities
('2026-04-04', 'BESCOM electricity bill',     -320000, (SELECT id FROM categories WHERE name='Utilities'), 'Summer peak AC usage'),
('2026-04-05', 'Airtel broadband',            -104900, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-04-06', 'Mobile recharge - Jio',        -26600, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-04-08', 'Piped gas (Indane)',            -78000, (SELECT id FROM categories WHERE name='Utilities'), NULL),

-- Groceries
('2026-04-04', 'DMart - weekly groceries',    -200000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-04-11', 'Blinkit - quick order',        -88000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-04-18', 'DMart - weekly groceries',    -215000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-04-25', 'DMart - monthly restock',     -235000, (SELECT id FROM categories WHERE name='Groceries'), NULL),

-- Transport
('2026-04-02', 'Namma Metro monthly pass',    -130000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-04-08', 'Petrol - Honda Activa',        -71000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-04-16', 'Ola cab - late night office',  -48000, (SELECT id FROM categories WHERE name='Transport'), 'Product launch crunch'),
('2026-04-22', 'Rapido bike taxi',             -22000, (SELECT id FROM categories WHERE name='Transport'), NULL),

-- Dining
('2026-04-04', 'Swiggy - dinner',              -62000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-04-07', 'Ugadi lunch - hotel buffet',  -130000, (SELECT id FROM categories WHERE name='Dining'), 'Ugadi celebration'),
('2026-04-11', 'Zomato - lunch',               -45000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-04-14', 'Chai Point - coffee',          -24000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-04-17', 'CTR - masala dosa breakfast',  -35000, (SELECT id FROM categories WHERE name='Dining'), 'Malleswaram, classic BLR'),
('2026-04-20', 'Swiggy - team celebration dinner', -95000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-04-24', 'Arbor - craft beer evening',  -185000, (SELECT id FROM categories WHERE name='Dining'), 'Indiranagar'),
('2026-04-28', 'Zomato - dinner',              -55000, (SELECT id FROM categories WHERE name='Dining'), NULL),

-- Entertainment
('2026-04-06', 'PVR - summer blockbuster',     -65000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-04-12', 'Spotify Premium',              -11900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-04-18', 'BookMyShow - IPL fan park',    -75000, (SELECT id FROM categories WHERE name='Entertainment'), 'IPL season'),
('2026-04-30', 'Netflix subscription',         -64900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),

-- Health
('2026-04-02', 'Cult.fit monthly membership', -199900, (SELECT id FROM categories WHERE name='Health'), NULL),
('2026-04-10', 'Dermatologist consultation',   -80000, (SELECT id FROM categories WHERE name='Health'), 'Skin issue - summer heat'),
('2026-04-11', 'PharmEasy - prescription',     -55000, (SELECT id FROM categories WHERE name='Health'), NULL),

-- Shopping
('2026-04-05', 'Amazon - summer clothes',     -320000, (SELECT id FROM categories WHERE name='Shopping'), 'Linen shirts, shorts'),
('2026-04-19', 'Croma - portable fan',        -299900, (SELECT id FROM categories WHERE name='Shopping'), 'For bedroom, no AC port'),
('2026-04-26', 'Decathlon - running shoes',   -399900, (SELECT id FROM categories WHERE name='Shopping'), 'Started running routine');

-- ─── MAY 2026 ────────────────────────────────────────────────────────────────

INSERT INTO transactions (occurred_on, description, amount_paise, category_id, notes) VALUES

-- Income
('2026-05-01', 'Salary - May',               7100000, (SELECT id FROM categories WHERE name='Income'), 'Monthly take-home after TDS'),

-- Rent
('2026-05-01', 'Rent - Koramangala 1BHK',   -3000000, (SELECT id FROM categories WHERE name='Rent'), NULL),

-- Utilities
('2026-05-04', 'BESCOM electricity bill',     -295000, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-05-05', 'Airtel broadband',            -104900, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-05-06', 'Mobile recharge - Jio',        -26600, (SELECT id FROM categories WHERE name='Utilities'), NULL),
('2026-05-07', 'Piped gas (Indane)',            -82000, (SELECT id FROM categories WHERE name='Utilities'), NULL),

-- Groceries
('2026-05-03', 'DMart - weekly groceries',    -188000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-05-10', 'Zepto - quick order',          -72000, (SELECT id FROM categories WHERE name='Groceries'), NULL),
('2026-05-14', 'DMart - weekly groceries',    -205000, (SELECT id FROM categories WHERE name='Groceries'), NULL),

-- Transport
('2026-05-02', 'Namma Metro monthly pass',    -130000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-05-06', 'Petrol - Honda Activa',        -69000, (SELECT id FROM categories WHERE name='Transport'), NULL),
('2026-05-12', 'Ola cab - client visit',       -55000, (SELECT id FROM categories WHERE name='Transport'), NULL),

-- Dining
('2026-05-02', 'Swiggy - dinner',              -58000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-05-06', 'Onesta - pizza night',         -92000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-05-09', 'Zomato - lunch',               -44000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-05-13', 'Chai Point',                   -21000, (SELECT id FROM categories WHERE name='Dining'), NULL),
('2026-05-16', 'Swiggy - dinner',              -67000, (SELECT id FROM categories WHERE name='Dining'), NULL),

-- Entertainment
('2026-05-03', 'Spotify Premium',              -11900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-05-10', 'PVR - weekend movie',          -60000, (SELECT id FROM categories WHERE name='Entertainment'), NULL),
('2026-05-31', 'Netflix subscription',         -64900, (SELECT id FROM categories WHERE name='Entertainment'), NULL),

-- Health
('2026-05-02', 'Cult.fit monthly membership', -199900, (SELECT id FROM categories WHERE name='Health'), NULL),
('2026-05-08', 'PharmEasy - vitamins',         -38000, (SELECT id FROM categories WHERE name='Health'), NULL),

-- Shopping
('2026-05-07', 'Amazon - mechanical keyboard', -450000, (SELECT id FROM categories WHERE name='Shopping'), 'Keychron K2, WFH upgrade'),
('2026-05-11', 'Myntra - sports wear',         -185000, (SELECT id FROM categories WHERE name='Shopping'), 'Running gear');

-- ─── BUDGETS (May 2026) ───────────────────────────────────────────────────────
INSERT INTO budgets (category_id, month, amount_paise) VALUES
  ((SELECT id FROM categories WHERE name='Groceries'),     '2026-05-01', 800000),
  ((SELECT id FROM categories WHERE name='Rent'),          '2026-05-01', 3000000),
  ((SELECT id FROM categories WHERE name='Utilities'),     '2026-05-01', 600000),
  ((SELECT id FROM categories WHERE name='Transport'),     '2026-05-01', 350000),
  ((SELECT id FROM categories WHERE name='Dining'),        '2026-05-01', 400000),
  ((SELECT id FROM categories WHERE name='Entertainment'), '2026-05-01', 200000),
  ((SELECT id FROM categories WHERE name='Health'),        '2026-05-01', 300000),
  ((SELECT id FROM categories WHERE name='Shopping'),      '2026-05-01', 500000)
ON CONFLICT (category_id, month) DO UPDATE SET amount_paise = EXCLUDED.amount_paise;
