function save(){
  localStorage.setItem("sr",JSON.stringify(data));
}

function tab(i){
  document.querySelectorAll(".page").forEach((p,idx)=>{
    p.classList.toggle("active",idx===i);
  });
  render();
}

/* --- 入力UI --- */
document.getElementById("p0").innerHTML = `
<div class="card">

<h3>結果</h3>
<select id="result">
<option>成功</option>
<option>成功（オカシラ成功）</option>
<option>成功（オカシラ失敗）</option>
<option>失敗（wave1）</option>
<option>失敗（wave2）</option>
<option>失敗（wave3）</option>
<option>失敗（wave4）</option>
<option>失敗（wave5）</option>
</select>

<h3>ブキ（6）</h3>
${[1,2,3,4,5,6].map(i=>`
<select id="w${i}">
${weapons.map(w=>`<option>${w}</option>`).join("")}
</select>
`).join("")}

<h3>スペシャル</h3>
<select id="sp">
${specials.map(s=>`<option>${s}</option>`).join("")}
</select>

<h3>イクラ</h3>
<input id="gm" placeholder="金(個人)">
<input id="ga" placeholder="金(アシスト)">
<input id="rm" placeholder="赤(個人)">

<button onclick="add()">保存</button>

</div>
`;

function add(){

  let ws=[1,2,3,4,5,6].map(i=>document.getElementById("w"+i).value);

  data.push({
    result:result.value,
    weapons:ws,
    special:sp.value,
    goldMe:+gm.value||0,
    goldAssist:+ga.value||0,
    redMe:+rm.value||0
  });

  save();
  render();
}

/* --- 詳細 --- */
function openDetail(i){
  let d=data[i];

  detail.style.display="block";

  detail.innerHTML=`
    <button onclick="detail.style.display='none'">← 戻る</button>

    <h2>${d.result}</h2>

    <p>ブキ：${d.weapons.join(", ")}</p>
    <p>スペシャル：${d.special}</p>
    <p>金(個人)：${d.goldMe}</p>
    <p>金(アシスト)：${d.goldAssist}</p>
    <p>赤：${d.redMe}</p>

    <button onclick="del(${i})">🗑 削除</button>
  `;
}

function del(i){
  if(confirm("削除する？")){
    data.splice(i,1);
    save();
    detail.style.display="none";
    render();
  }
}

/* --- 戦績 --- */
function render(){

  document.getElementById("p1").innerHTML =
    data.map((d,i)=>`
      <div class="item" onclick="openDetail(${i})">
        ${d.result}<br>
        ${d.special}
      </div>
    `).join("")

  || "なし";

  /* --- 分析 --- */
  let gm=data.reduce((a,b)=>a+b.goldMe,0)/(data.length||1);
  let ga=data.reduce((a,b)=>a+b.goldAssist,0)/(data.length||1);
  let rm=data.reduce((a,b)=>a+b.redMe,0)/(data.length||1);

  let sp={};
  data.forEach(d=>{
    if(!sp[d.special])sp[d.special]={s:0,t:0};
    sp[d.special].t++;
    if(d.result.includes("成功"))sp[d.special].s++;
  });

  document.getElementById("p2").innerHTML=`
    <div class="card">
      平均金(個人)：${gm.toFixed(1)}<br>
      平均金(アシスト)：${ga.toFixed(1)}<br>
      平均赤(個人)：${rm.toFixed(1)}<br><br>

      <b>スペシャル成功率</b><br>
      ${Object.keys(sp).map(k=>{
        return `${k}: ${(sp[k].s/sp[k].t*100).toFixed(1)}%`;
      }).join("<br>")}
    </div>
  `;
}

render();
