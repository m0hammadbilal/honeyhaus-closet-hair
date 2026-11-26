(()=>{
const A='assets/', data={
long:{name:'Long Sleeve Crew Neck Bodysuit',group:'Everyday Essentials',price:38,colours:{Black:['long','long-side'],Brown:['long-brown','long-back']},copy:'A clean crew neckline and long sleeves give this everyday bodysuit a simple, uninterrupted silhouette.'},
zip:{name:'Zipper Tummy Control Shapewear',group:'Shapewear',price:48,colours:{Brown:['zip','zip-back','zip-detail'],Black:['zip-black']},chart:'zip-chart',copy:'A sculpting one-piece with a front zip and shorts-length leg. Take a closer look at the zip construction and fit.'},
plunge:{name:'Plunge Sculpt Seamless Bodyshaper',group:'Shapewear',price:45,colours:{Brown:['plunge','plunge-flat','plunge-detail','fabric']},chart:'plunge-chart',copy:'A deep plunge neckline, adjustable straps and a rich brown finish. Explore the fabric and construction up close.'},
bob:{name:'The Signature Bob',group:'Wigs',price:165,colours:{Black:['hair']},copy:'A sleek, side-parted bob with a clean silhouette. This visual concept introduces the HoneyHaus Hair collection.'}
};
const img=v=>v==='hair'?'hair.webp':A+v+'.webp', keys=Object.keys(data), money=n=>'£'+n.toFixed(2), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])), first=p=>Object.values(p.colours)[0][0],get=k=>{try{return JSON.parse(localStorage.getItem('hh-'+k))}catch{return null}},set=(k,v)=>localStorage.setItem('hh-'+k,JSON.stringify(v));
let bag=get('bag')||[], route='',colour='',size='',current='',last='',pic=0;
const count=()=>{let n=document.querySelector('#bagcount');if(n)n.textContent=bag.reduce((a,b)=>a+b.qty,0)},save=()=>{set('bag',bag);count()},btn=(href,label)=>'<a class="hh-btn" href="#'+href+'">'+label+'</a>',title=(k,t)=>'<div class="hh-kicker">'+k+'</div><h1>'+t+'</h1>',card=id=>{let p=data[id];return '<a class="hh-card" href="#product/'+id+'"><img src="'+img(first(p))+'" alt="'+p.name+'" loading="lazy"><small>'+p.group+'</small><h3>'+p.name+'</h3><span>'+money(p.price)+'</span></a>'},grid=ids=>'<div class="hh-grid">'+ids.map(card).join('')+'</div>',note='<small class="hh-note">Concept pricing and options for preview.</small>',tabs=()=>'<nav class="hh-tabs" aria-label="Collections">'+[['shop','All products'],['closet','Closet'],['hair','Hair'],['essentials','Everyday essentials'],['shapewear','Shapewear']].map(([r,l])=>'<a href="#'+r+'" '+(r===route?'aria-current="page"':'')+'>'+l+'</a>').join('')+'</nav>';
const guides={
 zip:{headers:['Size','Jump size','US','Bust (in)','Waist (in)'],rows:[
 ['S','XS/S','4','30–34','23–27.5'],['M','M/L','6','34–36','27.5–30'],['L','XL/2XL','8','36–38','30–33.5'],['XL','3XL/4XL','10','38–41','33.5–37'],['2XL','5XL/6XL','12','41–44','37–40.5'],['3XL','7XL/8XL','14','44–47','40.5–44']]},
 plunge:{headers:['Size','UK','Bust (in)','Waist (in)','Hip (in)'],rows:[
 ['2XS','4','30–31','23–24','31–34'],['XS','6','31.5–33.5','24–26','34–36.5'],['S','8–10','34–36','26.5–28.5','37–39'],['M','12–14','36.5–38.5','29–31','39.5–41.5'],['L','16','39–41','31.5–34.5','42–44'],['XL','18','41.5–44.5','35–38','44.5–47.5'],['2XL','20','45–48','38.5–41.5','48–51'],['3XL','22–24','48.5–52','42–45.5','51.5–55']]}
};
const stock=(id,c,s)=>id==='zip'&&c==='Black'&&s==='XL'?0:8;
const inBag=(id,c,s)=>bag.find(b=>b.id===id&&b.colour===c&&b.size===s)?.qty||0;
const remaining=(id,c,s)=>Math.max(0,stock(id,c,s)-inBag(id,c,s));
let amount=1,filter='',swatches={},drawer;
const links=()=>'<div class="hh-actions">'+btn('closet','Shop Closet')+btn('hair','Shop Hair')+'</div>';
function guide(id){
 const g=guides[id];
 if(!g)return '<p>Ask our team about the fit of this style.</p>'+btn('contact','Ask about fit');
 return '<p>Measure your body in inches. Match the measurements below to this style.</p><div class="hh-table"><table><caption>'+data[id].name+'</caption><thead><tr>'+g.headers.map(h=>'<th scope="col">'+h+'</th>').join('')+'</tr></thead><tbody>'+g.rows.map(row=>'<tr><th scope="row">'+row[0]+'</th>'+row.slice(1).map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function gallery(id){
 const p=data[id],photos=p.colours[colour],isHair=id==='bob',available=isHair||size?remaining(id,colour,size):8;
 const choices=Object.keys(p.colours).map(c=>'<button class="hh-choice" data-col="'+c+'" aria-pressed="'+(c===colour)+'"><i class="hh-swatch" style="background:'+(c==='Black'?'#211e1c':'#704936')+'"></i>'+c+'</button>').join('');
 const sizes=(guides[id]?.rows.map(r=>r[0])||['S','M','L','XL']).map(s=>'<button class="hh-choice" data-size="'+s+'" '+(!stock(id,colour,s)?'disabled aria-label="'+s+' sold out"':'')+' aria-pressed="'+(s===size)+'">'+s+'</button>').join('');
 return `<nav aria-label="Breadcrumb"><a href="#shop">Shop</a> / <a href="#${isHair?'hair':'closet'}">${isHair?'Hair':'Closet'}</a> / ${p.group}</nav>
 <div class="hh-detail"><div><img class="hh-photo" data-gallery src="${img(photos[pic])}" alt="${p.name}, ${colour}, view ${pic+1}"><div class="hh-options">${photos.map((s,i)=>'<button class="hh-thumb" data-pic="'+i+'" aria-pressed="'+(i===pic)+'" aria-label="View image '+(i+1)+'"><img src="'+img(s)+'" alt=""></button>').join('')}</div></div>
 <section class="hh-side">${title('HoneyHaus / '+p.group,p.name)}<p>${money(p.price)}</p><p>${p.copy}</p>
 <span>Colour · ${colour}</span><div class="hh-options">${choices}</div>
 ${isHair?'':'<span>Choose a size</span><div class="hh-options">'+sizes+'</div><details><summary>Size & fit guide</summary>'+guide(id)+'</details>'}
 <div class="hh-buy"><label>Quantity<input class="hh-amt" type="number" min="1" max="${Math.max(1,available)}" value="${amount}" step="1" id="hh-amount"></label><button class="hh-btn" data-add ${available?'':'disabled'}>${available?'Add to bag':'Unavailable'}</button></div><div aria-live="polite" id="hh-message"></div>${note}
 <details><summary>${isHair?'Wig details & care':'Construction & care'}</summary><p>${isHair?'This portrait illustrates the Hair edit. Contact our team for confirmed fibre, cap fit, lengths and care instructions.':guides[id]?'Hand wash gently. The supplied care card advises against tumble drying, machine washing and dry cleaning.':'The fitted long-sleeve silhouette has a classic crew neckline. Follow the care label supplied with the garment.'}</p></details><details><summary>Delivery & returns</summary><a href="#shipping">Delivery information</a> · <a href="#returns">Returns information</a></details></section></div>`;
}
function cart(compact=false){
 let heading=compact?'<h2 id="drawer-title">Your shopping bag</h2>':title('HoneyHaus','Your shopping bag');
 if(!bag.length)return heading+'<p>Your bag is empty.</p>'+links();
 let rows=bag.map((b,i)=>`<div class="hh-row"><img src="${img(data[b.id].colours[b.colour][0])}" alt=""><section><a href="#product/${b.id}?colour=${b.colour}">${data[b.id].name}</a><br><small>${b.colour} ${b.size}</small><div><button class="hh-num" data-delta="-1" data-i="${i}" aria-label="Decrease quantity">−</button> ${b.qty} <button class="hh-num" data-delta="1" data-i="${i}" ${remaining(b.id,b.colour,b.size)?'':'disabled'} aria-label="Increase quantity">+</button></div></section><span>${money(data[b.id].price*b.qty)}</span><button class="hh-link" data-remove="${i}">Remove</button></div>`).join('');
 return heading+rows+'<h2>Subtotal · '+money(total())+'</h2><p>Delivery calculated at live checkout. <a href="#returns">Returns information</a></p><div class="hh-actions">'+(compact?btn('cart','View full bag'):'')+btn('checkout','Continue to checkout')+'</div>'+note;
}
function openBag(){
 if(!drawer){drawer=document.createElement('dialog');drawer.className='hh-drawer';drawer.setAttribute('aria-labelledby','drawer-title');document.body.append(drawer);drawer.addEventListener('click',e=>{if(e.target===drawer)drawer.close()});}
 drawer.innerHTML='<section class="hh-page"><button class="hh-link" data-close aria-label="Close bag">Close ×</button>'+cart(true)+'</section>';
 if(!drawer.open)drawer.showModal();
}
function shopCard(id,c){
 const p=data[id];c=swatches[id]||c||Object.keys(p.colours)[0];
 return `<article><a class="hh-card" href="#product/${id}?colour=${c}"><img src="${img(p.colours[c][0])}" alt="${c} ${p.name}" loading="lazy"><small>HoneyHaus ${id==='bob'?'Hair':'Closet'} / ${p.group}</small><h3>${p.name}</h3><span>${money(p.price)}</span></a><div class="hh-chips">${Object.keys(p.colours).map(v=>'<button class="hh-chip" data-chip="'+v+'" data-id="'+id+'" aria-pressed="'+(c===v)+'">'+v+'</button>').join('')}</div></article>`;
}
const collectionNames={shop:'Shop all',closet:'HoneyHaus Closet',hair:'HoneyHaus Hair',essentials:'Everyday essentials',shapewear:'Shapewear'};
function styleRail(){
 const styles=[['product/long','Crew neck','M6 5l4-2q2 3 4 0l4 2 4 9-3 2-3-7v10l-4 3-4-3V9l-3 7-3-2z'],['product/zip','Zip-front','M8 2l2 1-1 4q3 3 6 0l-1-4 2-1 2 8-1 4 2 7h-6l-1-4-1 4H5l2-7-1-4z M12 9v6'],['product/plunge','Plunge','M8 2l2 1-1 3 3 5 3-5-1-3 2-1 2 8-2 4 2 7h-5l-1-4-1 4H6l2-7-2-4z'],['product/bob','Bob','M4 20q2-3 1-8C4 0 20-1 20 11q0 7 2 9l-6 1V9q-3 4-8 4v8z']];
 return '<section class="hh-styleband"><h2>Find your silhouette</h2><div>'+styles.map(([r,n,d])=>'<a href="#'+r+'"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="'+d+'"/></svg>'+n+'</a>').join('')+'</div></section>';
}
function collectionBlocks(){
 return '<div class="hh-blocks">'+[['closet','editor-long','HoneyHaus Closet','Everyday layers'],['hair','hair','HoneyHaus Hair','The wig edit']].map(([r,i,n,c])=>'<a href="#'+r+'"><div><span>'+c+'</span><h2>'+n+'</h2><u>Explore collection</u></div><img src="'+img(i)+'" alt="" loading="lazy"></a>').join('')+'</div>';
}
function pairing(){
 return '<section class="hh-pair"><img src="'+img('long-brown')+'" alt="Brown crew-neck bodysuit" loading="lazy"><div><h2>Wear them together.</h2><p>A smooth crew neckline and a sharply cut bob. Two pieces, one finished look.</p>'+btn('product/long?colour=Brown','Shop the bodysuit')+'<a href="#product/bob">Explore the bob</a></div><img src="hair.webp" alt="Sleek side-parted bob" loading="lazy"></section>';
}
function collectionPage(){
 const isHair=route==='hair';
 let ids=keys.filter(id=>route==='shop'||(isHair?id==='bob':route==='closet'?id!=='bob':route==='essentials'?id==='long':['zip','plunge'].includes(id)));
 const matching=ids.filter(id=>!filter||data[id].colours[filter]);
 const feature=isHair?['hair','The signature bob.','product/bob','Explore the wig']:route==='shapewear'?['editor-zip','Sculpted layers.','product/zip','Explore the zip-front']:['editor-long','The everyday bodysuit.','product/long','Explore the crew neck'];
 const filterBar='<div class="hh-catalog-tools"><span>'+matching.length+' '+(matching.length===1?'piece':'pieces')+'</span><label>Colour<select id="hh-filter">'+['','Black','Brown'].map(v=>'<option value="'+v+'" '+(v===filter?'selected':'')+'>'+(v||'All colours')+'</option>').join('')+'</select></label>'+(filter?'<button class="hh-link" data-reset>Reset filter</button>':'')+'</div>';
 return '<div class="hh-collection-intro">'+title('HoneyHaus collections',collectionNames[route])+tabs()+'</div><section class="hh-catalog"><a class="hh-feature" href="#'+feature[2]+'"><img src="'+img(feature[0])+'" alt=""><div><h2>'+feature[1]+'</h2><u>'+feature[3]+'</u></div></a><div>'+filterBar+'<div class="hh-grid">'+matching.map(id=>shopCard(id,filter)).join('')+'</div>'+(!matching.length?'<p>No products in this colour.</p>':'')+note+'</div></section>'+styleRail()+(route==='shop'?collectionBlocks():pairing());
}
function aboutSpreads(){
 return '<div class="hh-collection-intro">'+title('About the Haus','Comfort meets confidence.')+'</div><section class="hh-story"><img src="'+img('editor-long')+'" alt="HoneyHaus Closet fashion portrait"><div><h2>Introducing HoneyHaus.</h2><p>Formerly Gluxe Collection, HoneyHaus brings together the layers you reach for and the hair that finishes the look.</p>'+btn('collections','Explore our collections')+'</div></section><section class="hh-story hh-story-reverse"><img src="'+img('plunge-detail')+'" alt="Adjustable shoulder strap of the brown Plunge bodyshaper" loading="lazy"><div><h2>Inside the Closet.</h2><p>Start with a crew neckline, a plunge or a zip-front silhouette. Explore each piece in detail, from the shape of its straps to the fabric against your skin.</p>'+btn('closet','Explore Closet')+'</div></section><section class="hh-story hh-story-hair"><img src="hair.webp" alt="HoneyHaus Hair editorial portrait" loading="lazy"><div><h2>Meet the Hair edit.</h2><p>A deep side part and a clean bob frame the face. Discover the first silhouette in the HoneyHaus wig collection.</p>'+btn('hair','Explore Hair')+'</div></section>';
}
function grouped(ids){
 return ['Closet','Hair'].map(g=>{const list=ids.filter(id=>g==='Hair'?id==='bob':id!=='bob');return list.length?'<h2>HoneyHaus '+g+'</h2><div class="hh-grid">'+list.map(id=>shopCard(id)).join('')+'</div>':''}).join('')||'<p>No products matched your search.</p>'+links();
}
const total=()=>bag.reduce((a,b)=>a+b.qty*data[b.id].price,0);
const info={returns:['Returns & refunds','For a return enquiry, include your order reference and the item you would like to return. For eligible UK distance purchases, you generally have 14 days from receipt to notify cancellation and another 14 days to send the item back. Standard outbound delivery is generally refundable when cancelling the whole order. Faulty or misdescribed goods have separate statutory protections. Final return address, postage arrangements and eligibility by product will be confirmed for launch.'],shipping:['Shipping & delivery','Delivery regions, rates and dispatch estimates will be confirmed before the collection opens for orders.'],privacy:['Privacy policy','This concept stores your shopping bag and demo order summary in this browser. Checkout and contact details entered here are not transmitted.'],terms:['Terms of service','This storefront is a shopping concept. Preview orders demonstrate the shopping flow and do not create a purchase or payment.'],cookies:['Cookie preferences','This preview uses local browser storage to remember your bag and preview order. You can clear this information below.']};
function show(r){route=(r||'shop').replace(/^#?\/?/,'').split('?')[0];const query=new URLSearchParams((r||'').split('?')[1]); if(last!==route){filter='';swatches={}} let page='';current=route.split('/')[1];if(route.startsWith('product/')&&data[current]){if(last!==route||query.has('colour')){const c=query.get('colour');colour=Object.hasOwn(data[current].colours,c)?c:Object.keys(data[current].colours)[0];size='';pic=0;amount=1}page=gallery(current)}
else if(['shop','closet','hair','essentials','shapewear'].includes(route)){page=collectionPage()}
else if(route==='collections'){page=title('Shop HoneyHaus','Our collections')+collectionBlocks()+styleRail()+pairing()}
else if(route==='wishlist'){page=title('HoneyHaus','Your wishlist')+(window.hhShelf?.wishlist()||'')}
else if(route==='search'){page=title('HoneyHaus','Search the Haus')+'<label for="hh-q">Search products or collections</label><input type="search" id="hh-q" placeholder="Try bodysuit, wig or shapewear"><div id="hh-results">'+grouped(keys)+'</div>'}
else if(route==='cart'||route==='bag'){page=cart()}
else if(route==='checkout'){page=title('Your bag','Checkout')+(bag.length?'<p>Preview your order. No payment is collected.</p><form id="hh-order"><label>Email<input type="email" required autocomplete="email"></label><label>Name<input required autocomplete="name"></label><h2>Order summary</h2>'+bag.map(b=>'<p>'+data[b.id].name+' × '+b.qty+' · '+b.colour+' '+b.size+'</p>').join('')+'<p>Demo total · '+money(total())+'</p><p><a href="#shipping">Delivery</a> · <a href="#returns">Returns</a> · <a href="#terms">Terms</a></p><button class="hh-btn">Place preview order</button></form>':btn('shop','Explore products'))}
else if(route==='confirmation'||route==='account'){let o=get('order');page=title('HoneyHaus',route==='account'?'My account':'Order confirmation')+(o?'<h2>Your preview order</h2><p>'+esc(o.ref)+' · '+money(o.sum)+'</p><p>Saved in this browser. No payment was taken.</p>':'<p>Your preview orders will appear here after checkout.</p>')+(route==='account'?(get('orders')||[]).map(o=>'<details><summary>'+esc(o.ref)+' · '+esc(o.date)+' · '+money(o.sum)+'</summary>'+o.items.map(i=>'<p>'+esc(data[i.id].name)+' × '+i.qty+' · '+esc(i.colour)+' '+esc(i.size)+'</p>').join('')+'</details>').join(''):'')+btn('shop','Continue shopping')}
else if(route==='about'){page=aboutSpreads()}
else if(route==='contact'){page=title('Customer care','Contact the Haus')+'<p>Ask about an order, a fit or the wig collection.</p><form id="hh-contact"><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" autocomplete="email" type="email" required></label><label>Topic<select name="topic"><option>Product & fit</option><option>Hair</option><option>Order</option><option '+(query.get('topic')==='Returns'?'selected':'')+'>Returns</option></select></label><label>Order number (optional)<input name="order"></label><label>Your message<textarea name="message" rows="4" required></textarea></label><p>Save a copy of your enquiry while the shop prepares to open.</p><button class="hh-btn">Download enquiry</button><p id="hh-response" role="status"></p></form>'}
else if(info[route]){page=title('Customer care',info[route][0])+'<p>'+info[route][1]+'</p>'+(route==='cookies'?'<button class="hh-btn" data-clear>Clear preview data</button>':btn(route==='returns'?'contact?topic=Returns':'contact',route==='returns'?'Request a return':'Contact HoneyHaus'))}
else{page=title('HoneyHaus','Page not found')+links()}
const label=(page.match(/<h1>([^<]+)<\/h1>/)||[])[1]||'The Haus';document.title=label+' | HoneyHaus';document.querySelector('meta[name="description"]')?.setAttribute('content',data[current]?.copy||label+' at HoneyHaus. Discover the Closet and Hair collections.');
last=route;document.querySelector('#app').innerHTML='<div class="hh-page"><div class="hh-inner">'+page+'</div></div>';count()}
document.addEventListener('click',e=>{if(!e.target.closest('.hh-page'))return;let d=e.target.closest('button')?.dataset;if(!d)return;if(d.close!==undefined){drawer.close();return}if(d.reset!==undefined){filter='';swatches={};show(route)}if(d.chip){swatches[d.id]=d.chip;let a=e.target.closest('article');a.outerHTML=shopCard(d.id);return}if(d.col){history.replaceState(null,'','#'+route+'?colour='+d.col);colour=d.col;size='';amount=1;pic=0;show(route)}if(d.size&&stock(current,colour,d.size)){size=d.size;amount=1;show(route)}if(d.pic!==undefined){pic=+d.pic;show(route)}if(d.add!==undefined){let m=document.querySelector('#hh-message');if(current!=='bob'&&!size){m.textContent='Choose a size to add this item.';return}if(!Number.isInteger(amount)||amount<1||amount>remaining(current,colour,size)){m.textContent='Choose an available quantity.';return}if(!addVariant(current,colour,size,amount))return;amount=1;show(route);m=document.querySelector('#hh-message');m.innerHTML='Added to your bag. <a href="#cart">View bag</a>'}if(d.delta){let b=bag[+d.i];if(+d.delta>0&&!remaining(b.id,b.colour,b.size))return;b.qty+=+d.delta;if(b.qty<1)bag.splice(+d.i,1);save();drawer?.open?openBag():show(route)}if(d.remove!==undefined){bag.splice(+d.remove,1);save();drawer?.open?openBag():show(route)}if(d.clear!==undefined){bag=[];save();localStorage.removeItem('hh-order');localStorage.removeItem('hh-orders');e.target.textContent='Preview data cleared'}});
document.addEventListener('input',e=>{if(e.target.id==='hh-amount'){amount=Number(e.target.value);return}if(e.target.id!=='hh-q')return;let q=e.target.value.toLowerCase().trim(),ids=keys.filter(k=>(data[k].name+' '+data[k].group+' '+(k==='bob'?'hair':'closet')).toLowerCase().includes(q));document.querySelector('#hh-results').innerHTML=grouped(ids)});
document.addEventListener('submit',e=>{if(e.target.id==='hh-order'){e.preventDefault();if(!bag.length)return;let record={ref:'HH-'+Date.now().toString().slice(-8),sum:total(),items:bag.map(b=>({...b})),date:new Date().toISOString().slice(0,10)};set('order',record);set('orders',[record,...(get('orders')||[])]);bag=[];save();location.hash='confirmation'}if(e.target.id==='hh-contact'){e.preventDefault();const f=new FormData(e.target);const body=['HoneyHaus enquiry',...['name','email','topic','order','message'].map(k=>k+': '+(f.get(k)||'—'))].join('\n');const url=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='HoneyHaus-enquiry.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),5000);document.querySelector('#hh-response').textContent='Your enquiry copy is ready. Email delivery opens with the live store.'}});
document.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a)return;
 if(a.closest('header')&&a.getAttribute('href')==='#cart'){e.preventDefault();openBag();return}
 if(drawer?.open&&drawer.contains(a))drawer.close();
});
document.addEventListener('change',e=>{if(e.target.id==='hh-filter'){filter=e.target.value;swatches={};show(route)}});
let startX=null;document.addEventListener('touchstart',e=>{startX=e.target.matches('[data-gallery]')?e.touches[0].clientX:null},{passive:true});
document.addEventListener('touchend',e=>{if(startX===null)return;let d=e.changedTouches[0].clientX-startX;startX=null;if(Math.abs(d)<45)return;const n=data[current].colours[colour].length;pic=(pic+(d<0?1:n-1))%n;show(route)},{passive:true});
function addVariant(id,selectedColour,selectedSize,qty=1){
 const product=data[id];
 if(!product||!product.colours[selectedColour]||!Number.isInteger(qty)||qty<1)return false;
 const sizes=id==='bob'?['']:(guides[id]?.rows.map(row=>row[0])||['S','M','L','XL']);
 if(!sizes.includes(selectedSize)||qty>remaining(id,selectedColour,selectedSize))return false;
 const item=bag.find(line=>line.id===id&&line.colour===selectedColour&&line.size===selectedSize);
 if(item)item.qty+=qty;else bag.push({id,colour:selectedColour,size:selectedSize,qty});
 save();return true;
}
window.hhShop={products:data,sizes:id=>id==='bob'?[]:(guides[id]?.rows.map(row=>row[0])||['S','M','L','XL']),remaining,addVariant,image:img,price:money};
window.shopRender=show;window.hhBagCount=count;count();
})();
