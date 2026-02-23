// 
import { supabase } from "../lib/supabase";


export const AuthServices = {


    async login (email: string, password: string) {

    try  {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.log('Error Message: ', error)
        }

        return {data, error: null}

    } catch (error: any) {
        return {data: null, error: error.message || 'An unexpected error occured.'};
        
    }

    }
            

}
