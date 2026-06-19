"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, AlertTriangle, ShieldCheck, Edit, Eye, EyeOff } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([
    {
      id: "p1",
      sku: "GVP-01",
      name: "Gélules Ventre Plat",
      price: 15000,
      stock: 100,
      status: "published",
    },
    {
      id: "p2",
      sku: "TD-01",
      name: "Thé Détox",
      price: 8000,
      stock: 3,
      status: "published",
    },
    {
      id: "p3",
      sku: "TVP-01",
      name: "Tisane Ventre Plat",
      price: null, // Null price warning
      stock: 80,
      status: "draft",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handlePublish = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (product.price === null || product.price <= 0) {
      setNotification(`Erreur : Le prix de "${product.name}" doit être configuré avant publication.`);
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: "published" } : p))
    );
  };

  const handleUnpublish = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: "draft" } : p))
    );
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-ivoire/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest">Gestion du catalogue</h1>
            <p className="text-sm text-foreground/60 mt-1">Gérer les fiches produits et la publication</p>
          </div>
          <button className="flex items-center space-x-1 px-4 py-2 bg-forest hover:bg-forest-light text-ivoire font-bold rounded-button text-xs transition-smooth cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="bg-danger/10 border border-danger/20 p-4 rounded-premium mb-6 flex items-start space-x-3 text-xs text-danger font-semibold">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Table list */}
        <div className="bg-white rounded-premium border border-forest/5 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-forest text-ivoire uppercase font-bold tracking-wider text-[10px]">
                  <th className="p-4">SKU</th>
                  <th className="p-4">Nom</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const hasPrice = p.price !== null && p.price > 0;
                  return (
                    <tr key={p.id} className="border-b border-forest/5 hover:bg-ivoire/5">
                      <td className="p-4 font-semibold">{p.sku}</td>
                      <td className="p-4 font-bold text-forest">{p.name}</td>
                      <td className="p-4 font-semibold">
                        {hasPrice ? (
                          `${p.price?.toLocaleString("fr-FR")} FCFA`
                        ) : (
                          <span className="text-danger flex items-center">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                            Non configuré
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock <= 5 ? "text-danger font-bold" : ""}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                          p.status === "published" ? "bg-success/15 text-success" : "bg-forest/10 text-forest/60"
                        }`}>
                          {p.status === "published" ? "Publié" : "Brouillon"}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end space-x-2 items-center">
                        {p.status === "published" ? (
                          <button
                            onClick={() => handleUnpublish(p.id)}
                            className="p-1.5 rounded-full hover:bg-forest/5 text-forest cursor-pointer"
                            title="Retirer du catalogue"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(p.id)}
                            className={`p-1.5 rounded-full hover:bg-forest/5 text-forest cursor-pointer ${
                              !hasPrice ? "opacity-30 cursor-not-allowed" : ""
                            }`}
                            title="Publier sur le site"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 rounded-full hover:bg-forest/5 text-forest cursor-pointer" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
