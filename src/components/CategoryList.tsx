'use client'

import { Card, CardBody } from "@nextui-org/react"
import Link from "next/link"
import { Layers } from "lucide-react"

interface CategoryListProps {
  categories: string[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/categories/${category.toLowerCase()}`}
          className="transform transition-transform hover:scale-105"
        >
          <Card className="h-48">
            <CardBody className="flex items-center justify-center text-center p-6">
              <div>
                <Layers className="w-12 h-12 mb-4 mx-auto text-primary" />
                <h2 className="text-xl font-semibold">{category}</h2>
                <p className="text-sm text-default-500 mt-2">
                  Browse {category} collection
                </p>
              </div>
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  )
}
