<template>
    <div>
        <div v-if="GlobalState.data" class="classes">
            <router-link v-for="_class in GlobalState.data.classes" :key="_class.id"  :to="{name: 'timetable', params: {type: 'class',id:_class.id}}" >
                <button :style="{'--color': _class.color}" class="item">
                    {{ _class.shortName }}
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
import { DataRoot, getData } from './data/data';
import { GlobalState } from './GlobalState';

export default {
    name:"Main",
    data(){
        return {
            GlobalState
        }
    },
    mounted(){
        
    }
}
</script>

<style scoped lang="scss">
    .classes {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 20px;

        .item {
            width: 80px;
            height: 80px;
            font-size: 18px;
            border: none;
            outline: none;
            /* --color: white;
            background-color: var(--color); */
        }
    }
</style>