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


    async getAvailableRooms (status: string) {
        const {data, error} = await supabase
            .from('Room')
            .select('*')
            .eq('is_available', status)

        if (error) {
            console.error('Error Message: ', error)
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
        
    },


    async deleteRoom (roomId: string) {

        const {data, error} = await supabase
            .from('Room')
            .delete()
            .eq('id', roomId)

        if (error) {
            console.error('Error Message: ', error)
        }

        return data

    },

    async updateRoom (roomId: string, roomData:{
        name: string,
        is_available: string,
    }) {
        try {
            const {data, error} = await supabase
                .from('Room')
                .update(roomData)
                .eq('id', roomId)
                .select()
                .single()

                if (error) {
                    return { data: null, error: error.message };
                }

                return {data, error: null}

        } catch (err) {
            console.error('Error Message: ', err)
        }
    },

}