// ==== Aliases ====
export type UserRole = 'member' | 'vip' | 'admin' | 'staff'
export type ServiceCategory  = 'massage'| 'spa'| 'facial'| 'body_wrap'| 'nail_care'| 'aromatherapy'| 'bundle'
export type OrderStatus = 'pending' | 'paid'| 'done' | 'cancelled'
export type RoomStatus = 'available' | 'cleaning' | 'close' | 'reserve' | 'maintenance'




export interface User {

    // ID Automatic Creation From Supabase
    firstName: string,
    middleName: string,
    lastName: string,
    emailAdd: string,
    phoneNum: number,
    username: string,
    password: string,
    userRole: UserRole,
    created_at: string // ISO Date Format


};

export interface Service {

    // ID Automatic Creation From Supabase
    serviceName: string,
    category: ServiceCategory,
    price: number,
    description: string,
    createdAt: string, // ISO Date Format

}


export interface Order {

    // ID Automatically Created By Supabase
    orderName: string,
    serviceId: string,
    clientId: string, 
    staffId: string,
    roomId: string, // Only Shows Available Rooms When Ordering
    orderStatus: OrderStatus,
    createdAt: string

}


export interface Room {

    // ID Automatically Created By Supabase
    roomName: string,
    staffId: string, // Assigned User for work
    staffName: string, // Assigned Name 
    isAvailable: RoomStatus,
    createdAt: string,
    updatedAt: string,


}


export interface Reservation {

    // ID Automatically Created By Supabase
    reservationName: string,
    clientId: string,
    orderId: string,
    roomId: string,
    reservationTime: string,
    createdAt: string,
}


