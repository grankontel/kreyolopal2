import { BreadcrumbLink, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbList, Breadcrumb } from "@/components/ui/breadcrumb"

export default function DashboardPath() {

	return (
		<Breadcrumb className="breadcrumb">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="/products">Products</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>

	)
}