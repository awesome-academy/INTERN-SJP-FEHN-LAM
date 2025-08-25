
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItemProps {
    label: string;
    href?: string;
}

interface OwnBreadcrumbProps {
    items: BreadcrumbItemProps[];
}

const OwnBreadcrumb: React.FC<OwnBreadcrumbProps> = ({ items }) => {
    return (
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                {items.map((item, index) => {
                    if (index === items.length - 1) {
                        return (
                            <BreadcrumbItem key={index}>
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            </BreadcrumbItem>
                        );
                    }
                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default OwnBreadcrumb;
