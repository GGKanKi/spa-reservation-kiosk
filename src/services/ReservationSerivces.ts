// ==== IMPORTS ====
import { supabase } from "../lib/supabase";


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

        const {data, error} = await supabase
            .from('Reservation')
            .insert([
                {
                    reservation_name: reservationData.reservationName,
                    client_id: reservationData.clientId,
                    order_id: reservationData.orderId,
                    room_id: reservationData.roomId,
                    reservation_time: reservationData.reservationTime // Date Time Option
                }
            ])
            .select()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data
    }

}