// ===== IMPORTS =====
import { supabase } from "../lib/supabase";
import { ServiceSchema } from "./ValidationServices";


export const Services = {


    async getServices () {

        const {data, error} = await supabase
            .from('Service')
            .select('*')

        if (error) {
            console.log('Error Message:', error)
        }

        return data
    },


    async selectService (serviceId: string) {

        const {data, error} = await supabase
            .from('Service')
            .select()
            .eq('id', serviceId)
            .single()

        if (error) {
            console.log('Error Message: ', error)
        }

        return data

    },
    // Admin Functions For Handling Services

    async createService (serviceData: any) {

        // Zod Validation
        const validation = ServiceSchema.safeParse(serviceData)

        if (!validation.success) {
            console.error('Validation Failed', validation.error.message)
            return
        }

        const {data, error} = await supabase
            .from('Service')
            .insert([
                {
                    name: validation.data.serviceName,
                    category: validation.data.category,
                    price: Number(validation.data.price),
                    description: validation.data.description,
                }
            ])
            .select()

        if (error) {
            console.log('Message Error: ', error)
        }

        return data
    }

}

