/* Masthead shared by every prototype page, so each option is seen in situ
   rather than as a floating fragment. */
function mountShell(activeNav, { nav: showNav = true } = {}) {
  const nav = ['Home','Department','Associated Organisations','Offerings','Documents','Events & Gallery','Connect'];
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="gov-strip"><div class="wrap">
      <span>भारत सरकार &nbsp;|&nbsp; Government of India</span>
      <span>Skip to Main Content &nbsp;·&nbsp; A− A A+ &nbsp;·&nbsp; English</span>
    </div></div>
    <header class="masthead"><div class="wrap">
      <img class="emblem" src="emblem.png" alt="National Emblem of India">
      <div class="mast-txt">
        <span class="beta">BETA</span>
        Government of India · Ministry of Social Justice &amp; Empowerment
        <b>Department of Social Justice &amp; Empowerment</b>
      </div>
    </div></header>
    ${showNav ? `<nav class="nav"><div class="wrap">
      ${nav.map(n => `<a href="#" class="${n===activeNav?'on':''}">${n}</a>`).join('')}
    </div></nav>` : ''}
  `);
}

/* Pointer-down feedback on every control, so a press registers before release. */
document.addEventListener('pointerdown', e => {
  const t = e.target.closest('.btn,.chip,.opt-card,.persona-tile');
  if (t) { t.style.transform = 'scale(.975)'; }
}, true);
document.addEventListener('pointerup', () => {
  document.querySelectorAll('[style*="scale"]').forEach(el => el.style.transform = '');
}, true);
