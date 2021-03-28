<template>
    <div v-if="GlobalState.data" class="viewer">
        <div class="days">
            <div v-for="day in getDays()" :key="day.id" class="day" :style="{width: 1/getDays().length*100+'%'}">
                <div class="dayname">{{ day.name }}</div>
                <div>
                    <div class="lessonsBox slimScroll" v-for="period in GlobalState.data.periods" :key="period.id" :class="{'manyEntries':getEntries(day,period).length >= 3}">
                        <div v-for="entry in getEntries(day,period)" :key="entry.id" class="lesson" :class="{'darkFg':useDarkForeground(getColorForEntry(entry))}" :style="{'--color': getColorForEntry(entry), '--width': 1/getEntries(day,period).length*100+'%'}" >
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
import { useDarkForeground } from '../util';

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
        useDarkForeground,
        getColorForEntry(entry){
            return entry.lesson.groups[0].entireClass == false ? entry.lesson.groups[0].color : "rgb(236, 236, 236)";
        },
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
    .dayname {
        text-align: center;
        font-size: 20px;
    }
    .lessonsBox {
        --space-between: 2px;
        display: flex;
        height: 62px;
        margin-bottom: calc(var(--space-between) * 2);
        overflow-x: hidden;

        &.manyEntries {
            overflow-x: auto;
            .lesson {
                width: 110px;
                flex-shrink: 0;
            }
        }
    }
    .lesson {
        
        --width: 40px;
        width: var(--width);

        --color: red;
        padding: 0 var(--space-between);
        box-sizing: border-box;

        color: rgba(255, 255, 255, 0.90);

        &.darkFg {
            color: rgba(0, 0, 0, 0.90);
        }

        .inner {
            background-color: var(--color);
            padding: 3px 5px;
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

            font-family: inherit;
            color: inherit;
            font-size: 14px;

            &:hover {
                filter: brightness(0.8);
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
        

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .classRoom {
                margin-right: 10px;
            }
        }
    }
</style>