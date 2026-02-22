// ===== IMPORTS =====
import { supabase } from "../lib/supabase";


export const ServiceServices = {


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

        const {data, error} = await supabase
            .from('Service')
            .insert([
                {
                    name: serviceData.serviceName,
                    category: serviceData.category,
                    price: serviceData.price,
                    description: serviceData.description,
                }
            ])
            .select()

        if (error) {
            console.log('Message Error: ', error)
        }

        return data
    }

}

