'use client'

import type { Product } from '@/lib/types/types'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden p-0 border-none bg-[#00B88A] text-white">

      {/* AUTHENTIC BAR */}
      <div className="flex items-center justify-center bg-[#00B88A] ">
        <Check className="w-5 h-5 text-white" />
        <span className="font-semibold text-lg">AUTHENTIC</span>
      </div>

      {/* MORE INFORMATION SECTION */}
      <div className="w-full px-3 pb-6">
        <p className="text-xs font-semibold tracking-wide text-white">
          MORE INFORMATION
        </p>
        <hr className=' mb-3'></hr>
        


          {/* Label ID */}
          <div className="flex gap-2">
            <span className="text-[11px] font-bold">Label ID</span>
            <span className="text-sm opacity-80 break-all font-medium">
              {product.labelId || 'N/A'}
            </span>
          </div>

          {/* Title */}
          <div className="flex gap-2">
            <span className="text-[11px] font-bold">Title</span>
            <span className="text-sm opacity-80 font-medium">
              {product.title}
            </span>
          </div>

          {/* Description */}
          <div className="flex gap-2">
            <span className="text-[11px]  font-bold">Description</span>
            <span className="text-sm opacity-80 leading-relaxed font-medium">
              {product.description || 'No description provided.'}
            </span>
          </div>

        </div>

    </Card>
  )
}
