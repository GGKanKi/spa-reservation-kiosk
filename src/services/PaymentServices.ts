import { supabase } from "../lib/supabase";
import type { PaymentMethod, PaymentFormData } from "../types/database.types";


export const PaymentServices = {

    /**
     * Triggers when Payment Method (Gcash, Credit Card, etc.) is selected in the Order Page.
     */

    async payOrder(formData: PaymentFormData) {

        const { data, error: functionError } = await supabase.functions.invoke('process-payment', {
            body: {
                amount: formData.amount,
                orderId: formData.orderId,
                clientId: formData.clientId,
                paymentMethod: formData.paymentMethod,
                transactionId: formData.transactionId,
            },
        });

        if (functionError) {
            console.error('Payment Function Error:', functionError);
            throw new Error(functionError.message);
        }

        if (data?.checkout_url) {
            window.location.href = data.checkout_url;
        } else if (data?.error) {
            throw new Error(data.error);
        }

        return data;
    },


    /**
     * Manual Payment
     */
    async manualPayOrder(formData: PaymentFormData) {
        const { data, error } = await supabase
            .from('Payment')
            .insert([
                {
                    order_id: formData.orderId,
                    client_id: formData.clientId,
                    amount: formData.amount,
                    payment_method: formData.paymentMethod,
                    payment_status: 'completed',
                    transaction_id: formData.transactionId,
                    paid_at: new Date().toISOString(),
                    update_at: new Date().toISOString(),


                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    }


}