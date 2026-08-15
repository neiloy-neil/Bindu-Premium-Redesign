import { LookbookGallery } from "@/components/premium/LookbookGallery"

export const metadata = {
  title: "Lookbook | Bindu Premium",
  description: "Explore the latest campaigns and editorial styling from Bindu Premium.",
}

const lookbookImages = [
  {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=2000&auto=format&fit=crop",
    alt: "Bindu Premium Drop 01 Hero",
    featuredProduct: {
      name: "The Essential Heavyweight T-Shirt",
      price: 850,
      slug: "essential-heavyweight-t-shirt"
    }
  },
  {
    id: "img-2",
    url: "https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=2940&auto=format&fit=crop",
    alt: "Bindu Premium Everyday Wear",
  },
  {
    id: "img-3",
    url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
    alt: "Bindu Premium Styling",
    featuredProduct: {
      name: "Signature Pique Polo",
      price: 1250,
      slug: "signature-pique-polo"
    }
  },
  {
    id: "img-4",
    url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop",
    alt: "Bindu Premium Formal",
  },
  {
    id: "img-5",
    url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2940&auto=format&fit=crop",
    alt: "Bindu Premium Layers",
    featuredProduct: {
      name: "Minimalist Panjabi",
      price: 2450,
      slug: "minimalist-panjabi"
    }
  },
  {
    id: "img-6",
    url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2000&auto=format&fit=crop",
    alt: "Bindu Premium Close up",
  }
]

export default function LookbookPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Collection 01
        </h1>
        <p className="text-bindu-text-muted text-lg tracking-widest uppercase text-xs font-bold">
          The Foundation Drop
        </p>
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-8 max-w-[1600px] mx-auto">
        <LookbookGallery images={lookbookImages} />
      </section>
    </div>
  )
}
