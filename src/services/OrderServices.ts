// ===== IMPORTS =====

import { supabase } from "../lib/supabase"
import { OrderSchema } from "./ValidationServices"



export const Orders = {

    async getOrders() {

        const {data, error} = await supabase
            .from('Order')
            .select(`
                    *, OrderItem(
                    id,
                    quantity,
                    price_at_purchase,
                    Service(name, category, price, description)
                    )
                    
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
            return { error: error.message }  
        }

        return {data, error: null }
        },


    // Client Function
    async createOrder(orderData: any) {
    // orderData.items = [{serviceId: '...', quantity: 1}, {...}]
    
    const validation = OrderSchema.safeParse(orderData)
    
    if (!validation.success) {
        return { error: "Validation failed", data: null }
    }

    // 1. Create the main Order
    const { data: order, error: orderError } = await supabase
        .from('Order')
        .insert([
        {
            name: validation.data.orderName,
            client_id: validation.data.clientId,
            staff_id: validation.data.staffId,
            room_id: validation.data.roomId,
            order_status: 'pending',
        }
        ])
        .select()
        .single()

    if (orderError) {
        return { error: orderError.message, data: null }
    }

    // 2. Create OrderItems for each service
    const orderItems = await Promise.all(
        validation.data.items.map(async (item: any) => {
        const { data: service, error: serviceError } = await supabase
            .from('Service')
            .select('price')
            .eq('id', item.serviceId)
            .single()

        if (serviceError || !service) {
            throw new Error(`Service ${item.serviceId} not found`)
        }    


        return {
            order_id: order.id,
            service_id: item.serviceId,
            quantity: item.quantity || 1,
            price_at_purchase: service.price || 0,
        }
        })
    )

    const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems)

    if (itemsError) {
        return { error: itemsError.message, data: null }
    }

    return { data: order, error: null }
    }



}