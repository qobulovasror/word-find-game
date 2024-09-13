"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[48],{48:(e,a,n)=>{n.r(a),n.d(a,{default:()=>s});var l=n(60),o=n(900),m=n(376),t=n(496);function s(){const[e,a]=(0,l.useState)("join"),[n,s]=(0,l.useState)({username:"",roomname:"",roomcode:"",questionCount:5,execut_time:10});return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)("div",{className:"conatainer",children:(0,t.jsxs)("div",{className:"row",children:[(0,t.jsx)("div",{className:"col-1 col-md-3 col-lg-4"}),(0,t.jsx)("div",{className:"col-10 col-md-6 col-lg-4 mt-5",children:(0,t.jsxs)("div",{className:"card p-2 px-3",children:[(0,t.jsx)("h2",{className:"text-center mt-1",children:"Welcome Back"}),(0,t.jsxs)("div",{className:"btn-group",role:"group",children:[(0,t.jsx)("input",{type:"radio",className:"btn-check",name:"room_type",id:"create",autoComplete:"off",onChange:e=>a(e.target.id)}),(0,t.jsx)("label",{className:"btn btn-outline-primary",htmlFor:"create",children:"Create new Room"}),(0,t.jsx)("input",{type:"radio",className:"btn-check",name:"room_type",id:"join",autoComplete:"off",defaultChecked:!0,onChange:e=>a(e.target.id)}),(0,t.jsx)("label",{className:"btn btn-outline-primary",htmlFor:"join",children:"Join existing room"})]}),(0,t.jsxs)("div",{className:"mb-3 mt-2",children:[(0,t.jsxs)("label",{htmlFor:"exampleInputUsername",className:"form-label",children:["Enter username ",(0,t.jsx)("i",{className:"text-danger",children:"*"})]}),(0,t.jsx)("input",{type:"text",className:"form-control",required:!0,id:"exampleInputUsername",placeholder:"username...",value:n.username,onChange:e=>s({...n,username:e.target.value}),name:"name"})]}),"create"===e?(0,t.jsxs)("div",{className:"mb-3 mt-2",children:[(0,t.jsxs)("label",{htmlFor:"exampleInputRoomName",className:"form-label",children:["Room name ",(0,t.jsx)("i",{className:"text-danger",children:"*"})]}),(0,t.jsx)("input",{type:"text",className:"form-control",required:!0,id:"exampleInputRoomName",placeholder:"room name...",value:n.roomname,onChange:e=>s({...n,roomname:e.target.value}),name:"roomname"})]}):(0,t.jsx)(t.Fragment,{}),(0,t.jsxs)("div",{className:"mb-3 mt-2",children:[(0,t.jsxs)("label",{htmlFor:"exampleInputRoomCode",className:"form-label",children:["Room code ",(0,t.jsx)("i",{className:"text-danger",children:"*"})]}),(0,t.jsx)("input",{type:"text",className:"form-control",required:!0,id:"exampleInputRoomCode",placeholder:"1a2b3c...",value:n.roomcode,onChange:e=>s({...n,roomcode:e.target.value}),name:"roomcode"})]}),"create"===e?(0,t.jsxs)("div",{className:"row",children:[(0,t.jsxs)("div",{className:"col mb-3 mt-2",children:[(0,t.jsxs)("label",{htmlFor:"exampleInputQuestionCount",className:"form-label",children:["Question count ",(0,t.jsx)("i",{className:"text-danger",children:"*"})]}),(0,t.jsx)("input",{type:"number",min:3,max:30,className:"form-control",required:!0,id:"exampleInputQuestionCount",placeholder:"question count (number)...",value:n.questionCount,onChange:e=>s({...n,questionCount:e.target.value}),name:"questionCount"})]}),(0,t.jsxs)("div",{className:"col mb-3 mt-2",children:[(0,t.jsxs)("label",{htmlFor:"exampleInputTymer",className:"form-label",children:["Taymer ",(0,t.jsx)("i",{className:"text-danger",children:"*"})]}),(0,t.jsx)("input",{type:"number",min:5,max:35,className:"form-control",required:!0,id:"exampleInputTymer",placeholder:"test execution time (number)...",value:n.execut_time,onChange:e=>s({...n,execut_time:e.target.value}),name:"roomname"})]})]}):(0,t.jsx)(t.Fragment,{}),(0,t.jsx)("button",{type:"button",className:"btn btn-primary",onClick:async()=>n.username.length<3||n.roomcode.length<5?o.m4.error("Some inputs is invalid"):"create"===e&&n.roomname.length<4?o.m4.error("Room name is invalid"):void("create"===e?(0,m.AL)({...n}):(0,m.KU)({roomcode:n.roomcode,username:n.username})),children:"create"===e?"Create":"Join"})]})}),(0,t.jsx)("div",{className:"col-1 col-md-3 col-lg-4"})]})})})}}}]);
//# sourceMappingURL=48.842fccdc.chunk.js.map