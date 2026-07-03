let data = JSON.parse(localStorage.getItem("samolog") || "[]");

function go(i){
  document.querySelectorAll(".page").forEach((p,idx)=>{
    p.classList.toggle("active",idx===i);
  });

  document.querySelectorAll(".tab").forEach((t,idx)=>{
    t.classList.toggle("active",idx===i);
  });

  render();
}

function add(){

  data.push({
    id:Date.now(),
    stage:stage.value,
    result:result.value,
    special:special.value,
    gold:+gold.value||0,
    goldA:+goldA.value||0,
    red:+red.value||0
  });

  localStorage.setItem("samolog",JSON.stringify(data));
  render();
}

/* 戦績 */
function render(){

  document.getElementById("p1").innerHTML =
    data.slice().reverse().map(d=>`
      <div class="battleCard">
        <b>${d.stage}</b><br>
        ${d.result}<br>
        ${d.special}<br>
        金:${d.gold} / アシ:${d.goldA} / 赤:${d.red}
      </div>
    `).join("");

  analyze();
}

/* 分析 */
function analyze(){

  if(data.length===0) return;

  const avg=k=>
    data.reduce((a,b)=>a+(b[k]||0),0)/data.length;

  const win = data.filter(d=>d.result.includes("成功")).length;

  avgGold.innerText = Math.round(avg("gold"));
  avgAssist.innerText = Math.round(avg("goldA"));
  avgRed.innerText = Math.round(avg("red"));
  winRate.innerText = Math.round((win/data.length)*100)+"%";
}

render();
