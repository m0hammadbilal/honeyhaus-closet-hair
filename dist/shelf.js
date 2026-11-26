(()=>{
 const shop=window.hhShop;
 if(!shop)return;
 const key='hh-wishlist',heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.2 12.4C-2.8 5.5 5.4-.6 12 6.1 18.6-.6 26.8 5.5 20.8 12.4Z"/></svg>';
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]').filter(id=>Object.hasOwn(shop.products,id))}catch{return []}};
 const activeColour=card=>card.querySelector('[data-swatch][aria-pressed=true]')?.dataset.swatch||Object.keys(shop.products[card.dataset.shelfId].colours)[0];
 const iconButton=id=>'<button type="button" class="sf-heart" data-heart="'+id+'" aria-label="Save '+shop.products[id].name+'" aria-pressed="'+read().includes(id)+'">'+heart+'</button>';
 function syncHearts(){
  const saved=read();
  document.querySelectorAll('[data-heart]').forEach(b=>{const id=b.dataset.heart,on=saved.includes(id);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Remove ':'Save ')+shop.products[id].name+(on?' from wishlist':' to wishlist'))});
 }
 function wishlist(){
  const saved=read();if(!saved.length)return '<p>Keep your favourite pieces here. Tap a heart in the Haus edit to save a piece.</p><a class="hh-btn" href="#home">Explore the edit</a>';
  return '<div class="hh-grid sf-list">'+saved.map(id=>{
   const p=shop.products[id],colour=Object.keys(p.colours)[0];
   return '<article data-shelf-id="'+id+'"><div class="sf-frame"><a class="hh-card" href="#product/'+id+'"><img src="'+shop.image(p.colours[colour][0])+'" alt="'+p.name+'"></a>'+iconButton(id)+'<button class="sf-add" data-quick="'+id+'">Add to cart</button></div><a class="hh-card" href="#product/'+id+'"><h3>'+p.name+'</h3></a><p>'+shop.price(p.price)+'</p></article>';
  }).join('')+'</div>';
 }
 window.hhShelf={wishlist};
 const dialog=document.createElement('dialog');dialog.className='sf-dialog';dialog.setAttribute('aria-labelledby','sf-title');document.body.append(dialog);
 function options(id,colour){
  const sizes=shop.sizes(id);
  return sizes.length?'<label>Size<select name="size" required><option value="">Choose a size</option>'+sizes.map(s=>'<option '+(shop.remaining(id,colour,s)?'':'disabled')+' value="'+s+'">'+s+(shop.remaining(id,colour,s)?'':' · sold out')+'</option>').join('')+'</select></label>':'';
 }
 function openPicker(id,c){
  const p=shop.products[id];dialog.innerHTML='<form data-sf-order="'+id+'"><button type="button" class="sf-close" aria-label="Close quick add">×</button><img class="sf-preview" src="'+shop.image(p.colours[c][0])+'" alt="'+p.name+'"><div class="sf-choices"><small>Quick add</small><h2 id="sf-title">'+p.name+'</h2><p>'+shop.price(p.price)+'</p><label>Colour<select name="colour">'+Object.keys(p.colours).map(v=>'<option '+(c===v?'selected':'')+'>'+v+'</option>').join('')+'</select></label><div class="sf-sizes">'+options(id,c)+'</div><button class="sf-submit">Add to bag</button><div role="status" class="sf-message"></div><a class="sf-full" href="#product/'+id+'?colour='+c+'">View piece details</a></div></form>';dialog.showModal();
 }
 function mount(){
  document.querySelectorAll('.products-four .piece, .pieces .piece').forEach(card=>{
   if(card.dataset.shelfId)return;
   const photo=card.querySelector('.piecephoto'),id=photo?.hash.split('/')[1]?.split('?')[0];if(!shop.products[id])return;
   card.dataset.shelfId=id;const frame=document.createElement('div');frame.className='sf-frame';photo.before(frame);frame.append(photo);
   frame.insertAdjacentHTML('beforeend',iconButton(id)+'<button class="sf-add" data-quick="'+id+'" aria-label="Quick add '+shop.products[id].name+'">Add to cart</button>');
  });
  const tools=document.querySelector('header .tools');if(tools&&!tools.querySelector('[href="#wishlist"]'))tools.querySelector('[href="#cart"]')?.insertAdjacentHTML('beforebegin','<a href="#wishlist" class="sf-wishlink" aria-label="Wishlist">'+heart+'</a>');
  syncHearts();
 }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(b?.dataset.heart){const id=b.dataset.heart,list=read();localStorage.setItem(key,JSON.stringify(list.includes(id)?list.filter(v=>v!==id):[...list,id]));if(location.hash==='#wishlist'){window.shopRender('wishlist');(document.querySelector('.sf-list [data-heart]')||document.querySelector('.hh-page .hh-btn'))?.focus()}syncHearts()}
  if(b?.dataset.quick)openPicker(b.dataset.quick,activeColour(b.closest('[data-shelf-id]')));
  if(b?.matches('[data-swatch]')){syncHearts();b.closest('.piece').querySelector('[data-quick]')?.removeAttribute('aria-pressed')}
  if(e.target===dialog||b?.classList.contains('sf-close')||e.target.closest('dialog.sf-dialog a'))dialog.close();
 });
 dialog.addEventListener('change',e=>{
  if(e.target.name!=='colour')return;const id=e.target.form.dataset.sfOrder,c=e.target.value,p=shop.products[id];dialog.querySelector('.sf-preview').src=shop.image(p.colours[c][0]);dialog.querySelector('.sf-sizes').innerHTML=options(id,c);dialog.querySelector('.sf-full').href='#product/'+id+'?colour='+c;dialog.querySelector('.sf-message').textContent='';
 });
 dialog.addEventListener('submit',e=>{e.preventDefault();const f=e.target,id=f.dataset.sfOrder,c=f.elements.colour.value,s=f.elements.size?.value||'',ok=shop.addVariant(id,c,s);const msg=f.querySelector('.sf-message');if(!ok){msg.textContent='This selection is unavailable. Choose another option.';return}msg.innerHTML='Added to your bag. <a href="#cart">View bag</a>';f.querySelector('.sf-submit').textContent='Add another';});
 new MutationObserver(mount).observe(document.querySelector('#app'),{childList:true});window.addEventListener('storage',e=>{if(e.key===key){if(location.hash==='#wishlist')window.shopRender('wishlist');syncHearts()}});mount();if(location.hash==='#wishlist')window.shopRender('wishlist');
})();
