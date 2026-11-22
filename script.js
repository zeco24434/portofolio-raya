/* ===== Tombol ganti tema ===== */
(function(){
  var btn=document.getElementById('tema'),root=document.documentElement;
  btn.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('tema',next)}catch(e){}
  });
})();

/* ===== API ARSIRAN PENSIL (hitam putih, atas ke bawah) ===== */
(function(){
var cv=document.getElementById('api'),g=cv.getContext('2d'),dpr=window.devicePixelRatio||1;
var W,H,fw,CELL=8;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function h(a,b,c){var n=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return n-Math.floor(n)}
function sm(t){return t*t*(3-2*t)}
function vn(x,y){
  var ix=Math.floor(x),iy=Math.floor(y),fx=sm(x-ix),fy=sm(y-iy);
  var a=h(ix,iy,0),b=h(ix+1,iy,0),c=h(ix,iy+1,0),d=h(ix+1,iy+1,0);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;
}
function seg(path,x,y,ang,len,j1,j2){
  var dx=Math.cos(ang)*len/2,dy=Math.sin(ang)*len/2;
  path.moveTo(x-dx+j1,y-dy+j2);path.lineTo(x+dx+j2,y+dy+j1);
}

function draw(t){
  var ink=getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()||'28,28,28';
  g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
  var step=Math.floor(t*7),cols=Math.ceil(fw/CELL),rows=Math.ceil(H/CELL)+1;
  /* 0 arsir ringan, 1 arsir silang, 2 arsir tegak, 3 gelap/bintik, 4 kontur */
  var P=[new Path2D(),new Path2D(),new Path2D(),new Path2D(),new Path2D()];
  for(var side=0;side<2;side++){
    for(var cx=0;cx<cols;cx++){
      var prof=Math.pow(1-(cx+.5)/cols,1.8);
      var px=side?W-(cx+.5)*CELL:(cx+.5)*CELL;
      for(var ry=0;ry<rows;ry++){
        var py=ry*CELL+CELL/2;
        var nx=cx*.55+side*37,ny=ry*.13+t*1.3;
        var n=.65*vn(nx,ny)+.35*vn(nx*2.1+7,ny*2.1+3);
        var v=prof*n*1.75*(.6+.5*py/H);
        if(v<.12)continue;
        var s=cx+side*50;
        var r1=h(s,ry,step),r2=h(s,ry,step+11),r3=h(s,ry,step+23);
        var j1=(r2-.5)*2,j2=(r3-.5)*2;
        if(v>.2) seg(P[0],px,py,-.95+(r1-.5)*.4,CELL*(1.1+r2*.5),j1,j2);
        if(v>.2&&v<.33) seg(P[4],px,py,-1.57+(r1-.5)*.3,CELL*1.9,j2*.8,j1*.8);
        if(v>.42) seg(P[1],px,py,-2.2+(r2-.5)*.4,CELL*(1.1+r3*.5),j2,j1);
        if(v>.62) seg(P[2],px,py,-1.57+(r3-.5)*.3,CELL*(1.2+r1*.5),j1,j2);
        if(v>.85) seg(P[3],px,py,-1.1+(r1-.5)*.5,CELL*.9,j2,j1);
        if(v<=.2&&r1>.62) seg(P[3],px,py,0,1.5,j1*2,j2*2);
      }
    }
  }
  g.lineCap='round';
  var cfg=[[.5,.9],[.55,.9],[.62,1],[.78,1.5],[.9,1.1]];
  for(var k=0;k<5;k++){
    g.strokeStyle='rgba('+ink+','+cfg[k][0]+')';
    g.lineWidth=cfg[k][1];
    g.stroke(P[k]);
  }
}

function size(){
  W=innerWidth;H=innerHeight;
  cv.width=W*dpr;cv.height=H*dpr;
  fw=Math.min(130,Math.max(34,W*.1));
  if(reduce)draw(0);
}
size();addEventListener('resize',size);

if(!reduce){
  var last=0;
  (function loop(ts){
    requestAnimationFrame(loop);
    if(ts-last<33)return;
    last=ts;draw(ts/1000);
  })(0);
}
})();

/* ===== TITIK LATAR + KRISTAL DIGITAL ===== */
(function(){
var dpr=window.devicePixelRatio||1;
function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function hx(h){h=h.replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}

/* ===== Titik kecil di seluruh halaman ===== */
var bg=document.getElementById('bg'),bx=bg.getContext('2d'),W,H,P=[],pm=null;
function bsize(){
  W=innerWidth;H=innerHeight;bg.width=W*dpr;bg.height=H*dpr;
  var n=Math.min(110,Math.round(W*H/13000));P=[];
  for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:.8+Math.random()*1.2,a:.2+Math.random()*.35});
}
bsize();addEventListener('resize',bsize);
addEventListener('pointermove',function(e){pm=[e.clientX,e.clientY]});
addEventListener('pointerleave',function(){pm=null});

/* ===== KRISTAL DIGITAL (gaya anak IT) ===== */
var c=document.getElementById('orb'),x=c.getContext('2d'),S,R,B,m;
var MONO='"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
var phi=(1+Math.sqrt(5))/2,ip=1/phi,V=[],NN=[],F=[],E=[];
[-1,1].forEach(function(a){[-1,1].forEach(function(b){[-1,1].forEach(function(d){V.push([a,b,d])})})});
[-1,1].forEach(function(a){[-1,1].forEach(function(b){
  V.push([0,a*ip,b*phi]);V.push([a*ip,b*phi,0]);V.push([b*phi,0,a*ip]);
  NN.push([a,0,b*phi]);NN.push([a*phi,b,0]);NN.push([0,a*phi,b]);
})});
function nrm(v){var l=Math.hypot(v[0],v[1],v[2]);return[v[0]/l,v[1]/l,v[2]/l]}
function dt(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function cr(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])}
V=V.map(nrm);
NN.forEach(function(n){
  n=nrm(n);
  var idx=V.map(function(v,i){return[i,dt(v,n)]}).sort(function(a,b){return b[1]-a[1]}).slice(0,5).map(function(o){return o[0]});
  var u=nrm(cr(n,[.31,.52,.79])),w=cr(n,u);
  idx.sort(function(a,b){return Math.atan2(dt(V[a],w),dt(V[a],u))-Math.atan2(dt(V[b],w),dt(V[b],u))});
  F.push({n:n,i:idx});
});
var mn=9,i,j;
for(i=0;i<V.length;i++)for(j=i+1;j<V.length;j++)mn=Math.min(mn,dist(V[i],V[j]));
for(i=0;i<V.length;i++)for(j=i+1;j<V.length;j++)if(dist(V[i],V[j])<mn*1.02)E.push([i,j]);

function fib(i,n){var y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),t=i*2.399963;return[Math.cos(t)*r,y,Math.sin(t)*r]}
var DOTS=[],NODES=[],LK=[],GL=['0','1','</>','{ }','01','=>','#','>_','fn','10','&&','λ','//'];
for(i=0;i<240;i++)DOTS.push(fib(i,240));
for(i=0;i<48;i++)NODES.push(fib(i,48));
for(i=0;i<NODES.length;i++)for(j=i+1;j<NODES.length;j++)if(dist(NODES[i],NODES[j])<.7)LK.push([i,j]);

var ay=0,ax=.35,vy=.004,vx=0,drag=false,lx=0,ly=0,mx=null,my=null;
function size(){var w=c.clientWidth;c.width=c.height=w*dpr;S=c.width;R=S*.37;B=R*.6;m=S/2}
size();addEventListener('resize',size);
c.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX;ly=e.clientY;c.setPointerCapture(e.pointerId);c.style.cursor='grabbing'});
c.addEventListener('pointerup',function(){drag=false;c.style.cursor='grab'});
c.addEventListener('pointermove',function(e){
  var b=c.getBoundingClientRect();mx=(e.clientX-b.left)*dpr;my=(e.clientY-b.top)*dpr;
  if(drag){vy=(e.clientX-lx)*.0008;vx=(e.clientY-ly)*.0008;ay+=(e.clientX-lx)*.008;ax+=(e.clientY-ly)*.008;lx=e.clientX;ly=e.clientY}
});
c.addEventListener('pointerleave',function(){mx=my=null});

function rot(p,a,b){
  var cy=Math.cos(a),sy=Math.sin(a),cx=Math.cos(b),sx=Math.sin(b);
  var X=p[0]*cy+p[2]*sy,Z=-p[0]*sy+p[2]*cy,Y=p[1]*cx-Z*sx;Z=p[1]*sx+Z*cx;return[X,Y,Z];
}
function tilt(p,tx,tz){
  var c1=Math.cos(tx),s1=Math.sin(tx),y=p[1]*c1-p[2]*s1,z=p[1]*s1+p[2]*c1,c2=Math.cos(tz),s2=Math.sin(tz);
  return[p[0]*c2-y*s2,p[0]*s2+y*c2,z];
}
function push(px,py){
  if(mx===null)return[px,py];
  var dx=px-mx,dy=py-my,d=Math.sqrt(dx*dx+dy*dy)||1,f=Math.max(0,1-d/(S*.2));
  return[px+dx*f*.35,py+dy*f*.35];
}
var L=nrm([-.4,-.6,.7]);

function frame(){
  var t=performance.now()/1000;
  var dot=css('--dot'),acc=css('--acc'),b1=hx(css('--ball1')),b2=hx(css('--ball2'));
  function A(a){return 'rgba('+acc+','+a+')'}

  /* titik latar halaman */
  bx.setTransform(dpr,0,0,dpr,0,0);bx.clearRect(0,0,W,H);
  P.forEach(function(p){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    var px=p.x,py=p.y;
    if(pm){var dx=px-pm[0],dy=py-pm[1],d=Math.hypot(dx,dy);if(d<110){var f=(1-d/110)*28;px+=dx/d*f;py+=dy/d*f}}
    bx.beginPath();bx.arc(px,py,p.r,0,6.2832);bx.fillStyle='rgba('+dot+','+p.a+')';bx.fill();
  });

  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,S,S);
  if(!drag){ay+=vy;ax+=vx;vx*=.96;vy+=(.004-vy)*.02}

  /* proyeksi titik & node */
  var dp=DOTS.map(function(p){var q=rot(p,ay,ax),k=1+q[2]*.18,s=push(m+q[0]*R*k,m+q[1]*R*k);return{x:s[0],y:s[1],z:q[2]}});
  var nd=NODES.map(function(p,idx){var q=rot(p,ay,ax),k=1+q[2]*.18,s=push(m+q[0]*R*k,m+q[1]*R*k);return{x:s[0],y:s[1],z:q[2],g:GL[idx%GL.length]}});

  function drawDots(front){
    dp.forEach(function(p){
      if((p.z>=0)!==front)return;
      var a=.18+.45*(p.z+1)/2,r=(.9+1.1*(p.z+1)/2)*dpr;
      x.beginPath();x.arc(p.x,p.y,r,0,6.2832);x.fillStyle='rgba('+dot+','+a+')';x.fill();
    });
  }
  function drawNet(front){
    x.lineWidth=.8*dpr;
    LK.forEach(function(l){
      var a=nd[l[0]],b=nd[l[1]],z=(a.z+b.z)/2;
      if((z>=0)!==front)return;
      x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);
      x.strokeStyle=A(.08+.32*(z+1)/2);x.stroke();
    });
    x.textAlign='center';x.textBaseline='middle';
    nd.forEach(function(n){
      if((n.z>=0)!==front)return;
      var dep=(n.z+1)/2,fs=(7.5+4.5*dep)*dpr;
      x.font='500 '+fs+'px '+MONO;
      x.fillStyle=A(.3+.65*dep);
      x.fillText(n.g,n.x,n.y);
    });
  }

  /* cincin HUD */
  var RINGS=[
    {rad:R*1.13,tx:1.15,tz:.35,spin:t*.35},
    {rad:R*.93,tx:.55,tz:-.9,spin:-t*.5}
  ];
  RINGS.forEach(function(r){
    var o=[],seg=96;
    for(var k=0;k<=seg;k++){var th=k/seg*6.2832+r.spin;o.push(rot(tilt([r.rad*Math.cos(th),0,r.rad*Math.sin(th)],r.tx,r.tz),ay,ax))}
    r.pts=o;
  });
  function drawRings(front){
    RINGS.forEach(function(r){
      var o=r.pts;
      for(var k=0;k<o.length-1;k++){
        var a=o[k],b=o[k+1],z=(a[2]+b[2])/2;
        if((z>=0)!==front)continue;
        var al=.12+.5*(z/r.rad+1)/2;
        if(k%8===0){
          x.beginPath();x.moveTo(m+a[0],m+a[1]);x.lineTo(m+a[0]*1.06,m+a[1]*1.06);
          x.strokeStyle=A(al);x.lineWidth=1*dpr;x.stroke();
        }
        if(k%10>6)continue;
        x.beginPath();x.moveTo(m+a[0],m+a[1]);x.lineTo(m+b[0],m+b[1]);
        x.strokeStyle=A(al);x.lineWidth=1.2*dpr;x.stroke();
      }
    });
  }

  /* ===== urutan gambar ===== */
  drawDots(false);
  drawNet(false);
  drawRings(false);

  /* inti wireframe kecil (berputar berlawanan) */
  var a2=-ay*1.6+t*.2,b2r=ax*1.3+.5;
  x.lineWidth=1*dpr;
  E.forEach(function(e){
    var p=rot(V[e[0]],a2,b2r),q=rot(V[e[1]],a2,b2r);
    x.beginPath();x.moveTo(m+p[0]*B*.42,m+p[1]*B*.42);x.lineTo(m+q[0]*B*.42,m+q[1]*B*.42);
    x.strokeStyle=A(.55);x.stroke();
  });
  for(i=0;i<V.length;i+=1){
    var iv=rot(V[i],a2,b2r);
    x.beginPath();x.arc(m+iv[0]*B*.42,m+iv[1]*B*.42,1.6*dpr,0,6.2832);x.fillStyle=A(.9);x.fill();
  }

  /* sisi kristal (semi-transparan, matte abu-abu) */
  F.map(function(f){return{f:f,n:rot(f.n,ay,ax)}}).filter(function(o){return o.n[2]>0}).forEach(function(o){
    var l=.3+.7*Math.max(0,dt(o.n,L));
    var col='rgba('+[0,1,2].map(function(k){return Math.round(b2[k]+(b1[k]-b2[k])*l)}).join(',')+',.58)';
    x.beginPath();
    o.f.i.forEach(function(vi,j){var q=rot(V[vi],ay,ax),px=m+q[0]*B,py=m+q[1]*B;if(j)x.lineTo(px,py);else x.moveTo(px,py)});
    x.closePath();x.fillStyle=col;x.fill();
  });

  /* rusuk wireframe menyala */
  x.lineCap='round';
  E.forEach(function(e){
    var p=rot(V[e[0]],ay,ax),q=rot(V[e[1]],ay,ax),z=(p[2]+q[2])/2;
    var front=z>0;
    x.beginPath();x.moveTo(m+p[0]*B,m+p[1]*B);x.lineTo(m+q[0]*B,m+q[1]*B);
    x.strokeStyle=A(front?.95:.22);x.lineWidth=(front?1.6:1)*dpr;
    if(front){x.shadowColor=A(1);x.shadowBlur=9*dpr}
    x.stroke();x.shadowBlur=0;
  });
  /* simpul sudut berdenyut */
  V.forEach(function(v,idx){
    var q=rot(v,ay,ax);if(q[2]<-.1)return;
    var pu=1+.35*Math.sin(t*2.2+idx);
    x.beginPath();x.arc(m+q[0]*B,m+q[1]*B,2.4*pu*dpr,0,6.2832);
    x.fillStyle='rgba(255,255,255,.95)';x.shadowColor=A(1);x.shadowBlur=10*dpr;x.fill();x.shadowBlur=0;
  });

  drawDots(true);
  drawNet(true);
  drawRings(true);

  /* satelit mengorbit di cincin pertama */
  (function(){
    var r=RINGS[0];
    for(var k=14;k>=0;k--){
      var th=t*1.3-k*.07;
      var q=rot(tilt([r.rad*Math.cos(th),0,r.rad*Math.sin(th)],r.tx,r.tz),ay,ax);
      var dep=(q[2]/r.rad+1)/2,a=(1-k/15)*(.35+.65*dep);
      x.beginPath();x.arc(m+q[0],m+q[1],(k===0?3.2:2.2*(1-k/18))*dpr,0,6.2832);
      x.fillStyle=k===0?'rgba(255,255,255,'+a+')':A(a);
      if(k===0){x.shadowColor=A(1);x.shadowBlur=14*dpr}
      x.fill();x.shadowBlur=0;
    }
  })();

  /* garis scan */
  (function(){
    var s=Math.sin(t*.8),yy=m+s*B*1.1,dir=Math.cos(t*.8)>0?1:-1,bw=34*dpr;
    var y0=yy-dir*bw,g2=x.createLinearGradient(0,y0,0,yy);
    g2.addColorStop(0,A(0));g2.addColorStop(1,A(.2));
    x.fillStyle=g2;x.fillRect(m-R*1.2,Math.min(y0,yy),R*2.4,bw);
    var g=x.createLinearGradient(m-R*1.2,0,m+R*1.2,0);
    g.addColorStop(0,A(0));g.addColorStop(.5,A(.95));g.addColorStop(1,A(0));
    x.strokeStyle=g;x.lineWidth=1.5*dpr;x.beginPath();x.moveTo(m-R*1.2,yy);x.lineTo(m+R*1.2,yy);x.stroke();
  })();

  /* HUD teks terminal */
  (function(){
    var fs=Math.max(9,S/dpr*.026)*dpr,pad=S*.035;
    x.font='500 '+fs+'px '+MONO;
    x.fillStyle=A(.8);x.textBaseline='alphabetic';
    x.textAlign='left';x.fillText('> orb.init()'+(((t*2)|0)%2?'_':' '),pad,pad+fs);
    x.fillText('nodes:'+NODES.length+' edges:'+E.length,pad,S-pad);
    x.textAlign='right';
    var deg=(((ay*57.2958)%360)+360)%360|0;
    x.fillText('rot '+('00'+deg).slice(-3)+'\u00b0',S-pad,pad+fs);
    x.fillText('sys://online',S-pad,S-pad);
    var tw=x.measureText('sys://online').width;
    x.beginPath();x.arc(S-pad-tw-fs*.7,S-pad-fs*.3,fs*.22,0,6.2832);
    x.fillStyle=A(.5+.5*Math.sin(t*3));x.fill();
  })();

  requestAnimationFrame(frame);
}
frame();
})();
