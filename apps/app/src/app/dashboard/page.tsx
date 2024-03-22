import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export default function Home() {
  return (
		<div>
            <Card>
              <CardHeader>
                <CardTitle>Product Overview</CardTitle>
                <CardDescription>View and manage all your products from a single place</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Product</TableHead>
                        <TableHead className="w-[150px]">Category</TableHead>
                        <TableHead className="w-[150px]">Price</TableHead>
                        <TableHead className="w-[150px]">Inventory</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Glimmer Lamps</TableCell>
                        <TableCell>Lighting</TableCell>
                        <TableCell>$49.99</TableCell>
                        <TableCell>500 in stock</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Aqua Filters</TableCell>
                        <TableCell>Home Appliances</TableCell>
                        <TableCell>$29.99</TableCell>
                        <TableCell>750 in stock</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Eco Planters</TableCell>
                        <TableCell>Gardening</TableCell>
                        <TableCell>$19.99</TableCell>
                        <TableCell>300 in stock</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Zest Juicers</TableCell>
                        <TableCell>Kitchenware</TableCell>
                        <TableCell>$39.99</TableCell>
                        <TableCell>1000 in stock</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">Flexi Wearables</TableCell>
                        <TableCell>Fitness & Health</TableCell>
                        <TableCell>$59.99</TableCell>
                        <TableCell>200 in stock</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
		</div>
  );
}
