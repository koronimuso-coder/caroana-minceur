"use client";

import { useState } from "react";
import { User, ClipboardList, MapPin, Settings, ShieldCheck, ShoppingBag } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");

  // Mocked authenticated user for development/demo
  const [user, setUser] = useState({
    firstName: "Mariam",
    lastName: "Kouamé",
    email: "mariam.kouame@gmail.com",
    phone: "+225 07 48 99 12 34",
    role: "customer",
    preferredLanguage: "fr",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "adr1",
      city: "Abidjan",
      commune: "Cocody",
      neighborhood: "Angré 8ème Tranche",
      landmark: "Près de l'immeuble CGECI",
      addressLine: "Villa 24, Rue L12",
      isDefault: true,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: "ord_1",
      orderNumber: "CM-2026-000001",
      createdAt: "19/06/2026",
      grandTotal: 12000,
      paymentStatus: "paid",
      fulfillmentStatus: "delivered",
      itemsCount: 2,
    },
  ]);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-ivoire/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="font-serif text-3xl font-bold text-forest">Mon Espace Client</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Bonjour, <span className="font-bold text-forest">{user.firstName}</span>. Suivez vos commandes et gérez vos préférences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 bg-white p-6 rounded-premium border border-forest/5 shadow-premium space-y-2">
            {[
              { id: "orders", label: "Mes Commandes", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "addresses", label: "Mes Adresses", icon: <MapPin className="w-4 h-4" /> },
              { id: "profile", label: "Mon Profil", icon: <User className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-button text-xs font-semibold cursor-pointer transition-smooth ${
                  activeTab === tab.id
                    ? "bg-forest text-ivoire"
                    : "text-forest hover:bg-forest/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white p-8 rounded-premium border border-forest/5 shadow-premium min-h-[50vh]">
            
            {/* 1. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-forest pb-2 border-b border-forest/10">
                  Historique de vos commandes
                </h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-10 h-10 text-forest/20 mx-auto mb-3" />
                    <p className="text-sm text-foreground/50">Vous n&apos;avez passé aucune commande pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-premium border border-forest/5 bg-ivoire/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <p className="font-bold text-forest">{ord.orderNumber}</p>
                          <p className="text-foreground/45 mt-0.5">Passée le {ord.createdAt}</p>
                          <p className="text-foreground/60 mt-1">{ord.itemsCount} article(s)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-success/15 text-success font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                            {ord.paymentStatus === "paid" ? "Payée" : "En attente"}
                          </span>
                          <span className="bg-forest/10 text-forest font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                            {ord.fulfillmentStatus === "delivered" ? "Livrée" : "En cours"}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-forest min-w-[100px] text-right">
                          {ord.grandTotal.toLocaleString("fr-FR")} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-forest/10">
                  <h2 className="font-serif text-xl font-bold text-forest">
                    Vos Adresses de livraison
                  </h2>
                  <button className="text-xs font-bold text-solar hover:underline cursor-pointer">
                    + Ajouter
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((adr) => (
                    <div
                      key={adr.id}
                      className="p-5 rounded-premium border border-forest/5 bg-ivoire/10 relative flex flex-col justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-forest">{adr.commune}</span>
                          {adr.isDefault && (
                            <span className="bg-solar/20 text-solar-dark font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-foreground/80">{adr.neighborhood}</p>
                        <p className="text-foreground/70">{adr.addressLine}</p>
                        <p className="text-[10px] text-foreground/50 mt-1">Repère: {adr.landmark}</p>
                      </div>
                      <div className="flex justify-end space-x-3 pt-4 border-t border-forest/10 mt-4 text-[10px] font-bold">
                        <button className="text-forest hover:text-solar cursor-pointer">Modifier</button>
                        <button className="text-danger hover:underline cursor-pointer">Supprimer</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-forest pb-2 border-b border-forest/10">
                  Modifier mes informations
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-forest uppercase tracking-wider block mb-1">Prénom</label>
                    <input
                      type="text"
                      defaultValue={user.firstName}
                      className="w-full bg-white border border-forest/10 rounded-button text-xs p-2.5 focus:outline-none focus:border-solar"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-forest uppercase tracking-wider block mb-1">Nom</label>
                    <input
                      type="text"
                      defaultValue={user.lastName}
                      className="w-full bg-white border border-forest/10 rounded-button text-xs p-2.5 focus:outline-none focus:border-solar"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-forest uppercase tracking-wider block mb-1">Téléphone</label>
                    <input
                      type="text"
                      defaultValue={user.phone}
                      className="w-full bg-white border border-forest/10 rounded-button text-xs p-2.5 focus:outline-none focus:border-solar"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-forest uppercase tracking-wider block mb-1">Adresse Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full bg-forest/5 text-forest/50 border border-forest/10 rounded-button text-xs p-2.5 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="flex items-center space-x-1.5 px-6 py-2.5 bg-forest hover:bg-forest-light text-ivoire font-bold rounded-button shadow-premium transition-smooth text-xs cursor-pointer">
                    <ShieldCheck className="w-4 h-4 text-solar" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
