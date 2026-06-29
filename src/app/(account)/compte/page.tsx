"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  ClipboardList, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Loader2, 
  Edit,
  AlertTriangle,
  PlusCircle,
  Home
} from "lucide-react";
import { 
  getUserProfile, 
  updateUserProfile, 
  getAddresses, 
  saveAddress, 
  deleteAddress, 
  setDefaultAddress, 
  getUserOrders 
} from "@/server/actions/profile.action";
import { UserAddress } from "@/types";

export default function AccountPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<UserAddress>>({
    firstName: "",
    lastName: "",
    phone: "",
    secondaryPhone: "",
    country: "Côte d'Ivoire",
    city: "Abidjan",
    commune: "",
    neighborhood: "",
    landmark: "",
    addressLine: "",
    deliveryInstructions: "",
    isDefault: false
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);

  // Load user data once logged in
  useEffect(() => {
    if (!authUser) return;

    const uid = authUser.uid;
    const email = authUser.email;
    const displayName = authUser.displayName;
    const phoneNumber = authUser.phoneNumber;

    async function loadData() {
      setLoading(true);
      
      // Get profile
      const profRes = await getUserProfile(uid);
      if (profRes.success && profRes.profile) {
        setProfile({
          firstName: profRes.profile.firstName || "",
          lastName: profRes.profile.lastName || "",
          phone: profRes.profile.phone || "",
          email: email || ""
        });
      } else {
        // First login or incomplete signup, prefill with displayName split
        const names = (displayName || "").split(" ");
        setProfile({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          phone: phoneNumber || "",
          email: email || ""
        });
      }

      // Get addresses
      const addrRes = await getAddresses(uid);
      if (addrRes.success && addrRes.addresses) {
        setAddresses(addrRes.addresses);
      }

      // Get orders
      const ordRes = await getUserOrders(uid);
      if (ordRes.success && ordRes.orders) {
        setOrders(ordRes.orders);
      }

      setLoading(false);
    }

    loadData();
  }, [authUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-bg" style={{ color: "var(--color-theme-fg)" }}>
        <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
      </div>
    );
  }

  // Not logged in state
  if (!authUser) {
    return (
      <div className="pt-32 pb-20 min-h-[70vh] flex flex-col items-center justify-center text-center px-4" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
        <div className="w-16 h-16 rounded-full bg-theme-fg/5 flex items-center justify-center mb-6">
          <User className="w-8 h-8 text-theme-fg/45" />
        </div>
        <h1 className="font-serif text-2xl font-bold">Mon Espace Client</h1>
        <p className="text-sm text-theme-fg/60 mt-2 max-w-sm">
          Connectez-vous pour suivre vos commandes de phytothérapie minceur et configurer vos adresses de livraison.
        </p>
        <button
          onClick={() => {
            // Trigger login modal
            const event = new CustomEvent("open-auth-modal");
            window.dispatchEvent(event);
          }}
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-theme-accent text-theme-bg font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          Se connecter / S'inscrire
        </button>
      </div>
    );
  }

  // Form submit for user profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setSaveSuccess(false);
    
    if (!profile.firstName || !profile.lastName || !profile.phone) {
      setProfileError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const res = await updateUserProfile(authUser.uid, {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone
    });

    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setProfileError(res.error || "Une erreur est survenue.");
    }
  };

  // Address operations
  const handleEditAddress = (addr?: UserAddress) => {
    if (addr) {
      setCurrentAddress(addr);
    } else {
      setCurrentAddress({
        id: "",
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        secondaryPhone: "",
        country: "Côte d'Ivoire",
        city: "Abidjan",
        commune: "",
        neighborhood: "",
        landmark: "",
        addressLine: "",
        deliveryInstructions: "",
        isDefault: false
      });
    }
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAddress.commune || !currentAddress.neighborhood || !currentAddress.addressLine || !currentAddress.landmark) {
      alert("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }

    const res = await saveAddress(authUser.uid, currentAddress as any);
    if (res.success && res.addresses) {
      setAddresses(res.addresses);
      setIsEditingAddress(false);
    } else {
      alert("Erreur lors de la sauvegarde de l'adresse.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
    const res = await deleteAddress(authUser.uid, id);
    if (res.success && res.addresses) {
      setAddresses(res.addresses);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const res = await setDefaultAddress(authUser.uid, id);
    if (res.success && res.addresses) {
      setAddresses(res.addresses);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen transition-colors duration-500" style={{ background: "var(--color-theme-bg)", color: "var(--color-theme-fg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="font-serif text-3xl font-bold">Mon Espace Client</h1>
          <p className="text-sm opacity-60 mt-1">
            Bonjour, <span className="font-bold text-theme-accent-hover text-glow">{profile.firstName || authUser.email}</span>. Suivez vos commandes et gérez vos préférences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 p-6 rounded-2xl border bg-theme-card space-y-2" style={{ borderColor: "var(--color-theme-border)" }}>
            {[
              { id: "orders", label: "Mes Commandes", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "addresses", label: "Mes Adresses", icon: <MapPin className="w-4 h-4" /> },
              { id: "profile", label: "Mon Profil", icon: <User className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsEditingAddress(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "text-theme-bg"
                    : "hover:bg-theme-fg/5"
                }`}
                style={{
                  background: activeTab === tab.id ? "var(--color-theme-accent)" : "transparent"
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 p-8 rounded-2xl border bg-theme-card min-h-[50vh] relative" style={{ borderColor: "var(--color-theme-border)" }}>
            
            {loading && (
              <div className="absolute inset-0 bg-theme-bg/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
              </div>
            )}

            {/* 1. ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold pb-2 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                  Historique de vos commandes
                </h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20 opacity-60">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-theme-accent" />
                    <p className="text-sm">Vous n'avez passé aucune commande pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border bg-theme-bg/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      >
                        <div>
                          <p className="font-bold text-theme-accent">{ord.orderNumber}</p>
                          <p className="opacity-50 mt-0.5">Passée le {ord.createdAt}</p>
                          <p className="opacity-70 mt-1">{ord.items.length} article(s)</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[9px] ${
                            ord.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/15 text-yellow-600"
                          }`}>
                            {ord.paymentStatus === "paid" ? "Payée" : ord.paymentStatus === "verification_required" ? "À vérifier" : "En attente"}
                          </span>
                          <span className={`font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[9px] ${
                            ord.fulfillmentStatus === "delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-neutral-500/15"
                          }`}>
                            {ord.fulfillmentStatus === "delivered" ? "Livrée" : ord.fulfillmentStatus === "shipped" ? "En cours d'expédition" : "En cours"}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-theme-accent-hover text-glow min-w-[100px] text-right">
                          {ord.grandTotal.toLocaleString("fr-FR")} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESSES TAB */}
            {activeTab === "addresses" && !isEditingAddress && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                  <h2 className="font-serif text-xl font-bold">
                    Vos Adresses de livraison
                  </h2>
                  <button 
                    onClick={() => handleEditAddress()}
                    className="text-xs font-bold text-theme-accent hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter une adresse
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-16 opacity-60">
                    <MapPin className="w-10 h-10 mx-auto mb-3 text-theme-accent" />
                    <p className="text-sm">Aucune adresse de livraison enregistrée.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((adr) => (
                      <div
                        key={adr.id}
                        className="p-5 rounded-2xl border bg-theme-bg/20 relative flex flex-col justify-between text-xs transition-all hover:border-theme-accent/30"
                        style={{ borderColor: "var(--color-theme-border)" }}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-theme-accent">{adr.commune}</span>
                            {adr.isDefault ? (
                              <span className="bg-emerald-500/15 text-emerald-600 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Par défaut
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleSetDefaultAddress(adr.id)}
                                className="text-[8px] text-theme-fg/40 hover:text-theme-accent font-bold uppercase tracking-wider"
                              >
                                Définir par défaut
                              </button>
                            )}
                          </div>
                          <p className="font-semibold">{adr.firstName} {adr.lastName}</p>
                          <p className="opacity-80 mt-1">{adr.neighborhood}</p>
                          <p className="opacity-85">{adr.addressLine}</p>
                          <p className="text-[10px] opacity-50 mt-1">Repère: {adr.landmark}</p>
                          <p className="text-[10px] opacity-60 mt-1">Tél: {adr.phone}</p>
                        </div>
                        <div className="flex justify-end space-x-3 pt-3 border-t mt-4 text-[10px] font-bold" style={{ borderColor: "var(--color-theme-border)" }}>
                          <button 
                            onClick={() => handleEditAddress(adr)}
                            className="text-theme-accent hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Edit className="w-3 h-3" />
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(adr.id)}
                            className="text-red-500 hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESS EDITOR FORM */}
            {activeTab === "addresses" && isEditingAddress && (
              <form onSubmit={handleSaveAddress} className="space-y-6">
                <h2 className="font-serif text-xl font-bold pb-2 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                  {currentAddress.id ? "Modifier l'adresse" : "Ajouter une adresse"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={currentAddress.firstName}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, firstName: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={currentAddress.lastName}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, lastName: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Téléphone Principal *</label>
                    <input
                      type="text"
                      required
                      placeholder="+225..."
                      value={currentAddress.phone}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, phone: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Téléphone Secondaire</label>
                    <input
                      type="text"
                      placeholder="+225..."
                      value={currentAddress.secondaryPhone || ""}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, secondaryPhone: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Ville *</label>
                    <input
                      type="text"
                      required
                      value={currentAddress.city}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, city: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Commune *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Cocody, Marcory"
                      value={currentAddress.commune}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, commune: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Quartier *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Riviera 3, Angré"
                      value={currentAddress.neighborhood}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, neighborhood: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Point de repère *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: En face de la pharmacie"
                      value={currentAddress.landmark || ""}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, landmark: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Adresse précise (rue, porte...) *</label>
                    <textarea
                      required
                      rows={2}
                      value={currentAddress.addressLine}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, addressLine: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Instructions de livraison</label>
                    <input
                      type="text"
                      placeholder="ex: Livrer après 17h"
                      value={currentAddress.deliveryInstructions || ""}
                      onChange={(e) => setCurrentAddress({ ...currentAddress, deliveryInstructions: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer"
                    style={{ borderColor: "var(--color-theme-border)" }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-theme-accent text-theme-bg rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:opacity-90"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            )}

            {/* 3. PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="font-serif text-xl font-bold pb-2 border-b" style={{ borderColor: "var(--color-theme-border)" }}>
                  Modifier mes informations
                </h2>

                {profileError && (
                  <div className="p-4 border rounded-xl flex gap-2.5 items-start text-xs bg-red-500/10 text-red-500 border-red-500/20">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Téléphone Mobile *</label>
                    <input
                      type="text"
                      required
                      placeholder="+225..."
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-theme-bg border border-theme-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Adresse Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-theme-fg/5 text-theme-fg/40 border border-theme-border rounded-xl text-xs p-2.5 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 items-center gap-4">
                  {saveSuccess && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Profil sauvegardé avec succès !
                    </span>
                  )}
                  <button 
                    type="submit"
                    className="flex items-center space-x-1.5 px-6 py-2.5 bg-theme-accent text-theme-bg font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer hover:opacity-90"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
