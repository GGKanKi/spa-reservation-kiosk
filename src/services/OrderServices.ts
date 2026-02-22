// ===== IMPORTS =====

import { supabase } from "../lib/supabase"



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

        const {data, error} = await supabase
            .from('Order')
            .insert([
                {
                    // Database Match = Frontend Data Fetching
                    name: orderData.orderName, 
                    client_id: Number(orderData.clientId),   
                    service_id: Number(orderData.serviceId), 
                    staff_id: Number(orderData.staffId),     
                    room_id: Number(orderData.roomId),       
                    order_status: orderData.orderStatus, // Status Enum
                }
            ])
            .select()

        if (error) {
            console.error('Error Message: ', error)
        }

        return data

    } 



}