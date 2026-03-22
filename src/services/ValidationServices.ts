// ============================================================================
// SPA RESERVATION SYSTEM - ZOD VALIDATION SCHEMAS
// Matches Database Schema & Types Exactly
// ============================================================================

import { z } from "zod"

// ============================================================================
// USER VALIDATION SCHEMAS
// ============================================================================

export const UserSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be 2+ characters")
    .max(50, "First name must be 50 characters or less"),
  
  middleName: z.string()
    .min(2, "Middle name must be 2+ characters")
    .max(50, "Middle name must be 50 characters or less")
    .optional(),
  
  lastName: z.string()
    .min(2, "Last name must be 2+ characters")
    .max(50, "Last name must be 50 characters or less"),
  
  emailAdd: z.string()
    .email("Invalid email address"),
  
  phoneNum: z.string()
    .min(10, "Phone number must be 10+ digits")
    .max(20, "Phone number must be 20 digits or less")
    .optional(),
  
  password: z.string()
    .min(8, "Password must be 8+ characters")
    .max(100, "Password must be 100 characters or less"),
  
  role: z.enum(['member', 'vip', 'admin', 'staff'])
    .default('member'),
})

// Sign-up specific schema (with confirm password)
export const SignUpSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be 2+ characters")
    .max(50, "First name must be 50 characters or less"),
  
  middleName: z.string()
    .min(2, "Middle name must be 2+ characters")
    .max(50, "Middle name must be 50 characters or less")
    .optional(),
  
  lastName: z.string()
    .min(2, "Last name must be 2+ characters")
    .max(50, "Last name must be 50 characters or less"),
  
  emailAdd: z.string()
    .email("Invalid email address"),
  
  phoneNum: z.string()
    .min(10, "Phone number must be 10+ digits")
    .max(20, "Phone number must be 20 digits or less")
    .optional(),
  
  password: z.string()
    .min(8, "Password must be 8+ characters")
    .max(100, "Password must be 100 characters or less"),
  
  confirmPassword: z.string()
    .min(8, "Confirm password must be 8+ characters"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Login schema (minimal)
export const LoginSchema = z.object({
  emailAdd: z.string()
    .email("Invalid email address"),
  
  password: z.string()
    .min(1, "Password is required"),
})

// Update profile schema (optional fields)
export const UpdateProfileSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be 2+ characters")
    .optional(),
  
  middleName: z.string()
    .min(2, "Middle name must be 2+ characters")
    .optional(),
  
  lastName: z.string()
    .min(2, "Last name must be 2+ characters")
    .optional(),
  
  phoneNum: z.string()
    .min(10, "Phone number must be 10+ digits")
    .optional(),
  
  password: z.string()
    .min(8, "Password must be 8+ characters")
    .optional(),
})

// Type inference
export type SignUpFormData = z.infer<typeof SignUpSchema>
export type LoginFormData = z.infer<typeof LoginSchema>
export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>

// ============================================================================
// SERVICE VALIDATION SCHEMAS
// ============================================================================

export const ServiceSchema = z.object({
  name: z.string()
    .min(5, "Service name must be 5+ characters")
    .max(100, "Service name must be 100 characters or less"),
  
  category: z.enum(
    ['massage', 'spa', 'facial', 'body_wrap', 'nail_care', 'aromatherapy', 'bundle']
  ),
  
  price: z.number()
    .positive("Price must be greater than 0")
    .max(999999.99, "Price is too high"),
  
  description: z.string()
    .min(10, "Description must be 10+ characters")
    .max(500, "Description must be 500 characters or less"),
})

// Service creation (no ID, no timestamps)
export const ServiceCreateSchema = ServiceSchema

// Service update (all fields optional)
export const ServiceUpdateSchema = ServiceSchema.partial()

// Type inference
export type ServiceFormData = z.infer<typeof ServiceSchema>
export type ServiceCreateFormData = z.infer<typeof ServiceCreateSchema>
export type ServiceUpdateFormData = z.infer<typeof ServiceUpdateSchema>

// ============================================================================
// ROOM VALIDATION SCHEMAS
// ============================================================================

export const RoomSchema = z.object({
  name: z.string()
    .min(3, "Room name must be 3+ characters")
    .max(50, "Room name must be 50 characters or less"),
  
  assignedId: z.string()
    .uuid("Invalid staff ID")
    .optional(),
  
  isAvailable: z.enum(
    ['available', 'cleaning', 'closed', 'reserved', 'maintenance']
  ),
})

// Room creation
export const RoomCreateSchema = RoomSchema

// Room update (all fields optional)
export const RoomUpdateSchema = RoomSchema.partial()

// Type inference
export type RoomFormData = z.infer<typeof RoomSchema>
export type RoomCreateFormData = z.infer<typeof RoomCreateSchema>
export type RoomUpdateFormData = z.infer<typeof RoomUpdateSchema>

// ============================================================================
// ORDER VALIDATION SCHEMAS
// ============================================================================

export const OrderItemSchema = z.object({
  serviceId: z.string()
    .uuid("Invalid service ID"),
  
  quantity: z.number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0")
    .default(1),
})

export const OrderSchema = z.object({
  orderName: z.string()
    .min(1, "Order name is required")
    .max(100, "Order name must be 100 characters or less"),
  
  clientId: z.string()
    .uuid("Invalid client ID"),
  
  staffId: z.string()
    .uuid("Invalid staff ID")
    .optional(),
  
  roomId: z.string()
    .uuid("Invalid room ID")
    .optional(),
  
  items: z.array(OrderItemSchema)
    .min(1, "Order must have at least one service"),
})

// Order creation
export const OrderCreateSchema = OrderSchema

// Order update (only status)
export const OrderUpdateSchema = z.object({
  orderStatus: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
})

// Type inference
export type OrderFormData = z.infer<typeof OrderSchema>
export type OrderItemFormData = z.infer<typeof OrderItemSchema>
export type OrderCreateFormData = z.infer<typeof OrderCreateSchema>
export type OrderUpdateFormData = z.infer<typeof OrderUpdateSchema>

// ============================================================================
// RESERVATION VALIDATION SCHEMAS
// ============================================================================

export const ReservationSchema = z.object({
  name: z.string()
    .min(5, "Reservation name must be 5+ characters")
    .max(100, "Reservation name must be 100 characters or less"),
  
  clientId: z.string()
    .uuid("Invalid client ID"),
  
  roomId: z.string()
    .uuid("Invalid room ID"),
  
  staffId: z.string()
    .uuid("Invalid staff ID")
    .optional(),
  
  reservationTime: z.string()
    .datetime("Invalid date/time format"),
})

// Reservation creation
export const ReservationCreateSchema = ReservationSchema

// Reservation update (all fields optional)
export const ReservationUpdateSchema = ReservationSchema.partial()

// Type inference
export type ReservationFormData = z.infer<typeof ReservationSchema>
export type ReservationCreateFormData = z.infer<typeof ReservationCreateSchema>
export type ReservationUpdateFormData = z.infer<typeof ReservationUpdateSchema>

// ============================================================================
// PAYMENT VALIDATION SCHEMAS
// ============================================================================

export const PaymentSchema = z.object({
  orderId: z.string()
    .uuid("Invalid order ID"),
  
  clientId: z.string()
    .uuid("Invalid client ID"),
  
  amount: z.number()
    .positive("Amount must be greater than 0")
    .max(999999.99, "Amount is too high"),
  
  paymentMethod: z.enum(
    ['credit_card', 'debit_card', 'cash', 'bank_transfer', 'gcash', 'paypal']
  ),
  
  transactionId: z.string()
    .max(100, "Transaction ID must be 100 characters or less")
    .optional(),
  
  referenceNumber: z.string()
    .min(1, "Reference number is required")
    .max(50, "Reference number must be 50 characters or less"),
  
  notes: z.string()
    .max(500, "Notes must be 500 characters or less")
    .optional(),
})

// Payment creation
export const PaymentCreateSchema = PaymentSchema

// Payment status update
export const PaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']),
  notes: z.string().optional(),
})

// Type inference
export type PaymentFormData = z.infer<typeof PaymentSchema>
export type PaymentCreateFormData = z.infer<typeof PaymentCreateSchema>
export type PaymentStatusFormData = z.infer<typeof PaymentStatusSchema>

// ============================================================================
// UTILITY VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates form data against a Zod schema
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns { valid, errors }
 */
export function validateForm(
  schema: z.ZodSchema,
  data: unknown
): { valid: boolean; errors: Record<string, string> } {
  try {
    const result = schema.safeParse(data)

    if (!result.success) {
      const errors: Record<string, string> = {}
      
      // Handle different Zod error formats
      if (result.error && result.error.issues) {
        result.error.issues.forEach((issue: any) => {
          const path = issue.path.join('.')
          errors[path] = issue.message
        })
      }
      
      return { valid: false, errors }
    }

    return { valid: true, errors: {} }
  } catch (err) {
    console.error('Validation error:', err)
    return { valid: false, errors: { _general: 'Validation failed' } }
  }
}

/**
 * Get first error message from validation result
 * @param result Zod validation result
 * @returns First error message or null
 */
export function getFirstError(result: any): string | null {
  if (result.success) return null
  
  try {
    // Try issues first (newer Zod)
    if (result.error?.issues && result.error.issues.length > 0) {
      return result.error.issues[0].message
    }
    
    return 'Validation failed'
  } catch (err) {
    return 'Validation failed'
  }
}

// ============================================================================
// END OF VALIDATION SCHEMAS
// ============================================================================