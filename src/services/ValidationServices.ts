// Zod Import For Data Validation
import { z } from "zod"




export const UserSchema = z.object({

    firstName: z.string().min(2, "Name Must 2 Characters Long."),
    middleName: z.string().min(2, "Name Must 2 Characters Long."),
    lastName: z.string().min(2, "Name Must 2 Characters Long."),
    emailAddress: z.string().email("Invalid Email"),
    phoneNum: z.string().min(10, "Phone number must be at least 10 digits"),
    username: z.string().min(8, "Username must be 8 Characters Long."),
    password: z.string().min(8, "Password must be 8 Characters Long."),
    created_at: z.string().datetime(),
    userRole: z.enum(['member' , 'vip' , 'admin' , 'staff']),

});

// Extension For SignUpSchema

export const SignUpSchema = UserSchema.omit({
    created_at: true,
    userRole: true,
    username: true,
}).extend({
    confirmPassword: z.string().min(8, "Confirm Password must be 8 Characters Long.")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],

});


export type SignUpFormData = z.infer<typeof SignUpSchema>;

export const ServiceSchema = z.object({

    serviceName: z.string().min(5, "Service Name Must Be 5 Characters Long."),
    category: z.enum(['massage', 'spa', 'facial', 'body_wrap', 'nail_care', 'aromatherapy', 'bundle']),
    price: z.number().positive('Price must be greater than 0'),
    description: z.string().min(10, 'Description Should Be A Sentence'),
    createdAt: z.string().datetime(),
});

export const OrderSchema = z.object({

    orderName: z.string().min(5, 'Order Name Should be 5 Characters Long.'),
    serviceId: z.string(), // ID Connected To Services
    clientId:  z.string(), // ID Connected to Client Who Ordered
    staffId: z.string(), // ID where User.role = Staff
    roomId: z.string(), // Room Id only for available rooms
    orderStatus: z.enum(['pending', 'cleaning', 'close', 'reserve', 'maintenance']),
    createdAt: z.string().datetime(),

});


export const RoomSchema = z.object({

    roomName: z.string().min(3, 'Room Name should be 3 Characters Long.'),
    staffId: z.string(), // UserID where UserRole = Staff
    staffName: z.string().min(2, 'Staff Name Should be 2 Characters Long.'),
    isAvailable: z.enum(['available' , 'cleaning' , 'close' , 'reserve' , 'maintenance']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),

});


export const ReservationSchema = z.object({

    reservationName: z.string().min(5, 'Reservation Name Should be 5 Characters Long.'),
    clientId: z.string(), // UserID where UserRole = member/VIP
    orderId: z.string(), // Client Order
    roomId: z.string(), // Room ID for avaialble Room
    reservationTime: z.string().datetime(),
    createdAt: z.string().datetime(),

});

