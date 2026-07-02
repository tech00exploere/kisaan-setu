import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <p className="text-slate-500">
          Create a new agricultural listing
        </p>
      </div>

      <div className="rounded-3xl border bg-white p-8">
        <div className="space-y-6">
          <Input placeholder="Product Name" />

          <Input placeholder="Category" />

          <Input placeholder="Sub Category" />

          <Input placeholder="Quantity" />

          <Input placeholder="Price" />

          <Input placeholder="Location" />

          <Input placeholder="Image URL" />

          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
}