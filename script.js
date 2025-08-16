async function hydrate(){
  try{
    const res = await fetch('/data/site.json', {cache:'no-store'});
    if(!res.ok) throw new Error('No data');
    const data = await res.json();
    document.querySelectorAll('.brand .name').forEach(n=>n.textContent=data.brand_name||'Violet Vending');
    document.querySelectorAll('[data-bind="email"]').forEach(e=>{ e.textContent=data.email; e.href='mailto:'+data.email; });
    document.querySelectorAll('[data-bind="phone"]').forEach(p=>{ p.textContent=data.phone; p.href='tel:'+data.phone.replace(/[^0-9+]/g,''); });
    const h1 = document.querySelector('[data-bind="hero_title"]'); if(h1) h1.textContent = data.hero_title;
    const hp = document.querySelector('[data-bind="hero_paragraph"]'); if(hp) hp.textContent = data.hero_paragraph;
    const kpiWrap = document.querySelector('.kpis');
    if(kpiWrap && Array.isArray(data.kpis)){
      kpiWrap.innerHTML = data.kpis.map(k=>`<div class="kpi"><b>${k.value}</b><span>${k.label}</span></div>`).join('');
    }
    const svcWrap = document.querySelector('#services .grid');
    if(svcWrap && Array.isArray(data.services)){
      svcWrap.innerHTML = data.services.map(s=>`<div class="card"><h3>${s.title}</h3><p>${s.text}</p></div>`).join('');
    }
    const faqWrap = document.querySelector('#faq .faq-list');
    if(faqWrap && Array.isArray(data.faq)){
      faqWrap.innerHTML = data.faq.map(item=>`<details><summary>${item.q}</summary><p>${item.a}</p></details>`).join('');
    }
    const areaSelect = document.getElementById('service_area');
    if(areaSelect && Array.isArray(data.service_areas)){
      areaSelect.innerHTML = '<option value="">Choose…</option>' + data.service_areas.map(a=>`<option>${a}</option>`).join('');
    }
  }catch(e){}
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', hydrate); else hydrate();

// ---- Theme toggle (optional dark mode) ----
(function(){
  const root = document.documentElement;
  const key = 'vv-theme';
  function apply(theme){
    if(theme==='dark'){ root.setAttribute('data-theme','dark'); }
    else{ root.removeAttribute('data-theme'); }
    try{ localStorage.setItem(key, theme||'light'); }catch(e){}
    const btn = document.getElementById('themeToggle');
    if(btn) btn.setAttribute('aria-pressed', theme==='dark' ? 'true':'false');
  }
  function init(){
    let saved = null;
    try{ saved = localStorage.getItem(key); }catch(e){}
    if(!saved){
      // Respect system preference on first visit without forcing later
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    apply(saved);
    const btn = document.getElementById('themeToggle');
    if(btn){
      btn.addEventListener('click', ()=>{
        const next = root.getAttribute('data-theme')==='dark' ? 'light' : 'dark';
        apply(next);
      });
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

