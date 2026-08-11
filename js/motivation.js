const MOTIVATION_LINES = [
  "Dard hoga, dum nahi tootega.",
  "Aaj ka pasina, kal ki pehchaan.",
  "Jo aaine mein dikhna hai, wo gym mein banta hai.",
  "Thakan aayegi, ruknay ka bahana nahi banegi.",
  "Body banti hai gym mein, mindset banta hai dard mein.",
  "Comfort zone chhodo, warna kabhi kuch nahi hoga.",
  "Excuses fit nahi karte, sirf effort karta hai.",
  "Weight utha, apni limit tod.",
  "Har set ke baad ek naya version banta hai tera.",
  "Jo aaj bhaagega, wo kal udega.",
  "Junoon wahi jo raat ko bhi gym khinch le jaaye.",
  "Sapna bada, mehnat usse bhi badi.",
  "Log baatein karenge, tu results dikha.",
  "Apne aap se competition kar, baaki sab peeche reh jaayenge.",
  "Aag lagao andar, baahar khud dikhega.",
  "Jo tut'ta nahi, wahi banta hai.",
  "Mehnat itni kar ki kismat bhi salute kare.",
  "Naam nahi, kaam bolna chahiye.",
  "Jo dar gaya, wo gym chhod gaya.",
  "Har din ek jung hai, khud se hi jeetni hai.",
  "Body temporary hai, discipline permanent.",
  "Gym mein banta hai body, zindagi mein banta hai character.",
  "Weak mind body nahi banata, strong mind sab kuch banata hai.",
  "Muscle nahi, mindset pehle bana.",
  "Jo khud se pyaar karta hai, wo khud pe mehnat karta hai.",
  "Physique dikhta hai, discipline nahi dikhta — par wahi asli hero hai.",
  "Sharir se pehle iraade mazboot kar.",
  "Fit rehna style nahi, zaroorat hai.",
  "Jism thak sakta hai, iraada nahi.",
  "Andar ki fight jeet, bahar ki khud jeet jaayegi.",
  "Ek din ka josh nahi, roz ka commitment chahiye.",
  "Chhoti shuruaat, bada result.",
  "Rukna mana hai, thakna allowed hai.",
  "Consistency hi asli talent hai.",
  "Aaj chhod diya toh kal fir se shuru karna padega.",
  "Slow chal, par ruk mat.",
  "Har din thoda better, saal ke baad bahut better.",
  "Routine bana, excuses nahi.",
  "Jo roz aata hai gym, wahi kabhi haarta nahi.",
  "Naam bada karna hai toh roz mehnat chhoti nahi honi chahiye.",
  "Bhai, dard hoga toh hi kuch banega.",
  "Weight uthale, tension nahi.",
  "Gym bhi ek mandir hai, mehnat wahan ki puja hai.",
  "Chhati chauda kar, seena tan ke jee.",
  "Jo apne aap ko haraya, usne duniya jeet li.",
  "Sweat is your prayer, discipline is your dharma.",
  "Aaj ka struggle kal ki flex hai.",
  "Thak gaya toh baith mat, aaram kar aur fir utha.",
  "Naa rukna hai, naa jhukna hai — bas badhte jaana hai.",
  "Ek din sab dekhenge — bas tu chal.",
  "No pain, no desi gain.",
  "Roz ka rep, kal ka champion.",
  "Body goals nahi, mindset goals bana pehle.",
];

(() => {
  const quoteEl = document.getElementById("motivation-text");
  const btn = document.getElementById("motivation-refresh");
  if (!quoteEl || !btn) return;

  let lastIndex = -1;

  function pickQuote() {
    if (MOTIVATION_LINES.length < 2) return 0;
    let idx;
    do {
      idx = Math.floor(Math.random() * MOTIVATION_LINES.length);
    } while (idx === lastIndex);
    lastIndex = idx;
    return idx;
  }

  function showQuote(animate) {
    const idx = pickQuote();
    const line = MOTIVATION_LINES[idx];

    if (!animate) {
      quoteEl.textContent = line;
      return;
    }

    quoteEl.classList.add("is-changing");
    setTimeout(() => {
      quoteEl.textContent = line;
      quoteEl.classList.remove("is-changing");
    }, 180);
  }

  btn.addEventListener("click", () => showQuote(true));
  showQuote(false);
})();
