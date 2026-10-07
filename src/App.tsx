import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  featured?: boolean;
};

type IconName =
  | "arrow"
  | "bag"
  | "cart"
  | "check"
  | "chevron"
  | "close"
  | "dashboard"
  | "edit"
  | "heart"
  | "menu"
  | "minus"
  | "plus"
  | "search"
  | "shield"
  | "store"
  | "trash"
  | "trend"
  | "user";

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  cart: <><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  minus: <path d="M5 12h14" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  store: <><path d="M3 9 5 4h14l2 5" /><path d="M5 13v8h14v-8M9 21v-6h6v6" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" /></>,
  trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M15 6h6v6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

const seedProducts: Product[] = [
  { id: 1, name: "Sac tressé Adja", category: "Mode", price: 18500, stock: 12, featured: true, image: "https://images.unsplash.com/photo-1692689383138-c2df3476072c?auto=format&fit=crop&w=900&q=85" },
  { id: 2, name: "Panier mural Sika", category: "Maison", price: 12000, stock: 8, image: "https://images.unsplash.com/photo-1724762125584-d7aef95791e8?auto=format&fit=crop&w=900&q=85" },
  { id: 3, name: "Étoffe Kita artisanale", category: "Textile", price: 24500, stock: 15, featured: true, image: "https://images.unsplash.com/photo-1578509566163-068acd11b8e7?auto=format&fit=crop&w=900&q=85" },
  { id: 4, name: "Chapeau Tano", category: "Accessoires", price: 9500, stock: 4, image: "https://images.unsplash.com/photo-1658046350754-b98336542844?auto=format&fit=crop&w=900&q=85" },
  { id: 5, name: "Coussin wax Naya", category: "Maison", price: 14000, stock: 9, image: "https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?auto=format&fit=crop&w=900&q=85" },
  { id: 6, name: "Pochette Kente", category: "Mode", price: 7500, stock: 20, image: "https://images.unsplash.com/photo-1717913491283-2936576a88b7?auto=format&fit=crop&w=900&q=85" },
];

const formatPrice = (value: number) => new Intl.NumberFormat("fr-FR").format(value) + " FCFA";

function App() {
  const [view, setView] = useState<"shop" | "dashboard">("shop");
  const [products, setProducts] = useState(seedProducts);
  const [cart, setCart] = useState<Record<number, number>>({ 3: 1 });
  const [category, setCategory] = useState("Tout");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"form" | "loading" | "success">("form");
  const [productModal, setProductModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = products.filter((p) =>
    (category === "Tout" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const cartItems = products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] }));
  const itemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + (subtotal ? 1000 : 0);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const addToCart = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    notify("Produit ajouté au panier");
  };

  const updateQty = (id: number, delta: number) => {
    setCart((current) => {
      const qty = (current[id] || 0) + delta;
      const next = { ...current };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const launchPayment = () => {
    setPaymentStep("loading");
    window.setTimeout(() => {
      setPaymentStep("success");
      setCart({});
    }, 1500);
  };

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updated: Product = {
      id: editing?.id || Date.now(),
      name: String(data.get("name")),
      category: String(data.get("category")),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      image: editing?.image || seedProducts[0].image,
    };
    setProducts((current) => editing ? current.map((p) => p.id === editing.id ? updated : p) : [updated, ...current]);
    setProductModal(false);
    setEditing(null);
    notify(editing ? "Produit mis à jour" : "Nouveau produit ajouté");
  };

  const openProductModal = (product?: Product) => {
    setEditing(product || null);
    setProductModal(true);
  };

  return (
    <div className="app-shell">
      {notice && <div className="toast"><span className="toast-icon"><Icon name="check" size={15} /></span>{notice}</div>}
      <header className="topbar">
        <button className="brand" onClick={() => setView("shop")} aria-label="Accueil KoraPay">
          <span className="brand-mark"><Icon name="bag" size={19} /></span>
          <span>Kora<span>Pay</span></span>
        </button>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <button className={view === "shop" ? "active" : ""} onClick={() => setView("shop")}>La boutique</button>
          <button onClick={() => { setView("shop"); setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 0); }}>Nos produits</button>
          <button onClick={() => notify("La page artisans arrive bientôt")}>Nos artisans</button>
        </nav>
        <div className="header-actions">
          <button className="merchant-link" onClick={() => setView(view === "dashboard" ? "shop" : "dashboard")}>
            <Icon name={view === "dashboard" ? "store" : "dashboard"} size={17} />
            {view === "dashboard" ? "Voir la boutique" : "Espace commerçant"}
          </button>
          <button className="icon-btn account-btn" aria-label="Mon compte"><Icon name="user" /></button>
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Panier, ${itemCount} articles`}>
            <Icon name="cart" />
            <span>{itemCount}</span>
          </button>
        </div>
      </header>

      {view === "shop" ? (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><span /> L'artisanat local, autrement</span>
              <h1>Le beau, le vrai,<br /><em>à portée de main.</em></h1>
              <p>Découvrez des créations uniques, faites avec passion par les meilleurs artisans de chez nous.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Découvrir la collection <Icon name="arrow" size={18} /></button>
                <div className="trust-pill"><span className="avatar-stack"><i>A</i><i>K</i><i>M</i></span><span><b>+2 500</b><small>clients satisfaits</small></span></div>
              </div>
            </div>
            <div className="hero-visual">
              <img src="https://images.unsplash.com/photo-1709809081557-78f803ce93a0?auto=format&fit=crop&w=1200&q=90" alt="Créatrice portant une tenue artisanale colorée" />
              <div className="hero-badge"><span><Icon name="shield" size={19} /></span><div><b>Paiement sécurisé</b><small>Mobile Money & Fedapay</small></div></div>
              <div className="hero-caption"><small>Créatrice du mois</small><strong>Aïcha Koné</strong><span>Abidjan, Côte d'Ivoire</span></div>
            </div>
          </section>

          <section className="benefits">
            <div><span><Icon name="shield" /></span><p><b>Paiement 100% sécurisé</b><small>Vos transactions sont protégées</small></p></div>
            <div><span><Icon name="store" /></span><p><b>Artisans sélectionnés</b><small>Des créations authentiques</small></p></div>
            <div><span><Icon name="bag" /></span><p><b>Livraison rapide</b><small>Partout en Côte d'Ivoire</small></p></div>
          </section>

          <section className="products-section" id="products">
            <div className="section-heading">
              <div><span className="eyebrow">La sélection du moment</span><h2>Nos coups de cœur</h2></div>
              <button className="text-btn" onClick={() => { setCategory("Tout"); setSearch(""); }}>Voir toute la collection <Icon name="arrow" size={17} /></button>
            </div>
            <div className="catalog-tools">
              <div className="categories">
                {["Tout", "Mode", "Maison", "Textile", "Accessoires"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
              <label className="search-box"><Icon name="search" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." /></label>
            </div>
            <div className="product-grid">
              {filtered.map((product, index) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {index === 0 && <span className="product-tag">Coup de cœur</span>}
                    <button className="favorite" aria-label={`Ajouter ${product.name} aux favoris`} onClick={() => notify("Ajouté à vos favoris")}><Icon name="heart" size={18} /></button>
                    <button className="quick-add" onClick={() => addToCart(product.id)}><Icon name="plus" size={17} /> Ajouter au panier</button>
                  </div>
                  <div className="product-info"><span>{product.category}</span><h3>{product.name}</h3><div><strong>{formatPrice(product.price)}</strong><small>Par Atelier Naya</small></div></div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && <div className="empty-state"><Icon name="search" size={32} /><h3>Aucun produit trouvé</h3><p>Essayez un autre mot-clé ou une autre catégorie.</p></div>}
          </section>

          <section className="payment-banner">
            <div className="payment-copy"><span className="eyebrow light">Simple, rapide et sécurisé</span><h2>Payez comme vous voulez.</h2><p>Réglez vos achats en quelques secondes avec votre opérateur Mobile Money préféré.</p><div className="operator-list"><span>MTN <b>MoMo</b></span><span>moov <b>Money</b></span><span className="orange">orange <b>money</b></span><span className="fedapay">fedapay</span></div></div>
            <div className="phone-card">
              <div className="phone-head"><span><Icon name="shield" size={18} /></span><p>Paiement sécurisé<small>Propulsé par Fedapay</small></p></div>
              <div className="phone-amount"><small>Montant à payer</small><strong>24 500 FCFA</strong></div>
              <div className="phone-row"><span className="network-dot">M</span><p>MTN Mobile Money<small>+225 05 •• •• 18 42</small></p><Icon name="chevron" size={17} /></div>
              <button className="phone-btn" onClick={() => { setCheckout(true); setPaymentStep("form"); }}>Payer maintenant <Icon name="arrow" size={17} /></button>
              <small className="encrypted">Chiffrement SSL 256 bits</small>
            </div>
          </section>
        </main>
      ) : (
        <MerchantDashboard products={products} openProductModal={openProductModal} setProducts={setProducts} notify={notify} />
      )}

      <footer>
        <button className="brand footer-brand" onClick={() => setView("shop")}><span className="brand-mark"><Icon name="bag" size={19} /></span><span>Kora<span>Pay</span></span></button>
        <p>Le meilleur de l'artisanat local, livré chez vous.</p>
        <span>© 2025 KoraPay Market. Tous droits réservés.</span>
      </footer>

      {cartOpen && (
        <div className="overlay" onMouseDown={() => setCartOpen(false)}>
          <aside className="cart-drawer" onMouseDown={(e) => e.stopPropagation()}>
            <div className="drawer-head"><div><span>Votre panier</span><small>{itemCount} article{itemCount > 1 ? "s" : ""}</small></div><button className="icon-btn" onClick={() => setCartOpen(false)}><Icon name="close" /></button></div>
            <div className="cart-content">
              {cartItems.length ? cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt="" />
                  <div><span>{item.category}</span><h4>{item.name}</h4><strong>{formatPrice(item.price)}</strong><div className="quantity"><button onClick={() => updateQty(item.id, -1)}><Icon name="minus" size={14} /></button><span>{item.qty}</span><button onClick={() => updateQty(item.id, 1)}><Icon name="plus" size={14} /></button></div></div>
                  <button className="remove" onClick={() => updateQty(item.id, -item.qty)}><Icon name="trash" size={17} /></button>
                </div>
              )) : <div className="empty-cart"><span><Icon name="cart" size={30} /></span><h3>Votre panier est vide</h3><p>Explorez notre collection et trouvez votre prochain coup de cœur.</p><button className="primary-btn" onClick={() => setCartOpen(false)}>Découvrir les produits</button></div>}
            </div>
            {!!cartItems.length && <div className="cart-summary"><p><span>Sous-total</span><b>{formatPrice(subtotal)}</b></p><p><span>Livraison</span><b>1 000 FCFA</b></p><div><span>Total</span><strong>{formatPrice(total)}</strong></div><button className="primary-btn wide" onClick={() => { setCartOpen(false); setCheckout(true); setPaymentStep("form"); }}>Passer au paiement <Icon name="arrow" size={18} /></button><small><Icon name="shield" size={14} /> Paiement sécurisé avec Fedapay</small></div>}
          </aside>
        </div>
      )}

      {checkout && <CheckoutModal total={total || 24500} step={paymentStep} setStep={setPaymentStep} onPay={launchPayment} onClose={() => setCheckout(false)} />}
      {productModal && <ProductModal product={editing} onClose={() => setProductModal(false)} onSave={saveProduct} />}
    </div>
  );
}

function MerchantDashboard({ products, openProductModal, setProducts, notify }: {
  products: Product[];
  openProductModal: (product?: Product) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  notify: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const remove = (id: number) => {
    setProducts((current) => current.filter((p) => p.id !== id));
    notify("Produit supprimé");
  };
  return (
    <main className="dashboard-page">
      <div className="dashboard-welcome"><div><span className="eyebrow">Espace commerçant</span><h1>Bonjour, Atelier Naya</h1><p>Voici un aperçu de l'activité de votre boutique aujourd'hui.</p></div><button className="primary-btn" onClick={() => openProductModal()}><Icon name="plus" size={18} /> Ajouter un produit</button></div>
      <section className="stat-grid">
        <div><span className="stat-icon green"><Icon name="trend" /></span><p>Chiffre d'affaires<small>Ce mois-ci</small></p><strong>842 500 <small>FCFA</small></strong><em>+12,5%</em></div>
        <div><span className="stat-icon gold"><Icon name="bag" /></span><p>Commandes<small>Ce mois-ci</small></p><strong>48</strong><em>+8,2%</em></div>
        <div><span className="stat-icon blue"><Icon name="store" /></span><p>Produits en ligne<small>Catalogue actif</small></p><strong>{products.length}</strong><em>100%</em></div>
        <div><span className="stat-icon rose"><Icon name="user" /></span><p>Nouveaux clients<small>Ce mois-ci</small></p><strong>34</strong><em>+18,1%</em></div>
      </section>
      <section className="dashboard-card">
        <div className="table-head"><div><h2>Mes produits</h2><p>Gérez votre catalogue et vos stocks.</p></div><label className="search-box"><Icon name="search" size={18} /><input placeholder="Rechercher..." value={query} onChange={(e) => setQuery(e.target.value)} /></label></div>
        <div className="product-table">
          <div className="table-row table-labels"><span>Produit</span><span>Prix</span><span>Stock</span><span>Statut</span><span>Actions</span></div>
          {rows.map((product) => <div className="table-row" key={product.id}>
            <div className="table-product"><img src={product.image} alt="" /><p><b>{product.name}</b><small>{product.category}</small></p></div>
            <strong>{formatPrice(product.price)}</strong>
            <span>{product.stock} unités</span>
            <span className={product.stock > 5 ? "status active" : "status low"}>{product.stock > 5 ? "En ligne" : "Stock faible"}</span>
            <div className="row-actions"><button onClick={() => openProductModal(product)} aria-label="Modifier"><Icon name="edit" size={17} /></button><button onClick={() => remove(product.id)} aria-label="Supprimer"><Icon name="trash" size={17} /></button></div>
          </div>)}
        </div>
      </section>
    </main>
  );
}

function CheckoutModal({ total, step, setStep, onPay, onClose }: { total: number; step: "form" | "loading" | "success"; setStep: (step: "form" | "loading" | "success") => void; onPay: () => void; onClose: () => void }) {
  return <div className="modal-overlay">
    <div className="checkout-modal">
      <div className="modal-head"><div className="modal-brand"><span><Icon name="shield" size={18} /></span><p>Paiement sécurisé<small>Propulsé par Fedapay</small></p></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></div>
      {step === "form" && <div className="checkout-body">
        <div className="checkout-total"><small>Montant total</small><strong>{formatPrice(total)}</strong></div>
        <p className="form-label">Choisissez votre moyen de paiement</p>
        <div className="network-options">
          <button className="selected"><span className="mtn">MTN</span><p><b>MTN MoMo</b><small>Paiement instantané</small></p><i><Icon name="check" size={13} /></i></button>
          <button onClick={() => {}}><span className="moov">moov</span><p><b>Moov Money</b><small>Paiement instantané</small></p><i /></button>
          <button onClick={() => {}}><span className="om">OM</span><p><b>Orange Money</b><small>Paiement instantané</small></p><i /></button>
        </div>
        <label className="field"><span>Numéro Mobile Money</span><div><b>+225</b><input defaultValue="05 07 08 18 42" /></div></label>
        <button className="primary-btn wide" onClick={onPay}>Payer {formatPrice(total)} <Icon name="arrow" size={18} /></button>
        <small className="secure-note"><Icon name="shield" size={14} /> Cette transaction est chiffrée et sécurisée.</small>
      </div>}
      {step === "loading" && <div className="payment-state"><div className="spinner" /><h2>Validation en cours...</h2><p>Confirmez la transaction sur votre téléphone.</p><div className="ussd">Composez votre code secret Mobile Money</div></div>}
      {step === "success" && <div className="payment-state success-state"><span className="success-check"><Icon name="check" size={34} /></span><span className="eyebrow">Paiement confirmé</span><h2>Merci pour votre commande !</h2><p>Votre paiement de <b>{formatPrice(total)}</b> a bien été reçu. Un reçu vient de vous être envoyé.</p><div className="reference"><small>Référence de transaction</small><strong>KP-2025-8F42A</strong></div><button className="primary-btn wide" onClick={onClose}>Retour à la boutique</button></div>}
    </div>
  </div>;
}

function ProductModal({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-overlay"><div className="product-modal">
    <div className="modal-head"><div><h2>{product ? "Modifier le produit" : "Ajouter un produit"}</h2><p>Renseignez les informations de votre article.</p></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></div>
    <form onSubmit={onSave}>
      <label className="field"><span>Nom du produit</span><input name="name" required defaultValue={product?.name} placeholder="Ex. Sac tressé Adja" /></label>
      <div className="field-row">
        <label className="field"><span>Catégorie</span><select name="category" defaultValue={product?.category || "Mode"}><option>Mode</option><option>Maison</option><option>Textile</option><option>Accessoires</option></select></label>
        <label className="field"><span>Prix (FCFA)</span><input name="price" type="number" required defaultValue={product?.price || ""} placeholder="15000" /></label>
      </div>
      <label className="field"><span>Stock disponible</span><input name="stock" type="number" required defaultValue={product?.stock || ""} placeholder="10" /></label>
      <div className="form-actions"><button type="button" className="secondary-btn" onClick={onClose}>Annuler</button><button className="primary-btn" type="submit">{product ? "Enregistrer" : "Ajouter le produit"}</button></div>
    </form>
  </div></div>;
}

export default App;
