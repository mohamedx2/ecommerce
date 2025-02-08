import CategoryList from '../../components/CategoryList'
import { Product } from '@/models/Product'
import { connectDB } from '@/lib/mongodb'

async function getCategories() {
  try {
    await connectDB()
    const categories = await Product.distinct('category')
    return categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Shop by Category</h1>
      <CategoryList categories={categories} />
    </div>
  )
}
