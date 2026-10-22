import { createResourceRoutes } from '@/lib/api/factory'
import { z } from 'zod'

const { GET, POST } = createResourceRoutes({
  tableName: 'quotes',
  createSchema: z.object({
    customer_id: z.string().uuid(),
    supplier_id: z.string().uuid().optional(),
    valid_from: z.string().datetime(),
    valid_until: z.string().datetime(),
    incoterm: z.enum(['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']).optional().default('FOB'),
    payment_terms: z.number().int().min(0).max(365).optional().default(30),
    currency: z.string().length(3).optional().default('USD'),
    exchange_rate: z.number().positive().optional().default(1),
    notes: z.string().optional(),
    terms: z.string().optional(),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unit: z.string(),
      unit_price: z.number().positive(),
      discount_percent: z.number().min(0).max(100).optional().default(0),
      discount_amount: z.number().min(0).optional().default(0),
      tax_percent: z.number().min(0).max(100).optional().default(0),
      tax_amount: z.number().min(0).optional().default(0),
      total_amount: z.number().positive(),
      commodity_code: z.string().optional(),
      weight: z.number().positive().optional(),
      volume: z.number().positive().optional(),
      origin: z.string().optional(),
      destination: z.string().optional(),
    })).min(1),
  }),
  updateSchema: z.object({
    customer_id: z.string().uuid().optional(),
    supplier_id: z.string().uuid().optional(),
    valid_from: z.string().datetime().optional(),
    valid_until: z.string().datetime().optional(),
    incoterm: z.enum(['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FAS', 'FOB', 'CFR', 'CIF']).optional(),
    payment_terms: z.number().int().min(0).max(365).optional(),
    currency: z.string().length(3).optional(),
    exchange_rate: z.number().positive().optional(),
    notes: z.string().optional(),
    terms: z.string().optional(),
    status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVISED', 'CONVERTED']).optional(),
  }),
})

export { GET, POST }