import { createWebHistory, createRouter } from "vue-router";
import Main from './Main.vue';
import TimetableViewer from './components/TimetableViewer.vue';

const history = createWebHistory();

const routes = [
    { path: "/", component: Main },
    {
        path: "/timetable/:type/:id",
        component: TimetableViewer,
        name:"timetable"
    },
];

const router = createRouter({ history, routes });

export default router;
