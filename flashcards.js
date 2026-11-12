/* NISHLAB daily skill flashcards.
   Each day the site shows 5 cards from this bank (picked from today's date, same for everyone).
   To add cards, add {q:"...",a:"..."} lines inside a course below. Keep answers to 1-3 sentences.
   With 6 cards per course (60 total) the daily set repeats every 12 days; more cards = longer before repeats. */
(function(){
var COURSES={
 SW:{n:"SolidWorks",u:"/courses/solidworks-professional/",cards:[
  {q:"Fully defined vs under-defined sketch: what is the difference?",a:"In a fully defined sketch every entity has fixed size and position (shown black). An under-defined sketch has free entities (blue) that can still move, so edits can behave unpredictably."},
  {q:"When do you use a Loft instead of a Sweep?",a:"A Sweep moves one profile along a path. A Loft blends between two or more different profiles, and can follow guide curves for control."},
  {q:"What does a Design Table do?",a:"It drives dimensions, features and configurations from an Excel sheet, so one part model can produce many sizes."},
  {q:"Coincident vs Concentric mate?",a:"Coincident joins faces, edges or points so they touch or share a plane. Concentric aligns the axes of circular or cylindrical features."},
  {q:"What is the rollback bar for?",a:"It steps back through the FeatureManager tree so you can insert or edit earlier features without deleting the later ones."},
  {q:"Why use Configurations instead of saving copies of a part?",a:"One file holds all variants (sizes, suppressed features), and a change to the base model carries into every variant."}]},
 ACAD:{n:"AutoCAD",u:"/courses/autocad-professional/",cards:[
  {q:"Model space vs layout (paper space)?",a:"Model space is where you draw the real geometry at 1:1. A layout holds the title block and viewports, and is where you set the plot scale."},
  {q:"What does Object Snap (OSNAP) do?",a:"It snaps the cursor to exact points on geometry, such as endpoint, midpoint, centre and intersection, so drawings stay accurate."},
  {q:"Block vs Xref: what is the difference?",a:"A block is copied into the drawing. An Xref is a live link to another drawing file and updates when that file changes."},
  {q:"What are annotative objects?",a:"Text, dimensions and hatches that scale automatically to each viewport's scale, so they plot at the correct size."},
  {q:"What does FILLET with radius 0 do?",a:"It joins two lines at a sharp corner by trimming or extending them until they meet."},
  {q:"Why keep object properties ByLayer?",a:"Colour, linetype and lineweight then follow the layer, so changing the layer changes every object on it and plot settings stay consistent."}]},
 CATIA:{n:"CATIA V5",u:"/courses/catia-v5-professional/",cards:[
  {q:"What do Pad and Pocket do in Part Design?",a:"Pad extrudes a closed sketch into material. Pocket removes material from the solid using a sketch."},
  {q:"What do the Sketcher colours mean?",a:"White is under-constrained, green is fully constrained (iso-constrained), purple is over-constrained and red is inconsistent."},
  {q:"What is the specification tree used for?",a:"It lists the features and their order, so you can edit, reorder or reference them."},
  {q:"Part Design vs Generative Shape Design?",a:"Part Design builds solids. Generative Shape Design builds wireframe and surfaces for complex or freeform shapes."},
  {q:"Part vs Product in CATIA?",a:"A Part is a single component. A Product is an assembly that holds parts and sub-products and the constraints between them."},
  {q:"Why use Publications?",a:"They expose chosen geometry under a clear name, so other parts and assemblies link to a stable reference."}]},
 CREO:{n:"Creo Parametric",u:"/courses/creo-parametric/",cards:[
  {q:"What drives a model in Creo?",a:"Dimensions, relations and feature order. Change a parameter and the model regenerates."},
  {q:"Why use datum planes as references?",a:"Features that reference datums survive edits better than ones that reference faces, which makes models more robust."},
  {q:"What are relations?",a:"Equations such as d5 = d3*2 that link dimensions or parameters so they update together."},
  {q:"What is a Family Table?",a:"A table of variants of one part, each with its own dimensions or features, much like configurations."},
  {q:"Why do parent-child relationships matter?",a:"Deleting or editing a parent can break its children. Choose references carefully and check them in Reference Viewer."},
  {q:"What is a skeleton model?",a:"It is a top-down design method: one model holds key datums and layouts that the components reference."}]},
 F360:{n:"Fusion 360",u:"/courses/fusion-360/",cards:[
  {q:"What is the Timeline?",a:"A history bar of your operations. You can edit, roll back or reorder steps, like a feature tree."},
  {q:"Components vs bodies?",a:"Components are independent parts with their own origin and joints. Bodies are solids inside a component. Make anything that moves its own component."},
  {q:"Joint vs As-built joint?",a:"A Joint moves components into position using chosen geometry. An As-built joint keeps components where they already are."},
  {q:"Parametric vs direct modelling?",a:"Parametric mode records the Timeline so you can edit history. Direct modelling does not record history."},
  {q:"Which workspace creates CNC toolpaths?",a:"Manufacture, the CAM workspace."},
  {q:"What are user parameters for?",a:"Named variables such as Width = 50 mm that you use in dimensions, so one change updates the whole design."}]},
 ANSYS:{n:"ANSYS",u:"/courses/ansys-workbench-professional/",cards:[
  {q:"Why run a mesh convergence study?",a:"To show that results such as maximum stress stop changing as the mesh is refined, so they do not depend on mesh size."},
  {q:"What is von Mises stress?",a:"An equivalent stress that combines all stress components. For ductile materials you compare it with yield strength."},
  {q:"What is a stress singularity?",a:"Stress that keeps rising as you refine the mesh at a sharp corner or point load. It is not real, so add a fillet or ignore that spot."},
  {q:"What does modal analysis give you?",a:"Natural frequencies and mode shapes of a structure in free vibration, with no applied load needed."},
  {q:"What is Factor of Safety?",a:"Allowable stress (yield or ultimate) divided by the actual stress. A value above 1 means the part has margin."},
  {q:"Fixed support vs frictionless support?",a:"Fixed support blocks all movement of the face. Frictionless support blocks only motion normal to the face, so it can slide."}]},
 KS:{n:"KeyShot",u:"/courses/keyshot/",cards:[
  {q:"What is HDRI lighting?",a:"A 360-degree high-dynamic-range image that lights the scene and shows up in reflections."},
  {q:"Why can metals look flat in a render?",a:"Metals mostly reflect their surroundings. A plain or dim environment gives them nothing to reflect, so use an HDRI with contrast."},
  {q:"What does depth of field do?",a:"It blurs everything outside the focus distance, which adds realism and draws the eye to the product."},
  {q:"What is a turntable animation?",a:"The model or camera rotates 360 degrees around an axis to show every side of the product."},
  {q:"Material vs texture?",a:"A material defines how a surface behaves (metal, plastic, glass). A texture adds pattern or detail, such as brushed lines or a label."},
  {q:"What does denoise do?",a:"It removes grain from renders with few samples, so you can finish sooner with a clean image."}]},
 PY:{n:"Python",u:"/courses/python-for-engineers/",cards:[
  {q:"List vs tuple?",a:"A list can change after it is created. A tuple cannot, so use it for fixed data such as coordinates."},
  {q:"Why use NumPy instead of plain lists for engineering maths?",a:"NumPy arrays support fast whole-array and matrix operations without writing loops."},
  {q:"How do you load an Excel BOM with pandas?",a:"pd.read_excel('bom.xlsx') reads the sheet into a DataFrame you can filter, group and total."},
  {q:"Why write with open('file') as f?",a:"The file is closed automatically, even if an error happens inside the block."},
  {q:"What is try/except for?",a:"It catches errors, such as a missing file, so your script can show a clear message or carry on instead of crashing."},
  {q:"Which library can drive AutoCAD from Python?",a:"pyautocad, which talks to AutoCAD through COM on Windows."}]},
 XLS:{n:"Excel + VBA",u:"/courses/advanced-excel-vba-for-engineers/",cards:[
  {q:"XLOOKUP vs VLOOKUP?",a:"XLOOKUP can look in any direction, defaults to an exact match and lets you set a not-found message. VLOOKUP only looks right of the first column."},
  {q:"What does SUMIFS do?",a:"It adds values that meet several conditions: =SUMIFS(sum_range, range1, criteria1, range2, criteria2)."},
  {q:"What is a pivot table good for?",a:"Summarising a large table by dragging fields into rows, columns and values. Refresh it after the data changes."},
  {q:"What does $A$1 mean?",a:"An absolute reference. The dollar signs lock the column and row when you copy the formula."},
  {q:"What does the macro recorder do?",a:"It records your clicks as VBA code, which is a quick way to learn VBA or automate a repeated task."},
  {q:"Why start a VBA module with Option Explicit?",a:"It forces you to declare every variable, so typos in variable names are caught early."}]},
 JOB:{n:"Career",u:"/courses/interview-resume-and-portfolio-preparation/",cards:[
  {q:"How long should a fresher's resume be?",a:"One page, with the strongest projects and skills near the top."},
  {q:"What does ATS-friendly mean?",a:"A simple layout with standard headings and no tables or graphics, so tracking software can read it. Use keywords from the job post."},
  {q:"What is the STAR method for interview answers?",a:"Situation, Task, Action, Result. Describe the context, your role, what you did and the outcome, with numbers if you have them."},
  {q:"What belongs in a CAD portfolio?",a:"Your best 4 to 6 projects, each with renders or drawings, what you personally did, the tools used and the result."},
  {q:"How do you answer 'Tell me about yourself'?",a:"In under 90 seconds: your current skills or role, one standout project, and why you want this job."},
  {q:"What is GD&T?",a:"Geometric Dimensioning and Tolerancing: symbols that control the form, orientation and position of features, beyond simple size limits."}]}
};
var ORDER=["SW","PY","ACAD","ANSYS","XLS","CATIA","JOB","F360","KS","CREO"],PER_DAY=5;
var all=[];
for(var i=0;i<6;i++)ORDER.forEach(function(k){var c=COURSES[k].cards[i];if(c)all.push({k:k,q:c.q,a:c.a})});
var root=document.getElementById("fl");if(!root)return;

var now=new Date(),dayNo=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/864e5);
var dayKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
var nice=now.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});
function pick(n,offset){var o=[],s=((dayNo+offset)*PER_DAY)%all.length;for(var i=0;i<n;i++)o.push(all[(s+i)%all.length]);return o}
var deck=pick(PER_DAY,0),idx=0,flipped=false,seen={},knew={};

function store(){try{return JSON.parse(localStorage.getItem("nl_fl")||"{}")}catch(e){return {}}}
function save(o){try{localStorage.setItem("nl_fl",JSON.stringify(o))}catch(e){}}
function touchStreak(){
  var s=store();if(s.last===dayKey)return;
  var y=new Date(now);y.setDate(y.getDate()-1);var yk=y.getFullYear()+"-"+(y.getMonth()+1)+"-"+y.getDate();
  s.streak=(s.last===yk?(s.streak||0):0)+1;s.last=dayKey;save(s);showStreak();
}
function showStreak(){var s=store(),el=document.getElementById("fl-streak");if(el)el.textContent=s.streak?"Streak: "+s.streak+(s.streak>1?" days":" day"):""}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;")}

root.innerHTML=
 "<div class='fl-top'><span class='mono' id='fl-date'></span><span class='mono' id='fl-count'></span></div>"+
 "<button type='button' class='fl-card' id='fl-card' aria-live='polite'><span class='fl-face'><span class='mono hot' id='fl-tag'></span><span class='fl-text' id='fl-text'></span><span class='fl-hint mono' id='fl-hint'></span></span></button>"+
 "<div class='fl-link' id='fl-link'></div>"+
 "<div class='fl-bar'><button type='button' class='btn line' id='fl-prev'>← Back</button><button type='button' class='btn line' id='fl-knew' hidden>I knew it ✓</button><button type='button' class='btn' id='fl-next'>Next →</button></div>"+
 "<div class='fl-done' id='fl-done' hidden><p><b id='fl-score'></b></p><button type='button' class='btn line' id='fl-more'>5 more practice cards</button><a class='btn' href='#demo'>Learn these hands-on, book a free demo →</a></div>";
var $=function(i){return document.getElementById(i)};
$("fl-date").textContent="Today · "+nice;

function render(){
  var c=deck[idx],course=COURSES[c.k];
  $("fl-tag").textContent=course.n;
  $("fl-text").textContent=flipped?c.a:c.q;
  $("fl-hint").textContent=flipped?"Answer":"Tap to flip";
  $("fl-card").classList.toggle("back",flipped);
  $("fl-card").setAttribute("aria-label",(flipped?"Answer: ":"Question: ")+(flipped?c.a:c.q)+". Press to "+(flipped?"see the question":"reveal the answer"));
  $("fl-count").textContent="Card "+(idx+1)+" of "+deck.length;
  $("fl-link").innerHTML=flipped?"<a href='"+course.u+"'>Learn this in the "+esc(course.n)+" course →</a>":"";
  $("fl-knew").hidden=!flipped;
  $("fl-prev").disabled=idx===0;
  $("fl-next").textContent=idx===deck.length-1?"Finish":"Next →";
}
function flip(){flipped=!flipped;if(flipped){seen[idx]=1;touchStreak()}render()}
$("fl-card").onclick=flip;
$("fl-knew").onclick=function(){knew[idx]=1;go(1)};
$("fl-prev").onclick=function(){go(-1)};
$("fl-next").onclick=function(){go(1)};
function go(d){
  var n=idx+d;
  if(n<0)return;
  if(n>=deck.length){finish();return}
  idx=n;flipped=false;render();
}
function finish(){
  var k=Object.keys(knew).length;
  $("fl-done").hidden=false;$("fl-card").hidden=true;$("fl-link").hidden=true;document.querySelector(".fl-bar").hidden=true;
  $("fl-score").textContent="You knew "+k+" of "+deck.length+". Come back tomorrow for 5 new cards.";
}
$("fl-more").onclick=function(){
  var extra=[],used={};deck.forEach(function(c){used[c.q]=1});
  var pool=all.filter(function(c){return !used[c.q]});
  while(extra.length<PER_DAY&&pool.length){extra.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0])}
  deck=extra;idx=0;flipped=false;knew={};
  $("fl-done").hidden=true;$("fl-card").hidden=false;$("fl-link").hidden=false;document.querySelector(".fl-bar").hidden=false;
  $("fl-date").textContent="Practice round";render();
};
showStreak();render();
})();
