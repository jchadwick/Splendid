(window.webpackJsonpboard=window.webpackJsonpboard||[]).push([[0],{119:function(e,t){},125:function(e,t,r){},130:function(e,t,r){"use strict";r.r(t);var n,a=r(0),i=r.n(a),o=r(9),l=r.n(o),c=(r(81),r(63)),u=r(6),s=r(66),d=r(11),f=r(8),m=r(16),p=r(17),v=r(19);!function(e){e.Wild="Wild",e.Emerald="Emerald",e.Sapphire="Sapphire",e.Ruby="Ruby",e.Diamond="Diamond",e.Onyx="Onyx"}(n||(n={}));Object.freeze(Object.keys(n).filter(function(e){return"string"===typeof e}).map(function(e){return n[e]}));var y=Object.freeze(Object.keys(n).filter(function(e){return e!==n.Wild})),b=function(){function e(t){Object(d.a)(this,e),this.action=t}return Object(f.a)(e,[{key:"hash",value:function(){return JSON.stringify({name:this.__proto__.constructor.name,action:this.action})}}]),e}(),E=r(31),g="\n1,E,{A} & {B} & {B},0\n1,E,{A} & {A} & {C} & {C},0\n1,E,{C} & {C} & {C},0\n1,E,{A} & {B} & {C} & {D},0\n1,E,{A} & {C} & {C} & {D} & {D},0\n1,E,{A} & {B} & {C} & {D} & {D},0\n1,E,{D} & {D} & {D} & {D},1\n\n2,E,{D} & {D} & {D} & {A} & {A} & {B} & {B}, 1\n2,E,{E} & {E} & {C} & {C} & {C} & {B} & {B} & {B}, 1\n2,E,{B} & {B} & {B} & {B} & {D} & {A} & {A}, 2\n2,E,{B} & {B} & {B} & {B} & {B}, 2\n2,E,{B} & {B} & {B} & {B} & {B} & {A} & {A} & {A}, 2\n2,E,{E} & {E} & {E} & {E} & {E} & {E}, 3\n\n3,E,{C} & {C} & {C} & {D} & {D} & {D} & {A} & {A} & {A} & {B} & {B} & {B} & {B} & {B},3\n3,E,{A} & {A} & {A} & {A} & {A} & {A} & {A},4\n3,E,{A} & {A} & {A} & {A} & {A} & {A} & {E} & {E} & {E} & {B} & {B} & {B},4\n3,E,{A} & {A} & {A} & {A} & {A} & {A} & {A} & {E} & {E} & {E},5".split(/\n/).filter(function(e){return e&&e.length}).map(function(e){return e.split(",")}).map(function(e){var t=Object(E.a)(e,4);return{level:t[0],resourceType:t[1],cost:t[2],prestigePoints:t[3]}}),h=function(e,t){var r=t.reduce(function(e,t,r){return e[t]=y[r],e},{});return e.map(function(e){var n=e.cost,a=e.level,i=e.prestigePoints,o=e.resourceType;return{cost:k(n,t,r),level:a,prestigePoints:i,resourceType:r[o]}})},k=function(e,t,r){return t.reduce(function(e,t){return e.replace(new RegExp("{".concat(t,"}"),"g"),r[t])},e)},C=function(e){return e.filter(O).map(A)},O=function(e){return e&&!!e.cost&&j(e.level,1,3)&&P(e.resourceType)&&j(e.prestigePoints,0,10)},P=function(e){return Object.keys(n).indexOf(e)>-1},j=function(e,t,r){return n=Number(e),!Number.isNaN(n)&&n>=t&&n<=r;var n},A=function(e,t){var r=e.cost,a=e.level,i=e.prestigePoints,o=e.resourceType;return{id:"".concat(t,"_L").concat(a,"_").concat(o),level:Number(a),resourceType:n[o],cost:w(r),prestigePoints:Number(i)}},w=function(e){return(e||"").split("&").map(function(e){return e.trim()}).reduce(function(e,t){var r=t.endsWith("Card"),n=r?t.substr(0,t.length-"Card".length):t,a=e[r?"cards":"tokens"];return a[n]=(a[n]||0)+1,e},{cards:{},tokens:{}})},x=function(e){e.forEach(function(e){for(var t=0;t<e.visibleCards.length;t++)null==e.visibleCards[t]&&0!==e.stock.length&&(e.visibleCards[t]=e.stock.pop())})},D=function(e){for(var t,r,n=e.length;0!==n;)r=Math.floor(Math.random()*n),t=e[n-=1],e[n]=e[r],e[r]=t;return e},T=function(){return Object.keys(n).reduce(function(e,t){return e[t]=0,e},{})},B=function(e,t){var r=t&&t.cards||{},a=t&&t.tokens||{},i=e&&e.cards||{},o=e&&e.tokens||{},l=a[n.Wild]||0,c={cards:T(),tokens:T()},u=!0,s=!1,d=void 0;try{for(var f,m=y[Symbol.iterator]();!(u=(f=m.next()).done);u=!0){var p=f.value,v=r[p]||0,b=a[p]||0,E=i[p]||0,g=o[p]||0;if(E+g!==0){var h=g;h-=Math.min(h,v);var k=Math.min(h,b);h-=k;var C=Math.min(h,l);(h-=C)>0?c.tokens[p]=-h:(c.tokens[p]=(c.tokens[p]||0)+k,c.tokens[n.Wild]=(c.tokens[n.Wild]||0)+C,l-=C);var O=Math.max(0,E-v);c.cards[p]=(c.cards[p]||0)-O}}}catch(P){s=!0,d=P}finally{try{u||null==m.return||m.return()}finally{if(s)throw d}}return c},S=function(e,t){var r=t?B(e,t):e,n=N(r.cards),a=N(r.tokens);return!(n||a)},N=function(e){return null!=e&&Object.keys(e).some(function(t){return e[t]<0})},I=function(e,t){return Object.keys(t).reduce(function(e,r){return null!=e[r]?e[r]=e[r]+t[r]:e[r]=t[r],e},Object.assign({},e||{}))},M=function(e){var t=e.playedCards;return{tokens:e.tokens,cards:R(t)}},R=function(e){return e.reduce(function(e,t){return e[t.resourceType]=(e[t.resourceType]||0)+1,e},{})},W=function(e){var t=G(e.players,e.currentPlayerId);if(null==t)throw new Error("Couldn't find current player");return t},G=function(e,t){return null==e?null:e.find(function(e){return e.id===t})},z=function(e,t){var r=W(e),n=!0,a=!1,i=void 0;try{for(var o,l=e.availableCards[Symbol.iterator]();!(n=(o=l.next()).done);n=!0){var c=o.value,u=function(e){return e&&e.id===t.id},s=u(c.stock[c.stock.length-1]),d=c.visibleCards.findIndex(u),f=d>-1;if(s)return c.stock.pop(),void r.reservedCards.push(t);if(f)return c.visibleCards[d]=null,void r.reservedCards.push(t)}}catch(m){a=!0,i=m}finally{try{n||null==l.return||l.return()}finally{if(a)throw i}}throw new Error("Couldn't find card ".concat(JSON.stringify(t)," in top card of stock piles or visible cards"))},_=function(e){function t(){return Object(d.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(f.a)(t,[{key:"execute",value:function(e){var t=!0,r=!1,n=void 0;try{for(var a,i=this.action.resources[Symbol.iterator]();!(t=(a=i.next()).done);t=!0){var o=a.value;e.availableTokens[o]=(e.availableTokens[o]||0)-1,W(e).tokens[o]=(W(e).tokens[o]||0)+1}}catch(l){r=!0,n=l}finally{try{t||null==i.return||i.return()}finally{if(r)throw n}}return e}}]),t}(b);_.getAvailableMoves=function(e){var t=y.filter(function(t){return e.availableTokens[t]>0}).map(function(e){return n[e]});if(t.length<3)return[];var r=[],a=!0,i=!1,o=void 0;try{for(var l,c=function(){var e=l.value,n=!0,a=!1,i=void 0;try{for(var o,c=function(){var n=o.value,a=!0,i=!1,l=void 0;try{for(var c,u=t.filter(function(t){return t!==e&&t!==n})[Symbol.iterator]();!(a=(c=u.next()).done);a=!0){var s=c.value;r.push([e,n,s])}}catch(d){i=!0,l=d}finally{try{a||null==u.return||u.return()}finally{if(i)throw l}}},u=t.filter(function(t){return t!==e})[Symbol.iterator]();!(n=(o=u.next()).done);n=!0)c()}catch(s){a=!0,i=s}finally{try{n||null==u.return||u.return()}finally{if(a)throw i}}},u=t[Symbol.iterator]();!(a=(l=u.next()).done);a=!0)c()}catch(s){i=!0,o=s}finally{try{a||null==u.return||u.return()}finally{if(i)throw o}}return r.map(function(e){return{move:"collectMultipleResources",args:[e]}})};var F=function(e){function t(){return Object(d.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(f.a)(t,[{key:"execute",value:function(e){e.availableTokens[this.action.resource]=(e.availableTokens[this.action.resource]||0)-2;var t=W(e);return t.tokens[this.action.resource]=(t.tokens[this.action.resource]||0)+2,e}}]),t}(b);F.getAvailableMoves=function(e){return y.filter(function(t){return e.availableTokens[t]>=2}).map(function(e){return n[e]}).map(function(e){return{move:"collectSingleResource",args:[e]}})};var U=function(e){function t(){return Object(d.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(f.a)(t,[{key:"execute",value:function(e){var r=this.action.card;if(null==r)throw new Error("Can't purchase an empty card!");var n=W(e),a=B(r.cost,M(n));if(!S(a))throw new Error(t.INSUFFICIENT_FUNDS);var i,o,l=e.availableCards.some(function(e){return e.visibleCards.some(function(e){return e&&e.id===r.id})}),c=n.reservedCards.find(function(e){return e.id===r.id});if(!c&&!l)throw new Error(t.UNAVAILABLE_CARD);return n.tokens=(i=a.tokens,o=n.tokens,Object.keys(i).reduce(function(e,t){return null!=e[t]?e[t]=e[t]-i[t]:e[t]=-i[t],e},Object.assign({},o||{}))),e.availableTokens=I(e.availableTokens,a.tokens),l&&(z(e,r),c=r),n.reservedCards.splice(n.reservedCards.indexOf(c),1),n.playedCards.push(r),n.prestigePoints=(n.prestigePoints||0)+r.prestigePoints,e}}]),t}(b);U.INSUFFICIENT_FUNDS="Player has insufficient funds to purchase this card",U.UNAVAILABLE_CARD="Card is not available to play",U.getAvailableMoves=function(e){var t=e.availableCards.flatMap(function(e){return e.visibleCards}),r=W(e).reservedCards,n=[].concat(Object(u.a)(t),Object(u.a)(r)).filter(function(e){return null!=e}),a=W(e),i={tokens:a.tokens,cards:R(a.playedCards)};return n.filter(function(e){return S(e.cost,i)}).map(function(e){return{move:"purchaseDevelopmentCard",args:[e]}})};var V=function(e){function t(){return Object(d.a)(this,t),Object(m.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(v.a)(t,e),Object(f.a)(t,[{key:"execute",value:function(e){var t=this.action.card;if(null==t)throw new Error("Can't reserve an empty card!");var r=W(e);return e.availableTokens.Wild>0&&(r.tokens.Wild=(r.tokens.Wild||0)+1,e.availableTokens.Wild=(e.availableTokens.Wild||0)-1),z(e,t),e}}]),t}(b);V.getAvailableMoves=function(e){return W(e).reservedCards.length>=4?[]:e.availableCards.flatMap(function(e){return e.visibleCards}).filter(function(e){return null!=e}).map(function(e){return{move:"reserveDevelopmentCard",args:[e]}})};var L=function(e,t,r,n){try{return new r(n).execute(e)}catch(a){return console.error(a),e}},J={triggerWin:function(e){return W(e).prestigePoints=15,e},collectMultipleResources:function(e,t,r){return L(e,0,_,{resources:r})},collectSingleResource:function(e,t,r){return L(e,0,F,{resource:r})},purchaseDevelopmentCard:function(e,t,r){return L(e,0,U,{card:r})},reserveDevelopmentCard:function(e,t,r){return L(e,0,V,{card:r})}},H=Object(s.Game)({setup:function(e){var t=function(){var e=[["A","B","C","D","E"],["B","C","D","E","A"],["C","D","E","A","B"],["D","E","A","B","C"],["E","A","B","C","D"]].flatMap(function(e){return h(g,e)});return C(e)}();D(t);var r=[{level:3,stock:t.filter(function(e){return 3===e.level}),visibleCards:Array(4).fill(null)},{level:2,stock:t.filter(function(e){return 2===e.level}),visibleCards:Array(4).fill(null)},{level:1,stock:t.filter(function(e){return 1===e.level}),visibleCards:Array(4).fill(null)}];x(r);return{availableCards:r,availableTokens:{Wild:7,Emerald:5,Onyx:5,Ruby:5,Sapphire:5,Diamond:5},players:Array(e.numPlayers).fill(0).map(function(e,t){return{id:String(t),name:"Player ".concat(t+1),isHuman:!1,patrons:[],playedCards:[],tokens:{},prestigePoints:0,reservedCards:[],totalResources:{}}})}},moves:J,flow:{movesPerTurn:1,onTurnBegin:function(e,t){e.currentPlayerId=t.currentPlayer},onTurnEnd:function(e,t){x(e.availableCards)},endGameIf:function(e){var t=e.players.filter(function(e){return e.prestigePoints>=15});if(t.length){var r=Object(u.a)(e.players).sort(function(e,t){return t.prestigePoints-e.prestigePoints});return{winner:t[0],rankings:r}}}}}),Y=r(151),$=r(159),q=(r(125),r(156)),K=r(157),Q=r(153),X=r(154),Z=r(131),ee=r(155),te=r(158),re=r(150),ne=Object(re.a)(q.a)({display:"flex",flexDirection:"column"}),ae=Object(re.a)(q.a)({display:"flex",flexDirection:"row"}),ie=Object(re.a)("div")({position:"absolute",top:0,left:0,width:"100vw",height:function(e){var t=e.isActive;return"".concat(t?100:0,"vh")},zIndex:1e3}),oe=Object(Y.a)(function(){return Object($.a)({container:{color:"#000",backgroundColor:"#fff",fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",fontSize:"calc(100vw/75)",height:"100vh",display:"grid",gridColumnGap:5,gridRowGap:5,gridTemplateColumns:"auto 6% 25%",gridTemplateRows:"10% auto 30%",gridTemplateAreas:'\n        "board      tokens    player-list"\n        "board      tokens    player-list"\n        "inventory  inventory player-list"'},tokens:{gridArea:"tokens",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-around","& [itemProp='token']":{display:"flex",flexDirection:"column",fontSize:"3rem"},"& [itemProp='token'] [itemProp='resource']":{},"& [itemProp='token'] [itemProp='count']":{position:"absolute",padding:".4em",fontSize:"60%",fontWeight:900},"& [itemprop='resource'][data-value='Onyx'] + [itemProp='count']":{color:"#fff"}},board:{gridArea:"board",padding:"0 1rem 0.5rem",display:"flex",flexDirection:"column",justifyContent:"space-evenly"},playerList:{display:"flex",flexDirection:"column",alignContent:"center",gridArea:"player-list",backgroundColor:"#fff",padding:"0.4em"},inventory:{gridArea:"inventory",display:"flex"}})}),le=function(e){var t=e.G,r=e.G,o=r.availableCards,l=r.availableTokens,c=r.currentPlayerId,s=r.players,d=e.ctx.gameover,f=e.playerID,m=e.moves,p=e.step,v=oe({}),y=f||s[0].id,b=Object(a.useState)([]),g=Object(E.a)(b,2),h=g[0],k=g[1],C=W(t),O=G(s,y),P=s.filter(function(e){return e.id!==y}),j=y===c;Object(a.useEffect)(function(){c!==y&&p()},[p,c,y]);var A=Object(a.useCallback)(function(e){if(e!==n.Wild){var t=h;h.indexOf(e)>-1?1===h.length?(m.collectSingleResource(e),t=[]):console.debug("Ignoring invalid duplicate selection of ".concat(e)):t=[].concat(Object(u.a)(h),[e]),3===t.length&&(m.collectMultipleResources(t),t=[]),k(t)}else console.debug("Ignoring invalid selection of a wild token")},[m,h]),w=function(e){var t=M(C);S(e.cost,t)?m.purchaseDevelopmentCard(e):m.reserveDevelopmentCard(e)};return i.a.createElement(i.a.Fragment,null,d&&i.a.createElement(ce,{onClose:function(){return window.location.reload()},results:d,userPlayer:O}),i.a.createElement(ie,{isActive:!j}),i.a.createElement("div",{id:"container",className:v.container},i.a.createElement("div",{id:"tokens",className:v.tokens},Object.keys(l).map(function(e){return i.a.createElement("div",{key:e,itemProp:"token",onClick:function(){return A(e)}},i.a.createElement("div",{itemProp:"resource","data-value":e}),i.a.createElement("div",{itemProp:"count","data-value":l[e]}))})),i.a.createElement("div",{id:"board",className:v.board},o.map(function(e,t){return i.a.createElement("div",{key:String(t),className:"cardRow"},i.a.createElement("div",{className:"stock card valid-action",onClick:function(){return!!e.stock.length&&w(e.stock[e.stock.length-1])}},i.a.createElement("span",null,e.stock.length)),Array(4).fill(0).map(function(t,r){return e.visibleCards[r]||{id:null}}).map(function(t,r){return i.a.createElement(ue,{key:t.id||"".concat(e.level).concat(r),card:t,onSelected:w})}))})),i.a.createElement("div",{id:"player-list",className:v.playerList},P.map(function(e){return i.a.createElement(se,{key:e.id,isCurrentPlayer:e===C,player:e})})),i.a.createElement("div",{id:"inventory",className:v.inventory},O&&i.a.createElement(me,{isCurrentPlayer:O.id===c,player:O,onPlayReservedCard:function(e){return m.purchaseDevelopmentCard(e)}}))))},ce=function(e){var t=e.results,r=e.onClose,n=e.userPlayer;return i.a.createElement(K.a,{open:!0,onClose:r,"aria-labelledby":"customized-dialog-title"},i.a.createElement(Q.a,null,"GAME OVER"),i.a.createElement(X.a,{dividers:!0},i.a.createElement(Z.a,{gutterBottom:!0},t.winner===n?i.a.createElement(Z.a,null,"YOU WIN!"):i.a.createElement(Z.a,null,"You lose - get off my property"))),i.a.createElement(ee.a,null,i.a.createElement(te.a,{onClick:r,color:"primary"},"New Game")))},ue=function(e){var t=e.card,r=e.onSelected,n=e.canSelect;return i.a.createElement("div",{className:"card ".concat(t.id||n?"valid-action":""),itemProp:"card",onClick:function(){return!(!t.id&&!n)&&r(t)}},i.a.createElement("div",{itemProp:"resource","data-value":t.resourceType}),t&&t.prestigePoints>0&&i.a.createElement("div",{itemProp:"prestigePoints","data-value":t.prestigePoints}),i.a.createElement("div",{itemProp:"cost"},t&&t.cost&&Object.keys(t.cost.tokens).map(function(e){return i.a.createElement("div",{key:e,itemProp:"token"},i.a.createElement("div",{itemProp:"resource","data-value":e}),i.a.createElement("div",{itemProp:"count","data-value":t.cost.tokens[e]}))})))},se=function(e){var t=e.isCurrentPlayer,r=e.player;return i.a.createElement(ne,{className:"player ".concat(t&&"active"),itemScope:!0,itemType:"urn:x:player",itemID:String(r.id)},i.a.createElement(ae,null,i.a.createElement(q.a,{flexGrow:1,itemProp:"name"},r.name),i.a.createElement(q.a,{fontWeight:800},r.prestigePoints)),i.a.createElement(q.a,{className:"tokens",minHeight:"4em",fontSize:"40%",border:"1px ridge #ccc"},Object.keys(r.tokens).map(function(e){return r.tokens[e]>0&&i.a.createElement("div",{key:e,itemProp:"token"},i.a.createElement("div",{itemProp:"resource","data-value":e}),i.a.createElement("div",{itemProp:"count","data-value":r.tokens[e]}))})),i.a.createElement(ae,{className:"inventory",flexGrow:1,minHeight:"10em",marginTop:"1em",border:"1px ridge #ccc"},i.a.createElement(ae,{justifyContent:"space-between",flexWrap:"wrap",fontSize:"70%"},r.playedCards.map(function(e){return i.a.createElement(de,{card:e})}))))},de=function(e){var t=e.card;return i.a.createElement(q.a,{width:"3em",height:"4em",borderRadius:".5em",position:"relative",border:"1px ridge #333",margin:"0 1em",fontSize:"70%",padding:".5em"},i.a.createElement("div",{itemProp:"resource","data-value":t.resourceType}),i.a.createElement("div",{itemProp:"prestigePoints","data-value":t.prestigePoints}))},fe=Object(re.a)("h3")({writingMode:"vertical-lr",textOrientation:"upright"}),me=function(e){var t=e.isCurrentPlayer,r=e.player,n=e.onPlayReservedCard;return i.a.createElement(ae,{position:"relative",flexGrow:1,className:t&&"active"},i.a.createElement(q.a,{className:"prestigePoints",position:"absolute",top:"1rem",right:"1rem"},r.prestigePoints),i.a.createElement(fe,null,r.name),i.a.createElement(ae,null,i.a.createElement(ae,{border:"1px solid #333"},i.a.createElement(ae,{id:"playerTokens",fontSize:"160%",flexWrap:"wrap",width:"5rem"},Object.keys(r.tokens).map(function(e){return r.tokens[e]>0&&i.a.createElement("div",{key:e,itemProp:"token"},i.a.createElement("div",{itemProp:"resource","data-value":e}),i.a.createElement("div",{itemProp:"count","data-value":r.tokens[e]}))})),i.a.createElement(ae,{id:"reservedCards"},r.reservedCards.map(function(e){return i.a.createElement(ue,{key:e.id,card:e,onSelected:n})}))),i.a.createElement(ae,null,i.a.createElement(ae,{id:"playedCards"},pe(r.playedCards).map(function(e){var t=e.resourceType,r=e.cards;return i.a.createElement(q.a,{className:"cardStack ".concat(t),position:"relative",width:"9em"},r.map(function(e,t){return i.a.createElement(q.a,{position:"absolute",top:"".concat(3*t,"em"),width:"7em",paddingRight:"1em"},i.a.createElement(ue,{key:e.id,card:e,onSelected:function(){return null}}))}))})))))},pe=function(e){return e.reduce(function(e,t){var r=t.resourceType,n=e.find(function(e){return e.resourceType===r});return null==n?e.push({resourceType:r,cards:[t]}):n.cards.push(t),e},[])},ve=r(10),ye=r(50),be=r(69);function Ee(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}var ge=function(e,t){return{weight:0,checker:function(r){var n=t(r);return this.weight=n*e,this.weight>0}}},he=function(e){function t(e){return Object(d.a)(this,t),Object(m.a)(this,Object(p.a)(t).call(this,function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ee(r,!0).forEach(function(t){Object(ve.a)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ee(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}({},e,{iterations:100,playoutDepth:100,objectives:function(e,t,r){if(!r)return{};var n=G(e.players,r);return{winGame:ge(Number.POSITIVE_INFINITY,function(e){return G(e.players,r).prestigePoints>=15?1:0}),increasePrestigePoints:ge(50,function(e){return G(e.players,r).prestigePoints-n.prestigePoints})}}})))}return Object(v.a)(t,e),t}(ye.MCTSBot),ke=Object(ye.AI)({bot:he,enumerate:function(e){return[_,F,U,V].flatMap(function(t){return t.getAvailableMoves(e)})},visualize:Object(be.MCTSVisualizer)(function(e){var t=e.G,r=W(t);return null==r?null:i.a.createElement("div",{style:{transform:"scale(0.4)"}},i.a.createElement("table",null,i.a.createElement("tr",null,i.a.createElement("th",null,"Prestige"),i.a.createElement("td",null,r.prestigePoints)),i.a.createElement("tr",null,i.a.createElement("th",null,"Cards"),i.a.createElement("td",null,"P: ",r.playedCards," | R: ",r.reservedCards)),i.a.createElement("tr",null,i.a.createElement("th",null,"Tokens"),i.a.createElement("td",null,Object.keys(r.tokens).reduce(function(e,t){return e+r.tokens[t]},0)))))})}),Ce=r(39),Oe=Object(Ce.a)(function(e){var t=e.settings,r=Object(c.Client)({game:H,board:le,ai:ke,numPlayers:t.numberOfPlayers,multiplayer:t.multiplayer,debug:t.debug});return i.a.createElement(r,null)}),Pe=Object(Ce.a)(function(){return i.a.createElement(Oe,{settings:{numberOfPlayers:2,musicVolume:0,sfxVolume:0,players:[]}})});Pe.displayName="SplendidGame";var je=Pe;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(i.a.createElement(function(){return i.a.createElement(je,null)},null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},76:function(e,t,r){e.exports=r(130)},81:function(e,t,r){}},[[76,1,2]]]);
//# sourceMappingURL=main.ffb5ade1.chunk.js.map