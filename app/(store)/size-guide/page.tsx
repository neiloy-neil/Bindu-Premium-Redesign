import { Ruler } from "lucide-react"

export const metadata = {
  title: "Size Guide | Bindu Premium",
  description: "Comprehensive size guide and measurements for Bindu Premium garments.",
}

const sizeCharts = {
  tops: [
    { size: "S", chest: "38", length: "27", shoulder: "17" },
    { size: "M", chest: "40", length: "28", shoulder: "17.5" },
    { size: "L", chest: "42", length: "29", shoulder: "18" },
    { size: "XL", chest: "44", length: "30", shoulder: "18.5" },
    { size: "XXL", chest: "46", length: "31", shoulder: "19" }
  ],
  bottoms: [
    { size: "30", waist: "30", inseam: "30", hip: "38" },
    { size: "32", waist: "32", inseam: "30", hip: "40" },
    { size: "34", waist: "34", inseam: "32", hip: "42" },
    { size: "36", waist: "36", inseam: "32", hip: "44" },
    { size: "38", waist: "38", inseam: "32", hip: "46" }
  ]
}

export default function SizeGuidePage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          Size Guide
        </h1>
        <p className="text-bindu-text-muted text-lg">
          Find your perfect fit. All measurements are provided in inches unless otherwise stated.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 space-y-16">
        
        {/* Tops */}
        <div className="bg-white border border-bindu-border-grey p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Ruler className="w-6 h-6 text-bindu-orange" />
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight">
              Tops & Shirts
            </h2>
          </div>
          <p className="text-bindu-text-muted mb-8">
            Applies to T-Shirts, Polos, and Casual Shirts. For a relaxed fit, we recommend sizing up.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-bindu-light-grey border-b border-bindu-border-grey">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Size</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Chest (in)</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Length (in)</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Shoulder (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bindu-border-grey text-bindu-text-muted">
                {sizeCharts.tops.map((row) => (
                  <tr key={row.size} className="hover:bg-bindu-light-grey/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-bindu-navy">{row.size}</td>
                    <td className="py-4 px-4">{row.chest}</td>
                    <td className="py-4 px-4">{row.length}</td>
                    <td className="py-4 px-4">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottoms */}
        <div className="bg-white border border-bindu-border-grey p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Ruler className="w-6 h-6 text-bindu-orange" />
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight">
              Bottoms & Trousers
            </h2>
          </div>
          <p className="text-bindu-text-muted mb-8">
            Applies to Chinos, Denim, and Shorts.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-bindu-light-grey border-b border-bindu-border-grey">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Size</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Waist (in)</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Inseam (in)</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Hip (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bindu-border-grey text-bindu-text-muted">
                {sizeCharts.bottoms.map((row) => (
                  <tr key={row.size} className="hover:bg-bindu-light-grey/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-bindu-navy">{row.size}</td>
                    <td className="py-4 px-4">{row.waist}</td>
                    <td className="py-4 px-4">{row.inseam}</td>
                    <td className="py-4 px-4">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="bg-bindu-navy text-white p-8 md:p-12">
          <h2 className="text-2xl font-heading font-bold uppercase tracking-tight mb-8 text-bindu-orange">
            How To Measure
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-3">Chest</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Measure around the fullest part of your chest, keeping the measuring tape horizontal and ensuring it is not too tight.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-3">Waist</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Measure around your natural waistline, where your trousers normally sit. Keep one finger between the tape and your body for a comfortable fit.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-3">Shoulder</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Measure from the tip of one shoulder across the back to the tip of the other shoulder.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b border-white/20 pb-3">Inseam</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Measure from the top of your inner thigh down to the bottom of your ankle. Alternatively, measure a pair of trousers that fit you well.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}
