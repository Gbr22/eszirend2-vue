export function getList(data, id){
    return data.r.dbiAccessorRes.tables.find(e=>e.id == id);
}
export function getListItem(data,list,id){
    return getList(data,list).data_rows.find(e=>e.id == id);
}
export class Subject {

    data;
    json;

    name;
    shortName;
    color;
    id;

    constructor(data,json){
        this.data = data;
        this.json = json;

        this.name = json.name;
        this.shortName = json.short;
        this.id = json.id;
        this.color = json.color;
    }
}
export class Lesson {

    data;
    json;

    classIds;
    id;
    teacherIds;
    teachers;
    durationPeriods = 1;

    constructor(data,json){
        this.data = data;
        this.json = json;

        this.classIds = this.json.classids;
        this.id = this.json.id;
        this.teacherIds = json.teacherids;
        this.teachers = this.teacherIds.map(e=>new Teacher(data,getListItem(data.json,"teachers",e)));
        this.durationPeriods = json.durationperiods;
    }


    get subject(){
        return new Subject(this.data,getListItem(this.data.json,"subjects",this.json.subjectid));
    }
    get color(){
        return this.groups[0].color;
    }
    get groups(){
        return this.json.groupids.map(e=>{
            return new Group(this.data,getListItem(this.data.json,"groups",e));
        })
    }
}
export class Entry {

    data;
    json;

    lesson;
    period;

    classrooms = [];

    get periods(){
        let arr = [];
        for (let i = 0; i < this.lesson.durationPeriods; i++) {
            arr.push((parseInt(this.period)+i).toString());
        }   
        return arr;
    }

    constructor(data,json){
        this.data = data;
        this.json = json;
        this.days = json.days;

        let el = getListItem(this.data.json,"lessons",this.json.lessonid);
        /* console.log("el",el); */

        this.lesson = new Lesson(this.data,el);
        this.period = json.period;
        this.classrooms = json.classroomids.map(e=>new Classroom(this.data,getListItem(this.data.json,"classrooms",e)))
    }
}
export class Classroom {

    data;
    json;

    id;
    name;
    shortName;

    constructor(data,json){
        this.data = data;
        this.json = json;

        this.id = json.id;
        this.name = json.name;
        this.shortName = json.short;
    }
}

function generateTimetable(data,classId = "-40"){

    let cards = getList(data,"cards").data_rows.map(e=>new Entry(data,e));
    
    cards = cards.filter(e=>e.lesson.json.classids.includes(classId));
    
    let days = {};
    cards.forEach(e=>{
        if (!days[e.day.id]){
            days[e.day.id] = {
                info:e.day,
                lessons:[],
            };
        }
        days[e.day.id].lessons.push(e);
    })
}
export class Day {

    data;
    json;
    
    vals;

    matches(v){
        return this.vals.includes(v);
    }

    constructor(data,json){
        this.data = data;
        this.json = json;
        this.vals = json.vals;
        this.val = json.val;
        this.shortName = json.shortName;
        this.name = json.name;
        this.id = json.id;
    }
}
export class Class {

    data;
    json;
    
    id;
    name;
    shortName;
    color;

    constructor(data,json){
        this.data = data;
        this.json = json;

        this.id = json.id;
        this.name = json.name;
        this.shortName = json.short;
        this.color = json.color;
    }
}
export class Teacher {

    data;
    json;
    name;
    id;

    constructor(data,json){
        this.data = data;
        this.json = json;

        this.name = json.short;
        this.id = json.id;
    }
}
export class Group {

    data;
    json;

    color;
    entireClass;
    name;
    divisionId;
    id;

    constructor(data,json){
        this.data = data;
        this.json = json;
        this.color = json.color;
        this.entireClass = json.entireclass;
        this.name = json.name;
        this.divisionId = json.divisionid;
        this.id = json.id;
    }
}
export class DataRoot {
    periods;

    json;

    classes = [];
    days = [];


    constructor(json){
        this.json = json;
        let periods = getList(this.json,"periods").data_rows.map(e=>{
            return {
                name:e.name,
                startTime:e.starttime,
                endTime:e.endtime,
                id:e.id,
                period:e.period,
            }
        });
        this.periods = periods;

        this.classes = getList(this.json,"classes").data_rows.map(e=>new Class(this,e));
        this.days = getList(this.json,"daysdefs").data_rows.map(e=>new Day(this,e));
        this.entries = getList(this.json,"cards").data_rows.map(e=>new Entry(this,e));
    }
}

export function getData(){
    return fetch("/api/data").then(r=>r.json());
}