import axios from '../api/axios';
import { browserHistory } from 'react-router';

const SAVE_COURSE_LIST = 'SAVE_COURSE_LIST',
    SAVE_SECTION_LIST = 'SAVE_SECTION_LIST',
    UPDATE_RECENT_ASSIGNMENTS = 'UPDATE_RECENT_ASSIGNMENTS',
    ADD_TEACHER_INFO = 'ADD_TEACHER_INFO',
    RECEIVE_STUDENT_ASSIGNMENT_LIST = 'RECEIVE_STUDENT_ASSIGNMENT_LIST',
    UPDATE_STUDENT_CATEGORY_DATA = 'UPDATE_STUDENT_CATEGORY_DATA',
    ERROR = 'ERROR';

/************ ASSIGNMENTS *************/
export function getCategoriesForGrading(assignmentId, category){
    return axios.get(`/api/teacher/${assignmentId}/${category}`).then(results => {
        console.log("Back grom getting Category Data");
        return {
            action: UPDATE_STUDENT_CATEGORY_DATA,
            payload: results.data.studentDataForGrading
        };
    }).catch(e => {
        return {
            error: e
        };
    });
}

/************ ASSIGNMENTS *************/
export function getStudentAssignmentList(assignmentId) {
    console.log('ACTIONS: in get student assignment list');

    return axios.get('/api/teacher/students/' + assignmentId).then(results => {
        console.log('will mount', results);
        return {
            type: RECEIVE_STUDENT_ASSIGNMENT_LIST,
            payload: results.data.studentList,
            currAssignmentId: assignmentId
        };
    }).catch(e => {
        this.setState({
            error: e
        });
    });
}
export function saveNewAssignment(assignmentInfo) {
    console.log('ACTIONS: in save assignment', assignmentInfo);
    if(assignmentInfo) {
        return axios.post('/api/teacher/assignment', {assignmentInfo}).then((results) => {
            if(results.data.success) {
                browserHistory.push('/teacher/assignments')
                return {
                    type: UPDATE_RECENT_ASSIGNMENTS,
                    payload: results.data.assignmentId
                };
            }
        }).catch(e => {
            return {
                type: ERROR,
                payload: e
            };
        });
    }
}
/************ SECTIONS *************/
export function saveNewSection(courseId, name, start, end){
    if(name) {
        return axios.post('/api/teacher/section', {courseId, name, start, end}).then(() => {
            return getAllSections();
        });
    } else {
        return {
            type: ERROR,
            payload: "You must give a name for the section"
        };
    }
}
export function getAllSections() {
    return axios.get('/api/teacher/sections').then(results => {
        console.log('ACTIONS getAllSections', results);
        return {
            type: SAVE_SECTION_LIST,
            payload: results.data.sections
        };
    }).catch(e => {
        return {
            type: ERROR,
            payload: e
        };
    });
}

/******** COURSES **************/
export function getCourseList() {
    return axios.get('/api/teacher/courses').then((results) => {
        console.log('Actions: back from getting courses', results);
        return {
            type: SAVE_COURSE_LIST,
            payload: results.data.courses
        };
    });
}

export function saveNewCourse(name, desc) {
    console.log('ACTIONS: saveNewCourse');
    return axios.post('/api/teacher/course', {name, desc}).then((results) => {
        if(results.data.success){
            console.log('success adding new course');
            return getCourseList();
        }
    });

}

export function getTeacherInfo() {
    console.log('ACTIONS: getUserInfo');
    return axios.get('/api/teacher').then(results => {
        if(results.data.success) {
            console.log('got teacher info:', results);
            return {
                type: ADD_TEACHER_INFO,
                payload: results.data.teacherInfo
            }
        }
    })
}
