// ==== IMPORTS ====
import { supabase } from "../lib/supabase";
import { ReservationSchema } from "./ValidationServices";


export const ReservationServices = {

    async getReservation () {

        const {data, error} = await supabase
            .from('Reservation')
            .select('*')


        if (error) {
            console.log('Error Message: ', error)
        }

        return data
    },

    async selectReservation (reservationId: string) {

        const {data, error} = await supabase
            .from('Reservation')
            .select()
            .eq('id', reservationId)
            .single()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data

    },


    // User Function (Member)
    async createReservation (reservationData: any) {

        // Zod Validation
        const validation = ReservationSchema.safeParse(reservationData)

        if (!validation.success) {
            console.error('Validation Failed', validation.error.message)
            return
        }

        const {data, error} = await supabase
            .from('Reservation')
            .insert([
                {
                    reservation_name: validation.data.reservationName,
                    client_id: Number(validation.data.clientId),
                    order_id: Number(validation.data.orderId),
                    room_id: Number(validation.data.roomId),
                    reservation_time: validation.data.reservationTime // Date Time Option
                }
            ])
            .select()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data
    }

}