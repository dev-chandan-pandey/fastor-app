import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft, Search, SlidersHorizontal, MapPin, ChevronDown, Bell, Heart,
  ShoppingBag, Home, ClipboardList, UserRound, Plus, Minus, Star, Clock3,
  Bike, Check, X, ChevronRight, LocateFixed, Phone, ShieldCheck, ArrowRight,
  Utensils, Flame, CircleHelp, Trash2
} from 'lucide-react';
import './styles.css';
import { requestOtp, verifyOtp } from './api/auth';
import { getProducts } from './api/products';
import { createOrder, getOrders } from './api/orders';
import { updateProfile } from './api/profile';

const FOOD = {
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85',
  shake: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=85',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=85'
};
const categories = [
  { name: 'Pizza', img: FOOD.pizza }, { name: 'Burgers', img: FOOD.burger },
  { name: 'Shakes', img: FOOD.shake }, { name: 'Sushi', img: FOOD.sushi },
];
const initialProducts = [
  { id: 'shake', name: 'Strawberry Shake', description: 'Creamy strawberry milkshake', price: 120, rating: '4.8', time: '10–15 min', image: FOOD.shake, category: 'Shakes', veg: true },
  { id: 'burger', name: 'Chicken Burger', description: 'Crispy chicken, fresh lettuce', price: 189, rating: '4.7', time: '20–25 min', image: FOOD.burger, category: 'Burgers', veg: false },
  { id: 'sushi', name: 'Sushi Wave', description: 'A fresh, chef-curated sushi roll', price: 249, rating: '4.9', time: '25–30 min', image: FOOD.sushi, category: 'Sushi', veg: false },
  { id: 'pizza', name: 'Garden Veg Pizza', description: 'Classic cheese with garden veggies', price: 299, rating: '4.8', time: '20–30 min', image: FOOD.pizza, category: 'Pizza', veg: true },
  { id: 'salad', name: 'Green Goddess Bowl', description: 'Crunchy greens, avocado and seeds', price: 179, rating: '4.6', time: '15–20 min', image: FOOD.salad, category: 'Healthy', veg: true },
  { id: 'fries', name: 'Loaded Peri Fries', description: 'Golden fries with spicy seasoning', price: 109, rating: '4.5', time: '12–18 min', image: FOOD.fries, category: 'Sides', veg: true },
  { id: 'pasta', name: 'Creamy Pesto Pasta', description: 'Basil pesto, parmesan and herbs', price: 229, rating: '4.7', time: '20–25 min', image: FOOD.pasta, category: 'Pasta', veg: true },
  { id: 'sandwich', name: 'Grilled Club Sandwich', description: 'Toasted bread, cheese and greens', price: 159, rating: '4.6', time: '15–20 min', image: FOOD.sandwich, category: 'Snacks', veg: true },
];
const money = n => `₹${n.toLocaleString('en-IN')}`;

function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}

function BottomNav({ active, onChange, cartCount }) {
  const links = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];
  return <nav className="bottom-nav">{links.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={`nav-item ${active === id ? 'active' : ''}`}><span className="nav-icon-wrap"><Icon size={21} strokeWidth={active === id ? 2.3 : 1.8} />{id === 'cart' && cartCount > 0 && <i className="nav-badge">{cartCount}</i>}</span><span>{label}</span></button>)}</nav>;
}
function ProductCard({ product, onAdd, quantity = 0, onOpen }) {
  return <article className="product-card">
    <button className="product-photo" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy"/><span className={`veg-mark ${product.veg ? 'veg' : 'nonveg'}`}><i /></span><span className="rating"><Star size={11} fill="currentColor" /> {product.rating}</span></button>
    <div className="product-copy"><button className="product-title" onClick={() => onOpen(product)}>{product.name}</button><p>{product.description}</p><div className="product-foot"><strong>{money(product.price)}</strong>{quantity ? <div className="quantity mini"><button onClick={() => onAdd(product, -1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{quantity}</span><button onClick={() => onAdd(product, 1)} aria-label="Increase quantity"><Plus size={13}/></button></div> : <button className="add-btn" onClick={() => onAdd(product, 1)} aria-label={`Add ${product.name}`}><Plus size={16}/></button>}</div></div>
  </article>;
}
function FoodDetail({ product, onClose, onAdd, quantity }) {
  if (!product) return null;
  return <div className="sheet-backdrop" onClick={onClose}><section className="food-sheet" onClick={e => e.stopPropagation()}>
    <div className="sheet-handle"/><button className="sheet-close" onClick={onClose}><X size={19}/></button>
    <img className="detail-image" src={product.image} alt={product.name}/>
    <div className="detail-copy"><span className="eyebrow">{product.category}</span><h2>{product.name}</h2><div className="detail-meta"><span><Star size={14} fill="currentColor"/> {product.rating} rating</span><span><Clock3 size={14}/> {product.time}</span><span className="veg-text">{product.veg ? 'Vegetarian' : 'Non-vegetarian'}</span></div><p>{product.description}. Prepared fresh when you order and packed with care.</p><div className="detail-add"><div><small>Price</small><strong>{money(product.price)}</strong></div>{quantity ? <div className="quantity"><button onClick={() => onAdd(product, -1)}><Minus size={16}/></button><b>{quantity}</b><button onClick={() => onAdd(product, 1)}><Plus size={16}/></button></div> : <Button onClick={() => onAdd(product, 1)}>Add to cart <Plus size={16}/></Button>}</div></div>
  </section></div>;
}
function HomeScreen({ onAdd, cart, onNavigate, onOpenProduct, products }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState('recommended');
  const quantities = useMemo(() => Object.fromEntries(cart.map(x => [x.id, x.qty])), [cart]);
  const filtered = useMemo(() => {
    let arr = products.filter(p => (category === 'All' || p.category === category) && (!vegOnly || p.veg) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-low') arr = [...arr].sort((a,b) => a.price-b.price);
    if (sort === 'rating') arr = [...arr].sort((a,b) => Number(b.rating)-Number(a.rating));
    return arr;
  }, [products, category, search, vegOnly, sort]);
  return <div className="screen home-screen">
    <header className="home-header"><button className="location-block" onClick={() => alert('Location selection will be connected to the backend in the next phase.')}><span className="location-symbol"><MapPin size={18}/></span><span><small>DELIVER TO</small><strong>Model Town, New Delhi <ChevronDown size={14}/></strong></span></button><button className="round-icon notification" onClick={() => onNavigate('orders')} aria-label="Notifications"><Bell size={20}/><i/></button></header>
    <section className="welcome-row"><div><span className="muted-small">Good evening,</span><h1>What are you craving, <em>Karan?</em></h1></div><span className="avatar">K</span></section>
    <label className="searchbar"><Search size={19}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes, restaurants..."/><button onClick={() => setShowFilters(v => !v)} aria-label="Open filters" className={showFilters ? 'filter-active' : ''}><SlidersHorizontal size={18}/></button></label>
    {showFilters && <div className="filter-panel"><label className="toggle-line"><span>Vegetarian only</span><input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)}/><i/></label><label className="sort-label">Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option></select></label></div>}
    <section className="category-section"><div className="section-heading"><h2>Explore categories</h2><button onClick={() => setCategory('All')}>See all <ChevronRight size={15}/></button></div><div className="category-row">{categories.map(c => <button key={c.name} onClick={() => setCategory(category === c.name ? 'All' : c.name)} className={`category-chip ${category === c.name ? 'selected' : ''}`}><span className="category-photo"><img src={c.img} alt=""/></span><span>{c.name}</span></button>)}</div></section>
    <section className="promo-banner"><div className="promo-copy"><span className="promo-pill"><Flame size={12}/> TODAY'S SPECIAL</span><h2>A little treat,<br/><strong>30% OFF</strong></h2><p>On your first delicious order</p><button onClick={() => { setCategory('All'); setSearch(''); document.getElementById('popular')?.scrollIntoView({behavior:'smooth'}); }}>Order now <ArrowRight size={14}/></button></div><div className="promo-art"><img src={FOOD.pizza} alt="Fresh pizza"/><span className="promo-spark">✦</span></div><span className="promo-orbit orbit-one"/><span className="promo-orbit orbit-two"/></section>
    <section className="popular-section" id="popular"><div className="section-heading"><div><h2>{category === 'All' ? 'Popular items' : category}</h2><p>Delicious picks, just for you</p></div><button onClick={() => { setCategory('All'); setSort('rating'); }}>View all <ChevronRight size={15}/></button></div>
      {filtered.length ? <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} quantity={quantities[p.id] || 0} onOpen={onOpenProduct}/>)}</div> : <div className="empty-state"><Utensils size={28}/><strong>No dishes found</strong><p>Try another search or category.</p><button onClick={() => { setSearch(''); setCategory('All'); setVegOnly(false); }}>Clear filters</button></div>}
    </section>
  </div>;
}
function CartScreen({ cart, onAdd, onNavigate, onPlaceOrder, orderError }) {
  const [instructions, setInstructions] = useState('');
  const subtotal = cart.reduce((s, x) => s + x.price*x.qty, 0);
  const delivery = subtotal === 0 || subtotal >= 299 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;
  const [placed, setPlaced] = useState(false);
  if (placed) return <div className="screen centered-state"><span className="success-orb"><Check size={34}/></span><h1>Order placed!</h1><p>Your delicious order is being prepared. Order details will appear in My Orders.</p><div className="order-number">ORDER ID <strong>{placed.orderNumber || placed._id || 'Confirmed'}</strong></div><Button onClick={() => onNavigate('orders')}>Track your order <ArrowRight size={17}/></Button><button className="text-button" onClick={() => {setPlaced(false);onNavigate('home');}}>Back to home</button></div>;
  if (!cart.length) return <div className="screen centered-state"><span className="empty-cart-icon"><ShoppingBag size={32}/></span><h1>Your cart is hungry</h1><p>Looks like you haven't added anything delicious yet.</p><Button onClick={() => onNavigate('home')}>Explore menu <ArrowRight size={17}/></Button></div>;
  return <div className="screen sub-screen"><header className="page-header"><button className="back-btn" onClick={() => onNavigate('home')}><ArrowLeft size={20}/></button><div><h1>Your cart</h1><p>{cart.reduce((s,x)=>s+x.qty,0)} items in your bag</p></div><button className="header-text-button" onClick={() => cart.forEach(x => onAdd(x,-x.qty))}>Clear</button></header>
    <div className="delivery-card"><span className="delivery-icon"><MapPin size={20}/></span><div><small>DELIVERING TO</small><strong>Home · Model Town</strong><p>New Delhi, 110009</p></div><button onClick={() => alert('Address management will be connected in the backend phase.')}>Change</button></div>
    <div className="cart-list">{cart.map(item => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-info"><strong>{item.name}</strong><small>{item.category}</small><b>{money(item.price * item.qty)}</b></div><div className="quantity"><button onClick={() => onAdd(item,-1)} aria-label="Decrease"><Minus size={14}/></button><b>{item.qty}</b><button onClick={() => onAdd(item,1)} aria-label="Increase"><Plus size={14}/></button></div></article>)}</div>
    <label className="instructions"><span>Cooking instructions <small>Optional</small></span><textarea rows="2" value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="E.g. less spicy, no onions..."/></label>
    <div className="bill-card"><h2>Bill details</h2><div><span>Item total</span><b>{money(subtotal)}</b></div><div><span>Delivery fee</span><b className={delivery===0?'free':''}>{delivery===0?'FREE':money(delivery)}</b></div><div><span>Taxes & charges</span><b>{money(tax)}</b></div><hr/><div className="total-line"><strong>Grand total</strong><strong>{money(total)}</strong></div></div>
    <div className="cart-checkout"><div><small>Grand total</small><strong>{money(total)}</strong></div><div>{orderError&&<p className="form-error">{orderError}</p>}<Button onClick={async () => { const result = await onPlaceOrder({ cart, instructions }); if (result) setPlaced(result); }}>Place order <ArrowRight size={17}/></Button></div></div>
  </div>;
}
function OrdersScreen({ onNavigate, apiOrders = [] }) {
  const [tab,setTab] = useState('Ongoing');
  const [tracking,setTracking] = useState(false);
  const mockOrders = [
    {id:'FS-240819',name:'Strawberry Shake',img:FOOD.shake,price:120,qty:2,date:'Today, 1:20 PM',state:'Preparing',items:'2 items'},
    {id:'FS-240817',name:'Chicken Burger',img:FOOD.burger,price:189,qty:1,date:'17 Oct, 1:20 PM',state:'Delivered',items:'1 item'},
    {id:'FS-240802',name:'Sushi Wave',img:FOOD.sushi,price:249,qty:2,date:'22 Apr, 1:20 PM',state:'Delivered',items:'2 items'},
  ];
  const orders = apiOrders.length ? apiOrders.map(o=>({id:o.orderNumber||o._id,name:o.items?.[0]?.name||'Fastor order',img:o.items?.[0]?.image||FOOD.pizza,price:o.total||0,qty:o.items?.reduce((n,i)=>n+i.quantity,0)||0,date:new Date(o.createdAt).toLocaleString(),state:({confirmed:'Confirmed',preparing:'Preparing',out_for_delivery:'On the way',delivered:'Delivered',cancelled:'Cancelled'})[o.status]||o.status,items:`${o.items?.length||0} items`,raw:o})) : mockOrders;
  const visible = tab === 'Ongoing' ? orders.filter(o => o.state !== 'Delivered') : orders.filter(o => o.state === 'Delivered');
  return <div className="screen sub-screen"><header className="page-header"><div><h1>My orders</h1><p>All your cravings, in one place</p></div><button className="round-icon" onClick={() => onNavigate('home')}><Home size={19}/></button></header>
    <div className="segmented"><button className={tab==='Ongoing'?'chosen':''} onClick={()=>setTab('Ongoing')}>Ongoing <span>1</span></button><button className={tab==='Past orders'?'chosen':''} onClick={()=>setTab('Past orders')}>Past orders</button></div>
    <div className="orders-list">{visible.map(o=><article className="order-card" key={o.id}><div className="order-top"><span>ORDER #{o.id}</span><span className={`status-pill ${o.state==='Delivered'?'delivered':''}`}><i/>{o.state}</span></div><div className="order-main"><img src={o.img} alt=""/><div><strong>{o.name}</strong><small>{o.date} · {o.items}</small><b>{money(o.price*o.qty)}</b></div></div>{o.state!=='Delivered'&&<div className="delivery-progress"><span className="progress-icon"><Bike size={18}/></span><div><strong>Your food is being prepared</strong><small>Estimated arrival in 20–30 min</small></div></div>}<div className="order-actions"><Button variant="soft" onClick={()=>onNavigate('home')}>Order again</Button>{o.state!=='Delivered'&&<Button onClick={()=>setTracking(v=>!v)}>{tracking?'Hide tracking':'Track order'}</Button>}{o.state==='Delivered'&&<button className="rate-button" onClick={()=>alert('Thanks! Ratings will be saved once the backend is connected.')}><Star size={15}/> Rate order</button>}</div>{tracking&&o.state!=='Delivered'&&<div className="tracking-panel"><div className="tracking-step complete"><i><Check size={12}/></i><span><b>Order confirmed</b><small>Restaurant received your order</small></span></div><div className="tracking-step complete"><i><Check size={12}/></i><span><b>Preparing your food</b><small>Freshly made with care</small></span></div><div className="tracking-step"><i><Bike size={12}/></i><span><b>On the way</b><small>We'll update you when the driver leaves</small></span></div></div>}</article>)}</div>
  </div>;
}
function ProfileScreen({ onNavigate }) {
  const [name,setName]=useState('Karan');
  const [editing,setEditing]=useState(false);
  return <div className="screen sub-screen"><header className="page-header"><div><h1>My profile</h1><p>Manage your account</p></div><button className="round-icon" onClick={()=>setEditing(v=>!v)}>{editing?<Check size={19}/>:<UserRound size={19}/>}</button></header>
    <section className="profile-card"><div className="profile-avatar">{name.charAt(0).toUpperCase()}</div><div className="profile-ident">{editing?<input value={name} onChange={e=>setName(e.target.value)} aria-label="Your name"/>:<h2>{name}</h2>}<p>Welcome to Fastor</p></div><span className="verified-mark"><ShieldCheck size={18}/></span></section>
    <div className="profile-group"><h3>Account</h3><button onClick={()=>alert('Phone verification settings will be connected to the backend.')}><span className="profile-option-icon"><Phone size={18}/></span><span><b>Mobile number</b><small>+91 12345 67890</small></span><ChevronRight size={18}/></button><button onClick={()=>alert('Saved addresses will be connected to the backend.')}><span className="profile-option-icon"><MapPin size={18}/></span><span><b>Saved addresses</b><small>Home · Model Town, New Delhi</small></span><ChevronRight size={18}/></button><button onClick={()=>onNavigate('orders')}><span className="profile-option-icon"><ClipboardList size={18}/></span><span><b>My orders</b><small>Track and reorder your favourites</small></span><ChevronRight size={18}/></button></div>
    <div className="profile-group"><h3>Preferences</h3><button onClick={()=>alert('Help and support will be connected soon.')}><span className="profile-option-icon"><CircleHelp size={18}/></span><span><b>Help & support</b><small>We're here to help</small></span><ChevronRight size={18}/></button></div>
    <p className="app-version">Fastor v1.0.0 · Made with love for foodies</p>
  </div>;
}
function AuthFlow({ onDone }) {
  const [step,setStep]=useState('phone');
  const [phone,setPhone]=useState('');
  const [otp,setOtp]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [devCode,setDevCode]=useState('');
  const sendCode=async e=>{e.preventDefault(); if(!/^\d{10}$/.test(phone)){setError('Enter a valid 10-digit mobile number.');return;} setBusy(true);setError('');try{const result=await requestOtp(`+91${phone}`);setDevCode(result.developmentCode||'');setStep('otp');}catch(err){setError(err.message);}finally{setBusy(false);}};
  const verify=async e=>{e.preventDefault(); if(otp.length!==6){setError('Please enter the 6-digit code.');return;}setBusy(true);setError('');try{const result=await verifyOtp(`+91${phone}`,otp);onDone(result);}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <div className="auth-layout"><div className="auth-side"><div className="brand brand-light"><span className="brand-mark"><Utensils size={19}/></span><span>fastor<span className="brand-dot">.</span></span></div><div className="auth-side-content"><span className="auth-emoji">🥗</span><h2>Good food.<br/>Good mood.</h2><p>Discover the flavours you love and get them delivered fresh to your door.</p></div><div className="auth-side-bottom">Freshly made, just for you <span>✦</span></div></div><main className="auth-main"><div className="auth-mobile-brand brand"><span className="brand-mark"><Utensils size={19}/></span><span>fastor<span className="brand-dot">.</span></span></div><div className="auth-content">{step==='otp'&&<button className="auth-back" onClick={()=>{setStep('phone');setOtp('');setError('');}}><ArrowLeft size={20}/></button>}<span className="auth-kicker">{step==='phone'?'WELCOME TO FASTOR':'ALMOST THERE'}</span><h1>{step==='phone'?'Sign up to Fastor':'6-digit code'}</h1><p className="auth-description">{step==='phone'?'Let us know your mobile number and we’ll send you an OTP for verification.':<>Please enter the code we’ve sent to <b>+91 {phone.slice(0,5)} {phone.slice(5)}</b></>}</p>
    {step==='phone'?<form onSubmit={sendCode} className="auth-form"><label className="field-label">Mobile number</label><div className="phone-field"><span>🇮🇳 <b>+91</b><ChevronDown size={15}/></span><input autoFocus inputMode="numeric" type="tel" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="Enter mobile number" aria-label="Mobile number"/></div>{error&&<p className="form-error">{error}</p>}<Button type="submit" disabled={busy} className="auth-submit">{busy ? 'Sending…' : 'Send verification code'} <ArrowRight size={17}/></Button><p className="auth-terms">By continuing, you agree to our <button type="button" onClick={()=>alert('Terms of service will be added before launch.')}>Terms of Service</button> and <button type="button" onClick={()=>alert('Privacy policy will be added before launch.')}>Privacy Policy</button>.</p></form>:<form onSubmit={verify} className="auth-form"><label className="field-label">Verification code</label><div className="otp-row">{Array.from({length:6},(_,i)=><input key={i} value={otp[i]||''} autoFocus={i===0} inputMode="numeric" maxLength={1} aria-label={`OTP digit ${i+1}`} onChange={e=>{const v=e.target.value.replace(/\D/g,'').slice(-1); const a=otp.split('');a[i]=v;setOtp(a.join('').slice(0,6)); if(v&&e.target.nextSibling)e.target.nextSibling.focus();}} onKeyDown={e=>{if(e.key==='Backspace'&&!otp[i]&&e.target.previousSibling)e.target.previousSibling.focus();}}/> )}</div>{error&&<p className="form-error">{error}</p>}<Button type="submit" disabled={busy} className="auth-submit">{busy ? 'Verifying…' : 'Verify & continue'} <ArrowRight size={17}/></Button><p className="resend-code">Didn't receive a code? <button type="button" onClick={()=>{setOtp('');setError('');}}>Resend code</button></p>{devCode&&<p className="demo-hint">Development OTP: <b>{devCode}</b></p>}</form>}
    </div><footer className="auth-footer"><ShieldCheck size={15}/> Your information is safe and secure</footer></main></div>;
}
function App() {
  const [session,setSession]=useState(()=>{try{return JSON.parse(localStorage.getItem('fastor.session')||'null')}catch{return null}});
  const authenticated=Boolean(session?.token);
  const [apiError,setApiError]=useState('');
  const [orders,setOrders]=useState([]);
  const [active,setActive]=useState('home');
  const [cart,setCart]=useState([]);
  const [selectedProduct,setSelectedProduct]=useState(null);
  const [toast,setToast]=useState('');
  const [products,setProducts] = useState(initialProducts);
  React.useEffect(()=>{let alive=true;getProducts().then(data=>{if(alive&&data.length)setProducts(data.map(p=>({...p,id:p.id||p.slug,rating:String(p.rating)})));}).catch(err=>{if(alive)setApiError(err.message);});return()=>{alive=false}},[]);
  React.useEffect(()=>{if(!session?.token)return;getOrders(session.token).then(data=>setOrders(data)).catch(err=>setApiError(err.message));},[session?.token]);
  const cartCount=cart.reduce((n,x)=>n+x.qty,0);
  const cartAdd=(product,delta)=>{setCart(current=>{const old=current.find(x=>x.id===product.id); if(!old&&delta>0)return [...current,{...product,qty:delta}]; return current.map(x=>x.id===product.id?{...x,qty:x.qty+delta}:x).filter(x=>x.qty>0);}); if(delta>0){setToast(`${product.name} added to cart`);setTimeout(()=>setToast(''),1800);}};
  const navigate=page=>{setActive(page);setSelectedProduct(null);window.scrollTo({top:0,behavior:'smooth'});};
  const handleLogin=result=>{localStorage.setItem('fastor.session',JSON.stringify(result));setSession(result);setApiError('');};
  const handlePlaceOrder=async ({cart,instructions})=>{try{setApiError('');const result=await createOrder(session.token,{cart,instructions,address:'Home, Model Town, New Delhi, 110009'});setOrders(current=>[result,...current]);setCart([]);return result;}catch(err){setApiError(err.message);return null;}};
  if(!authenticated)return <><AuthFlow onDone={handleLogin}/>{apiError&&<div className="toast">{apiError}</div>}</>;
  return <div className="app-shell"><div className="mobile-app"><div className="app-scroll" key={active}>{active==='home'&&<HomeScreen onAdd={cartAdd} cart={cart} onNavigate={navigate} onOpenProduct={setSelectedProduct} products={products}/ >}{active==='cart'&&<CartScreen cart={cart} onAdd={cartAdd} onNavigate={navigate} onPlaceOrder={handlePlaceOrder} orderError={apiError}/ >}{active==='orders'&&<OrdersScreen onNavigate={navigate} apiOrders={orders}/ >}{active==='profile'&&<ProfileScreen onNavigate={navigate}/ >}</div>{active!=='cart'&&<BottomNav active={active} onChange={navigate} cartCount={cartCount}/ >}{active==='cart'&&<div className="cart-bottom-spacer"/>}<FoodDetail product={selectedProduct} onClose={()=>setSelectedProduct(null)} onAdd={cartAdd} quantity={cart.find(x=>x.id===selectedProduct?.id)?.qty||0}/>{toast&&<div className="toast"><span><Check size={15}/></span>{toast}<button onClick={()=>navigate('cart')}>View cart</button></div>}</div><aside className="desktop-promo"><div className="brand"><span className="brand-mark"><Utensils size={19}/></span><span>fastor<span className="brand-dot">.</span></span></div><span className="desktop-label">YOUR DAILY DOSE OF DELIGHT</span><h2>Good food is<br/><em>always</em> a good idea.</h2><p>From your favourite comfort food to something new, there’s a little happiness in every bite.</p><div className="desktop-food-collage"><img src={FOOD.pizza} alt="Pizza"/><img src={FOOD.burger} alt="Burger"/><img src={FOOD.shake} alt="Milkshake"/></div><div className="desktop-note"><span>✦</span> Fresh flavours, delivered with love.</div></aside></div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
