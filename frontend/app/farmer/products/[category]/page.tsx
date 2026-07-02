"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CategoryRedirect() {
  const router = useRouter();
  const { category } = useParams();

  useEffect(() => {
    if (category) {
      router.replace(`/farmer/products?category=${encodeURIComponent(category as string)}`);
    } else {
      router.replace(`/farmer/products`);
    }
  }, [category, router]);

  return null;
}
