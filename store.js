const STORAGE_KEY = "sr_v2";

export function load(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function save(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
