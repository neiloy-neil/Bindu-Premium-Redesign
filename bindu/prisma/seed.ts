import { Role, DiscountType } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

config({ path: '.env.local' })

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000)
}

async function main() {
  console.log('🌱 Seeding Bindu Premium database with new products...')

  // ─── Admin User ───────────────────────────────────────────────
  const ADMIN_EMAIL = 'admin@bindupremium.com.bd'
  const FAKE_USER_ID = '00000000-0000-0000-0000-000000000000'
  
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: Role.ADMIN },
    create: {
      id: FAKE_USER_ID,
      name: 'Bindu Admin',
      email: ADMIN_EMAIL,
      role: Role.ADMIN,
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ─── Categories ───────────────────────────────────────────────
  const categoryData = [
    { name: 'Panjabi', slug: 'panjabi', image: '/category_panjabi.jpg', sortOrder: 1 },
    { name: 'Polo', slug: 'polo', image: '/category_polo.jpg', sortOrder: 2 },
    { name: 'T-Shirts', slug: 't-shirts', image: '/category_tshirt.jpg', sortOrder: 3 },
    { name: 'Shirts', slug: 'shirts', image: '/category_shirt.jpg', sortOrder: 4 },
    { name: 'Accessories', slug: 'accessories', image: '/category_accessories.jpg', sortOrder: 5 },
  ]

  const categories = await Promise.all(
    categoryData.map(cd =>
      prisma.category.upsert({
        where: { slug: cd.slug },
        update: { name: cd.name, image: cd.image, sortOrder: cd.sortOrder },
        create: cd,
      })
    )
  )
  console.log('✅ Categories updated with new assets.')

  // We are asked to seed all 26 photos from "New Product" as Polo and T-Shirts based on their pricing
  console.log('📦 Generating products from /public/New Product directory...')
  const dirPath = path.join(__dirname, '../public/New Product')
  if (!fs.existsSync(dirPath)) {
    console.log('⚠️ /public/New Product directory not found.')
    return
  }

  const files = fs.readdirSync(dirPath)
  let tShirtIndex = 1
  let poloIndex = 1
  
  const tShirtCategory = categories.find(c => c.slug === 't-shirts')
  const poloCategory = categories.find(c => c.slug === 'polo')

  if (!tShirtCategory || !poloCategory) {
    throw new Error("Categories not found")
  }

  const sizes = ['S', 'M', 'L', 'XL']

  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png')) continue

    let title = ""
    let description = ""
    let price = 0
    let categoryId = poloCategory.id
    let colorHex = "#000000"
    let colorName = "Black"
    let isTShirt = false

    if (file.startsWith('790')) {
      title = `Essential T-Shirt ${tShirtIndex++}`
      description = `Crafted from high-quality, breathable cotton, this premium t-shirt offers a relaxed fit for everyday comfort. The minimal design ensures versatility for any casual setting.`
      price = 790
      isTShirt = true
      colorHex = "#2196F3"
      colorName = "Blue"
    } else if (file.startsWith('1190')) {
      title = `Signature Contrast Polo ${poloIndex++}`
      description = `Elevate your casual wear with our Signature Contrast Polo. Featuring distinctive collar and sleeve accents, it's tailored from a rich cotton-blend pique for a sophisticated look.`
      price = 1190
      colorHex = "#FF5722"
      colorName = "Orange"
    } else if (file.startsWith('1290')) {
      title = `Classic Solid Polo ${poloIndex++}`
      description = `The epitome of timeless style. Our Classic Solid Polo is crafted with a structured collar and premium fabric, offering a sharp, modern silhouette perfect for both office and weekend.`
      price = 1290
      colorHex = "#757575"
      colorName = "Grey"
    } else if (file.startsWith('1150')) {
      title = `Urban Textured Polo ${poloIndex++}`
      description = `A modern take on the classic polo. This piece features a subtle textured weave, providing an extra dimension of style and comfort for the contemporary man.`
      price = 1150
      colorHex = "#4CAF50"
      colorName = "Green"
    } else if (file.startsWith('Gemini')) {
      // The user wants EVERYTHING from here as Polo and T-shirt based on prices, but Gemini images didn't have prices in names.
      // So we randomly assign them as Polos or T-Shirts.
      if (Math.random() < 0.5) {
        title = `Premium Essential T-Shirt ${tShirtIndex++}`
        description = `An elevated take on the casual staple. This t-shirt is made from ultra-soft heavyweight cotton for a perfect drape.`
        price = 790
        isTShirt = true
        colorHex = "#FFFFFF"
        colorName = "White"
      } else {
        title = `Modern Fit Polo ${poloIndex++}`
        description = `Refined and versatile. Our Modern Fit Polo is designed with premium breathable fabric and precise tailoring for an impeccable look.`
        price = 1190
        colorHex = "#212121"
        colorName = "Charcoal"
      }
    }

    if (!title) continue

    const categoryNameToUse = isTShirt ? tShirtCategory.id : poloCategory.id

    const existingProduct = await prisma.product.findFirst({
      where: {
        images: {
          some: { url: `/New Product/${file}` }
        }
      }
    })

    if (existingProduct) {
      console.log(`⏭️  Skipped (already seeded): ${title}`)
      continue
    }

    const product = await prisma.product.create({
      data: {
        name: title,
        slug: generateSlug(title),
        description,
        price,
        comparePrice: price > 1000 ? price + 500 : price + 200,
        categoryId: categoryNameToUse,
        tags: 'premium, bindu, menswear',
        isActive: true,
        isFeatured: Math.random() > 0.7,
        images: {
          create: [
            {
              url: `/New Product/${file}`,
              alt: title,
              sortOrder: 0,
            }
          ]
        },
        variants: {
          create: sizes.map(size => ({
            size,
            color: colorName,
            colorHex,
            sku: `BP-${Math.floor(Math.random() * 10000)}-${size}`,
            stock: 50
          }))
        }
      }
    })

    console.log(`✅ Created: ${product.name} (${price} BDT) in ${isTShirt ? 'T-Shirts' : 'Polo'}`)
  }

  // ─── Coupons ──────────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: DiscountType.PERCENTAGE,
      value: 10,
      isActive: true,
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'MINUS500' },
    update: {},
    create: {
      code: 'MINUS500',
      type: DiscountType.FLAT,
      value: 500,
      minOrderAmount: 3000,
      isActive: true,
    },
  })
  console.log('✅ Coupons: WELCOME10, MINUS500')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
