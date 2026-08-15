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

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000)
}

async function main() {
  console.log("Adding new products...")

  // Fetch categories to map properly
  const categories = await prisma.category.findMany()
  const catMap = {}
  categories.forEach(c => {
    catMap[c.name.toLowerCase()] = c.id
  })

  const getCategoryId = (name) => {
    return catMap[name.toLowerCase()] || categories[0].id
  }

  const dirPath = path.join(__dirname, '../public/New Product')
  const files = fs.readdirSync(dirPath)

  let geminiIndex = 1

  for (const file of files) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png')) continue

    let title = ""
    let description = ""
    let price = 0
    let categoryName = ""
    let colorHex = "#000000"
    let colorName = "Black"

    if (file.startsWith('790')) {
      title = `Premium Essential T-Shirt`
      description = `Crafted from high-quality, breathable cotton, this premium t-shirt offers a relaxed fit for everyday comfort. The minimal design ensures versatility for any casual setting.`
      price = 790
      categoryName = "T-Shirts"
      colorHex = "#2196F3"
      colorName = "Blue"
    } else if (file.startsWith('1190')) {
      title = `Signature Contrast Polo`
      description = `Elevate your casual wear with our Signature Contrast Polo. Featuring distinctive collar and sleeve accents, it's tailored from a rich cotton-blend pique for a sophisticated look.`
      price = 1190
      categoryName = "Polo"
      colorHex = "#FF5722"
      colorName = "Orange"
    } else if (file.startsWith('1290')) {
      title = `Classic Solid Polo`
      description = `The epitome of timeless style. Our Classic Solid Polo is crafted with a structured collar and premium fabric, offering a sharp, modern silhouette perfect for both office and weekend.`
      price = 1290
      categoryName = "Polo"
      colorHex = "#757575"
      colorName = "Grey"
    } else if (file.startsWith('1150')) {
      title = `Urban Textured Polo`
      description = `A modern take on the classic polo. This piece features a subtle textured weave, providing an extra dimension of style and comfort for the contemporary man.`
      price = 1150
      categoryName = "Polo"
      colorHex = "#4CAF50"
      colorName = "Green"
    } else if (file.startsWith('Gemini')) {
      // Randomly assign to Shirts, Panjabi, or Accessories
      const rand = Math.random()
      if (rand < 0.4) {
        title = `Heritage Panjabi Collection Vol. ${geminiIndex}`
        description = `Embrace tradition with a modern twist. This premium Panjabi features intricate detailing and is tailored from luxurious, lightweight fabric ideal for festive occasions.`
        price = 2490 + Math.floor(Math.random() * 5) * 200 // 2490 - 3290
        categoryName = "Panjabi"
        colorHex = "#9C27B0"
        colorName = "Purple"
      } else if (rand < 0.8) {
        title = `Executive Oxford Shirt Edition ${geminiIndex}`
        description = `A staple for the modern professional. Woven from premium long-staple cotton, this shirt offers a crisp look with all-day breathability and an impeccable tailored fit.`
        price = 1890 + Math.floor(Math.random() * 4) * 100 // 1890 - 2190
        categoryName = "Shirts"
        colorHex = "#FFFFFF"
        colorName = "White"
      } else {
        title = `Premium Leather Accessory ${geminiIndex}`
        description = `Handcrafted from full-grain leather, this timeless accessory adds a touch of sophistication to any outfit, combining unmatched durability with elegant design.`
        price = 990 + Math.floor(Math.random() * 3) * 300 // 990 - 1590
        categoryName = "Accessories"
        colorHex = "#795548"
        colorName = "Brown"
      }
      geminiIndex++
    }

    if (!title) continue // Skip unknown files

    // Create Product
    const product = await prisma.product.create({
      data: {
        name: title,
        slug: generateSlug(title),
        description,
        price,
        categoryId: getCategoryId(categoryName),
        isActive: true,
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
          create: categoryName === "Accessories" ? [] : [
            { size: "S", color: colorName, colorHex, sku: `BP-${Math.floor(Math.random()*10000)}-S`, stock: 50 },
            { size: "M", color: colorName, colorHex, sku: `BP-${Math.floor(Math.random()*10000)}-M`, stock: 50 },
            { size: "L", color: colorName, colorHex, sku: `BP-${Math.floor(Math.random()*10000)}-L`, stock: 50 },
            { size: "XL", color: colorName, colorHex, sku: `BP-${Math.floor(Math.random()*10000)}-XL`, stock: 50 },
          ]
        }
      }
    })

    console.log(`Created: ${product.name} (${price} BDT) in ${categoryName}`)
  }

  console.log("Finished adding new products!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
