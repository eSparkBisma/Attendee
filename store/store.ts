import {hookstate} from '@hookstate/core';

const store = hookstate(
    {
    students: [
        {id: 1, class: 9, name: "aron"},
        {id: 2, class: 9, name: "bella"},
        {id: 3, class: 9, name: "cathy"},
        {id: 4, class: 9, name: "daniel"},
        {id: 5, class: 10, name: "eric"},
        {id: 6, class: 10, name: "fred"},
        {id: 7, class: 10, name: "gray"},
        {id: 8, class: 10, name: "harry"},
    ],
    staff:[
        {staffId: 1, name: "ross", username:"ross123" ,password: "1111", headOf: 9},
        {staffId: 2, name: "rachel",username: "rachel123", password: "2222", headOf: 10},
        {staffId: 3, name: "joey", username: "joey123" ,password: "3333"},
        {staffId: 4, name: "monica", username:"monica123",password: "4444"},
        {staffId: 5, name: "phoebe", username:"phoebe123",password: "5555"},
        {staffId: 6, name: "chandler",username:"chandler123",password: "6666"},
        {staffId: 7, name: "gunther",username:"gunther123",password: "7777", admin: true}
    ],
    attendance: [],

    attendanceStudents: [],
})

export default store;
