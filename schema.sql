-- Complete Forwardex Database Schema for Supabase
-- Run this entire block in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CORE TABLES
-- ============================================

-- Tenants (multi-tenancy)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  address JSONB,
  contact JSONB,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'USER',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  avatar_url TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS & SUPPLIERS
-- ============================================

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'COMPANY',
  status VARCHAR(50) DEFAULT 'ACTIVE',
  tax_id VARCHAR(100),
  vat_number VARCHAR(100),
  registration_number VARCHAR(100),
  website VARCHAR(255),
  industry VARCHAR(100),
  currency CHAR(3) DEFAULT 'USD',
  payment_terms INTEGER DEFAULT 30,
  incoterm VARCHAR(10) DEFAULT 'FOB',
  risk_rating VARCHAR(20) DEFAULT 'LOW',
  certifications TEXT[],
  notes TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  contact_persons JSONB DEFAULT '[]',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  trade_name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'COMPANY',
  status VARCHAR(50) DEFAULT 'ACTIVE',
  tax_id VARCHAR(100),
  vat_number VARCHAR(100),
  registration_number VARCHAR(100),
  website VARCHAR(255),
  industry VARCHAR(100),
  currency CHAR(3) DEFAULT 'USD',
  payment_terms INTEGER DEFAULT 30,
  incoterm VARCHAR(10) DEFAULT 'FOB',
  port_of_loading VARCHAR(100),
  port_of_discharge VARCHAR(100),
  risk_rating VARCHAR(20) DEFAULT 'LOW',
  certifications TEXT[],
  notes TEXT,
  billing_address JSONB,
  shipping_address JSONB,
  contact_persons JSONB DEFAULT '[]',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

-- ============================================
-- SHIPMENTS & LOGISTICS
-- ============================================

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'FCL',
  mode VARCHAR(50) DEFAULT 'SEA_FCL',
  direction VARCHAR(50) DEFAULT 'IMPORT',
  incoterm VARCHAR(10) DEFAULT 'FOB',
  currency CHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(10,6) DEFAULT 1,
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  carrier_id UUID REFERENCES suppliers(id),
  booking_id UUID,
  container_id UUID,
  vessel_id UUID,
  voyage_id UUID,
  origin VARCHAR(255),
  destination VARCHAR(255),
  pol VARCHAR(100),
  pod VARCHAR(100),
  final_destination VARCHAR(255),
  commodity VARCHAR(255),
  weight DECIMAL(12,3),
  volume DECIMAL(12,3),
  quantity INTEGER,
  unit VARCHAR(50),
  value DECIMAL(15,2),
  insurance_value DECIMAL(15,2),
  hazardous_class VARCHAR(50),
  un_number VARCHAR(50),
  imdg_class VARCHAR(50),
  packing_group VARCHAR(50),
  pickup_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  cutoff_date TIMESTAMPTZ,
  etd TIMESTAMPTZ,
  eta TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'BOOKED',
  notes TEXT,
  internal_notes TEXT,
  terms TEXT,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, reference)
);

-- Containers
CREATE TABLE IF NOT EXISTS containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  container_number VARCHAR(50) NOT NULL,
  type VARCHAR(50) DEFAULT '20GP',
  size VARCHAR(20),
  owner_type VARCHAR(20) DEFAULT 'SHIPPER_OWNED',
  tare_weight DECIMAL(10,3),
  max_payload DECIMAL(10,3),
  capacity DECIMAL(10,3),
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  current_location VARCHAR(255),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, container_number)
);

-- Vessels
CREATE TABLE IF NOT EXISTS vessels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  imo_number VARCHAR(20),
  call_sign VARCHAR(20),
  flag VARCHAR(100),
  vessel_type VARCHAR(50),
  capacity_teu INTEGER,
  operator VARCHAR(255),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voyages
CREATE TABLE IF NOT EXISTS voyages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voyage_number VARCHAR(100) NOT NULL,
  vessel_id UUID REFERENCES vessels(id),
  service VARCHAR(100),
  rotation VARCHAR(100),
  etd TIMESTAMPTZ,
  eta TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'SCHEDULED',
  pol VARCHAR(100),
  pod VARCHAR(100),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, voyage_number)
);

-- ============================================
-- FINANCIAL
-- ============================================

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'SALES',
  status VARCHAR(50) DEFAULT 'DRAFT',
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  shipment_id UUID REFERENCES shipments(id),
  job_id UUID,
  booking_id UUID,
  currency CHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(10,6) DEFAULT 1,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  paid_amount DECIMAL(15,2) DEFAULT 0,
  balance_amount DECIMAL(15,2) DEFAULT 0,
  due_date TIMESTAMPTZ NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL,
  billing_address JSONB,
  shipping_address JSONB,
  terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  items JSONB DEFAULT '[]',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, invoice_number)
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT',
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  incoterm VARCHAR(10) DEFAULT 'FOB',
  payment_terms INTEGER DEFAULT 30,
  currency CHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(10,6) DEFAULT 1,
  total_amount DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  items JSONB DEFAULT '[]',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, quote_number)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  invoice_id UUID REFERENCES invoices(id),
  customer_id UUID REFERENCES customers(id),
  supplier_id UUID REFERENCES suppliers(id),
  amount DECIMAL(15,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  exchange_rate DECIMAL(10,6) DEFAULT 1,
  payment_method VARCHAR(50),
  payment_date TIMESTAMPTZ,
  reference VARCHAR(255),
  notes TEXT,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, payment_number)
);

-- ============================================
-- WAREHOUSE & INVENTORY
-- ============================================

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address JSONB,
  contact JSONB,
  capacity_sqm DECIMAL(12,2),
  capacity_cbm DECIMAL(12,2),
  features TEXT[],
  status VARCHAR(50) DEFAULT 'ACTIVE',
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

-- Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit VARCHAR(50),
  weight DECIMAL(10,3),
  volume DECIMAL(10,3),
  value DECIMAL(15,2),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, sku)
);

-- Stock Levels
CREATE TABLE IF NOT EXISTS stock_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  item_id UUID NOT NULL REFERENCES inventory_items(id),
  quantity_on_hand DECIMAL(12,3) DEFAULT 0,
  quantity_allocated DECIMAL(12,3) DEFAULT 0,
  quantity_available DECIMAL(12,3) DEFAULT 0,
  reorder_level DECIMAL(12,3) DEFAULT 0,
  reorder_quantity DECIMAL(12,3) DEFAULT 0,
  last_counted_at TIMESTAMPTZ,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(warehouse_id, item_id)
);

-- ============================================
-- TRACKING & DOCUMENTS
-- ============================================

-- Tracking Events
CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id),
  event_type VARCHAR(100) NOT NULL,
  event_description TEXT,
  location VARCHAR(255),
  event_date TIMESTAMPTZ NOT NULL,
  source VARCHAR(50),
  raw_data JSONB,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_number VARCHAR(100),
  document_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  file_url TEXT,
  file_name VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id UUID,
  status VARCHAR(50) DEFAULT 'DRAFT',
  tags TEXT[],
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT & ACTIVITY
-- ============================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  description TEXT,
  metadata JSONB,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON suppliers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_suppliers_type ON suppliers(tenant_id, type);
CREATE INDEX IF NOT EXISTS idx_shipments_tenant_id ON shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_customer ON shipments(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_shipments_etd ON shipments(tenant_id, etd);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(tenant_id, due_date);
CREATE INDEX IF NOT EXISTS idx_quotes_tenant_id ON quotes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer ON quotes(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tracking_shipment ON tracking_events(shipment_id, event_date);
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_logs(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activity_tenant ON activity_feed(tenant_id, created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE voyages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SEED DATA
-- ============================================

-- Default tenant
INSERT INTO tenants (id, name, code, created_at, updated_at)
VALUES (gen_random_uuid(), 'Forwardex', 'FWD', NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Admin user (CHANGE EMAIL AND PASSWORD)
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  role,
  tenant_id,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  'admin@forwardex.com',        -- CHANGE THIS
  crypt('your-secure-password', gen_salt('bf')),  -- CHANGE THIS
  'Admin',
  'User',
  'ADMIN',
  t.id,
  NOW(),
  NOW()
FROM tenants t WHERE t.code = 'FWD'
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = 'ADMIN',
  tenant_id = EXCLUDED.tenant_id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();

-- Sample customers (using JSONB for contact info)
INSERT INTO customers (code, name, trade_name, email, phone, status, tenant_id, created_by)
SELECT 'CUST-001', 'Acme Corporation', 'Acme Corp', 
       jsonb_build_object('email', 'contact@acme.com', 'phone', '+1-555-0100'),
       jsonb_build_object('phone', '+1-555-0100'),
       'ACTIVE', t.id, u.id
FROM tenants t, users u WHERE t.code = 'FWD' AND u.email = 'admin@forwardex.com'
ON CONFLICT (tenant_id, code) DO NOTHING;

INSERT INTO customers (code, name, trade_name, billing_address, shipping_address, status, tenant_id, created_by)
SELECT 'CUST-002', 'Global Logistics Inc', 'Global Logistics',
       jsonb_build_object('email', 'info@globallogistics.com', 'phone', '+1-555-0200'),
       jsonb_build_object('email', 'info@globallogistics.com', 'phone', '+1-555-0200'),
       'ACTIVE', t.id, u.id
FROM tenants t, users u WHERE t.code = 'FWD' AND u.email = 'admin@forwardex.com'
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Sample suppliers
INSERT INTO suppliers (code, name, trade_name, type, email, phone, status, tenant_id, created_by)
SELECT 'SUP-001', 'Maersk Line', 'Maersk', 'CARRIER',
       jsonb_build_object('email', 'bookings@maersk.com', 'phone', '+45-33-63-33-63'),
       jsonb_build_object('phone', '+45-33-63-33-63'),
       'ACTIVE', t.id, u.id
FROM tenants t, users u WHERE t.code = 'FWD' AND u.email = 'admin@forwardex.com'
ON CONFLICT (tenant_id, code) DO NOTHING;

INSERT INTO suppliers (code, name, trade_name, type, billing_address, shipping_address, status, tenant_id, created_by)
SELECT 'SUP-002', 'Kuehne + Nagel', 'K+N', 'AGENT',
       jsonb_build_object('email', 'info@kuehne-nagel.com', 'phone', '+41-44-786-95-11'),
       jsonb_build_object('email', 'info@kuehne-nagel.com', 'phone', '+41-44-786-95-11'),
       'ACTIVE', t.id, u.id
FROM tenants t, users u WHERE t.code = 'FWD' AND u.email = 'admin@forwardex.com'
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Verify
SELECT 'tenants' as table_name, count(*) FROM tenants
UNION ALL SELECT 'users', count(*) FROM users
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'suppliers', count(*) FROM suppliers
UNION ALL SELECT 'shipments', count(*) FROM shipments
UNION ALL SELECT 'invoices', count(*) FROM invoices
UNION ALL SELECT 'quotes', count(*) FROM quotes;

-- Show admin user
SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.tenant_id, t.name as tenant_name
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'admin@forwardex.com';