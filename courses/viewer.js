/* NISHLAB project viewer: loads STEP / IGES / BREP in the browser and shows it with drag-to-orbit.
   Used by every course page. Needs three.js (r128) loaded first. */
(function(){
var OCCT_BASE="https://cdn.jsdelivr.net/npm/occt-import-js@0.0.23/dist/";
var occtP=null;
function loadScript(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error("Could not load 3D engine"))};document.head.appendChild(s)})}
function getOcct(){
  if(!occtP)occtP=loadScript(OCCT_BASE+"occt-import-js.js").then(function(){return occtimportjs({locateFile:function(f){return OCCT_BASE+f}})});
  return occtP;
}
/* smooth shading only where faces are nearly flat, so sharp corners stay crisp */
function creaseGeo(pos,ix,span,deg){
  var nf=ix.length/3,cs=Math.cos(deg*Math.PI/180),q=1/(span*1e-5),fn=new Float32Array(nf*3),map=new Map(),vk=new Array(nf*3),f,c,i;
  function key(v){return Math.round(pos[v*3]*q)+","+Math.round(pos[v*3+1]*q)+","+Math.round(pos[v*3+2]*q)}
  for(f=0;f<nf;f++){
    var a=ix[f*3],b=ix[f*3+1],d=ix[f*3+2];
    var ux=pos[b*3]-pos[a*3],uy=pos[b*3+1]-pos[a*3+1],uz=pos[b*3+2]-pos[a*3+2],vx=pos[d*3]-pos[a*3],vy=pos[d*3+1]-pos[a*3+1],vz=pos[d*3+2]-pos[a*3+2];
    fn[f*3]=uy*vz-uz*vy;fn[f*3+1]=uz*vx-ux*vz;fn[f*3+2]=ux*vy-uy*vx;
    for(c=0;c<3;c++){var k=key(ix[f*3+c]);var L=map.get(k);if(!L){L=[];map.set(k,L)}L.push(f);vk[f*3+c]=k}
  }
  var P=new Float32Array(nf*9),N=new Float32Array(nf*9);
  for(f=0;f<nf;f++){
    var fx=fn[f*3],fy=fn[f*3+1],fz=fn[f*3+2],fl=Math.sqrt(fx*fx+fy*fy+fz*fz)||1;
    for(c=0;c<3;c++){
      var v=ix[f*3+c],o=f*9+c*3;P[o]=pos[v*3];P[o+1]=pos[v*3+1];P[o+2]=pos[v*3+2];
      var L2=map.get(vk[f*3+c]),nx=0,ny=0,nz=0;
      for(i=0;i<L2.length;i++){var h=L2[i],hx=fn[h*3],hy=fn[h*3+1],hz=fn[h*3+2],hl=Math.sqrt(hx*hx+hy*hy+hz*hz)||1;
        if((fx*hx+fy*hy+fz*hz)/(fl*hl)>cs){nx+=hx;ny+=hy;nz+=hz}}
      var nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;N[o]=nx/nl;N[o+1]=ny/nl;N[o+2]=nz/nl;
    }
  }
  var g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(P,3));g.setAttribute("normal",new THREE.BufferAttribute(N,3));return g;
}
var PAL=[0x7f93a8,0xff6a1a,0xd9dee4,0x3b4550,0x5d7a96,0xb8c4d0,0x2b3540];

function mount(box,model){
  var wrap=box.querySelector(".pv-stage"),btn=box.querySelector(".pv-load"),msg=box.querySelector(".pv-msg");
  btn.addEventListener("click",function(){btn.disabled=true;start()});
  function say(t){msg.textContent=t}
  function start(){
    say("Downloading model…");
    fetch(model).then(function(r){if(!r.ok)throw new Error("Model file not found ("+r.status+")");return r.arrayBuffer()})
    .then(function(buf){say("Starting 3D engine…");return getOcct().then(function(oc){return [oc,buf]})})
    .then(function(a){
      say("Building model…");
      return new Promise(function(res){setTimeout(function(){res(a)},30)});
    })
    .then(function(a){
      var oc=a[0],u8=new Uint8Array(a[1]),ext=(model.split("?")[0].split(".").pop()||"").toLowerCase();
      var opt={linearUnit:"millimeter",linearDeflectionType:"bounding_box_ratio",linearDeflection:.002,angularDeflection:.4};
      var r=(ext==="igs"||ext==="iges")?oc.ReadIgesFile(u8,opt):(ext==="brep"?oc.ReadBrepFile(u8,opt):oc.ReadStepFile(u8,opt));
      if(!r||!r.success||!r.meshes.length)throw new Error("Could not read this CAD file");
      show(r);
    })
    .catch(function(e){say(e.message||"Could not load the model");btn.disabled=false;btn.textContent="Try again"});
  }
  function show(r){
    wrap.classList.add("live");box.querySelector(".pv-intro").style.display="none";
    var canvas=document.createElement("canvas");wrap.insertBefore(canvas,wrap.firstChild);
    var R=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
    R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.01,1e5);
    scene.add(new THREE.AmbientLight(0xffffff,.6));
    var d1=new THREE.DirectionalLight(0xffffff,.9);d1.position.set(1,1.4,1.8);scene.add(d1);
    var d2=new THREE.DirectionalLight(0xff9a5a,.35);d2.position.set(-1.5,-.6,1);scene.add(d2);
    var grp=new THREE.Group();scene.add(grp);
    var bb=new THREE.Box3(),meshes=[],lines=[],tris=0;
    r.meshes.forEach(function(m){tris+=m.index.array.length/3;});
    r.meshes.forEach(function(m){
      var pos=m.attributes.position.array,ix=m.index.array;
      var mb=new THREE.Box3();for(var i=0;i<pos.length;i+=3)mb.expandByPoint(new THREE.Vector3(pos[i],pos[i+1],pos[i+2]));bb.union(mb);
    });
    var span=bb.getSize(new THREE.Vector3()).length()||1,ctr=bb.getCenter(new THREE.Vector3());
    r.meshes.forEach(function(m,k){
      var pos=m.attributes.position.array,ix=m.index.array,g;
      if(tris<250000)g=creaseGeo(pos,ix,span,35);
      else{g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setIndex(new THREE.BufferAttribute(ix,1));g.computeVertexNormals()}
      var col=m.color?new THREE.Color(m.color[0],m.color[1],m.color[2]):new THREE.Color(PAL[k%PAL.length]);
      var mat=new THREE.MeshStandardMaterial({color:col,metalness:.4,roughness:.45,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
      var me=new THREE.Mesh(g,mat);grp.add(me);meshes.push(me);
      var el=new THREE.LineSegments(new THREE.EdgesGeometry(g,tris<250000?30:45),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.28}));
      grp.add(el);lines.push(el);
      var wl=new THREE.LineSegments(new THREE.EdgesGeometry(g,6),new THREE.LineBasicMaterial({color:0xcfe0f2,transparent:true,opacity:.6,depthWrite:false}));
      wl.visible=false;grp.add(wl);me.userData.wire=wl;
    });
    grp.position.set(-ctr.x,-ctr.y,-ctr.z);
    var holder=new THREE.Group();scene.remove(grp);holder.add(grp);scene.add(holder);
    var s=1/span;holder.scale.setScalar(s*2.7);
    var dist=4.6,rx=.5,ry=-.6,auto=true,wire=false,drag=null;
    var dist0=dist;
    function size(){var w=wrap.clientWidth,h=wrap.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    size();if(window.ResizeObserver)new ResizeObserver(size).observe(wrap);else window.addEventListener("resize",size);
    canvas.addEventListener("pointerdown",function(e){drag={x:e.clientX,y:e.clientY};auto=false;wrap.classList.add("on");canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener("pointermove",function(e){if(!drag)return;ry+=(e.clientX-drag.x)*.008;rx+=(e.clientY-drag.y)*.008;rx=Math.max(-1.5,Math.min(1.5,rx));drag.x=e.clientX;drag.y=e.clientY});
    function up(){drag=null}canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
    wrap.addEventListener("pointerleave",function(){wrap.classList.remove("on")});
    canvas.addEventListener("wheel",function(e){if(!wrap.classList.contains("on"))return;e.preventDefault();dist=Math.max(1.6,Math.min(12,dist*(e.deltaY>0?1.08:.92)))},{passive:false});
    function zoom(f){dist=Math.max(1.6,Math.min(12,dist*f))}
    box.querySelector('[data-a="zin"]').onclick=function(){zoom(.85)};
    box.querySelector('[data-a="zout"]').onclick=function(){zoom(1.18)};
    box.querySelector('[data-a="reset"]').onclick=function(){dist=dist0;rx=.5;ry=-.6;auto=true};
    var wb=box.querySelector('[data-a="wire"]');
    wb.onclick=function(){wire=!wire;wb.setAttribute("aria-pressed",String(wire));
      meshes.forEach(function(m){m.visible=!wire;m.userData.wire.visible=wire});lines.forEach(function(l){l.visible=!wire})};
    box.querySelector('[data-a="full"]').onclick=function(){
      if(document.fullscreenElement)document.exitFullscreen();else if(wrap.requestFullscreen)wrap.requestFullscreen()};
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,vis=true;
    if(window.IntersectionObserver)new IntersectionObserver(function(en){vis=en[0].isIntersecting}).observe(wrap);
    (function loop(){
      requestAnimationFrame(loop);if(!vis)return;
      if(auto&&!reduce)ry+=.004;
      holder.rotation.set(rx,ry,0);cam.position.set(0,0,dist);cam.lookAt(0,0,0);R.render(scene,cam);
    })();
    box.querySelector(".pv-bar").hidden=false;
  }
}
window.NISHLAB_mountViewer=mount;
})();
