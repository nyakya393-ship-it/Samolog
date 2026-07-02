const weapons=["わかば","スシ","ローラー","チャージャー","ブラスター","シェルター"];
const specials=["トルネード","ナイスダマ","ジェッパ","カニ","サメ","メガホン"];
const stages=["アラマキ砦","ムニ・エール","シェケナダム","すじこ","トキシラズ","ブラコ"];

let data=JSON.parse(localStorage.getItem("inklog_promax")||"[]");

/* ---------------- nav ---------------- */
function go(i){
  document.querySelectorAll(".page").forEach((p,idx)=>{
    p.classList.toggle("active",idx===i);
  });
  render();
}

/* ---------------- input UI ---------------- */
document.getElementById("p0").innerHTML=`
<div class="card">

<h3>検索</h3>
<input id="q" placeholder="ステージ / 武器 / SP" oninput="render()">

<h3>ステージ</h3>
<select id="stage">
${stages.map(s=>`<option>${s}</option>`).join("")}
</select>

<h3>結果</h3>
<select id="result">
<option>成功</option>
<option>成功(オカシラ成功)</option>
<option>成功(オカシラ失敗)</option>
<option>失敗(wave1)</option>
<option>失敗(wave2)</option>
<option>失敗(wave3)</option>
<option>失敗(wave4)</option>
<option>失敗(wave5)</option>
</select>

<h3>スペシャル</h3>
<select id="sp">
${specials.map(s=>`<option>${s}</option>`).join("")}
</select>

<h3>WAVE武器</h3>
${[1,2,3,4,5,6].map(i=>`
<select id="w${i}">
${weapons.map(w=>`<option>${w}</option>`).join("")}
</select>
`).join("")}

<h3>イクラ</h3>
<input id="gold" placeholder="金">
<input id="goldA" placeholder="金アシスト">
<input id="red" placeholder="赤">

<button onclick="add()">保存</button>

</div>
`;

/* ---------------- add ---------------- */
function add(){
  data.push({
    id:Date.now(),
    stage:stage.value,
    result:result.value,
    special:sp.value,
    weapons:[w1.value,w2.value,w3.value,w4.value,w5.value,w6.value],
    totals:{
      gold:+gold.value||0,
      goldAssist:+goldA.value||0,
      red:+red.value||0
    },
    timestamp:Date.now()
  });

  localStorage.setItem("inklog_promax",JSON.stringify(data));
  render();
}

/* ---------------- delete ---------------- */
function del(i){
  data.splice(i,1);
  localStorage.setItem("inklog_promax",JSON.stringify(data));
  detail.style.display="none";
  render();
}

/* ---------------- detail ---------------- */
function openDetail(i){
  const d=data[i];
  detail.style.display="block";

  detail.innerHTML=`
  <div class="card">
    <h2>${d.stage}</h2>
    <p>${d.result}</p>
    <p>${d.special}</p>

    ${d.weapons.map((w,i)=>`W${i+1}:${w}`).join("<br>")}

    <p>金:${d.totals.gold}</p>
    <p>金A:${d.totals.goldAssist}</p>
    <p>赤:${d.totals.red}</p>

    <button onclick="del(${i})">削除</button>
    <button onclick="detail.style.display='none'">閉じる</button>
  </div>
  `;
}

/* ---------------- analytics ---------------- */
function analyze(list){
  const avg=k=>list.reduce((a,b)=>a+(b.totals?.[k]||0),0)/(list.length||1);

  const sp={};
  const st={};

  list.forEach(d=>{
    if(!sp[d.special])sp[d.special]={t:0,s:0};
    sp[d.special].t++;
    if(d.result.includes("成功"))sp[d.special].s++;

    if(!st[d.stage])st[d.stage]=0;
    st[d.stage]++;
  });

  return {avg,sp,st};
}

/* ---------------- graph ---------------- */
function draw(list){
  const c=document.getElementById("graph");
  const ctx=c.getContext("2d");
  ctx.clearRect(0,0,400,200);

  const vals=list.slice(-10).map(d=>d.totals.gold);
  const max=Math.max(...vals,1);

  vals.forEach((v,i)=>{
    ctx.fillStyle="orange";
    ctx.fillRect(i*30,120-(v/max)*100,20,(v/max)*100);
  });
}

/* ---------------- render ---------------- */
function render(){

  const q=document.getElementById("q")?.value||"";

  const filtered=data.filter(d=>
    d.stage.includes(q)||
    d.special.includes(q)||
    d.weapons.join(",").includes(q)
  );

  document.getElementById("p1").innerHTML=
    filtered.map((d,i)=>`
      <div class="item" onclick="openDetail(${i})">
        ${d.stage} / ${d.result} / ${d.special}
      </div>
    `).join("");

  const a=analyze(filtered);

  document.getElementById("p2").innerHTML=`
  <div class="card">
    <b>平均</b><br>
    金:${a.avg("gold").toFixed(1)}<br>
    金A:${a.avg("goldAssist").toFixed(1)}<br>
    赤:${a.avg("red").toFixed(1)}<br><br>

    <b>スペシャル勝率</b><br>
    ${Object.entries(a.sp).map(([k,v])=>
      `${k}:${(v.s/v.t*100).toFixed(1)}%`
    ).join("<br>")}<br><br>

    <b>ステージ回数</b><br>
    ${Object.entries(a.st).map(([k,v])=>`${k}:${v}`).join("<br>")}

    <canvas id="graph" width="320" height="140"></canvas>
  </div>
  `;

  draw(filtered);
}

render();
