// ==== Imports ====
import { supabase } from "../lib/supabase";
import { UserSchema } from "./ValidationServices";


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

    async getUserByRole (role: string) {
        const {data, error} = await supabase
            .from('Users')
            .select()
            .eq('role', role) 

        console.log("Query result:", data, error); 

        if (error) {
            console.log('Error:', error)
            return []
        }

        return data || []
    },



    // Client Name Fetch For Reservations


    async memberToStaff (userId: string) {
        try {
            const {error} = await supabase
                .from('Users')
                .update({ role: 'staff' })
                .eq('id', userId)

            

            if (error) {
                console.log('Error updating user role:', error)
                return false
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }

        const results = await this.getUserByRole('staff')
        console.log('Updated Staff List', results)
        return true

    },

    async memberToAdmin (userId: string) {
        try {
            const {error} = await supabase
                .from('Users')
                .update({ role: 'admin' })
                .eq('id', userId)

            

            if (error) {
                console.log('Error updating user role:', error)
                return false
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }

        const results = await this.getUserByRole('staff')
        console.log('Updated Staff List', results)
        return true

    },


    
    async createUser (newUserData: any) {

        // Uses Zod Validation
        const validation = UserSchema.safeParse(newUserData)

        if (!validation.success) {
            console.error('Validation Failed', validation.error.message)
            return
        }

        const {data, error} = await supabase
            .from('Users')
            .insert([
                {
                first_name: validation.data.firstName,
                middle_name: validation.data.middleName,
                last_name: validation.data.lastName,
                email_add: validation.data.emailAdd,
                phone_number: validation.data.phoneNum,
                password: validation.data.password,
                role: validation.data.role,
                }
            ])
            .select()

        if (error) {
            console.log('Error', error)
        }

        return data

    },

    async getUserProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                return { data: null, error: error.message };
            }

            return { data, error: null };
        } catch (error: any) {
            return { data: null, error: error.message || 'Failed to fetch user profile.' };
        }
    },

    async updateUser(userId: string, updateData: {
        first_name?: string,
        middle_name?: string,
        last_name?: string,
        email?: string,
        phone_num?: string,
        password?: string,

    }) {
        try {
            const {data, error} = await supabase
                .from('Users')
                .update(updateData)
                .eq('id', userId)
                .select()
                .single()

            if (error) {
                return { data: null, error: error.message };
            } 

            return {data, error: null};

        } catch (err: any) {
            return { data: null, error: err.message || 'Failed To Update Data.'}
        }


    } 

};