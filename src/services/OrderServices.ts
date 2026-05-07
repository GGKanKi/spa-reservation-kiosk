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

    async getOrderByUserId(userId: string) {

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
            .eq('client_id', userId)

        if (error) {
            console.error('Error Message:', error)
            return {data: null, error: error.message}
        }

        return {data, error: null}
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

    const { data: authUserData } = await supabase.auth.getUser();
    const authUserId = authUserData?.user?.id;
    const orderClientId = authUserId || validation.data.clientId;

    const { data: order, error: orderError } = await supabase
        .from('Order')
        .insert([
        {
            name: validation.data.orderName,
            client_id: orderClientId,
            staff_id: validation.data.staffId,
            room_id: validation.data.roomId,
            order_status: 'pending',
            reservation_date: validation.data.reservationDate,
            start_time: validation.data.startTime,
            end_time: validation.data.endTime
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

    // Calculate and save order total
    const orderTotal = orderItems.reduce((sum, item) => {
        return sum + (item.price_at_purchase * item.quantity);
    }, 0);

    const { error: updateError } = await supabase
        .from('Order')
        .update({ order_total: orderTotal })
        .eq('id', order.id);

    if (updateError) {
        return { error: updateError.message, data: null };
    }

    return { data: order, error: null }
    },

    async deleteOrder(id: string) {

        if (!id) return {error: "Order ID is required", data: null};

        const {data, error} = await supabase
            .from('Order')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error Message: ', error)
        }

        return {data, error: null}

    },

    async cancelOrder(id: string) {
        if (!id) return {error: "Order ID is required", data: null};

        const {data, error} = await supabase
            .from('Order')
            .update({order_status: 'cancelled'})
            .eq('id', id)
            .select()
            .single()

            if (error) {
                console.error('Error Message: ', error)
            }

            return {data, error: null}

    },

    async updateOrderStatus(orderId: string, newStatus: string) {

        if (!orderId || !newStatus) return {error: "Order ID and new status are required", data: null};

        const {data, error} = await supabase
            .from('Order')
            .update({ order_status: newStatus })
            .eq('id', orderId)
            .select()
            .single()
        if (error) {
            console.error('Error Message: ', error)
            return {error: error.message, data: null}
        }

        return {data, error: null}
    },


    async getPaidOrders(orderId: string, status: string = 'paid') {
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
            .eq('id', orderId)
            .eq('order_status', status)
            .single()

        if (error) {
            console.error('Error Message: ', error)
            return { error: error.message, data: null }  
        }

        return {data, error: null }
    }
}