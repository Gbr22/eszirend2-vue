import { reactive, shallowReactive } from "@vue/reactivity";
import { DataRoot, getData } from "./data/data";

export let GlobalState = reactive({
    data:null,
});
window.GlobalState = GlobalState;
getData().then(json=>{
    GlobalState.data = shallowReactive(new DataRoot(json));
})