(window.webpackJsonpboard=window.webpackJsonpboard||[]).push([[0],{102:function(e,t){},111:function(e,t,n){"use strict";n.r(t);var r,a=n(0),c=n.n(a),o=n(47),l=n.n(o),i=(n(64),n(48)),s=n(10),u=n(51);!function(e){e.Wild="Wild",e.Emerald="Emerald",e.Sapphire="Sapphire",e.Ruby="Ruby",e.Diamond="Diamond",e.Onyx="Onyx"}(r||(r={}));var m=Object.freeze(Object.keys(r).filter(function(e){return e!=r.Wild})),d={collectMultipleResources:function(e,t,n){console.log("[collectMultipleResources]")},collectSingleResource:function(e,t,n){console.log("[collectSingleResource]")},reserveDevelopmentCard:function(e,t,n){console.log("[reserveDevelopmentCard]")},purchaseDevelopmentCard:function(e,t,n){console.log("[purchaseDevelopmentCard]")}},p=Object(u.Game)({setup:function(){return{availableCards:Object(s.a)(Array(3).fill(0).map(function(e,t){return t+1}).map(function(e){return{level:e,stock:[],visibleCards:[{id:"".concat(e,"1"),level:e,resourceType:r.Diamond,cost:{tokens:{Onyx:1}}},{id:"".concat(e,"2"),level:e,resourceType:r.Emerald,cost:{tokens:{Ruby:1}}},{id:"".concat(e,"3"),level:e,resourceType:r.Onyx,cost:{tokens:{Sapphire:1}}},{id:"".concat(e,"4"),level:e,resourceType:r.Ruby,cost:{tokens:{Diamond:1}}},{id:"".concat(e,"5"),level:e,resourceType:r.Sapphire,cost:{tokens:{Emerald:1}}}]}})),availableTokens:{Wild:7,Gold:5,Blue:5,Silver:5,Red:5,Black:5},players:[{id:"0",name:"Jess",isHuman:!1,patrons:[],playedCards:[],tokens:{},prestigePoints:0,reservedCards:[],totalResources:{}}]}},moves:d,flow:{movesPerTurn:1,endGameIf:function(e){var t=e.players.filter(function(e){return e.prestigePoints>=15});if(t.length)return{winner:t[0].id}}}}),v=n(125),f=n(129),E=n(126),y=n(123),g=n(112),h=n(127),b=n(128),x=n(124),k=function(e){var t=e.levels,n=e.onDevelopmentCardSelected;return c.a.createElement(y.a,{container:!0,xs:12,spacing:2},t.map(function(e){return c.a.createElement(S,{key:"Level".concat(e.level),row:e,onDevelopmentCardSelected:n})}))},S=function(e){var t=e.row,n=t.level,r=t.stock,a=t.visibleCards,o=e.onDevelopmentCardSelected;return c.a.createElement(y.a,{item:!0,xs:12,spacing:2},c.a.createElement(b.a,{display:"flex",flexDirection:"row"},c.a.createElement(x.a,{className:C({}).card},c.a.createElement("h2",null,"LEVEL ",n),"[STOCK: ",r.length,"]"),a.map(function(e){return c.a.createElement(O,{key:"".concat(n).concat(e.id),card:e,onDevelopmentCardSelected:o})})))},C=Object(v.a)({card:{cursor:"pointer",margin:"0px 10px",width:120,height:150}}),O=function(e){return c.a.createElement(x.a,{className:C(e).card,onClick:function(){return!!e.onDevelopmentCardSelected&&e.onDevelopmentCardSelected(e.card)}},"[",e.card.resourceType,"] (",JSON.stringify(e.card.cost),")")},w={Emerald:"green",Diamond:"silver",Onyx:"black",Ruby:"red",Sapphire:"blue",Wild:"gold"},D=Object(v.a)(function(){return Object(f.a)({token:{backgroundColor:function(e){var t=e.resourceType;return w[t]},border:"1px solid #333",borderRadius:40,width:80,height:80,margin:"10px auto",cursor:"pointer"}})}),R=function(e){var t=e.resourceType,n=e.onResourceSelected,r=D(e);return c.a.createElement("div",{onClick:function(){return n(t)},className:r.token},"[",t,"]")},T=function(e){var t=e.onResourceSelected;return c.a.createElement(b.a,{flex:!0,flexDirection:"column"},c.a.createElement(b.a,null,m.map(function(e){return c.a.createElement(R,{onResourceSelected:t,resourceType:r[e]})})))},j=Object(v.a)(function(e){return Object(f.a)({root:{flexGrow:1,display:"flex",height:"100vh"},paper:{padding:e.spacing(2),textAlign:"center",color:e.palette.text.secondary}})}),N=function(){return c.a.createElement("div",null,"PLAYER INFO]")},P=function(){return c.a.createElement("div",null,"[PATRONS]")},W=function(){return c.a.createElement("div",null,"[INVENTORY]")},G=n(54),A={game:p,board:function(e){var t=e.G,n=e.ctx,a=e.moves,o=a.collectMultipleResources,l=a.collectSingleResource,i=a.purchaseDevelopmentCard,s=a.reserveDevelopmentCard,u=j(e),m=t.availableCards;return c.a.createElement(c.a.Fragment,null,c.a.createElement("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"}),c.a.createElement(E.a,{className:u.root},c.a.createElement(y.a,{container:!0,spacing:3},c.a.createElement(y.a,{item:!0,xs:12},c.a.createElement(g.a,{className:u.paper},c.a.createElement(h.a,{variant:"h1",component:"h2"},"JSS DEMO"))),c.a.createElement(y.a,{container:!0,xs:12,spacing:2},c.a.createElement(y.a,{item:!0,xs:9},c.a.createElement(g.a,{style:{flexGrow:1},className:u.paper},c.a.createElement(y.a,{container:!0},c.a.createElement(y.a,{item:!0,xs:10},c.a.createElement(P,null),c.a.createElement(k,{levels:m,onDevelopmentCardSelected:function(e){return function(e,t){return t&&t.resourceType===r.Diamond}(n.currentPlayer,e)?i(e):s(e)}})),c.a.createElement(y.a,{item:!0,xs:2,justify:"center"},c.a.createElement(T,{onResourceSelected:function(e){t.currentPlayerTokens=t.currentPlayerTokens||[];var n=t.currentPlayerTokens;return n.indexOf(e)>-1?(l(e),void n.splice(0,n.length)):2===n.length?(o(n),void n.splice(0,n.length)):void n.push(e)}}))))),c.a.createElement(y.a,{item:!0,xs:3,justify:"center"},c.a.createElement(g.a,{className:u.paper},c.a.createElement(N,null)))),c.a.createElement(y.a,{item:!0,xs:12},c.a.createElement(g.a,{className:u.paper},c.a.createElement(W,null))))))},ai:Object(G.AI)({enumerate:function(e,t){return[]}})},I=Object(i.Client)(A);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(c.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},59:function(e,t,n){e.exports=n(111)},64:function(e,t,n){}},[[59,1,2]]]);
//# sourceMappingURL=main.89f07ffc.chunk.js.map