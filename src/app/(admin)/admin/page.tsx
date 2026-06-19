"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, TrendingUp, AlertTriangle, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  // Mock data for analytics dashboard
  const stats = {
    revenue: 450000,
    orders: 38,
    paidOrders: 26,
    avgCart: 11840,
    conversionRate: "3.4%",
    newClients: 14,
  };

  const lowStockProducts = [
    { name: "Thé Détox", stock: 3, threshold: 5 },
  ];

  // Products with price: null which triggers validation warnings
  const unconfiguredPriceProducts = [
    { name: "Tisane Ventre Plat (Brouillon)", id: "p3", sku: "TVP-01" },
  ];

  const recentOrders = [
    { id: "ord_1", orderNumber: "CM-2026-000001", customer: "Mariam Kouamé", total: 12000, date: "Il y a 10 min", status: "pending" },
    { id: "ord_2", orderNumber: "CM-2026-000002", customer: "Amadou Diallo", total: 8000, date: "Il y a 1h", status: "paid" },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-ivoire/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest">Tableau de Bord</h1>
            <p className="text-sm text-foreground/60 mt-1">Administration de CAROANA MINCEUR</p>
          </div>
          <div className="flex space-x-3 text-xs font-bold">
            <Link href="/admin/produits" className="px-4 py-2 border border-forest/20 text-forest rounded-button hover:bg-forest/5 transition-smooth">
              Gérer les Produits
            </Link>
            <Link href="/admin/commandes" className="px-4 py-2 bg-forest text-ivoire rounded-button hover:bg-forest-light transition-smooth">
              Gérer les Commandes
            </Link>
          </div>
        </div>

        {/* PRICE ALERTE: Product with null price warning */}
        {unconfiguredPriceProducts.length > 0 && (
          <div className="bg-danger/10 border-2 border-danger/25 p-5 rounded-premium mb-8 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
            <div className="text-xs text-danger">
              <h3 className="font-bold text-sm">Alerte de Sécurité / Catalogue</h3>
              <p className="mt-1 leading-relaxed">
                Le produit <span className="font-bold">{unconfiguredPriceProducts[0]?.name}</span> a un prix non configuré. Conformément aux règles de sécurité, sa publication est bloquée pour éviter les ventes à montant nul.
              </p>
              <Link
                href={`/admin/produits/${unconfiguredPriceProducts[0]?.id}`}
                className="inline-flex items-center text-xs font-bold mt-2 hover:underline"
              >
                <span>Configurer le prix maintenant</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Revenue */}
          <div className="bg-white p-6 rounded-premium border border-forest/5 shadow-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Chiffre d&apos;affaires</span>
              <span className="text-xl font-bold text-forest mt-1 block">
                {stats.revenue.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-premium border border-forest/5 shadow-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Commandes</span>
              <span className="text-xl font-bold text-forest mt-1 block">{stats.orders}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          {/* Average Cart */}
          <div className="bg-white p-6 rounded-premium border border-forest/5 shadow-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Panier Moyen</span>
              <span className="text-xl font-bold text-forest mt-1 block">
                {stats.avgCart.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* New Clients */}
          <div className="bg-white p-6 rounded-premium border border-forest/5 shadow-premium flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Nouveaux Clients</span>
              <span className="text-xl font-bold text-forest mt-1 block">{stats.newClients}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-forest/5 flex items-center justify-center text-forest">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white p-6 rounded-premium border border-forest/5 shadow-premium space-y-6">
            <h2 className="font-serif text-lg font-bold text-forest pb-2 border-b border-forest/10">
              Commandes Récentes
            </h2>
            <div className="space-y-4">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-4 bg-ivoire/10 rounded-premium border border-forest/5 text-xs"
                >
                  <div>
                    <p className="font-bold text-forest">{ord.orderNumber}</p>
                    <p className="text-foreground/45 mt-0.5">{ord.customer} • {ord.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-0.5 rounded-full uppercase text-[9px] font-bold ${
                      ord.status === "paid" ? "bg-success/15 text-success" : "bg-solar/20 text-solar-dark"
                    }`}>
                      {ord.status === "paid" ? "Payée" : "En attente"}
                    </span>
                    <span className="font-bold text-forest">
                      {ord.total.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Stocks */}
          <div className="bg-white p-6 rounded-premium border border-forest/5 shadow-premium space-y-6">
            <h2 className="font-serif text-lg font-bold text-forest pb-2 border-b border-forest/10">
              Alertes de Stock
            </h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-foreground/50 text-center py-6">Aucune alerte de stock.</p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-solar/5 border border-solar/25 rounded-premium flex items-start space-x-3 text-xs"
                  >
                    <AlertTriangle className="w-4 h-4 text-solar flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-forest">{p.name}</h4>
                      <p className="text-foreground/60 mt-0.5">Stock restant : <span className="font-bold text-danger">{p.stock}</span> (Seuil: {p.threshold})</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
