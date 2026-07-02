import {load,save} from "./store.js";

let data = load();

/* ---------------- UI切替 ---------------- */
window.go = (i)=>{
  document.querySelectorAll(".page").forEach((p,idx)=>{
    p.classList.toggle("active",idx===i);
  });
  render();
};

/* ---------------- 定義 ---------------- */
const weapons = ["わかば","スシ","ローラー","チャージャー","ブラスター","シェルター"];
const specials = ["トルネード","ナイスダマ","ジェッパ","カニ","サメ","メガホン"];
const stages = ["アラマキ砦","ムニエール","シェケナダム","すじこ","トキシラズ","ブラコ"];

/* ---------------- 入力UI ---------------- */
document.getElementById("p0").innerHTML = `
<div class="card">

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

<h3>WAVEブキ</h3>
${[1,2,3,4,5,6].map(i=>`
<label>WAVE${i}</label>
<select id="w${i}">
${weapons.map(w=>`<option>${w}</option>`).join("")}
</select>
`).join("")}

<h3>スペシャル</h3>
<select id="sp">
${specials.map(s=>`<option>${s}</option>`).join("")}
</select>

<h3>イクラ</h3>
<input id="gold" placeholder="金(個人)">
<input id="goldA" placeholder="金(アシスト)">
<input id="red" placeholder="赤(個人)">

<button onclick="add()">保存</button>

</div>
`;

/* ---------------- 保存 ---------------- */
window.add = ()=>{
  data.push({
    stage:stage.value,
    result:result.value,
    weapons:[w1.value,w2.value,w3.value,w4.value,w5.value,w6.value],
    special:sp.value,
    gold:+gold.value||0,
    goldA:+goldA.value||0,
    red:+red.value||0,
    time:Date.now()
  });

  save(data);
  render();
};

/* ---------------- 詳細 ---------------- */
window.openDetail = (i)=>{
  const d=data[i];

  detail.innerHTML=`
    <div class="card">
      <h2>${d.stage}</h2>
      <p>${d.result}</p>

      <p>${d.weapons.map((w,i)=>`W${i+1}:${w}`).join("<br>")}</p>

      <p>SP:${d.special}</p>
      <p>金:${d.gold}</p>
      <p>金A:${d.goldA}</p>
      <p>赤:${d.red}</p>

      <button onclick="del(${i})">削除</button>
    </div>
  `;
};

/* ---------------- 削除 ---------------- */
window.del = (i)=>{
  data.splice(i,1);
  save(data);
  render();
};

/* ---------------- 描画 ---------------- */
function render(){

  document.getElementById("p1").innerHTML =
    data.map((d,i)=>`
      <div class="item" onclick="openDetail(${i})">
        ${d.stage} / ${d.result}
      </div>
    `).join("");

  const avg = (key)=>data.reduce((a,b)=>a+(b[key]||0),0)/(data.length||1);

  const sp={};
  data.forEach(d=>{
    if(!sp[d.special]) sp[d.special]={t:0,s:0};
    sp[d.special].t++;
    if(d.result.includes("成功")) sp[d.special].s++;
  });

  document.getElementById("p2").innerHTML=`
    <div class="card">
      金平均:${avg("gold").toFixed(1)}<br>
      金A平均:${avg("goldA").toFixed(1)}<br>
      赤平均:${avg("red").toFixed(1)}<br><br>

      <b>SP成功率</b><br>
      ${Object.entries(sp).map(([k,v])=>
        `${k}: ${(v.s/v.t*100).toFixed(1)}%`
      ).join("<br>")}
    </div>
  `;
}

render();
