"use client";

import { useState } from "react";
import { Search, Eye, Check, X, Truck, FileText } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    {
      id: "ord_1",
      orderNumber: "CM-2026-000001",
      customer: "Mariam Kouamé",
      phone: "+225 07 48 99 12 34",
      commune: "Cocody",
      total: 12000,
      paymentMethod: "ManualPaymentProvider",
      paymentStatus: "verification_required",
      fulfillmentStatus: "unfulfilled",
      proofUrl: "https://mock-storage-proof.pdf",
    },
    {
      id: "ord_2",
      orderNumber: "CM-2026-000002",
      customer: "Amadou Diallo",
      phone: "+225 01 02 03 04 05",
      commune: "Marcory",
      total: 8000,
      paymentMethod: "CashOnDeliveryProvider",
      paymentStatus: "pending",
      fulfillmentStatus: "processing",
      proofUrl: null,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleValidatePayment = (id: string) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? { ...o, paymentStatus: "paid" as const, fulfillmentStatus: "processing" as const }
          : o
      )
    );
  };

  const handleShipOrder = (id: string) => {
    setOrders(
      orders.map((o) =>
        o.id === id ? { ...o, fulfillmentStatus: "shipped" as const } : o
      )
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending_verify") return o.paymentStatus === "verification_required";
    if (filterStatus === "unfulfilled") return o.fulfillmentStatus === "unfulfilled";
    return true;
  });

  return (
    <div className="pt-28 pb-20 min-h-screen bg-ivoire/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-forest">Gestion des Commandes</h1>
          <p className="text-sm text-foreground/60 mt-1">Suivre les livraisons et valider les reçus de paiement</p>
        </div>

        {/* Toolbar */}
        <div className="glassmorphism p-6 rounded-premium shadow-premium mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex space-x-2">
            {[
              { label: "Toutes", val: "all" },
              { label: "À vérifier (Mobile Money)", val: "pending_verify" },
              { label: "À expédier", val: "unfulfilled" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilterStatus(tab.val)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer transition-smooth ${
                  filterStatus === tab.val
                    ? "bg-forest text-ivoire"
                    : "bg-white text-forest hover:bg-forest/5 border border-forest/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-premium border border-forest/5 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-forest text-ivoire uppercase font-bold tracking-wider text-[10px]">
                  <th className="p-4">Numéro</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Commune</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Paiement</th>
                  <th className="p-4">Livraison</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-forest/5 hover:bg-ivoire/5">
                    <td className="p-4 font-bold text-forest">{o.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-semibold">{o.customer}</p>
                      <p className="text-[10px] text-foreground/50">{o.phone}</p>
                    </td>
                    <td className="p-4 font-semibold">{o.commune}</td>
                    <td className="p-4 font-bold">{o.total.toLocaleString("fr-FR")} FCFA</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                        o.paymentStatus === "paid"
                          ? "bg-success/15 text-success"
                          : o.paymentStatus === "verification_required"
                          ? "bg-solar/20 text-solar-dark"
                          : "bg-danger/10 text-danger"
                      }`}>
                        {o.paymentStatus === "paid"
                          ? "Payé"
                          : o.paymentStatus === "verification_required"
                          ? "À vérifier"
                          : "En attente"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-forest/10 text-forest/80">
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end space-x-2 items-center">
                      {o.paymentStatus === "verification_required" && (
                        <button
                          onClick={() => handleValidatePayment(o.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-success text-white font-bold rounded-button text-[10px] cursor-pointer"
                          title="Valider le transfert"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Valider</span>
                        </button>
                      )}
                      
                      {o.fulfillmentStatus === "unfulfilled" && o.paymentStatus === "paid" && (
                        <button
                          onClick={() => handleShipOrder(o.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-forest text-ivoire font-bold rounded-button text-[10px] cursor-pointer"
                          title="Expédier"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Expédier</span>
                        </button>
                      )}

                      <button className="p-1.5 rounded-full hover:bg-forest/5 text-forest cursor-pointer" title="Voir détails">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
