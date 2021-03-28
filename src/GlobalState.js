import { reactive, ref } from "@vue/reactivity";
import { DataRoot, getData } from "./data/data";

export let GlobalState = reactive({
    data:null,
});
window.GlobalState = GlobalState;
getData().then(json=>{
    GlobalState.data = new DataRoot(json);
})