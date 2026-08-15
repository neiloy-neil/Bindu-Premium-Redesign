"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev)
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id)
      } else {
        if (!allowMultiple) {
          newOpenItems.clear()
        }
        newOpenItems.add(id)
      }
      return newOpenItems
    })
  }

  return (
    <div className="w-full divide-y divide-bindu-border-grey border-y border-bindu-border-grey">
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        
        return (
          <div key={item.id} className="py-4">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between text-left focus:outline-none group"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-bold uppercase tracking-widest text-bindu-navy group-hover:text-bindu-orange transition-colors">
                {item.title}
              </span>
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-bindu-text-muted transition-transform duration-300",
                  isOpen && "transform rotate-180 text-bindu-navy"
                )} 
              />
            </button>
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="text-bindu-text-muted leading-relaxed pb-4">
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
