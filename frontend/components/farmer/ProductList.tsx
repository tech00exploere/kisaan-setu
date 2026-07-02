"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  unit?: string;
  forecast?: number;
}

export default function ProductList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const fetchItems = async () => {
    if (!token) {
      setError('No auth token found');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!token) return;
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setItems(prev => prev.filter(item => item._id !== id));
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(String(e));
      }
    }
  }, [token]);

  const handleEdit = useCallback(async (item: Item) => {
    if (!token) return;
    const newForecast = prompt(
      'Enter new forecast value (leave blank to keep current)',
      item.forecast?.toString() || ''
    );
    if (newForecast === null) return;
    const updates: Partial<Item> = {};
    if (newForecast.trim() !== '') updates.forecast = Number(newForecast);
    try {
      const res = await fetch(`/api/items/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setItems(prev => prev.map(i => (i._id === updated._id ? updated : i)));
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert(String(e));
      }
    }
  }, [token]);

  if (loading) return <p className="text-center py-8">Loading products…</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;
  if (!items.length)
    return <p className="text-center py-8">No products found.</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <Card key={item._id} className="bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-col space-y-2">
            <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
            <p className="text-sm text-gray-600">{item.category}</p>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Price: ₹{item.price.toFixed(2)}</p>
            {item.forecast !== undefined && (
              <p className="text-sm text-indigo-600">Forecast: {item.forecast}</p>
            )}
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(item._id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
