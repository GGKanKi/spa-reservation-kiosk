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
        } catch {
        return false;
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