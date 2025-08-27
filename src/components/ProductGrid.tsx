
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_CONFIG } from "@/lib/orderStatusConfig";

interface OrderStatusBadgeProps {
    status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
    const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];

    if (!config) {
        return <Badge>{status}</Badge>;
    }

    return (
        <Badge variant={config.badgeVariant}>
            {config.label}
        </Badge>
    );
};
