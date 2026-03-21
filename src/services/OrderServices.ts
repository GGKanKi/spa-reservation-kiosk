// ===== IMPORTS =====

import { supabase } from "../lib/supabase"
import { OrderSchema } from "./ValidationServices"



export const Orders = {

    async getOrders() {

        const {data, error} = await supabase
            .from('Order')
            .select(`
                    *,
                    Service(name, category, price, description)
                    `)

        if (error) {
            console.error('Error Message: ', error)
            return {error: error.message}
        }

        return {data, error: null }
        
    },


    async selectOrder(orderId: string) {
    const {data, error} = await supabase
        .from('Order')
        .select(`
        *,
        Service(name, category, price, description)
        `)
        .eq('id', orderId)
        .single()

    if (error) {
        console.error('Error Message: ', error)
        return { error: error.message }  // ✅ Return error properly
    }

    return {data, error: null }
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
                    client_id: validation.data.clientId,   
                    service_id: validation.data.serviceId, 
                    staff_id: validation.data.staffId,     
                    room_id: validation.data.roomId,       
                    order_status: validation.data.orderStatus, // Status Enum
                }
            ])
            .select()

        if (error) {
            console.error('Error Message: ', error)
            return {error: error.message}
        }

        return {data, error: null }

    } 



}