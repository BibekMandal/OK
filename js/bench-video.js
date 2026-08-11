(() => {
  const video = document.querySelector(".hero-scene__video");
  const canvas = document.querySelector("#bench-canvas");
  if (!video || !canvas) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let repRate = 1;
  let raf = 0;

  function ensurePlay() {
    if (reducedMotion) {
      video.pause();
      return;
    }
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function sizeCanvas() {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 360;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  /** Remove light grey / white Lottie export background */
  function keyLightBg(data) {
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      if (lum > 215 && sat < 35) {
        px[i + 3] = 0;
      } else if (lum > 185 && sat < 50) {
        px[i + 3] = Math.round(px[i + 3] * Math.max(0, (215 - lum) / 30));
      }
    }
  }

  function draw() {
    if (reducedMotion) return;
    if (video.readyState >= 2) {
      sizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      keyLightBg(frame);
      ctx.putImageData(frame, 0, 0);
    }
    raf = requestAnimationFrame(draw);
  }

  video.addEventListener("loadeddata", () => {
    ensurePlay();
    sizeCanvas();
  });

  if (video.readyState >= 2) {
    ensurePlay();
    sizeCanvas();
  }

  if (!reducedMotion) {
    draw();
  }

  window.BenchVideo = {
    setActive(on) {
      repRate = on ? 1.12 : 1;
      video.playbackRate = repRate;
      ensurePlay();
      canvas.closest(".hero-scene__stage")?.classList.toggle("is-lifting", on);
    },
  };
})();
