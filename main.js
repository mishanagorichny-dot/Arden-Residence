/* ARDEN — shared chrome + page interactions */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const img = id => `assets/img/${id}.jpg`;
  const eur = n => '€' + n.toLocaleString('en-IE');
  const ARROW = '<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const PAGE = document.body.dataset.page || 'home';

  /* ================= data ================= */
  const HOMES = [
    { id: 'alder',  name: 'The Alder',  type: 'apartment', label: '1 bed apartment',          beds: 1, baths: 1, size: 52,  aspect: 'South-west',  price: 385000, left: 6, img: '1493809842364-78817add7ffb', plan: 1,
      feats: ['Recessed balcony, 6 m²', 'Floor-to-ceiling glazing', 'Utility store off hall', 'Bike space in secure store'] },
    { id: 'birch',  name: 'The Birch',  type: 'apartment', label: '2 bed apartment',          beds: 2, baths: 2, size: 78,  aspect: 'South',       price: 475000, left: 9, img: 'arden-birch', plan: 2,
      feats: ['Corner balcony, 9 m²', 'En-suite to main bedroom', 'Dual aspect living room', 'Designated parking option'] },
    { id: 'hazel',  name: 'The Hazel',  type: 'apartment', label: '2 bed + study apartment',  beds: 2, baths: 2, size: 88,  aspect: 'East & west', price: 525000, left: 3, img: '1502672260266-1c1ef2d93688', plan: 2,
      feats: ['Separate study with window', 'Walk-in wardrobe', 'Balcony over the woodland', 'Triple aspect'] },
    { id: 'rowan',  name: 'The Rowan',  type: 'apartment', label: '3 bed penthouse',          beds: 3, baths: 2, size: 118, aspect: 'South & west', price: 795000, left: 1, img: '1618221195710-dd6b41faaea6', plan: 3,
      feats: ['Private roof terrace, 24 m²', 'Views to the Dublin Mountains', 'Two parking spaces', 'Top-floor ceiling height 2.9 m'] },
    { id: 'willow', name: 'The Willow', type: 'duplex',    label: '2 bed own-door duplex',    beds: 2, baths: 2, size: 96,  aspect: 'South',       price: 545000, left: 4, img: 'arden-willow', plan: 2,
      feats: ['Own front door', 'Upper-floor terrace', 'Guest WC at entry level', 'Storage under stairs'] },
    { id: 'larch',  name: 'The Larch',  type: 'duplex',    label: '3 bed own-door duplex',    beds: 3, baths: 3, size: 112, aspect: 'South-east',  price: 615000, left: 2, img: '1600607687939-ce8a6c25118c', plan: 3,
      feats: ['Own front door', 'Two en-suites', 'Open-plan kitchen & living', 'Terrace facing the courtyard'] },
    { id: 'oak',    name: 'The Oak',    type: 'townhouse', label: '3 bed townhouse',          beds: 3, baths: 3, size: 126, aspect: 'West garden', price: 695000, left: 5, img: 'arden-oak', plan: 3,
      feats: ['Private rear garden, 60 m²', 'EV charger on driveway', 'Kitchen opening to garden', 'Attic storage'] },
    { id: 'ash',    name: 'The Ash',    type: 'townhouse', label: '4 bed townhouse',          beds: 4, baths: 3, size: 158, aspect: 'South garden', price: 845000, left: 0, img: '1600566753190-17f0baa2a6c3', plan: 4,
      feats: ['Private rear garden, 80 m²', 'Home office on 2nd floor', 'Two parking spaces', 'Released in Phase Two'] },
  ];
  const TYPE_LABEL = { apartment: 'Apartments', duplex: 'Duplexes', townhouse: 'Townhouses' };

  const SPEC = [
    { t: 'Kitchens', img: '1484154218962-a197022b5858', d: 'Handleless kitchens in matt oak and chalk, with quartz worktops and integrated Bosch appliances.', tags: ['Quartz worktops', 'Integrated appliances', 'Soft-close drawers', 'Under-cabinet lighting'] },
    { t: 'Living spaces', img: '1524758631624-e2822e304c36', d: 'Engineered oak floors throughout, 2.7 m ceilings and deep window reveals sized for a reading seat.', tags: ['Engineered oak', '2.7 m ceilings', 'Triple glazing', 'Dimmable lighting'] },
    { t: 'Bedrooms', img: '1616594039964-ae9021a400a0', d: 'Fitted wardrobes with full-height doors, wool-blend carpet and blackout-ready window heads.', tags: ['Fitted wardrobes', 'Wool-blend carpet', 'USB-C sockets'] },
    { t: 'Bathrooms', img: '1552321554-5fefe8c9ef14', d: 'Large-format porcelain tiles, wall-hung sanitaryware and heated towel rails in brushed brass.', tags: ['Porcelain tiling', 'Rain shower', 'Heated towel rail'] },
    { t: 'Energy & comfort', img: '1600563438938-a9a27216b4f5', d: 'Air-to-water heat pumps, underfloor heating and mechanical ventilation with heat recovery. Every home is rated A1.', tags: ['A1 BER', 'Heat pump', 'Underfloor heating', 'MVHR', 'Fibre broadband'] },
  ];

  const PLACES = {
    Transport: [
      { n: 'Ballyogan Wood Luas', s: 'Green Line to St Stephen\'s Green', t: 4,  m: 'walk',  x: 238, y: 232 },
      { n: 'M50 Junction 15',     s: 'Carrickmines interchange',          t: 3,  m: 'drive', x: 360, y: 118 },
      { n: 'St Stephen\'s Green', s: 'Direct on the Luas',                t: 32, m: 'Luas',  x: 190, y: 12 },
      { n: 'Dublin Airport',      s: 'Via the M50',                       t: 30, m: 'drive', x: 90,  y: 60 },
    ],
    Nature: [
      { n: 'Arden woodland walk', s: 'On site, 1.2 km loop',        t: 1,  m: 'walk',  x: 320, y: 280 },
      { n: 'Fernhill Park',       s: 'Gardens & woodland',          t: 8,  m: 'drive', x: 200, y: 360 },
      { n: 'Marlay Park',         s: 'Parkland, concerts, café',    t: 12, m: 'drive', x: 60,  y: 250 },
      { n: 'Ticknock Forest',     s: 'Dublin Mountains trails',     t: 15, m: 'drive', x: 110, y: 440 },
      { n: 'Killiney Hill',       s: 'Coastal walks & views',       t: 15, m: 'drive', x: 520, y: 360 },
    ],
    Everyday: [
      { n: 'The Park, Carrickmines', s: 'Retail, groceries, cafés',     t: 6,  m: 'cycle', x: 390, y: 200 },
      { n: 'Leopardstown',           s: 'Racecourse & shopping centre',  t: 8,  m: 'cycle', x: 330, y: 70 },
      { n: 'Sandyford',              s: 'Business district & dining',    t: 8,  m: 'Luas',  x: 200, y: 100 },
      { n: 'Dundrum Town Centre',    s: 'Shopping, cinema, restaurants', t: 12, m: 'drive', x: 110, y: 150 },
    ],
    Schools: [
      { n: 'Primary schools',   s: 'Several within the area', t: 6,  m: 'walk',  x: 270, y: 190 },
      { n: 'Secondary schools', s: 'Several within the area', t: 10, m: 'cycle', x: 380, y: 290 },
      { n: 'Crèche on site',    s: 'Opening with Phase One',  t: 2,  m: 'walk',  x: 330, y: 230 },
      { n: 'UCD campus',        s: 'Belfield',                t: 20, m: 'drive', x: 250, y: 20 },
    ],
  };

  const AMEN = [
    { t: 'The woodland walk',      img: 'arden-woodland-walk', d: 'A 1.2 km lit loop through the retained trees, with benches, play clearings and a dog-friendly route.' },
    { t: 'Courtyard gardens',      img: 'arden-courtyard', d: 'Three planted courtyards between the blocks, designed with a landscape architect for year-round colour.' },
    { t: 'Residents\' allotments', img: 'arden-allotments', d: 'Twenty raised beds with a potting shed and water points. Book a season through the resident app.' },
    { t: 'Fitness studio',         img: '1571902943202-507ec2618e8f', d: 'Open 6am to 11pm, facing the canopy, with free weekly classes in the first year.' },
    { t: 'Work suite',             img: '1497366216548-37526070297c', d: 'Bookable desks, two call booths and a meeting room, so remote work doesn\'t have to mean the kitchen table.' },
    { t: 'Residents\' lounge',     img: '1505691938895-1758d7feb511', d: 'A shared living room with a kitchen for bigger dinners, a parcel room and a concierge desk.' },
  ];

  /* ================= shared chrome ================= */
  const PAGES = [
    { key: 'homes', href: 'homes.html', label: 'Homes' },
    { key: 'location', href: 'location.html', label: 'Location' },
    { key: 'living', href: 'living.html', label: 'Living' },
    { key: 'buying', href: 'buying.html', label: 'Buying' },
  ];
  const cur = key => key === PAGE ? ' aria-current="page"' : '';

  const navHTML = `
  <header class="nav" data-nav>
    <div class="nav__inner">
      <a href="index.html" class="brand" aria-label="Arden, home"${cur('home')}>
        <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 30V14a10 10 0 0 1 20 0v16" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M16 30V11" stroke="currentColor" stroke-width="2"/>
          <path d="M16 18l-4-4M16 15l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="brand__word">Arden</span>
      </a>
      <nav class="nav__links" aria-label="Primary">
        ${PAGES.map(p => `<a href="${p.href}"${cur(p.key)}>${p.label}</a>`).join('')}
      </nav>
      <div class="nav__end">
        <a href="tel:+35315550142" class="nav__phone">01 555 0142</a>
        <a href="#register" class="btn btn--sm btn--light" data-nav-cta>Register interest</a>
        <button class="nav__burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu" data-burger><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="menu" id="menu" hidden data-menu>
    <nav aria-label="Mobile">
      <a href="index.html"${cur('home')}><span>00</span>Home</a>
      ${PAGES.map((p, i) => `<a href="${p.href}"${cur(p.key)}><span>0${i + 1}</span>${p.label}</a>`).join('')}
    </nav>
    <div class="menu__foot">
      <a href="#register" class="btn btn--dark btn--block">Register interest</a>
      <p>Sales suite · Ballyogan Road, Dublin 18<br><a href="tel:+35315550142">01 555 0142</a></p>
    </div>
  </div>`;

  const registerHTML = `
  <section class="register" id="register" aria-labelledby="reg-title">
    <div class="register__bg" aria-hidden="true"><img src="${img('1441974231531-c6227db76b6e', 2000)}" alt="" loading="lazy"></div>
    <div class="wrap register__grid">
      <div class="register__copy">
        <p class="eyebrow eyebrow--light">Register</p>
        <h2 id="reg-title" class="h2 h2--light">Be first through the door.</h2>
        <p>Registered buyers see Phase One pricing, full floor plans and show-home dates before public launch.</p>
        <ul class="register__perks"><li>Priority viewing slots</li><li>Launch-day pricing</li><li>No obligation, unsubscribe any time</li></ul>
        <address>Sales suite · Ballyogan Road, Dublin 18<br><a href="tel:+35315550142">01 555 0142</a> · <a href="mailto:hello@arden.example">hello@arden.example</a></address>
      </div>
      <form class="form" novalidate data-form>
        <div class="form__inner" data-form-fields>
          <div class="field-row">
            <div class="field"><label for="f-first">First name</label><input id="f-first" name="first" autocomplete="given-name" required><p class="field__err" id="e-first"></p></div>
            <div class="field"><label for="f-last">Last name</label><input id="f-last" name="last" autocomplete="family-name" required><p class="field__err" id="e-last"></p></div>
          </div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required><p class="field__err" id="e-email"></p></div>
          <div class="field"><label for="f-phone">Phone <span class="opt">optional</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
          <fieldset class="field"><legend>I'm interested in</legend>
            <div class="pick">
              <label><input type="checkbox" name="type" value="apartment"><span>Apartment</span></label>
              <label><input type="checkbox" name="type" value="duplex"><span>Duplex</span></label>
              <label><input type="checkbox" name="type" value="townhouse"><span>Townhouse</span></label>
            </div>
          </fieldset>
          <div class="field-row">
            <div class="field"><label for="f-home">Specific home <span class="opt">optional</span></label>
              <select id="f-home" name="home" data-home-select><option value="">No preference</option>
                ${HOMES.filter(h => h.left > 0).map(h => `<option value="${h.id}">${h.name} · ${h.label}</option>`).join('')}
              </select></div>
            <div class="field"><label for="f-buyer">Buyer type</label>
              <select id="f-buyer" name="buyer"><option>First-time buyer</option><option>Trading up / down</option><option>Other</option></select></div>
          </div>
          <label class="consent"><input type="checkbox" name="consent" required><span>I agree to Arden contacting me about this development. See the <a href="#privacy">privacy notice</a>.</span></label>
          <p class="field__err" id="e-consent"></p>
          <button class="btn btn--dark btn--block" type="submit">Register interest ${ARROW}</button>
        </div>
        <div class="form__done" hidden data-form-done tabindex="-1">
          <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><path d="M15 24l6 6 12-13"/></svg>
          <h3 class="h3">You're on the list, <span data-done-name></span>.</h3>
          <p>We'll send Phase One pricing and floor plans to <strong data-done-email></strong> ahead of launch.</p>
        </div>
      </form>
    </div>
  </section>`;

  const footerHTML = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <p class="footer__word" aria-hidden="true">Arden</p>
        <div class="footer__cols">
          <div><p class="eyebrow">Explore</p><a href="index.html">Home</a>${PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}</div>
          <div><p class="eyebrow">Visit</p><p>Sales suite<br>Ballyogan Road<br>Dublin 18</p><p>Thu–Sun, 11:00–17:00</p></div>
          <div><p class="eyebrow">Contact</p><a href="tel:+35315550142">01 555 0142</a><a href="mailto:hello@arden.example">hello@arden.example</a><a href="#top">Instagram</a></div>
        </div>
      </div>
      <div class="footer__base" id="privacy">
        <p>Arden is a fictional development created for a UX/UI case study. Images are illustrative and from Unsplash. Prices, availability and journey times are not real.</p>
        <p>© 2026 Arden</p>
      </div>
    </div>
  </footer>
  <div class="dock" data-dock aria-hidden="true">
    ${PAGE === 'homes' ? '<a href="#register" class="dock__homes">Book a viewing</a>' : '<a href="homes.html" class="dock__homes">View homes</a>'}
    <a href="#register" class="dock__cta"><span class="dock__meta">Phase One · From €385k</span><span>Register interest</span>${ARROW}</a>
  </div>
  <div class="drawer" hidden data-drawer>
    <div class="drawer__scrim" data-close></div>
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="d-title" tabindex="-1" data-drawer-panel>
      <button class="drawer__close" aria-label="Close" data-close><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg></button>
      <div data-drawer-body></div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', '<a class="skip" href="#main">Skip to content</a>' + navHTML);
  const regSlot = $('[data-slot="register"]');
  if (regSlot) regSlot.outerHTML = registerHTML;
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ================= nav behaviour ================= */
  const nav = $('[data-nav]');
  const top = $('.hero, .phero');
  const dock = $('[data-dock]');
  const register = $('#register');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    const threshold = top ? top.offsetHeight - 120 : 10;
    nav.classList.toggle('is-solid', y > Math.min(threshold, innerHeight * .8));
    nav.classList.toggle('is-hidden', y > lastY && y > innerHeight * .6 && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  let endVisible = false;
  const updateDock = () => {
    const show = scrollY > innerHeight * .7 && !endVisible;
    dock.classList.toggle('is-in', show);
    dock.setAttribute('aria-hidden', String(!show));
    $$('a', dock).forEach(a => a.tabIndex = show ? 0 : -1);
  };
  const endSeen = new Set();
  const endObs = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? endSeen.add(e.target) : endSeen.delete(e.target));
    endVisible = endSeen.size > 0; updateDock();
  }, { rootMargin: '0px 0px -15% 0px' });
  [register, $('.footer')].forEach(el => el && endObs.observe(el));
  addEventListener('scroll', updateDock, { passive: true });

  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  $$('nav a', menu).forEach((a, i) => a.style.setProperty('--i', i));
  const setMenu = open => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('lock', open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); }
    else { menu.classList.remove('is-open'); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 260); }
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ================= home cards + drawer ================= */
  const statusOf = h => h.left === 0 ? ['Phase Two', 'status--soon'] : h.left <= 3 ? [`${h.left} left`, 'status--low'] : [`${h.left} available`, ''];
  const cardHTML = (h, i) => {
    const [st, cls] = statusOf(h);
    return `<li class="home" style="--i:${i}">
      <button class="home__btn" data-open="${h.id}" aria-label="${h.name}, ${h.label}, from ${eur(h.price)}. View details">
        <div class="home__img"><img src="${img(h.img, 900)}" alt="" loading="lazy"><span class="status ${cls}">${st}</span></div>
        <div class="home__meta">
          <h3 class="home__name">${h.name}</h3>
          <p class="home__price"><small>From</small>${eur(h.price)}</p>
          <p class="home__type">${h.label}</p>
          <p class="home__specs"><span>${h.beds} bed</span><span>${h.baths} bath</span><span>${h.size} m²</span><span class="view">View ${ARROW}</span></p>
        </div>
      </button></li>`;
  };

  const PLANS = {
    1: [[0,0,190,150,'Living / Kitchen','28 m²'],[190,0,130,110,'Bedroom','12 m²'],[190,110,70,90,'Bath',''],[260,110,60,90,'Hall',''],[0,150,190,50,'Store','']],
    2: [[0,0,180,130,'Living / Kitchen','32 m²'],[180,0,140,100,'Bedroom 1','14 m²'],[180,100,70,50,'En-suite',''],[250,100,70,100,'Bedroom 2','10 m²'],[0,130,110,70,'Hall',''],[110,130,70,70,'Bath',''],[180,150,70,50,'Store','']],
    3: [[0,0,170,120,'Living','24 m²'],[170,0,150,80,'Kitchen / Dining','18 m²'],[170,80,80,70,'Bedroom 2','11 m²'],[250,80,70,70,'Bedroom 3','9 m²'],[0,120,120,80,'Bedroom 1','15 m²'],[120,120,50,80,'En-suite',''],[170,150,70,50,'Bath',''],[240,150,80,50,'Hall','']],
    4: [[0,0,160,110,'Living','26 m²'],[160,0,160,110,'Kitchen / Dining','24 m²'],[0,110,110,90,'Bedroom 1','16 m²'],[110,110,50,90,'En-suite',''],[160,110,80,90,'Bedroom 2','12 m²'],[240,110,80,45,'Bath',''],[240,155,80,45,'Utility','']],
  };
  const planSVG = h => {
    const rooms = PLANS[h.plan].map(([x,y,w,hh,l,s]) =>
      `<rect class="room" x="${x+10}" y="${y+10}" width="${w}" height="${hh}"/>
       <text x="${x+10+w/2}" y="${y+10+hh/2 - (s ? 4 : -3)}">${l}</text>${s ? `<text class="sz" x="${x+10+w/2}" y="${y+10+hh/2+10}">${s}</text>` : ''}`).join('');
    const outside = h.type === 'townhouse' ? 'Garden' : h.type === 'duplex' ? 'Terrace' : 'Balcony';
    return `<svg viewBox="0 0 340 250" role="img" aria-label="Indicative floor plan of ${h.name}"><rect class="ext" x="10" y="214" width="180" height="28"/><text x="100" y="232">${outside}</text>${rooms}</svg>`;
  };

  const drawer = $('[data-drawer]');
  const panel = $('[data-drawer-panel]');
  const dBody = $('[data-drawer-body]');
  let lastFocus = null;

  const openHome = id => {
    const h = HOMES.find(x => x.id === id); if (!h) return;
    const [st] = statusOf(h);
    dBody.innerHTML = `
      <div class="d-hero"><img src="${img(h.img, 1400)}" alt="${h.name}, indicative image"></div>
      <div class="d-body">
        <div class="d-top">
          <p class="eyebrow"><span class="idx">${TYPE_LABEL[h.type]}</span> · ${st}</p>
          <h2 id="d-title">${h.name}</h2>
          <p>${h.label} · ${h.aspect} facing · from <strong>${eur(h.price)}</strong></p>
        </div>
        <dl class="d-specs">
          <div><dt>Beds</dt><dd>${h.beds}</dd></div><div><dt>Baths</dt><dd>${h.baths}</dd></div>
          <div><dt>Size</dt><dd>${h.size} m²</dd></div><div><dt>BER</dt><dd>A1</dd></div>
        </dl>
        <figure class="d-plan">${planSVG(h)}<figcaption><span>Indicative layout</span><span>${h.size} m² · ${Math.round(h.size * 10.764)} ft²</span></figcaption></figure>
        <ul class="d-feat">${h.feats.map(f => `<li>${f}</li>`).join('')}</ul>
        <div class="d-cta">
          <a href="#register" class="btn btn--outline" data-enquire="${h.id}">Book a viewing</a>
          <a href="#register" class="btn btn--dark" data-enquire="${h.id}">Register interest</a>
        </div>
      </div>`;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('lock');
    panel.scrollTop = 0;
    requestAnimationFrame(() => { drawer.classList.add('is-open'); panel.focus(); });
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('lock');
    setTimeout(() => { drawer.hidden = true; }, reduce ? 0 : 480);
    lastFocus && lastFocus.focus({ preventScroll: true });
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openHome(b.dataset.open); });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) closeDrawer();
    const enq = e.target.closest('[data-enquire]');
    if (enq) {
      e.preventDefault(); prefill(enq.dataset.enquire); closeDrawer();
      setTimeout(() => { register.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => $('#f-first').focus({ preventScroll: true }), reduce ? 0 : 700); }, 60);
    }
  });
  addEventListener('keydown', e => {
    if (drawer.hidden) { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); return; }
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Tab') {
      const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', panel);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });

  /* ================= HOME: boomerang hero video =================
     Play the clip once while copying frames to offscreen canvases, then
     loop them forward → reverse on a display canvas. Frame count and size
     are capped so memory stays reasonable (~250 MB desktop, ~80 MB mobile). */
  const boom = $('[data-boomerang]');
  if (boom) {
    const video = $('video', boom);
    const canvas = $('canvas', boom);
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduce || saveData) { video.remove(); canvas.remove(); }
    else {
      const small = innerWidth < 768;
      const MAX_W = small ? 640 : 960, MAX_FRAMES = small ? 96 : 120, FPS = 24, STEP = 1 / FPS;
      const frames = [];
      let lastT = -1, capturing = true, fw = 0, fh = 0;

      const schedule = () => 'requestVideoFrameCallback' in video
        ? video.requestVideoFrameCallback(grab)
        : requestAnimationFrame(grab);

      function grab() {
        if (!capturing) return;
        const t = video.currentTime;
        if (t - lastT >= STEP - .005 && video.videoWidth) {
          if (!fw) { const k = Math.min(1, MAX_W / video.videoWidth); fw = Math.round(video.videoWidth * k); fh = Math.round(video.videoHeight * k); }
          const c = document.createElement('canvas');
          c.width = fw; c.height = fh;
          c.getContext('2d').drawImage(video, 0, 0, fw, fh);
          frames.push(c);
          lastT = t;
          if (frames.length >= MAX_FRAMES) return finish();
        }
        schedule();
      }

      function finish() {
        if (!capturing) return;
        capturing = false;
        video.pause();
        // Too few frames (e.g. tab was in the background) would stutter; keep the still instead
        if (frames.length < FPS * 2) { boom.classList.remove('is-video'); frames.length = 0; return; }
        canvas.width = fw; canvas.height = fh;
        const ctx = canvas.getContext('2d');
        // Start from the last captured frame, heading backwards, so the hand-off is seamless
        let i = frames.length - 1, dir = -1, last = 0, visible = true;
        ctx.drawImage(frames[i], 0, 0);
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(boom);
        const loop = now => {
          if (visible && !document.hidden && now - last >= 1000 / FPS) {
            last = now;
            i += dir;
            if (i >= frames.length - 1 || i <= 0) dir *= -1;
            ctx.drawImage(frames[i], 0, 0);
          }
          requestAnimationFrame(loop);
        };
        boom.classList.remove('is-video');
        boom.classList.add('is-looping');
        setTimeout(() => { video.style.display = 'none'; }, 900);
        requestAnimationFrame(loop);
      }

      video.addEventListener('playing', () => { boom.classList.add('is-video'); schedule(); }, { once: true });
      video.addEventListener('ended', finish);
      video.addEventListener('error', () => { capturing = false; });
      video.play().catch(() => { capturing = false; });
    }
  }

  /* ================= HOME: boomerang from a still image =================
     Same idea as the video version, for a single render: each frame is a
     step of a slow camera push + drift with a sunlight sweep across the sky.
     Frames advance at 30fps, forward to the last and back to the first, forever. */
  const still = $('[data-boomerang-image]');
  if (still && !reduce) {
    const pic = $('img', still);
    const canvas = $('canvas', still);
    const FPS = 30, FRAMES = FPS * 7;            // 7 s each way
    const start = () => {
      const cw = Math.min(1600, Math.max(1280, pic.naturalWidth));
      const ch = Math.round(cw * pic.naturalHeight / pic.naturalWidth);
      canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const draw = k => {
        const e = .5 - .5 * Math.cos(Math.PI * k / (FRAMES - 1));   // ease in-out
        const s = 1 + .07 * e;
        ctx.setTransform(s, 0, 0, s, (cw - cw * s) * .55 - cw * .012 * e, (ch - ch * s) * .25);
        ctx.drawImage(pic, 0, 0, cw, ch);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const gx = cw * (.18 + .5 * e), gy = ch * .16, r = cw * .42;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
        g.addColorStop(0, 'rgba(255,247,228,.30)');
        g.addColorStop(1, 'rgba(255,247,228,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
        ctx.globalCompositeOperation = 'source-over';
      };
      let i = 0, dir = 1, last = 0, visible = true;
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(still);
      draw(0);
      still.classList.add('is-looping');
      const loop = now => {
        if (visible && !document.hidden && now - last >= 1000 / FPS) {
          last = now;
          i += dir;
          if (i >= FRAMES - 1 || i <= 0) dir *= -1;
          draw(i);
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };
    pic.complete && pic.naturalWidth ? start() : pic.addEventListener('load', start, { once: true });
  }

  /* ================= HOME: idea scrub ================= */
  const scrub = $('[data-scrub]');
  if (scrub) {
    scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    const wEls = $$('.w', scrub);
    const idea = $('[data-idea]');
    const parallax = $$('[data-parallax]');
    const onIdea = () => {
      const r = idea.getBoundingClientRect();
      const total = idea.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total * .85)));
      const lit = Math.round(p * wEls.length);
      wEls.forEach((w, i) => w.classList.toggle('on', i < lit));
      const drift = innerWidth > 900;
      parallax.forEach(el => { el.style.transform = drift ? `translate3d(0, ${Math.max(0, -r.top) * parseFloat(el.dataset.parallax)}px, 0)` : ''; });
    };
    if (reduce) wEls.forEach(w => w.classList.add('on'));
    else { addEventListener('scroll', onIdea, { passive: true }); onIdea(); }
  }

  /* ================= HOME: featured homes ================= */
  const featured = $('[data-featured]');
  if (featured) featured.innerHTML = ['birch', 'willow', 'oak'].map((id, i) => cardHTML(HOMES.find(h => h.id === id), i)).join('');

  const teaserAmen = $('[data-amen-teaser]');
  if (teaserAmen) teaserAmen.innerHTML = AMEN.slice(0, 3).map((a, i) => `
    <li class="tease-amen__item reveal">
      <figure class="amen__img"><img src="${img(a.img, 900)}" alt="${a.t}" loading="lazy"></figure>
      <div class="amen__cap"><span class="amen__n">0${i + 1}</span><h3 class="amen__t">${a.t}</h3></div>
    </li>`).join('');

  /* ================= HOMES page: filters ================= */
  const grid = $('[data-homes]');
  if (grid) {
    const countLabel = $('[data-count-label]');
    const empty = $('[data-empty]');
    const params = new URLSearchParams(location.search);
    const state = { type: TYPE_LABEL[params.get('type')] ? params.get('type') : 'all', beds: 'any' };
    const render = () => {
      const list = HOMES.filter(h => (state.type === 'all' || h.type === state.type) && (state.beds === 'any' || h.beds === +state.beds));
      grid.innerHTML = list.map(cardHTML).join('');
      countLabel.textContent = `Showing ${list.length} ${list.length === 1 ? 'home' : 'homes'}`;
      empty.hidden = list.length > 0;
    };
    const setFilter = (key, value) => {
      state[key] = value;
      $$(`[data-filter="${key}"] button`).forEach(b => b.setAttribute('aria-checked', String(b.dataset.value === value)));
      if (key === 'type') {
        const u = new URL(location.href);
        value === 'all' ? u.searchParams.delete('type') : u.searchParams.set('type', value);
        history.replaceState(null, '', u);
      }
      render();
    };
    $$('[data-filter]').forEach(group => {
      const key = group.dataset.filter;
      group.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setFilter(key, b.dataset.value); });
      group.addEventListener('keydown', e => {
        if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
        const btns = $$('button', group); const i = btns.indexOf(document.activeElement);
        const next = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
        next.focus(); setFilter(key, next.dataset.value); e.preventDefault();
      });
    });
    $('[data-reset]').addEventListener('click', () => { setFilter('type', 'all'); setFilter('beds', 'any'); });
    setFilter('type', state.type);
  }

  /* ================= HOMES page: specification ================= */
  const specList = $('[data-spec]');
  if (specList) {
    const specMedia = $('[data-spec-media]');
    specMedia.innerHTML = SPEC.map((s, i) => `<img src="${img(s.img, 1100)}" alt="" loading="lazy" class="${i === 0 ? 'is-on' : ''}">`).join('');
    specList.innerHTML = SPEC.map((s, i) => `
      <li class="spec__item ${i === 0 ? 'is-open' : ''}">
        <button class="spec__row" aria-expanded="${i === 0}" aria-controls="spec-${i}" id="spec-b-${i}">
          <span class="spec__n">0${i + 1}</span><span class="spec__t">${s.t}</span>${ARROW}
        </button>
        <div class="spec__body" id="spec-${i}" role="region" aria-labelledby="spec-b-${i}"><div><p>${s.d}</p><ul>${s.tags.map(t => `<li>${t}</li>`).join('')}</ul></div></div>
      </li>`).join('');
    const items = $$('.spec__item', specList);
    const imgs = $$('img', specMedia);
    const open = i => {
      items.forEach((el, j) => { el.classList.toggle('is-open', i === j); $('button', el).setAttribute('aria-expanded', String(i === j)); });
      imgs.forEach((el, j) => el.classList.toggle('is-on', i === j));
    };
    items.forEach((el, i) => {
      $('button', el).addEventListener('click', () => open(i));
      if (matchMedia('(hover: hover)').matches) $('button', el).addEventListener('mouseenter', () => open(i));
    });
  }

  /* ================= LOCATION page: map ================= */
  const tabsEl = $('[data-loc-tabs]');
  if (tabsEl) {
    const placesEl = $('[data-places]');
    const pinsEl = $('[data-pins]');
    const cats = Object.keys(PLACES);
    tabsEl.innerHTML = cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-cat="${c}">${c}</button>`).join('');
    const highlight = i => {
      $$('.pin', pinsEl).forEach((p, j) => p.classList.toggle('is-on', i === j));
      $$('.place', placesEl).forEach((p, j) => p.classList.toggle('is-on', i === j));
    };
    const showCat = c => {
      $$('button', tabsEl).forEach(b => { const on = b.dataset.cat === c; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
      const list = PLACES[c];
      placesEl.innerHTML = list.map((p, i) => `
        <li class="place" style="--i:${i}" data-i="${i}" tabindex="0">
          <span class="place__n">${i + 1}</span>
          <div><p class="place__name">${p.n}</p><p class="place__sub">${p.s}</p></div>
          <p class="place__time">${p.t}<small>min ${p.m}</small></p>
        </li>`).join('');
      pinsEl.innerHTML = list.map((p, i) => `
        <g class="pin" data-i="${i}" transform="translate(${p.x} ${p.y})">
          <line x1="0" y1="0" x2="${300 - p.x}" y2="${250 - p.y}"/><circle r="11"/><text>${i + 1}</text>
        </g>`).join('');
    };
    tabsEl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) showCat(b.dataset.cat); });
    tabsEl.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const btns = $$('button', tabsEl); const i = btns.indexOf(document.activeElement);
      const n = btns[(i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length];
      n.focus(); showCat(n.dataset.cat);
    });
    const hover = e => { const t = e.target.closest('[data-i]'); highlight(t ? +t.dataset.i : -1); };
    placesEl.addEventListener('mouseover', hover);
    placesEl.addEventListener('focusin', hover);
    placesEl.addEventListener('mouseleave', () => highlight(-1));
    pinsEl.addEventListener('mouseover', hover);
    pinsEl.addEventListener('click', hover);
    showCat(cats[0]);
  }

  /* ================= LIVING page: amenities ================= */
  const amen = $('[data-amen]');
  if (amen) amen.innerHTML = AMEN.map((a, i) => `
    <li class="amen__item reveal">
      <figure class="amen__img"><img src="${img(a.img, i === 0 || i === 5 ? 1400 : 900)}" alt="${a.t}" loading="lazy"></figure>
      <div class="amen__cap"><span class="amen__n">0${i + 1}</span><h3 class="amen__t">${a.t}</h3><p class="amen__d">${a.d}</p></div>
    </li>`).join('');

  /* ================= form ================= */
  const form = $('[data-form]');
  function prefill(id) {
    const h = HOMES.find(x => x.id === id); if (!h || !form) return;
    form.elements.home.value = h.left > 0 ? h.id : '';
    $$('input[name="type"]', form).forEach(c => { if (c.value === h.type) c.checked = true; });
  }
  if (form) {
    const err = (name, msg) => {
      const input = form.elements[name];
      $('#e-' + name).textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      msg ? input.setAttribute('aria-describedby', 'e-' + name) : input.removeAttribute('aria-describedby');
      return !msg;
    };
    const validators = {
      first: v => v.trim() ? '' : 'Please add your first name.',
      last: v => v.trim() ? '' : 'Please add your last name.',
      email: v => !v.trim() ? 'We need an email to send pricing.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email doesn\'t look quite right.',
    };
    Object.keys(validators).forEach(n => {
      form.elements[n].addEventListener('blur', e => { if (e.target.value) err(n, validators[n](e.target.value)); });
      form.elements[n].addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') err(n, validators[n](e.target.value)); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(validators).forEach(n => { if (!err(n, validators[n](form.elements[n].value)) && !firstBad) firstBad = form.elements[n]; });
      if (!err('consent', form.elements.consent.checked ? '' : 'Please confirm we can contact you.') && !firstBad) firstBad = form.elements.consent;
      if (firstBad) { firstBad.focus(); return; }
      $('[data-done-name]').textContent = form.elements.first.value.trim();
      $('[data-done-email]').textContent = form.elements.email.value.trim();
      $('[data-form-fields]').hidden = true;
      const done = $('[data-form-done]'); done.hidden = false; done.focus();
    });
  }

  /* ================= cursor trail =================
     Ten thin spring-linked lines chase the pointer and settle when it stops,
     like tendrils in a breeze. Mouse/trackpad only; skipped for reduced motion. */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cv = document.createElement('canvas');
    cv.className = 'trail';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    addEventListener('resize', size);

    const TRAILS = 10, NODES = 12, FRICTION = .5, DAMPING = .1, TENSION = .98;
    const DARK = '.spec, .tease-loc, .register, .hero--dark, .phero';
    const p = { x: 0, y: 0 };
    let lines = null, running = false, inside = false, dark = false, alpha = 0, still = 0;

    const makeLines = () => Array.from({ length: TRAILS }, (_, i) => ({
      spring: .42 + i / TRAILS * .025 + Math.random() * .08 - .02,
      friction: FRICTION + Math.random() * .01 - .002,
      nodes: Array.from({ length: NODES }, () => ({ x: p.x, y: p.y, vx: 0, vy: 0 })),
    }));

    const step = () => {
      let energy = 0;
      for (const l of lines) {
        const n = l.nodes;
        let k = l.spring;
        n[0].vx += (p.x - n[0].x) * k;
        n[0].vy += (p.y - n[0].y) * k;
        for (let i = 0; i < n.length; i++) {
          const a = n[i];
          if (i) {
            const b = n[i - 1];
            a.vx += (b.x - a.x) * k + b.vx * DAMPING;
            a.vy += (b.y - a.y) * k + b.vy * DAMPING;
          }
          a.vx *= l.friction; a.vy *= l.friction;
          a.x += a.vx; a.y += a.vy;
          energy += Math.abs(a.vx) + Math.abs(a.vy);
          k *= TENSION;
        }
      }
      return energy;
    };

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = dark ? `rgba(214, 224, 196, ${.34 * alpha})` : `rgba(74, 90, 63, ${.3 * alpha})`;
      for (const { nodes: n } of lines) {
        ctx.beginPath();
        ctx.moveTo(n[0].x, n[0].y);
        let i = 1;
        for (; i < n.length - 2; i++) ctx.quadraticCurveTo(n[i].x, n[i].y, (n[i].x + n[i + 1].x) / 2, (n[i].y + n[i + 1].y) / 2);
        ctx.quadraticCurveTo(n[i].x, n[i].y, n[i + 1].x, n[i + 1].y);
        ctx.stroke();
      }
    };

    const frame = () => {
      const energy = step();
      alpha += ((inside ? 1 : 0) - alpha) * .1;
      draw();
      still = energy < .05 ? still + 1 : 0;
      // Settled on the pointer (or faded out): stop until the next move
      if (still > 45 || (!inside && alpha < .01)) {
        running = false;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        return;
      }
      requestAnimationFrame(frame);
    };
    const wake = () => { if (!running) { running = true; still = 0; requestAnimationFrame(frame); } };

    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX; p.y = e.clientY;
      if (!lines) lines = makeLines();
      inside = true;
      dark = !!(e.target.closest && e.target.closest(DARK));
      wake();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { inside = false; wake(); });
  }

  /* ================= reveal + counters ================= */
  const count = el => {
    const to = +el.dataset.count; if (reduce || to < 5) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1400;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); };
    el.textContent = 0; requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    $$('[data-count]', e.target).forEach(count);
    $$('.bar', e.target).forEach(b => b.classList.add('is-in'));
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.setProperty('--rd', `${(i % 4) * 70}ms`); io.observe(el); });
})();
