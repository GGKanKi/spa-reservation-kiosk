// ==== Imports ====
import { supabase } from "../lib/supabase";
// import type { User, UserRole } from "../types/database.types";


export const Users = {

    async getUsers () {

        const {data, error} = await supabase
            .from('Users')
            .select('*')

        if (error) {
            console.log('Problem Getting Users', error)
        } 

        return data

    },

    async selectUser (userId: string) {

        const {data, error} = await supabase
            .from('Users')
            .select()
            .eq('id', userId)
            .single()


        if (error) {
            console.log('Error Message:', error)
        }

        return data

    },


    async createUser (newUserData: any) {

        const {data, error} = await supabase
            .from('Users')
            .insert([
                {
                first_name: newUserData.firstName,
                middle_name: newUserData.middleName,
                last_name: newUserData.lastName,
                email_add: newUserData.emailAdd,
                phone_number: newUserData.phoneNum,
                username: newUserData.username,
                password: newUserData.password,
                role: newUserData.userRole,
                }
            ])
            .select()

        if (error) {
            console.log('Error', error)
        }

        return data

    }


};