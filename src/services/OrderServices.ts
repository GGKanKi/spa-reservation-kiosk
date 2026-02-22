// ===== IMPORTS =====

import { supabase } from "../lib/supabase"
import { OrderSchema } from "./ValidationServices"



export const OrderServices = {

    async getOrders() {

        const {data, error} = await supabase
            .from('Order')
            .select('*')

        if (error) {
            console.error('Error Message: ', error)
        }

        return data
        
    },


    async selectOrder(orderId: string) {

        const {data, error} = await supabase
            .from('Order')
            .select()
            .eq('id', orderId)
            .single()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data

    },


    // Client Function
    async createOrder (orderData: any) {

        const validation = OrderSchema.safeParse(orderData)

        if (!validation.success) {
            console.error('Validation Error', validation.error.message)
            return
        }

        const {data, error} = await supabase
            .from('Order')
            .insert([
                {
                    // Database Match = Frontend Data Fetching
                    name: validation.data.orderName, 
                    client_id: Number(validation.data.clientId),   
                    service_id: Number(validation.data.serviceId), 
                    staff_id: Number(validation.data.staffId),     
                    room_id: Number(validation.data.roomId),       
                    order_status: validation.data.orderStatus, // Status Enum
                }
            ])
            .select()

        if (error) {
            console.error('Error Message: ', error)
        }

        return data

    } 



}