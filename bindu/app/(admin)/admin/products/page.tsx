import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Download, Upload } from "lucide-react"
import Link from "next/link"
import prisma from "@/lib/prisma"
import ProductsFilters from "./ProductsFilters"
import AdminPagination from "@/components/admin/AdminPagination"
import { DuplicateButton } from "./DuplicateButton"
import PageHeader from "@/components/admin/PageHeader"
import { FilterTabs } from "@/components/admin/FilterTabs"

const PAGE_SIZE = 20

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const status = params.status || ""
  const page = Math.max(1, parseInt(params.page || "1"))
  const skip = (page - 1) * PAGE_SIZE

  const baseWhere: any = search ? { name: { contains: search } } : {}
  const where: any = {
    ...baseWhere,
    ...(status === "active" ? { isActive: true } : status === "inactive" ? { isActive: false } : {}),
  }

  const [products, total, allCount, activeCount, inactiveCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }).catch(() => []),
    prisma.product.count({ where }).catch(() => 0),
    prisma.product.count({}).catch(() => 0),
    prisma.product.count({ where: { isActive: true } }).catch(() => 0),
    prisma.product.count({ where: { isActive: false } }).catch(() => 0),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const tabs = [
    { label: "All", value: "", href: "/admin/products", count: allCount },
    { label: "Active", value: "active", href: "/admin/products?status=active", count: activeCount },
    { label: "Inactive", value: "inactive", href: "/admin/products?status=inactive", count: inactiveCount },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Products"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/products/import">
              <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" /> Import CSV</Button>
            </Link>
            <a href="/api/admin/products/export">
              <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
            </a>
            <Link href="/admin/products/new">
              <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Add Product</Button>
            </Link>
          </div>
        }
      />

      <FilterTabs tabs={tabs} activeValue={status} />

      <Card>
        <CardContent className="p-0">
          <ProductsFilters currentSearch={search} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock (Variants)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
              {products.map((product: any) => {
                const totalStock = product.variants.reduce((acc: number, curr: any) => acc + curr.stock, 0)
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                    <TableCell>৳{Number(product.price).toLocaleString()}</TableCell>
                    <TableCell>
                      {totalStock}{" "}
                      <span className="text-xs text-muted-foreground">({product.variants.length} variants)</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DuplicateButton productId={product.id} />
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <AdminPagination page={page} totalPages={totalPages} basePath="/admin/products" />
        </CardContent>
      </Card>
    </div>
  )
}
