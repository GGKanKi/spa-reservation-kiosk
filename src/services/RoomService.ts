// ===== IMPORTS =====
import { supabase } from "../lib/supabase"
import { RoomSchema } from "./ValidationServices"



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

        const validation = RoomSchema.safeParse(roomData)

        if (!validation.success) {
            console.error('Validation Failed', validation.error.message)
            return
        }

        const {data, error} = await supabase
            .from('Room')
            .insert([
                {
                    name: validation.data.roomName,
                    assigned_id: Number(validation.data.staffId),
                    assigned_name: validation.data.staffName,
                    is_available: validation.data.isAvailable,
                    updated_at: validation.data.updatedAt // Initial Data as the Created At Data

                }
            ])
            .select()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data
        
    }

}