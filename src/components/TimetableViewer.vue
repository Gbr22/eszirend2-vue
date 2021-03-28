<template>
    <div v-if="GlobalState.data" class="viewer">
        <div class="days">
            <div v-for="day in getDays()" :key="day.id" class="day" :style="{width: 1/getDays().length*100+'%'}">
                {{ day.name }}
                <div>
                    <div class="lessonsBox" v-for="period in GlobalState.data.periods" :key="period.id">
                        <div v-for="entry in getEntries(day,period)" :key="entry.id" class="lesson" :style="{'--color': entry.lesson.groups[0].entireClass == false ? entry.lesson.groups[0].color : null, '--width': 1/getEntries(day,period).length*100+'%'}" >
                            <button class="inner">
                                <div class="top">
                                    <div class="classRoom">{{ entry.classrooms.map(e=>e.shortName).join(", ") }}</div>    
                                    <div v-if="entry.lesson.groups[0].entireClass == false">{{ entry.lesson.groups.map(e=>shortenGroupName(e.name)).join(", ") }}</div>
                                </div>
                                <div class="subject">{{ entry.lesson.subject.name }}</div>
                                <div class="teacher">{{ entry.lesson.teachers.map(e=>e.name).join(", ") }}</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { GlobalState } from '../GlobalState'
import { Entry } from '../data/data';
export default {
    name:"TimetableViewer",
    data(){
        return {
            GlobalState,
            currentClass:this.$route?.params?.id,
            console,
            Entry
        }
    },
    mounted(){
        
    },
    methods: {
        shortenGroupName(name){
            let obj = {
                "Angol":"Ang",
                "Német":"Ném",
                "Környezetvédelem":"♻️",
                "Informatika":"🖱️",
                "Mechatronika":"🛠️",
                "Ügyvitel":"Ügyv",
                "Közgazdaság":"Közg",
            };
            for (let p in obj){
                name = name.replace(p,obj[p]);
            }
            return name;
        },
        getEntries(day,period){
            let entries = GlobalState.data.entries.filter(e=>e.lesson.classIds.includes(this.currentClass) && day.matches(e.days) && e.period == period.id);
            return entries;
        },
        getDays(){
            return GlobalState.data.days.filter(e=>e.val != null);
        }  
    },
}
</script>

<style scoped lang="scss">
    .days {
        display: flex;
    }
    .day {
        min-width: 150px;
        box-sizing: border-box;
        overflow-x: hidden;
    }
    .lessonsBox {
        --space-between: 2px;
        display: flex;
        height: 60px;
        margin-bottom: calc(var(--space-between) * 2);
        overflow-x: hidden;
    }
    .lesson {
        
        --width: 40px;
        width: var(--width);

        --color: rgb(236, 236, 236);
        padding: 0 var(--space-between);
        box-sizing: border-box;
        .inner {
            background-color: var(--color);
            padding: 3px;
            box-sizing: border-box;
            
            border-radius: 5px;
            height: 100%;
            border: none;
            display: block;
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            outline: none;

            transition: filter 0.2s ease;

            &:hover {
                filter: brightness(0.9);
            }
            > div {
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        .teacher {
            text-align: right;
        }

        .subject {
            text-align: center;
        }
        
        
        overflow: hidden;
        font-size: 15px;

        .top {
            display: flex;
            justify-content: space-between;

            .classRoom {
                margin-right: 10px;
            }
        }
    }
</style>