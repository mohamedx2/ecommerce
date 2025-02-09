import { Spinner } from "@nextui-org/react"

export default function ProductsLoading() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Spinner size="lg" label="Loading products..." />
    </div>
  )
}
