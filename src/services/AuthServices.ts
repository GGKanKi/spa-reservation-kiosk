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

    async signup(firstName: string, middleName: string, lastName: string, phoneNum: string, email: string, username: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        phone_num: phoneNum,
                        username: username,
                    }
                }
            });

            if (error) {
                return { data: null, error: error.message };
            }

            return { data, error: null };

        } catch (error: any) {
            return { data: null, error: error.message || 'An unexpected error occured.' };
        }
    }
};