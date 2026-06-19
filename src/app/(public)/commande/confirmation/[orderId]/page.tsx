import { notFound } from "next/navigation";
import Link from "next/link";
import { OrderRepository } from "@/server/repositories/order.repository";
import { CheckCircle2, MessageCircle, ArrowRight, Printer, AlertTriangle } from "lucide-react";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  const orderRepo = new OrderRepository();
  const order = await orderRepo.getById(orderId);

  if (!order) {
    notFound();
  }

  const getWhatsAppTrackingLink = () => {
    const msg = encodeURIComponent(
      `Bonjour CAROANA MINCEUR, je souhaite obtenir des informations concernant ma commande ${order.orderNumber}.`
    );
    return `https://wa.me/2250143655088?text=${msg}`;
  };

  const isManual = order.paymentMethod === "ManualPaymentProvider";

  return (
    <div className="pt-28 pb-20 bg-theme-bg text-theme-fg min-h-screen transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-theme-fg">Merci pour votre commande !</h1>
          <p className="text-sm text-theme-fg/75 mt-2">
            Votre commande <span className="font-bold text-theme-fg">{order.orderNumber}</span> a été enregistrée avec succès.
          </p>
        </div>

        {/* Payment Instructions (Mobile Money Manuel) */}
        {isManual && (
          <div className="bg-theme-accent/5 border-2 border-theme-accent/20 p-6 rounded-premium mb-8 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-theme-accent flex-shrink-0 mt-0.5" />
            <div className="text-xs text-theme-fg">
              <h3 className="font-bold text-sm text-theme-accent">Action Requise : Effectuez votre transfert</h3>
              <p className="mt-2 leading-relaxed">
                Pour valider votre commande, veuillez effectuer le transfert du montant total de{" "}
                <span className="font-bold">{order.grandTotal.toLocaleString("fr-FR")} FCFA</span> sur l&apos;un de nos numéros officiels :
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-semibold">Wave :</span> +225 01 43 65 50 88 (CAROANA MINCEUR)</li>
                <li><span className="font-semibold">Orange Money :</span> +225 07 19 17 23 71 (CAROANA MINCEUR)</li>
              </ul>
              <p className="mt-2 text-[10px] text-theme-fg/60 leading-relaxed">
                Une fois le transfert effectué, veuillez envoyer la capture d&apos;écran ou le reçu de paiement à notre service client via le bouton WhatsApp ci-dessous, en mentionnant votre numéro de commande.
              </p>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-theme-card p-6 rounded-premium border border-theme-border shadow-premium mb-8 space-y-6">
          <h2 className="font-serif text-lg font-bold text-theme-fg pb-2 border-b border-theme-border">
            Détails de la livraison
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-theme-fg/60 mb-1">Destinataire</h4>
              <p className="font-semibold">
                {order.customerSnapshot.firstName} {order.customerSnapshot.lastName}
              </p>
              <p>{order.customerSnapshot.phone}</p>
            </div>
            <div>
              <h4 className="font-bold text-theme-fg/60 mb-1">Adresse de livraison</h4>
              <p className="font-semibold">{order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.commune}</p>
              <p>{order.shippingAddressSnapshot.neighborhood}</p>
              <p className="text-[10px] text-theme-fg/60">Repère: {order.shippingAddressSnapshot.landmark}</p>
            </div>
          </div>

          <h2 className="font-serif text-lg font-bold text-theme-fg pb-2 border-b border-theme-border pt-4">
            Articles commandés
          </h2>

          <div className="space-y-4">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span>
                  {it.name} <span className="font-semibold text-theme-fg/45">x{it.quantity}</span>
                </span>
                <span className="font-semibold">{(it.unitPrice * it.quantity).toLocaleString("fr-FR")} FCFA</span>
              </div>
            ))}

            <div className="border-t border-theme-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-theme-fg/60">
                <span>Sous-total</span>
                <span>{order.subtotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-success">
                  <span>Remise ({order.couponCode})</span>
                  <span>-{order.discountTotal.toLocaleString("fr-FR")} FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-theme-fg/60">
                <span>Frais de livraison</span>
                <span>{order.shippingTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between text-base font-bold text-theme-fg pt-2 border-t border-theme-border">
                <span>Total réglé / à régler</span>
                <span>{order.grandTotal.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Link
            href="/boutique"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-theme-border text-theme-fg font-semibold text-xs rounded-button hover:bg-theme-fg/5 transition-smooth cursor-pointer"
          >
            Continuer mes achats
          </Link>
          
          <a
            href={getWhatsAppTrackingLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white font-bold text-xs rounded-button shadow-premium transition-smooth cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span>Suivre sur WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}
