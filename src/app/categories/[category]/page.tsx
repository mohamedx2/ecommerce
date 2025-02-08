import { connectDB } from '@/lib/mongodb'
import { Product } from '@/models/Product'
import ProductCard from '@/components/ProductCard'

type Params = Promise<{ category: string }>



async function getProducts(category: string) {
  await connectDB()
  return Product.find({ 
    category: { $regex: new RegExp(`^${category}$`, 'i') } 
  })
    .lean()
    .then(products => products.map((product:any) => ({
      ...product,
      _id: product._id.toString()
    })))
}

export default async function CategoryPage(props: {
  params: Params
}) {
  try {
    const params = await props.params
    const products = await getProducts(params.category)
    return (
      <div className="py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 capitalize">{params.category}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image}
            />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch category:', error)
    return []
  }
  

}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
