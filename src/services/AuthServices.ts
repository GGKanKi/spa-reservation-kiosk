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

            const token = data.session?.access_token || null;

            if (token) {
                localStorage.setItem("authToken", token);
            }

            return { data, error: null };
            } catch (err: any) {
            return { data: null, error: err.message };
        }
    },

    // Stored Token
    getToken() {
        return localStorage.getItem("authToken");
    },

    // Handle Logout
    async logout() {
        await supabase.auth.signOut();
        localStorage.removeItem("authToken");
    },

    // Token Verification
    async verifyToken() {
        const token = this.getToken();
        if (!token) {
            return { valid: false, error: "No token found" };
        }

        try {
            const { data, error } = await supabase.auth.getUser(token);
            return !error && !!data.user; 
        } catch (err: any) {
            return { valid: false, error: err.message };
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
    },


    async forgotPassword(userEmail: string) {

        const { data: userRecord, error: fetchError } = await supabase
            .from('Users')
            .select('id')
            .eq('email_add', userEmail)
            .single();

        if (userRecord) {
            try {
                const {data, error} = await supabase.auth.resetPasswordForEmail(userEmail, {
                redirectTo: 'http://localhost:5173/reset-password', 
            });

                if (error) throw error;

                return{ success: true, data};

            } catch (err:any) {
                console.error('Error Message: ', err.message);
                return { success: false, error: err.message };
            }
            
        } else {
            console.error('Email Invalid: Not found in Users table');
            return { success: false, error: "This email is not registered.", fetchError};
        }
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

};