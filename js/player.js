/*
  Desi Aakhada — optimized YouTube playlist player
  Playlist: https://youtube.com/playlist?list=PLICrDe62QZYc
*/
(() => {
  let player = null;
  let ready = false;
  let playlistReady = false;
  let seeking = false;
  let wantPlay = false;
  let lastErrSkip = 0;
  let loadAt = 0;
  let warmTimer = null;

  const $ = (id) => document.getElementById(id);
  const loaderEl = $("loader");
  const vinyl = $("vinyl");
  const playBtn = $("btn-play");
  const prevBtn = $("btn-prev");
  const nextBtn = $("btn-next");
  const coverArt = $("cover-art");
  const titleEl = $("track-title");
  const artistEl = $("track-artist");
  const fillEl = $("progress-fill");
  const thumbEl = $("progress-thumb");
  const curEl = $("time-current");
  const totEl = $("time-total");
  const barEl = $("progress-bar");
  const onlineEl = $("online-count");
  const iPlay = document.querySelector(".icon-play");
  const iPause = document.querySelector(".icon-pause");

  function dismissLoader() {
    if (loaderEl) loaderEl.classList.add("is-gone");
  }

  /* Never block UI more than 2.5s */
  setTimeout(dismissLoader, 2500);

  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  function setPlaying(on) {
    vinyl.classList.toggle("is-playing", on);
    iPlay.classList.toggle("hidden", on);
    iPause.classList.toggle("hidden", !on);
    playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
    try { window.BenchVideo?.setActive(on); } catch (_) {}
  }

  function syncMeta() {
    if (!player || !ready) return false;
    try {
      const d = player.getVideoData();
      if (d && d.title) {
        titleEl.textContent = d.title;
        artistEl.textContent = d.author || "GYM Playlist";
        if (d.video_id) {
          coverArt.src = `https://i.ytimg.com/vi/${d.video_id}/hqdefault.jpg`;
        }
        return true;
      }
    } catch (_) {}
    return false;
  }

  function hasPlaylistTrack() {
    if (!player || !ready) return false;
    try {
      const idx = player.getPlaylistIndex?.();
      if (typeof idx === "number" && idx >= 0) return true;
      const d = player.getVideoData?.();
      return !!(d && d.video_id);
    } catch (_) {
      return false;
    }
  }

  function tryPlay() {
    if (!player || !ready) return;
    try {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) return;
      player.playVideo();
    } catch (_) {}
  }

  function markReady() {
    if (!playlistReady) {
      playlistReady = true;
      playBtn.disabled = false;
      dismissLoader();
      if (titleEl.textContent === "GYM Playlist Loading…") {
        titleEl.textContent = "Ready — Press ▶";
        artistEl.textContent = "GYM Playlist";
      }
    }
    syncMeta();
    if (wantPlay) tryPlay();
  }

  function warmPlaylist() {
    if (!player || !ready) return;
    if (syncMeta() || hasPlaylistTrack()) {
      markReady();
      return;
    }
    warmTimer = setTimeout(warmPlaylist, 120);
  }

  function startPlayback() {
    if (!player || !ready) return;

    try {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        wantPlay = false;
        player.pauseVideo();
        return;
      }
    } catch (_) {}

    wantPlay = true;
    tryPlay();
  }

  setInterval(() => {
    if (!ready || seeking || !player) return;
    try {
      const dur = player.getDuration();
      const cur = player.getCurrentTime();
      if (dur > 0) {
        const p = Math.min((cur / dur) * 100, 100);
        fillEl.style.width = `${p}%`;
        thumbEl.style.left = `${p}%`;
        curEl.textContent = fmt(cur);
        totEl.textContent = fmt(dur);
      }
    } catch (_) {}
  }, 400);

  function onPlayerReady(event) {
    ready = true;
    loadAt = Date.now();
    const p = event.target;

    try { p.setLoop(true); } catch (_) {}
    try { p.setVolume(100); } catch (_) {}

    /* Playlist already loading via playerVars — do NOT reload */
    playBtn.disabled = false;
    dismissLoader();
    warmPlaylist();
  }

  function onPlayerStateChange(ev) {
    switch (ev.data) {
      case YT.PlayerState.PLAYING:
        wantPlay = false;
        setPlaying(true);
        markReady();
        syncMeta();
        break;

      case YT.PlayerState.PAUSED:
        setPlaying(false);
        syncMeta();
        break;

      case YT.PlayerState.ENDED:
        try { player.nextVideo(); } catch (_) {}
        break;

      case YT.PlayerState.CUED:
      case YT.PlayerState.BUFFERING:
        markReady();
        syncMeta();
        if (wantPlay) tryPlay();
        break;

      default:
        break;
    }
  }

  function onPlayerError() {
    if (Date.now() - loadAt < 1500) return;
    const now = Date.now();
    if (now - lastErrSkip < 2000) return;
    lastErrSkip = now;
    setTimeout(() => {
      try { player.nextVideo(); } catch (_) {}
    }, 400);
  }

  function createPlayer() {
    if (player) return;

    player = new YT.Player("yt-player", {
      host: "https://www.youtube-nocookie.com",
      height: "200",
      width: "200",
      playerVars: {
        listType: "playlist",
        list: PLAYLIST_ID,
        index: 0,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  }

  window.onYouTubeIframeAPIReady = createPlayer;
  if (window.YT && window.YT.Player) createPlayer();

  playBtn.addEventListener("click", startPlayback);

  nextBtn.addEventListener("click", () => {
    if (!player || !ready) return;
    wantPlay = true;
    try { player.nextVideo(); } catch (_) {}
  });

  prevBtn.addEventListener("click", () => {
    if (!player || !ready) return;
    wantPlay = true;
    try {
      if (player.getCurrentTime() > 3) {
        player.seekTo(0, true);
      } else {
        player.previousVideo();
      }
    } catch (_) {}
  });

  barEl.addEventListener("click", doSeek);
  barEl.addEventListener("mousedown", (e) => { seeking = true; doSeek(e); });
  window.addEventListener("mouseup", () => { seeking = false; });

  function doSeek(e) {
    if (!player || !ready) return;
    const r = barEl.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    try {
      const dur = player.getDuration();
      if (dur > 0) player.seekTo(dur * ratio, true);
    } catch (_) {}
  }

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === " ") { e.preventDefault(); startPlayback(); }
    else if (e.key === "ArrowRight") nextBtn.click();
    else if (e.key === "ArrowLeft") prevBtn.click();
  });

  onlineEl.textContent = String(28 + Math.floor(Math.random() * 35));
  setInterval(() => {
    const n = parseInt(onlineEl.textContent, 10);
    onlineEl.textContent = String(Math.min(Math.max(n + (Math.random() > 0.5 ? 1 : -1), 14), 120));
  }, 8000);
})();
