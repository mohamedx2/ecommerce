import { Spinner } from "@nextui-org/react"

export default function RootLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="lg" />
    </div>
  )
}
