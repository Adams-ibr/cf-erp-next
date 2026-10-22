import { createResourceRoutes } from '@/lib/api/factory'
import { z } from 'zod'

const { GET, POST } = createResourceRoutes({
  tableName: 'suppliers',
  createSchema: z.object({
    name: z.string().min(1),
    code: z.string().min(1),
    trade_name: z.string().optional(),
    type: z.enum(['COMPANY', 'INDIVIDUAL', 'AGENT', 'CARRIER', 'CUSTOMS_BROKER', 'WAREHOUSE', 'INSURANCE', 'BANK', 'GOVERNMENT', 'OTHER']).optional().default('COMPANY'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT', 'ON_HOLD', 'BLOCKED', 'ARCHIVED']).optional().default('ACTIVE'),
    tax_id: z.string().optional(),
    vat_number: z.string().optional(),
    registration_number: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    industry: z.string().optional(),
    currency: z.string().length(3).optional().default('USD'),
    payment_terms: z.number().int().min(0).max(365).optional().default(30),
    incoterm: z.enum(['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']).optional().default('FOB'),
    port_of_loading: z.string().optional(),
    port_of_discharge: z.string().optional(),
    risk_rating: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('LOW'),
    certifications: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  updateSchema: z.object({
    name: z.string().min(1).optional(),
    trade_name: z.string().optional(),
    type: z.enum(['COMPANY', 'INDIVIDUAL', 'AGENT', 'CARRIER', 'CUSTOMS_BROKER', 'WAREHOUSE', 'INSURANCE', 'BANK', 'GOVERNMENT', 'OTHER']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT', 'ON_HOLD', 'BLOCKED', 'ARCHIVED']).optional(),
    tax_id: z.string().optional(),
    vat_number: z.string().optional(),
    registration_number: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    industry: z.string().optional(),
    currency: z.string().length(3).optional(),
    payment_terms: z.number().int().min(0).max(365).optional(),
    incoterm: z.enum(['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']).optional(),
    port_of_loading: z.string().optional(),
    port_of_discharge: z.string().optional(),
    risk_rating: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    certifications: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
})

export { GET, POST }