// ===== IMPORTS =====
import { supabase } from "../lib/supabase"
import { RoomCreateSchema, RoomSchema } from "./ValidationServices"



export const Rooms = {

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

        const validation = RoomCreateSchema.safeParse(roomData)

        if (!validation.success) {
            console.error('Validation Failed', validation.error.issues)
            return
        }

        const {data, error} = await supabase
            .from('Room')
            .insert([
                {
                    name: validation.data.name,
                    assigned_id: validation.data.assignedId || null,
                    is_available: validation.data.isAvailable,

                }
            ])
            .select()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data
        
    }

}