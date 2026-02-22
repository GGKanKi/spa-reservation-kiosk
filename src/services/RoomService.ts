// ===== IMPORTS =====
import { supabase } from "../lib/supabase"



export const RoomServices = {

    async getRooms () {

        const {data, error} = await supabase
            .from('Room')
            .select('*')

        if (error) {
            console.log('Error Message: ', error)
        }
        
        return data

    },

    // For Members who wants available Rooms
    async selectRoom (roomId: string, roomAvailability: string) {

        const {data, error} = await supabase
            .from('Room')
            .select()
            .eq('id', roomId)
            .eq('is_available', roomAvailability) // Enum(Room Status)
            .single()


        if (error) {
            console.log('Error Message: ', error)
        }

        return data

    },

    async createRoom (roomData: any) {

        const {data, error} = await supabase
            .from('Room')
            .insert([
                {
                    name: roomData.roomName,
                    assigned_id: roomData.staffId,
                    assigned_name: roomData.staffName,
                    is_available: roomData.isAvailable,
                    updated_at: roomData.updatedAt // Initial Data as the Created At Data

                }
            ])
            .select()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data
        
    }

}