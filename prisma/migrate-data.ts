/**
 * One-shot migration: copy all data from old Supabase project → new Supabase project.
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/migrate-data.ts
 */
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const OLD_URL = "postgresql://postgres.zbqtbokfjlyyysfmrpkk:Farhad%40%401478@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
const NEW_URL = "postgresql://postgres.ybzrmqwumhrmhndwwpyv:PYGEDt9HTn4NPOkP@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

const src = new PrismaClient({ adapter: new PrismaPg({ connectionString: OLD_URL }) })
const dst = new PrismaClient({ adapter: new PrismaPg({ connectionString: NEW_URL }) })

function log(msg: string) { console.log(`  ${msg}`) }

async function main() {
  console.log("\n═══ Bindu Premium DB Migration ═══\n")

  // ── Settings ────────────────────────────────────────────────────
  const settings = await src.setting.findMany()
  if (settings.length) {
    await dst.setting.createMany({ data: settings, skipDuplicates: true })
    log(`✓ Settings: ${settings.length}`)
  }

  // ── Shipping Zones ───────────────────────────────────────────────
  const zones = await src.shippingZone.findMany()
  if (zones.length) {
    await dst.shippingZone.createMany({ data: zones, skipDuplicates: true })
    log(`✓ Shipping Zones: ${zones.length}`)
  }

  // ── Categories ───────────────────────────────────────────────────
  const cats = await src.category.findMany()
  if (cats.length) {
    await dst.category.createMany({ data: cats, skipDuplicates: true })
    log(`✓ Categories: ${cats.length}`)
  }

  // ── Category Attribute Configs ───────────────────────────────────
  const attrConfigs = await src.categoryAttributeConfig.findMany()
  if (attrConfigs.length) {
    await dst.categoryAttributeConfig.createMany({ data: attrConfigs, skipDuplicates: true })
    log(`✓ Attribute Configs: ${attrConfigs.length}`)
  }

  // ── Products ─────────────────────────────────────────────────────
  const products = await src.product.findMany()
  if (products.length) {
    await dst.product.createMany({ data: products, skipDuplicates: true })
    log(`✓ Products: ${products.length}`)
  }

  // ── Product Images ───────────────────────────────────────────────
  const images = await src.productImage.findMany()
  if (images.length) {
    await dst.productImage.createMany({ data: images, skipDuplicates: true })
    log(`✓ Product Images: ${images.length}`)
  }

  // ── Product Variants ─────────────────────────────────────────────
  const variants = await src.productVariant.findMany()
  if (variants.length) {
    await dst.productVariant.createMany({ data: variants, skipDuplicates: true })
    log(`✓ Product Variants: ${variants.length}`)
  }

  // ── Users ────────────────────────────────────────────────────────
  const users = await src.user.findMany()
  if (users.length) {
    await dst.user.createMany({ data: users, skipDuplicates: true })
    log(`✓ Users: ${users.length}`)
  }

  // ── User Addresses ───────────────────────────────────────────────
  const addresses = await src.address.findMany()
  if (addresses.length) {
    await dst.address.createMany({ data: addresses, skipDuplicates: true })
    log(`✓ Addresses: ${addresses.length}`)
  }

  // ── Orders ───────────────────────────────────────────────────────
  const orders = await src.order.findMany()
  if (orders.length) {
    await dst.order.createMany({ data: orders as any, skipDuplicates: true })
    log(`✓ Orders: ${orders.length}`)
  }

  // ── Order Items ──────────────────────────────────────────────────
  const orderItems = await src.orderItem.findMany()
  if (orderItems.length) {
    await dst.orderItem.createMany({ data: orderItems, skipDuplicates: true })
    log(`✓ Order Items: ${orderItems.length}`)
  }

  // ── Order Shipments ──────────────────────────────────────────────
  const shipments = await src.orderShipment.findMany().catch(() => [])
  if (shipments.length) {
    await dst.orderShipment.createMany({ data: shipments, skipDuplicates: true })
    log(`✓ Shipments: ${shipments.length}`)
  }

  // ── Cart Items ───────────────────────────────────────────────────
  const cartItems = await src.cartItem.findMany()
  if (cartItems.length) {
    await dst.cartItem.createMany({ data: cartItems, skipDuplicates: true })
    log(`✓ Cart Items: ${cartItems.length}`)
  }

  // ── Coupons ──────────────────────────────────────────────────────
  const coupons = await src.coupon.findMany()
  if (coupons.length) {
    await dst.coupon.createMany({ data: coupons, skipDuplicates: true })
    log(`✓ Coupons: ${coupons.length}`)
  }

  // ── Flash Sales ──────────────────────────────────────────────────
  const flashSales = await src.flashSale.findMany()
  if (flashSales.length) {
    await dst.flashSale.createMany({ data: flashSales, skipDuplicates: true })
    log(`✓ Flash Sales: ${flashSales.length}`)
  }

  // ── Reviews ──────────────────────────────────────────────────────
  const reviews = await src.review.findMany()
  if (reviews.length) {
    await dst.review.createMany({ data: reviews, skipDuplicates: true })
    log(`✓ Reviews: ${reviews.length}`)
  }

  // ── Blogs ────────────────────────────────────────────────────────
  const blogs = await src.blogPost.findMany()
  if (blogs.length) {
    await dst.blogPost.createMany({ data: blogs, skipDuplicates: true })
    log(`✓ Blog Posts: ${blogs.length}`)
  }

  // ── Brands ───────────────────────────────────────────────────────
  const brands = await src.brand.findMany()
  if (brands.length) {
    await dst.brand.createMany({ data: brands, skipDuplicates: true })
    log(`✓ Brands: ${brands.length}`)
  }

  // ── Loyalty Points ───────────────────────────────────────────────
  const loyalty = await src.loyaltyPoint.findMany()
  if (loyalty.length) {
    await dst.loyaltyPoint.createMany({ data: loyalty, skipDuplicates: true })
    log(`✓ Loyalty Points: ${loyalty.length}`)
  }

  // ── Wishlist Items ───────────────────────────────────────────────
  const wishlist = await src.wishlistItem.findMany()
  if (wishlist.length) {
    await dst.wishlistItem.createMany({ data: wishlist, skipDuplicates: true })
    log(`✓ Wishlist Items: ${wishlist.length}`)
  }

  // ── Checkout Fields ──────────────────────────────────────────────
  const checkoutFields = await src.checkoutField.findMany()
  if (checkoutFields.length) {
    await dst.checkoutField.createMany({ data: checkoutFields as any, skipDuplicates: true })
    log(`✓ Checkout Fields: ${checkoutFields.length}`)
  }

  // ── Order Bumps ──────────────────────────────────────────────────
  const bumps = await src.orderBump.findMany()
  if (bumps.length) {
    await dst.orderBump.createMany({ data: bumps, skipDuplicates: true })
    log(`✓ Order Bumps: ${bumps.length}`)
  }

  console.log("\n✅ Migration complete!\n")
}

main()
  .catch(e => { console.error("\n❌ Migration failed:", e.message); process.exit(1) })
  .finally(async () => { await src.$disconnect(); await dst.$disconnect() })
