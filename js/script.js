/* ==========================================================================
   Cabinet M Conseil — script principal
   ========================================================================== */
(function(){
  "use strict";

  /* ---- Coordonnées du cabinet (source unique) ---- */
  window.CABINET = {
    whatsapp1: "2290169588181",   // +229 01 69 58 81 81
    whatsapp1Display: "+229 01 69 58 81 81",
    phone2: "+2290195380006",     // 0195380006
    phone2Display: "01 95 38 00 06",
    linkedin: "https://www.linkedin.com/company/cabinet-m-conseils/?viewAsMember=true",
    facebook: "https://web.facebook.com/profile.php?id=100063520689732"
  };

  function waLink(message){
    var base = "https://wa.me/" + window.CABINET.whatsapp1;
    if(message){ base += "?text=" + encodeURIComponent(message); }
    return base;
  }
  window.waLink = waLink;

  document.addEventListener("DOMContentLoaded", function(){

    /* ---- Header: opacité au scroll ---- */
    var header = document.querySelector(".site-header");
    function onScroll(){
      if(!header) return;
      if(window.scrollY > 40){ header.classList.add("is-scrolled"); }
      else{ header.classList.remove("is-scrolled"); }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });

    /* ---- Menu mobile ---- */
    var burger = document.querySelector(".burger");
    var mobilePanel = document.querySelector(".mobile-panel");
    if(burger && mobilePanel){
      burger.addEventListener("click", function(){
        var open = burger.classList.toggle("is-open");
        mobilePanel.classList.toggle("is-open", open);
        document.body.style.overflow = open ? "hidden" : "";
      });
      mobilePanel.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){
          burger.classList.remove("is-open");
          mobilePanel.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }

    /* ---- Reveal au scroll ---- */
    var revealEls = document.querySelectorAll(".reveal");
    if("IntersectionObserver" in window && revealEls.length){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function(el, i){
        el.style.setProperty("--i", i % 6);
        io.observe(el);
      });
    } else {
      revealEls.forEach(function(el){ el.classList.add("is-visible"); });
    }

    /* ---- Compteurs animés (stats) ---- */
    var counters = document.querySelectorAll("[data-count]");
    if("IntersectionObserver" in window && counters.length){
      var counted = new WeakSet();
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting && !counted.has(entry.target)){
            counted.add(entry.target);
            animateCount(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function(el){ cio.observe(el); });
    }
    function animateCount(el){
      var target = el.getAttribute("data-count");
      var match = target.match(/^(\d+)(.*)$/);
      if(!match){ return; }
      var end = parseInt(match[1], 10);
      var suffix = match[2] || "";
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(start + (end - start) * eased);
        el.textContent = value + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }

    /* ---- Liens WhatsApp génériques (data-wa-msg) ---- */
    document.querySelectorAll("[data-wa-msg]").forEach(function(el){
      el.setAttribute("href", waLink(el.getAttribute("data-wa-msg")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-wa]").forEach(function(el){
      el.setAttribute("href", waLink());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
    document.querySelectorAll("[data-phone2]").forEach(function(el){
      el.setAttribute("href", "tel:" + window.CABINET.phone2);
    });
    document.querySelectorAll("[data-linkedin]").forEach(function(el){
      el.setAttribute("href", window.CABINET.linkedin);
      el.setAttribute("target","_blank"); el.setAttribute("rel","noopener");
    });
    document.querySelectorAll("[data-facebook]").forEach(function(el){
      el.setAttribute("href", window.CABINET.facebook);
      el.setAttribute("target","_blank"); el.setAttribute("rel","noopener");
    });

    /* ---- Sélecteur de service (page services.html) ---- */
    var tabs = document.querySelectorAll(".service-tab");
    if(tabs.length){
      tabs.forEach(function(tab){
        tab.addEventListener("click", function(){
          var id = tab.getAttribute("data-target");
          tabs.forEach(function(t){ t.classList.remove("is-active"); });
          tab.classList.add("is-active");

          document.querySelectorAll(".service-detail-body").forEach(function(panel){
            panel.classList.toggle("is-active", panel.getAttribute("data-panel") === id);
          });
          document.querySelectorAll(".service-detail-media img").forEach(function(img){
            img.classList.toggle("is-active", img.getAttribute("data-panel-img") === id);
          });

          var waBtn = document.querySelector(".service-detail [data-wa-msg-target]");
          if(waBtn){
            var msg = tab.getAttribute("data-wa-msg") || "";
            waBtn.setAttribute("href", waLink(msg));
            waBtn.setAttribute("target", "_blank");
            waBtn.setAttribute("rel", "noopener");
          }
        });
      });
    }

  });
})();
