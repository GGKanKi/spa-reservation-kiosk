import { supabase } from "../lib/supabase";

export const AuthServices = {

    async login(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data, error: null };

        } catch (error: any) {
            return { data: null, error: error.message || 'An unexpected error occured.' };
        }
    },

    async signup(firstName: string, middleName: string, lastName: string, phoneNum: string, email: string, password: string) {
        try {
            // Step 1: Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        phone_num: phoneNum
                    }
                }
            });

            if (authError) {
                console.error('Signup error:', authError);
                return { data: null, error: authError.message };
            }

            return { data: authData, error: null };

        } catch (error: any) {
            console.error('Signup exception:', error);
            return { data: null, error: error.message || 'An unexpected error occurred.' };
        }
    }
};