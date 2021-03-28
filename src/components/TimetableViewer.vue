<template>
    <div v-if="GlobalState.data" class="viewer">
        <div class="content">
            <div class="days" ref="days" @scroll="scrollDays()">
                <div v-for="day in days" :key="day.id" class="day" :style="{width: 1/days.length*100+'%'}">
                    <div class="dayname">{{ day.name }}</div>
                    <div>
                        <div class="lessonsBox slimScroll" v-for="period in GlobalState.data.periods" :key="period.id" :class="{'manyEntries':getEntries(day,period).length >= 4}">
                            <div v-for="entry in getEntries(day,period)" :key="entry.id" class="lesson" :class="{'darkFg':useDarkForeground(getColorForEntry(entry))}" :style="{'--color': getColorForEntry(entry), '--width': 1/getEntries(day,period).length*100+'%'}" >
                                <button class="inner" @click="openEntry(entry)">
                                    <div class="top">
                                        <div class="classRoom">{{ entry.classrooms.map(e=>e.shortName).join(", ") }}</div>    
                                        <div v-if="entry.lesson.groups[0].entireClass == false">{{ [...new Set(entry.lesson.groups.map(e=>shortenGroupName(e.name)))].join(", ") }}</div>
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
        <div class="daySelector">
            <button v-for="(day, index) in days" :key="day.id" class="item" @click="goToDay(index)" :ref="'day-'+index" :class="{active: index == 0}">
                {{ day.shortName }}
            </button>
        </div>
    </div>
</template>

<script>
import { GlobalState } from '../GlobalState'
import { Entry } from '../data/data';
import { useDarkForeground } from '../util';
import { shallowReactive } from '@vue/reactivity';

export default {
    name:"TimetableViewer",
    data(){
        return {
            GlobalState,
            currentClass:this.$route?.params?.id,
            console,
            Entry,
            currentDay:0,
        }
    },
    mounted(){
        
    },
    computed:{
        days(){
            return shallowReactive(GlobalState.data.days.filter(e=>e.val != null));
        }
    },
    methods: {
        scrollDays(){
            let el = this.$refs.days;
            this.currentDay = Math.round(el.scrollLeft / el.scrollWidth * this.days.length);
            for (let i = 0; i < this.days.length; i++) {
                if (i != this.currentDay){
                    this.$refs["day-"+i].classList.remove("active");
                }
            }
            this.$refs["day-"+this.currentDay].classList.add("active");
            
            /* :class="{'active':index == currentDay}" */
        },
        goToDay(i){
            let el = this.$refs.days;
            
            el.scrollTo(el.offsetWidth * i,0);
        },
        useDarkForeground,
        getColorForEntry(entry){
            let map = {
                "Csoport1":"#1a8cff",
                "Csoport2":"#ff6666",
                "Környezetvédelem":"#00ff99",
                "Informatika":"#0099ff",
                "Közgazdaság":"#F7AD94",
                "Ügyvitel":"#a1e3a1",
                "Pénzügy":"#7FDBFF",
                "Mechatronika":"#94b8b8",
            }
            let groupName = entry.lesson.groups[0].name;

            if (entry.lesson.groups[0].entireClass){
                return "rgb(236, 236, 236)";
            } else if (map[groupName]) {
                return map[groupName];
            } else {
                return entry.lesson.groups[0].color;
            }
            
        },
        openEntry(entry){
            console.log(entry);
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
            
            let entries = GlobalState.data.entries.filter(
                e=>e.lesson.classIds.includes(this.currentClass) &&
                day.matches(e.days) &&
                e.periods.includes(period.period)
            );
            entries.sort((a,b)=>{
                a = a.lesson.groups[0].id;
                b = b.lesson.groups[0].id;
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });

            return entries;
        },
        getDays(){
            return this.days;
        }  
    },
}
</script>

<style scoped lang="scss">
    .viewer {
        height: 100%;
        display: flex;
        flex-direction: column;
        .content {
            flex: 1;
            overflow-y: auto;
        }
        overflow: hidden;
    }

    .daySelector {
        display: none;
        flex-direction: row;
        background-color: rgb(236, 236, 236);
        box-shadow: 0 .5rem 2rem rgba(0,0,0,.3);
        justify-content: space-around;

        .item {
            
            text-align: center;
            border: none;
            font-family: inherit;
            outline: none;
            font-size: 14px;
            padding: 12px 0;
            font-weight: bold;
            color: rgb(107, 107, 107);
            border: 3px solid transparent;
            width: 40px;
            background: none;

            &.active {
                color: #0066ff;
                border-top-color: #0066ff;
            }
        }
    }
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
        padding: 15px 0;
        box-sizing: border-box;
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
    @media screen and (max-width: 1000px) {
        .days {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            
        }
        .daySelector {
            display: flex !important;
        }
        .dayname {
            display: none;
        }
        .day {
            padding: 0 2px;
            padding-top: 5px;
            flex-shrink: 0;
            width: 100% !important;
            scroll-snap-align: center;
        }
    }
</style>