"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import Link from "next/link"

interface LookbookImage {
  id: string
  url: string
  alt: string
  featuredProduct?: {
    name: string
    price: number
    slug: string
  }
}

interface LookbookGalleryProps {
  images: LookbookImage[]
}

export function LookbookGallery({ images }: LookbookGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleOpen = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = "hidden"
  }

  const handleClose = () => {
    setSelectedIndex(null)
    document.body.style.overflow = "auto"
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="break-inside-avoid relative group cursor-pointer overflow-hidden"
            onClick={() => handleOpen(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              width={800}
              height={1200}
              className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            {/* Hover overlay with product info if available */}
            {image.featuredProduct && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="bg-bindu-white w-full p-4 flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <h4 className="font-bold text-bindu-navy text-sm uppercase tracking-wider">{image.featuredProduct.name}</h4>
                    <p className="text-bindu-text-muted text-sm">৳{image.featuredProduct.price}</p>
                  </div>
                  <ShoppingBag className="w-5 h-5 text-bindu-navy" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox / Fullscreen Viewer */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
          onClick={handleClose}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
            onClick={handleClose}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          {selectedIndex > 0 && (
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-4"
              onClick={handleNext}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative w-full max-w-5xl h-[80vh] flex flex-col md:flex-row items-center justify-center gap-8 px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full md:w-2/3 h-full">
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Shop the look panel */}
            {images[selectedIndex].featuredProduct && (
              <div className="w-full md:w-1/3 bg-bindu-navy p-8 border border-white/10 text-white">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mb-4 block">Shop The Look</span>
                <h3 className="text-2xl font-heading font-bold uppercase tracking-tight mb-2">
                  {images[selectedIndex].featuredProduct!.name}
                </h3>
                <p className="text-lg text-white/70 mb-8">
                  ৳{images[selectedIndex].featuredProduct!.price}
                </p>
                <Link href={`/shop/${images[selectedIndex].featuredProduct!.slug}`}>
                  <button className="w-full bg-bindu-orange text-white h-12 text-sm uppercase tracking-widest font-bold hover:bg-bindu-orange/90 transition-colors">
                    View Product
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
