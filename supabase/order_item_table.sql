-- ============================================================================
-- TABLE FOR MULTIPLE SERVICES IN ONE ORDER
-- Spa Reservation - SQL Database Migration
-- RUN IN SUPABASE DASHBOARD > SQL EDITOR
-- ============================================================================

CREATE TABLE IF NOT EXISTS public."OrderItem" (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public."Order"(id) ON DELETE CASCADE,
    service_id uuid NOT NULL REFERENCES public."Service"(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    price_at_purchase NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ENABLE RLS
ALTER TABLE public."OrderItem" ENABLE ROW LEVEL SECURITY;

-- POLICY
CREATE POLICY "Users can see items in their orders"
ON public."OrderItem"
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public."Order" o
        WHERE o.id = order_id AND (
            EXISTS (
                SELECT 1 FROM public."Users"
                WHERE id = auth.uid() AND (role = 'admin' OR id = o.client_id)
            )
        )
    )
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_orderitem_order ON public."OrderItem"(order_id);

-- UPDATE ORDER TABLE
ALTER TABLE public."Order" ADD COLUMN IF NOT EXISTS order_total NUMERIC(10, 2);

-- TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION auto_set_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Order"
    SET order_total = (
        SELECT COALESCE(SUM(price_at_purchase), 0)
        FROM public."OrderItem"
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER
CREATE TRIGGER trigger_set_order_total
    AFTER INSERT OR UPDATE ON public."OrderItem"
    FOR EACH ROW
    EXECUTE PROCEDURE auto_set_order_total();

-- ============================================================================
-- Order Data list For Auto Computation of Prices
-- DONE!
-- ============================================================================
