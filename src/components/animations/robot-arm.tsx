"use client";
import React from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
.right{position:relative;overflow:hidden;width:100%;height:100%;min-height:500px;}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%)}
.r1{width:500px;height:500px;border-color:rgba(59,130,246,.07);animation:cw 28s linear infinite}
.r2{width:580px;height:580px;border-color:rgba(255,255,255,.03);animation:ccw 38s linear infinite}
.r3{width:420px;height:420px;border-color:rgba(59,130,246,.04);animation:cw 18s linear infinite}
@keyframes cw{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes ccw{to{transform:translate(-50%,-50%) rotate(-360deg)}}
@media (max-width: 1024px) {
  .right { height: 400px; }
  .hud-panel { right: 5%; top: 5%; }
}
.hud-panel{position:absolute;top:14%;right:2%;background:rgba(9,15,29,.9);border:1px solid #1a2540;border-radius:8px;padding:10px 14px;pointer-events:none;z-index:10}
.hud-row{display:flex;justify-content:space-between;gap:24px;margin-bottom:4px}
.hud-label{font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:#334155}
.hud-val{font-size:8px;font-family:monospace;color:#60a5fa;animation:dataFlicker 2s step-end infinite}
@keyframes dataFlicker{0%{opacity:1}10%{opacity:.6}11%{opacity:1}50%{opacity:1}51%{opacity:.7}52%{opacity:1}100%{opacity:1}}
.hud-bar{height:3px;background:#0f1e30;border-radius:2px;margin-bottom:8px;overflow:hidden}
.hud-fill{height:100%;background:#3b82f6;border-radius:2px;animation:barPulse 3s ease-in-out infinite}
@keyframes barPulse{0%,100%{width:72%}50%{width:91%}}
.badge{position:absolute;font-size:9px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;padding:6px 14px;border-radius:999px;pointer-events:none;z-index:10}
.b-top{top:10%;left:8%;background:#061a0e;border:1px solid #14532d;color:#4ade80;display:flex;align-items:center;gap:6px}
.b-mid{bottom:30%;right:2%;background:#0a1628;border:1px solid #1e3a6e;color:#93c5fd}
.glow-blob{position:absolute;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.2) 0%,transparent 70%);top:30%;left:30%;transform:translate(-50%,-50%);filter:blur(50px);pointer-events:none;animation:blobPulse 4s ease-in-out infinite}
@keyframes blobPulse{0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}
.particle{position:absolute;width:3px;height:3px;border-radius:50%;background:#60a5fa;pointer-events:none;opacity:0;animation:spark 3s ease-out infinite}
@keyframes spark{0%{opacity:0;transform:translate(0,0) scale(1)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0)}}
.float-item{position:absolute;pointer-events:none;animation:floatAround 6s ease-in-out infinite}
.fi1{top:15%;left:12%;animation-delay:0s}
.fi2{top:65%;left:6%;animation-delay:2s}
.fi3{top:50%;right:8%;animation-delay:1s;animation-duration:8s}
@keyframes floatAround{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-16px) rotate(10deg)}}
.arm-sway{animation:armSway 10s ease-in-out infinite;transform-origin:250px 490px}
@keyframes armSway{0%,100%{transform:rotate(0deg)}25%{transform:rotate(4deg)}75%{transform:rotate(-3deg)}}
.seg1-move{animation:seg1 10s ease-in-out infinite;transform-origin:250px 410px}
@keyframes seg1{0%,100%{transform:rotate(-55deg)}30%{transform:rotate(-40deg)}70%{transform:rotate(-65deg)}}
.seg2-move{animation:seg2 10s ease-in-out infinite;transform-origin:0px 0px}
@keyframes seg2{0%,100%{transform:rotate(80deg)}30%{transform:rotate(65deg)}70%{transform:rotate(95deg)}}
.wrist-move{animation:wrist 10s ease-in-out infinite;transform-origin:0px 0px}
@keyframes wrist{0%,100%{transform:rotate(-10deg)}30%{transform:rotate(20deg)}70%{transform:rotate(-25deg)}}
.finger-l{animation:fL 10s ease-in-out infinite;transform-origin:-22px -28px}
@keyframes fL{0%,100%{transform:rotate(-8deg)}30%{transform:rotate(-28deg)}70%{transform:rotate(-5deg)}}
.finger-r{animation:fR 10s ease-in-out infinite;transform-origin:22px -28px}
@keyframes fR{0%,100%{transform:rotate(8deg)}30%{transform:rotate(28deg)}70%{transform:rotate(5deg)}}
.item-held{animation:itemFloat 2.5s ease-in-out infinite,itemSwap 10s step-end infinite;transform-origin:0px -62px}
@keyframes itemFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes itemSwap{0%,30%{opacity:1}31%,59%{opacity:0}60%,100%{opacity:1}}
.item-held2{animation:itemFloat 2.5s ease-in-out infinite,itemSwap2 10s step-end infinite;transform-origin:0px -62px}
@keyframes itemSwap2{0%,30%{opacity:0}31%,59%{opacity:1}60%,100%{opacity:0}}
.orbit1{animation:orbit 3s linear infinite;transform-origin:0px -62px}
.orbit2{animation:orbit 5s linear infinite reverse;transform-origin:0px -62px}
@keyframes orbit{to{transform:rotate(360deg)}}
.energy-line{stroke-dasharray:8 6;animation:energyFlow 1.5s linear infinite}
@keyframes energyFlow{to{stroke-dashoffset:-40}}
.joint-ring{animation:jointPulse 2s ease-in-out infinite}
@keyframes jointPulse{0%,100%{opacity:.3}50%{opacity:0}}
.conv-item{animation:convMove 8s linear infinite}
.conv-item2{animation:convMove 8s linear infinite;animation-delay:-2.7s}
.conv-item3{animation:convMove 8s linear infinite;animation-delay:-5.3s}
@keyframes convMove{from{transform:translateX(0)}to{transform:translateX(-320px)}}
`;

export default function RobotArmHero({ status = "idle", project }: any) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="stage relative w-full h-full flex items-center justify-center">
        <div className="right w-full max-w-[500px]">
          <div className="glow-blob" />
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
          <div className="hud-panel">
            <div className="hud-row"><span className="hud-label">AXIS_Y</span><span className="hud-val">242.4°</span></div>
            <div className="hud-bar"><div className="hud-fill" /></div>
            <div className="hud-row"><span className="hud-label">TORQUE</span><span className="hud-val" style={{ animationDelay: ".8s" }}>88 Nm</span></div>
            <div className="hud-bar"><div className="hud-fill" style={{ animationDelay: "1s" }} /></div>
            <div className="hud-row"><span className="hud-label">CYCLE</span><span className="hud-val" style={{ animationDelay: ".1s" }}>0482</span></div>
            <div className="hud-row"><span className="hud-label">STATUS</span><span className="hud-val" style={{ color: "#4ade80", animationDelay: ".5s" }}>ACTIVE</span></div>
          </div>
          <div className="badge b-top"><span className="dot-live" style={{ width: 5, height: 5 }} />Precise Control</div>
          <div className="badge b-mid">Dynamic Torque</div>
          <div className="float-item fi1"><svg width="44" height="44" viewBox="0 0 44 44"><rect x="4" y="4" width="36" height="36" rx="8" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" /><rect x="13" y="13" width="18" height="18" rx="4" fill="#2563eb" opacity=".7" /><circle cx="22" cy="22" r="5" fill="#93c5fd" /></svg></div>
          <div className="float-item fi2"><svg width="36" height="36" viewBox="0 0 36 36"><polygon points="18,3 33,12 33,24 18,33 3,24 3,12" fill="#0f2d1a" stroke="#22c55e" strokeWidth="1.5" /><circle cx="18" cy="18" r="7" fill="#16a34a" opacity=".6" /></svg></div>
          <div className="float-item fi3"><svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#1a0d2e" stroke="#a855f7" strokeWidth="1.5" /><circle cx="16" cy="16" r="6" fill="#7c3aed" opacity=".7" /><circle cx="16" cy="16" r="2" fill="#c4b5fd" /></svg></div>
          {[["top:38%;left:55%", "--dx:-20px", "--dy:-30px", "0s", "#60a5fa"], ["top:38%;left:55%", "--dx:18px", "--dy:-25px", ".4s", "#60a5fa"], ["top:38%;left:55%", "--dx:-10px", "--dy:-38px", ".8s", "#22c55e"], ["top:38%;left:55%", "--dx:25px", "--dy:-18px", "1.2s", "#60a5fa"], ["top:38%;left:55%", "--dx:-30px", "--dy:-12px", "1.6s", "#a78bfa"]].map(([pos, dx, dy, delay, bg], i) => (
            <div key={i} className="particle" style={{ [dx.split(":")[0].trim().replace("--", "--")]: dx.split(":")[1], [dy.split(":")[0].trim()]: dy.split(":")[1], animationDelay: delay, background: bg, top: pos.split(";")[0].split(":")[1], left: pos.split(";")[1].split(":")[1] }} />
          ))}

          <svg width="100%" height="660" viewBox="0 0 500 660" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0, zIndex: 2, overflow: "visible" }}>
            <defs>
              <linearGradient id="am1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#080f1c" /><stop offset="45%" stopColor="#1a3255" /><stop offset="55%" stopColor="#1e3d60" /><stop offset="100%" stopColor="#080f1c" /></linearGradient>
              <linearGradient id="am2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#0a1320" /><stop offset="50%" stopColor="#152b46" /><stop offset="100%" stopColor="#0a1320" /></linearGradient>
              <linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a3050" /><stop offset="100%" stopColor="#080f1c" /></linearGradient>
              <filter id="nb"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="sg"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            <g transform="translate(0,580)">
              <rect x="40" y="0" width="420" height="12" rx="3" fill="#0a111e" stroke="#1a2540" strokeWidth="1" />
              <line x1="40" y1="6" x2="460" y2="6" stroke="#1a2540" strokeWidth="1" strokeDasharray="20 10" />
              <g className="conv-item"><rect x="100" y="-18" width="22" height="22" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.2" /><rect x="180" y="-18" width="22" height="22" rx="5" fill="#0f2d1a" stroke="#22c55e" strokeWidth="1.2" /><rect x="260" y="-18" width="22" height="22" rx="5" fill="#1a0d2e" stroke="#a855f7" strokeWidth="1.2" /></g>
              <circle cx="50" cy="12" r="6" fill="#0d1a2e" stroke="#1a2540" strokeWidth="1" />
              <circle cx="450" cy="12" r="6" fill="#0d1a2e" stroke="#1a2540" strokeWidth="1" />
            </g>

            <g className="arm-sway">
              <g transform="translate(205,510)">
                <ellipse cx="45" cy="72" rx="52" ry="7" fill="#040810" opacity=".7" />
                <rect width="90" height="28" rx="4" fill="#080f1c" stroke="#1a2540" strokeWidth="1.5" />
                <rect x="30" y="-110" width="30" height="110" fill="url(#bm)" stroke="#111d30" strokeWidth="1" />
                <rect x="22" y="-115" width="46" height="9" rx="3" fill="#192a40" stroke="#1a2540" strokeWidth="1" />
                <line x1="30" y1="-40" x2="60" y2="-40" stroke="#1a2540" strokeWidth=".8" />
                <line x1="30" y1="-70" x2="60" y2="-70" stroke="#1a2540" strokeWidth=".8" />
                <circle cx="14" cy="14" r="3.5" fill="#1a2540" stroke="#253650" strokeWidth="1" />
                <circle cx="76" cy="14" r="3.5" fill="#1a2540" stroke="#253650" strokeWidth="1" />
              </g>
              <circle cx="250" cy="410" r="22" fill="#0c1725" stroke="#1e3a5f" strokeWidth="2" />
              <circle className="joint-ring" cx="250" cy="410" r="26" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <circle cx="250" cy="410" r="8" fill="#22c55e" filter="url(#nb)" opacity=".9" />
              <circle cx="250" cy="410" r="3.5" fill="#bbf7d0" />

              <g className="seg1-move" style={{ transformOrigin: "250px 410px" }}>
                <rect x="241" y="175" width="18" height="235" rx="4" fill="url(#am1)" stroke="#111d30" strokeWidth="1" />
                <line x1="250" y1="185" x2="250" y2="405" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity=".4" className="energy-line" filter="url(#nb)" />
                <rect x="241" y="260" width="18" height="5" rx="1" fill="#0a1320" stroke="#1a2540" strokeWidth=".5" />
                <rect x="241" y="310" width="18" height="5" rx="1" fill="#0a1320" stroke="#1a2540" strokeWidth=".5" />
                <rect x="241" y="360" width="18" height="5" rx="1" fill="#0a1320" stroke="#1a2540" strokeWidth=".5" />

                <g transform="translate(250,175)">
                  <circle cx="0" cy="0" r="22" fill="#0c1725" stroke="#2563eb" strokeWidth="2" />
                  <circle className="joint-ring" cx="0" cy="0" r="26" fill="none" stroke="#3b82f6" strokeWidth="1.5" style={{ animationDelay: ".7s" }} />
                  <circle cx="0" cy="0" r="8" fill="#3b82f6" filter="url(#nb)" />
                  <circle cx="0" cy="0" r="3" fill="#bfdbfe" />

                  <g className="seg2-move">
                    <rect x="-9" y="-165" width="18" height="165" rx="4" fill="url(#am2)" stroke="#111d30" strokeWidth="1" />
                    <line x1="0" y1="-155" x2="0" y2="-5" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity=".4" className="energy-line" style={{ animationDelay: ".2s" }} filter="url(#nb)" />
                    <rect x="-9" y="-130" width="18" height="5" rx="1" fill="#0a1320" stroke="#1a2540" strokeWidth=".5" />
                    <rect x="-9" y="-90" width="18" height="5" rx="1" fill="#0a1320" stroke="#1a2540" strokeWidth=".5" />

                    <g transform="translate(0,-165)">
                      <circle cx="0" cy="0" r="14" fill="#0c1725" stroke="#1a2540" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="5" fill="#1a2f4a" />
                      <g className="wrist-move" style={{ transformOrigin: "0px 0px" }}>
                        <rect x="-24" y="-28" width="48" height="28" rx="7" fill="#080f1c" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="0" cy="-14" r="5" fill="#0f1e35" stroke="#1a2540" strokeWidth="1" />
                        <circle cx="0" cy="-14" r="2" fill="#1a2f4a" />
                        <g className="finger-l" style={{ transformOrigin: "-22px -28px" }}>
                          <path d="M -22,-28 L -42,-76 L -30,-81 L -10,-32 Z" fill="#152236" stroke="#1e3a5f" strokeWidth="1" />
                          <rect x="-46" y="-82" width="18" height="5" rx="2" fill="#3b82f6" transform="rotate(-20,-42,-80)" filter="url(#nb)" />
                          <circle cx="-36" cy="-58" r="2.5" fill="#60a5fa" opacity=".6" />
                        </g>
                        <g className="finger-r" style={{ transformOrigin: "22px -28px" }}>
                          <path d="M 22,-28 L 42,-76 L 30,-81 L 10,-32 Z" fill="#152236" stroke="#1e3a5f" strokeWidth="1" />
                          <rect x="28" y="-82" width="18" height="5" rx="2" fill="#3b82f6" transform="rotate(20,42,-80)" filter="url(#nb)" />
                          <circle cx="36" cy="-58" r="2.5" fill="#60a5fa" opacity=".6" />
                        </g>
                        <rect x="-5" y="-28" width="10" height="22" rx="3" fill="#0f1e35" stroke="#1a2540" strokeWidth=".8" />
                        <rect x="-4" y="-9" width="8" height="5" rx="2" fill="#3b82f6" opacity=".5" filter="url(#nb)" />

                        <g className="item-held">
                          <circle cx="0" cy="-62" r="38" fill="#1d4ed8" opacity=".08" />
                          <circle cx="0" cy="-62" r="44" stroke="#60a5fa" strokeWidth=".8" strokeDasharray="4 9" fill="none" opacity=".35" className="orbit1" style={{ transformOrigin: "0px -62px" }} />
                          <circle cx="0" cy="-62" r="36" stroke="#a78bfa" strokeWidth=".6" strokeDasharray="3 12" fill="none" opacity=".25" className="orbit2" style={{ transformOrigin: "0px -62px" }} />
                          <rect x="-17" y="-79" width="34" height="34" rx="9" fill="#2563eb" filter="url(#sg)" />
                          <rect x="-10" y="-72" width="20" height="20" rx="4" fill="#fff" fillOpacity=".88" />
                          <circle cx="0" cy="-62" r="4" fill="#93c5fd" opacity=".7" />
                          <circle cx="44" cy="-62" r="3.5" fill="#60a5fa" className="orbit1" style={{ transformOrigin: "0px -62px" }} filter="url(#nb)" />
                          <circle cx="-36" cy="-62" r="2.5" fill="#a78bfa" className="orbit2" style={{ transformOrigin: "0px -62px" }} />
                        </g>
                        <g className="item-held2">
                          <circle cx="0" cy="-62" r="32" fill="#14532d" opacity=".1" />
                          <circle cx="0" cy="-62" r="38" stroke="#22c55e" strokeWidth=".8" strokeDasharray="4 9" fill="none" opacity=".3" className="orbit1" style={{ transformOrigin: "0px -62px" }} />
                          <polygon points="0,-79 17,-52 -17,-52" fill="#16a34a" filter="url(#sg)" opacity=".9" />
                          <circle cx="0" cy="-62" r="5" fill="#4ade80" opacity=".8" />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>

            <line x1="60" y1="540" x2="440" y2="540" stroke="#3b82f6" strokeWidth=".8" strokeDasharray="6 8" opacity=".2" className="energy-line" />
            <line x1="40" y1="430" x2="180" y2="430" stroke="#3b82f6" strokeWidth=".6" strokeDasharray="4 8" opacity=".15" className="energy-line" style={{ animationDelay: ".3s" }} />
            <line x1="320" y1="430" x2="460" y2="430" stroke="#3b82f6" strokeWidth=".6" strokeDasharray="4 8" opacity=".15" className="energy-line" style={{ animationDelay: ".6s" }} />
          </svg>
        </div>
      </div>
    </>
  );
}