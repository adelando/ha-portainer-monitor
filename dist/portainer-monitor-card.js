/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
const STATUS_COLOR = {
    ok: "#00c853",
    warn: "#ff6d00",
    err: "#d50000",
    unknown: "#757575",
};
function containerStateToLevel(state) {
    if (!state)
        return "unknown";
    if (state === "running")
        return "ok";
    if (state === "paused" || state === "restarting")
        return "warn";
    if (state === "exited" || state === "dead" || state === "created")
        return "err";
    return "unknown";
}
function binaryToLevel(state) {
    if (!state || state === "unavailable" || state === "unknown")
        return "unknown";
    return state === "on" ? "ok" : "err";
}
function color(level) {
    return STATUS_COLOR[level];
}
function statusIcon(level) {
    if (level === "ok")
        return "mdi:check-circle";
    if (level === "warn")
        return "mdi:alert-circle";
    if (level === "err")
        return "mdi:close-circle";
    return "mdi:help-circle-outline";
}
function stateLabel(state) {
    if (!state)
        return "Unavailable";
    if (state === "unavailable" || state === "unknown")
        return "Unavailable";
    if (state === "on")
        return "Running";
    if (state === "off")
        return "Stopped";
    return state.charAt(0).toUpperCase() + state.slice(1);
}
function getState(hass, entityId) {
    var _a;
    if (!entityId)
        return undefined;
    return (_a = hass.states[entityId]) === null || _a === void 0 ? void 0 : _a.state;
}
function entityValueWithUnit(hass, entityId) {
    var _a;
    if (!entityId)
        return "—";
    const entity = hass.states[entityId];
    if (!entity || entity.state === "unavailable" || entity.state === "unknown")
        return "—";
    // formatEntityState respects the user's display_precision and unit settings
    if (typeof hass.formatEntityState === "function") {
        return hass.formatEntityState(entity);
    }
    // Fallback: respect display_precision attribute, default 2 dp
    const unit = entity.attributes.unit_of_measurement;
    const num = parseFloat(entity.state);
    if (!isNaN(num)) {
        const precision = (_a = entity.attributes.display_precision) !== null && _a !== void 0 ? _a : 2;
        return unit ? `${num.toFixed(precision)} ${unit}` : num.toFixed(precision);
    }
    return unit ? `${entity.state} ${unit}` : entity.state;
}
function cardTitle(title, cardType) {
    return title ? `${title} - ${cardType}` : cardType;
}
function findEntityInDevice(hass, deviceId, domain, suffix) {
    var _a;
    return (_a = Object.values(hass.entities).find((e) => e.platform === "portainer" &&
        e.device_id === deviceId &&
        e.entity_id.startsWith(domain + ".") &&
        e.entity_id.endsWith(suffix))) === null || _a === void 0 ? void 0 : _a.entity_id;
}
function getContainersForStack(hass, stackDeviceId) {
    const containers = [];
    const seen = new Set();
    for (const entry of Object.values(hass.entities)) {
        if (entry.platform !== "portainer")
            continue;
        if (!entry.device_id)
            continue;
        const device = hass.devices[entry.device_id];
        if (!device)
            continue;
        if (device.via_device_id !== stackDeviceId)
            continue;
        if (seen.has(entry.device_id))
            continue;
        seen.add(entry.device_id);
        containers.push({
            name: device.name_by_user || device.name,
            deviceId: entry.device_id,
            stateEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_container_state"),
            statusEntity: findEntityInDevice(hass, entry.device_id, "binary_sensor", "_status"),
            cpuEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_cpu_usage_total"),
            memEntity: findEntityInDevice(hass, entry.device_id, "sensor", "_memory_usage_percentage"),
        });
    }
    return containers;
}
function getDeviceIdFromEntity(hass, entityId) {
    var _a, _b;
    return (_b = (_a = hass.entities[entityId]) === null || _a === void 0 ? void 0 : _a.device_id) !== null && _b !== void 0 ? _b : null;
}
// ---------------------------------------------------------------------------
// Shared CSS
// ---------------------------------------------------------------------------
const SHARED_CSS = i$3 `
  :host {
    --portainer-ok: ${r$2(STATUS_COLOR.ok)};
    --portainer-warn: ${r$2(STATUS_COLOR.warn)};
    --portainer-err: ${r$2(STATUS_COLOR.err)};
    --portainer-unknown: ${r$2(STATUS_COLOR.unknown)};
  }
  ha-card {
    padding: 16px;
    background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
    color: var(--primary-text-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    position: relative;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .icon-badge {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .card-title {
    font-size: 0.85rem;
    opacity: 0.75;
    margin: 0;
  }
  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0 12px;
  }
  .status-text {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 1;
  }
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ip-label {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-left: auto;
  }
  .stats-grid {
    display: grid;
    gap: 8px 16px;
    margin-top: 4px;
  }
  .stat-col {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stat-label {
    font-size: 0.72rem;
    font-weight: 700;
    opacity: 0.55;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .stat-value {
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .controls {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  .divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 10px 0;
  }
`;
// ---------------------------------------------------------------------------
// STACK CARD
// ---------------------------------------------------------------------------
class PortainerStackCard extends i {
    constructor() {
        super(...arguments);
        this._deviceId = null;
    }
    static get properties() {
        return { hass: {}, _config: {}, _deviceId: { state: true } };
    }
    static get styles() {
        return [
            SHARED_CSS,
            i$3 `
        .stack-summary {
          display: flex;
          gap: 16px;
          margin: 0;
        }
        .container-rows {
          width: 100%;
        }
        .ctr-row {
          display: grid;
          grid-template-columns: minmax(60px, 90px) 80px 80px 1fr;
          justify-items: start;
          align-items: center;
          gap: 6px 12px;
          padding: 5px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .ctr-name {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          opacity: 0.8;
          white-space: nowrap;
        }
        .ctr-stat {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .ctr-stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          opacity: 0.45;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ctr-stat-value {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .ctr-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .ctr-status ha-icon {
          --mdc-icon-size: 16px;
        }
      `,
        ];
    }
    static getConfigElement() {
        return document.createElement("portainer-stack-card-editor");
    }
    static getStubConfig() {
        return { type: "custom:portainer-stack-card", stack_status_entity: "" };
    }
    setConfig(config) {
        if (!config.stack_status_entity)
            throw new Error("stack_status_entity is required");
        this._config = config;
    }
    updated(changed) {
        var _a;
        if (changed.has("hass") && ((_a = this._config) === null || _a === void 0 ? void 0 : _a.stack_status_entity)) {
            const id = getDeviceIdFromEntity(this.hass, this._config.stack_status_entity);
            if (id !== this._deviceId)
                this._deviceId = id;
        }
    }
    render() {
        var _a;
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const statusState = getState(this.hass, cfg.stack_status_entity);
        const level = binaryToLevel(statusState);
        const borderColor = color(level);
        const mainLabel = statusState === "on" ? "Running" : stateLabel(statusState);
        const containers = this._deviceId
            ? getContainersForStack(this.hass, this._deviceId)
            : [];
        const stackType = getState(this.hass, cfg.stack_type_entity);
        const containerCount = getState(this.hass, cfg.container_count_entity);
        const switchState = getState(this.hass, cfg.stack_switch_entity);
        const overrides = (_a = cfg.container_overrides) !== null && _a !== void 0 ? _a : {};
        const title = cardTitle(cfg.title, "Stack");
        const ip = cfg.ip_address || "";
        return b `
      <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
        <div class="header">
          <div class="header-left">
            <div class="icon-badge">
              <ha-icon icon="${cfg.icon || "mdi:layers-outline"}"></ha-icon>
            </div>
            <span class="card-title">${title}</span>
          </div>
        </div>

        <div class="status-row">
          <span class="status-text">${mainLabel}</span>
          <span class="status-dot" style="background:${borderColor};"></span>
          ${ip ? b `<span class="ip-label">${ip}</span>` : A}
        </div>

        ${containers.length > 0 || stackType || containerCount
            ? b `
              <div class="divider"></div>
              ${stackType || containerCount
                ? b `
                    <div class="stack-summary" style="margin-bottom:8px;">
                      ${containerCount
                    ? b `<span class="stat-label"
                            >${containerCount} container${Number(containerCount) !== 1 ? "s" : ""}</span
                          >`
                    : A}
                      ${stackType
                    ? b `<span class="stat-label">${stackType}</span>`
                    : A}
                    </div>
                  `
                : A}
              <div class="container-rows">
                ${containers.map((c) => {
                var _a;
                const cStatus = getState(this.hass, c.statusEntity);
                const cState = getState(this.hass, c.stateEntity);
                const cCpu = getState(this.hass, c.cpuEntity);
                const cMem = getState(this.hass, c.memEntity);
                const cLevel = c.statusEntity
                    ? binaryToLevel(cStatus)
                    : containerStateToLevel(cState);
                const cColor = color(cLevel);
                const cLabel = c.statusEntity
                    ? cStatus === "on"
                        ? "Running"
                        : stateLabel(cStatus)
                    : stateLabel(cState);
                const override = overrides[c.deviceId];
                const displayName = (override === null || override === void 0 ? void 0 : override.label) || ((_a = c.name) === null || _a === void 0 ? void 0 : _a.split("-").pop()) || c.name;
                return b `
                    <div class="ctr-row">
                      <span class="ctr-name">${displayName}</span>
                      ${cCpu !== undefined
                    ? b `
                            <div class="ctr-stat">
                              <span class="ctr-stat-label">CPU</span>
                              <span class="ctr-stat-value">${parseFloat(cCpu).toFixed(2)}%</span>
                            </div>
                          `
                    : b `<div></div>`}
                      ${cMem !== undefined
                    ? b `
                            <div class="ctr-stat">
                              <span class="ctr-stat-label">MEM</span>
                              <span class="ctr-stat-value">${parseFloat(cMem).toFixed(1)}%</span>
                            </div>
                          `
                    : b `<div></div>`}
                      <div class="ctr-status" style="color:${cColor};">
                        <ha-icon icon="${statusIcon(cLevel)}"></ha-icon>
                        ${cLabel}
                      </div>
                    </div>
                  `;
            })}
              </div>
            `
            : A}

        ${cfg.show_controls && cfg.stack_switch_entity
            ? b `
              <div class="controls">
                <ha-button
                  @click=${() => {
                const svc = switchState === "on" ? "turn_off" : "turn_on";
                this.hass.callService("switch", svc, {
                    entity_id: cfg.stack_switch_entity,
                });
            }}
                >
                  ${switchState === "on" ? "Stop Stack" : "Start Stack"}
                </ha-button>
              </div>
            `
            : A}
      </ha-card>
    `;
    }
}
customElements.define("portainer-stack-card", PortainerStackCard);
// ---------------------------------------------------------------------------
// CONTAINER CARD
// ---------------------------------------------------------------------------
class PortainerContainerCard extends i {
    static get properties() {
        return { hass: {}, _config: {} };
    }
    static get styles() {
        return [
            SHARED_CSS,
            i$3 `
        .mem-bar-bg {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.12);
          overflow: hidden;
          margin-top: 4px;
        }
        .mem-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .stats-grid {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
      `,
        ];
    }
    static getConfigElement() {
        return document.createElement("portainer-container-card-editor");
    }
    static getStubConfig() {
        return { type: "custom:portainer-container-card", status_entity: "" };
    }
    setConfig(config) {
        if (!config.status_entity)
            throw new Error("status_entity is required");
        this._config = config;
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const statusState = getState(this.hass, cfg.status_entity);
        const containerState = getState(this.hass, cfg.state_entity);
        const level = binaryToLevel(statusState);
        const borderColor = color(level);
        const label = statusState === "on" ? "Running" : stateLabel(statusState);
        const cpu = getState(this.hass, cfg.cpu_entity);
        const mem = getState(this.hass, cfg.memory_entity);
        const switchState = getState(this.hass, cfg.container_switch_entity);
        const ip = cfg.ip_address || "";
        const title = cardTitle(cfg.title, "Container");
        const memPct = mem !== undefined ? Math.min(parseFloat(mem), 100) : 0;
        const memColor = memPct > 85 ? STATUS_COLOR.err : memPct > 70 ? STATUS_COLOR.warn : STATUS_COLOR.ok;
        return b `
      <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
        <div class="header">
          <div class="header-left">
            <div class="icon-badge">
              <ha-icon icon="${cfg.icon || "mdi:docker"}"></ha-icon>
            </div>
            <span class="card-title">${title}</span>
          </div>
        </div>

        <div class="status-row">
          <span class="status-text">${label}</span>
          <span class="status-dot" style="background:${borderColor};"></span>
          ${ip ? b `<span class="ip-label">${ip}</span>` : A}
        </div>

        <div class="divider"></div>
        <div class="stats-grid">
          ${cpu !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">CPU Usage</div>
                  <div class="stat-value">${parseFloat(cpu).toFixed(2)}%</div>
                </div>
              `
            : A}
          ${mem !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">Memory</div>
                  <div class="stat-value">${parseFloat(mem).toFixed(1)}%</div>
                  <div class="mem-bar-bg">
                    <div
                      class="mem-bar-fill"
                      style="width:${memPct}%;background:${memColor};"
                    ></div>
                  </div>
                </div>
              `
            : A}
        </div>

        <div class="controls">
          ${cfg.container_switch_entity
            ? b `
                <ha-button
                  @click=${() => {
                const svc = switchState === "on" ? "turn_off" : "turn_on";
                this.hass.callService("switch", svc, {
                    entity_id: cfg.container_switch_entity,
                });
            }}
                >
                  ${switchState === "on" ? "Stop" : "Start"}
                </ha-button>
              `
            : A}
          ${cfg.restart_button_entity
            ? b `
                <ha-button
                  @click=${() => {
                this.hass.callService("button", "press", {
                    entity_id: cfg.restart_button_entity,
                });
            }}
                  >Restart</ha-button
                >
              `
            : A}
          ${statusState === "on" && cfg.pause_button_entity
            ? b `
                <ha-button
                  @click=${() => {
                this.hass.callService("button", "press", {
                    entity_id: cfg.pause_button_entity,
                });
            }}
                  >Pause</ha-button
                >
              `
            : A}
          ${containerState === "paused" && cfg.resume_button_entity
            ? b `
                <ha-button
                  @click=${() => {
                this.hass.callService("button", "press", {
                    entity_id: cfg.resume_button_entity,
                });
            }}
                  >Resume</ha-button
                >
              `
            : A}
        </div>
      </ha-card>
    `;
    }
}
customElements.define("portainer-container-card", PortainerContainerCard);
// ---------------------------------------------------------------------------
// ENDPOINT CARD
// ---------------------------------------------------------------------------
class PortainerEndpointCard extends i {
    static get properties() {
        return { hass: {}, _config: {} };
    }
    static get styles() {
        return [
            SHARED_CSS,
            i$3 `
        .stats-grid {
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        }
        .disk-section {
          margin-top: 10px;
        }
        .disk-title {
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0.55;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .disk-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      `,
        ];
    }
    static getConfigElement() {
        return document.createElement("portainer-endpoint-card-editor");
    }
    static getStubConfig() {
        return { type: "custom:portainer-endpoint-card", status_entity: "" };
    }
    setConfig(config) {
        if (!config.status_entity)
            throw new Error("status_entity is required");
        this._config = config;
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const statusState = getState(this.hass, cfg.status_entity);
        const level = binaryToLevel(statusState);
        const borderColor = color(level);
        const label = statusState === "on" ? "Online" : stateLabel(statusState);
        const ip = cfg.ip_address || "";
        const title = cardTitle(cfg.title, "Endpoint");
        const totalContainers = getState(this.hass, cfg.containers_count_entity);
        const running = getState(this.hass, cfg.containers_running_entity);
        const stopped = getState(this.hass, cfg.containers_stopped_entity);
        const dockerVersion = getState(this.hass, cfg.docker_version_entity);
        const os = getState(this.hass, cfg.os_entity);
        const cpuTotal = getState(this.hass, cfg.cpu_total_entity);
        const imgTotal = entityValueWithUnit(this.hass, cfg.image_disk_total_entity);
        const imgReclaimable = entityValueWithUnit(this.hass, cfg.image_disk_reclaimable_entity);
        const ctrDiskTotal = entityValueWithUnit(this.hass, cfg.container_disk_total_entity);
        const memTotal = entityValueWithUnit(this.hass, cfg.memory_total_entity);
        const hasDisk = cfg.image_disk_total_entity ||
            cfg.image_disk_reclaimable_entity ||
            cfg.container_disk_total_entity;
        return b `
      <ha-card style="box-shadow: inset 0 0 0 2px ${borderColor};">
        <div class="header">
          <div class="header-left">
            <div class="icon-badge">
              <ha-icon icon="${cfg.icon || "mdi:server"}"></ha-icon>
            </div>
            <span class="card-title">${title}</span>
          </div>
        </div>

        <div class="status-row">
          <span class="status-text">${label}</span>
          <span class="status-dot" style="background:${borderColor};"></span>
          ${ip ? b `<span class="ip-label">${ip}</span>` : A}
        </div>

        <div class="divider"></div>
        <div class="stats-grid">
          ${totalContainers !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">Containers</div>
                  <div class="stat-value">${totalContainers}</div>
                </div>
              `
            : A}
          ${running !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">Running</div>
                  <div class="stat-value" style="color:${STATUS_COLOR.ok};">${running}</div>
                </div>
              `
            : A}
          ${stopped !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">Stopped</div>
                  <div
                    class="stat-value"
                    style="color:${Number(stopped) > 0 ? STATUS_COLOR.err : "inherit"};"
                  >
                    ${stopped}
                  </div>
                </div>
              `
            : A}
          ${dockerVersion !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">Docker</div>
                  <div class="stat-value">${dockerVersion}</div>
                </div>
              `
            : A}
          ${os !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">OS</div>
                  <div class="stat-value">${os}</div>
                </div>
              `
            : A}
          ${cfg.memory_total_entity
            ? b `
                <div class="stat-col">
                  <div class="stat-label">RAM</div>
                  <div class="stat-value">${memTotal}</div>
                </div>
              `
            : A}
          ${cpuTotal !== undefined
            ? b `
                <div class="stat-col">
                  <div class="stat-label">CPUs</div>
                  <div class="stat-value">${cpuTotal}</div>
                </div>
              `
            : A}
        </div>

        ${hasDisk
            ? b `
              <div class="disk-section">
                <div class="divider"></div>
                <div class="disk-title">Disk Usage</div>
                <div class="disk-row">
                  ${cfg.image_disk_total_entity
                ? b `
                        <div class="stat-col">
                          <div class="stat-label">Images</div>
                          <div class="stat-value">
                            ${imgTotal}${cfg.image_disk_reclaimable_entity && imgReclaimable !== "—"
                    ? ` (${imgReclaimable} reclaimable)`
                    : ""}
                          </div>
                        </div>
                      `
                : A}
                  ${cfg.container_disk_total_entity
                ? b `
                        <div class="stat-col">
                          <div class="stat-label">Containers</div>
                          <div class="stat-value">${ctrDiskTotal}</div>
                        </div>
                      `
                : A}
                </div>
              </div>
            `
            : A}

        ${cfg.prune_images_button_entity
            ? b `
              <div class="controls">
                <ha-button
                  @click=${() => {
                this.hass.callService("button", "press", {
                    entity_id: cfg.prune_images_button_entity,
                });
            }}
                  >Prune Images</ha-button
                >
              </div>
            `
            : A}
      </ha-card>
    `;
    }
}
customElements.define("portainer-endpoint-card", PortainerEndpointCard);
// ---------------------------------------------------------------------------
// EDITORS
// ---------------------------------------------------------------------------
const EDITOR_CSS = i$3 `
  .editor-row {
    margin-bottom: 12px;
  }
  .editor-label {
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0.7;
    margin-bottom: 4px;
    display: block;
  }
  .editor-section {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.4;
    margin: 16px 0 8px;
  }
  .editor-sub {
    font-size: 0.78rem;
    font-weight: 600;
    opacity: 0.55;
    margin: 10px 0 6px;
  }
`;
function portainerDomainFilter(hass, domain) {
    return (entity) => {
        var _a;
        return entity.entity_id.startsWith(domain + ".") &&
            ((_a = hass.entities[entity.entity_id]) === null || _a === void 0 ? void 0 : _a.platform) === "portainer";
    };
}
// --- Stack Editor ---
class PortainerStackCardEditor extends i {
    constructor() {
        super(...arguments);
        this._deviceId = null;
    }
    static get properties() {
        return { hass: {}, _config: {}, _deviceId: { state: true } };
    }
    static get styles() {
        return EDITOR_CSS;
    }
    setConfig(config) {
        this._config = config;
    }
    updated(changed) {
        var _a;
        if ((changed.has("hass") || changed.has("_config")) && ((_a = this._config) === null || _a === void 0 ? void 0 : _a.stack_status_entity)) {
            const id = getDeviceIdFromEntity(this.hass, this._config.stack_status_entity);
            if (id !== this._deviceId)
                this._deviceId = id;
        }
    }
    _valueChanged(field, value) {
        const config = { ...this._config, [field]: value };
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    }
    _entityChanged(field) {
        return (ev) => this._valueChanged(field, ev.detail.value);
    }
    _inputChanged(field) {
        return (ev) => this._valueChanged(field, ev.target.value);
    }
    _updateContainerLabel(deviceId, value) {
        var _a, _b;
        const overrides = { ...((_a = this._config.container_overrides) !== null && _a !== void 0 ? _a : {}) };
        overrides[deviceId] = { ...((_b = overrides[deviceId]) !== null && _b !== void 0 ? _b : {}), label: value };
        this._valueChanged("container_overrides", overrides);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
        const swFilter = portainerDomainFilter(this.hass, "switch");
        const snFilter = portainerDomainFilter(this.hass, "sensor");
        const discoveredContainers = this._deviceId ? getContainersForStack(this.hass, this._deviceId) : [];
        return b `
      <div class="editor-row">
        <span class="editor-label">Title (displays as "Title - Stack")</span>
        <ha-textfield
          label="Title"
          .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port (e.g. 192.168.0.4:8765)</span>
        <ha-textfield
          label="IP : Port"
          .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon</span>
        <ha-icon-picker
          .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""}
          @value-changed=${(ev) => this._valueChanged("icon", ev.detail.value)}
        ></ha-icon-picker>
      </div>

      <div class="editor-section">Entities</div>

      <div class="editor-row">
        <span class="editor-label">Stack Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_d = cfg.stack_status_entity) !== null && _d !== void 0 ? _d : ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("stack_status_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stack Switch</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_e = cfg.stack_switch_entity) !== null && _e !== void 0 ? _e : ""}
          .entityFilter=${swFilter}
          include-domains='["switch"]'
          @value-changed=${this._entityChanged("stack_switch_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stack Type Sensor</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_f = cfg.stack_type_entity) !== null && _f !== void 0 ? _f : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("stack_type_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Count Sensor</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_g = cfg.container_count_entity) !== null && _g !== void 0 ? _g : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("container_count_entity")}
        ></ha-entity-picker>
      </div>

      ${discoveredContainers.length > 0
            ? b `
            <div class="editor-section">Container Labels</div>
            <span class="editor-label" style="opacity:0.5;font-size:0.75rem;">
              Rename each auto-discovered container row. Leave blank to use the device name.
            </span>
            ${discoveredContainers.map((c) => {
                var _a, _b, _c;
                return b `
                <div class="editor-row" style="margin-top:8px;">
                  <span class="editor-sub">${c.name}</span>
                  <ha-textfield
                    label="Display label"
                    .value=${(_c = (_b = (_a = cfg.container_overrides) === null || _a === void 0 ? void 0 : _a[c.deviceId]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : ""}
                    @change=${(ev) => this._updateContainerLabel(c.deviceId, ev.target.value)}
                  ></ha-textfield>
                </div>
              `;
            })}
          `
            : A}

      <div class="editor-section">Options</div>
      <div class="editor-row">
        <ha-formfield label="Show start/stop controls">
          <ha-checkbox
            .checked=${(_h = cfg.show_controls) !== null && _h !== void 0 ? _h : false}
            @change=${(ev) => this._valueChanged("show_controls", ev.target.checked)}
          ></ha-checkbox>
        </ha-formfield>
      </div>
    `;
    }
}
customElements.define("portainer-stack-card-editor", PortainerStackCardEditor);
// --- Container Editor ---
class PortainerContainerCardEditor extends i {
    static get properties() {
        return { hass: {}, _config: {} };
    }
    static get styles() {
        return EDITOR_CSS;
    }
    setConfig(config) {
        this._config = config;
    }
    _valueChanged(field, value) {
        const config = { ...this._config, [field]: value };
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    }
    _entityChanged(field) {
        return (ev) => this._valueChanged(field, ev.detail.value);
    }
    _inputChanged(field) {
        return (ev) => this._valueChanged(field, ev.target.value);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
        const swFilter = portainerDomainFilter(this.hass, "switch");
        const snFilter = portainerDomainFilter(this.hass, "sensor");
        const btnFilter = portainerDomainFilter(this.hass, "button");
        return b `
      <div class="editor-row">
        <span class="editor-label">Title (displays as "Title - Container")</span>
        <ha-textfield
          label="Title"
          .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port</span>
        <ha-textfield
          label="IP : Port"
          .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon</span>
        <ha-icon-picker
          .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""}
          @value-changed=${(ev) => this._valueChanged("icon", ev.detail.value)}
        ></ha-icon-picker>
      </div>

      <div class="editor-section">Entities</div>

      <div class="editor-row">
        <span class="editor-label">Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_d = cfg.status_entity) !== null && _d !== void 0 ? _d : ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("status_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container State (sensor — required for Resume button)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_e = cfg.state_entity) !== null && _e !== void 0 ? _e : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("state_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">CPU Usage (sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_f = cfg.cpu_entity) !== null && _f !== void 0 ? _f : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("cpu_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Memory Usage % (sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_g = cfg.memory_entity) !== null && _g !== void 0 ? _g : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("memory_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Switch</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_h = cfg.container_switch_entity) !== null && _h !== void 0 ? _h : ""}
          .entityFilter=${swFilter}
          include-domains='["switch"]'
          @value-changed=${this._entityChanged("container_switch_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Restart Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_j = cfg.restart_button_entity) !== null && _j !== void 0 ? _j : ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("restart_button_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Pause Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_k = cfg.pause_button_entity) !== null && _k !== void 0 ? _k : ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("pause_button_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Resume Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_l = cfg.resume_button_entity) !== null && _l !== void 0 ? _l : ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("resume_button_entity")}
        ></ha-entity-picker>
      </div>
    `;
    }
}
customElements.define("portainer-container-card-editor", PortainerContainerCardEditor);
// --- Endpoint Editor ---
class PortainerEndpointCardEditor extends i {
    static get properties() {
        return { hass: {}, _config: {} };
    }
    static get styles() {
        return EDITOR_CSS;
    }
    setConfig(config) {
        this._config = config;
    }
    _valueChanged(field, value) {
        const config = { ...this._config, [field]: value };
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    }
    _entityChanged(field) {
        return (ev) => this._valueChanged(field, ev.detail.value);
    }
    _inputChanged(field) {
        return (ev) => this._valueChanged(field, ev.target.value);
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (!this.hass || !this._config)
            return b ``;
        const cfg = this._config;
        const bsFilter = portainerDomainFilter(this.hass, "binary_sensor");
        const snFilter = portainerDomainFilter(this.hass, "sensor");
        const btnFilter = portainerDomainFilter(this.hass, "button");
        return b `
      <div class="editor-row">
        <span class="editor-label">Title (displays as "Title - Endpoint")</span>
        <ha-textfield
          label="Title"
          .value=${(_a = cfg.title) !== null && _a !== void 0 ? _a : ""}
          @change=${this._inputChanged("title")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">IP Address / Port</span>
        <ha-textfield
          label="IP : Port"
          .value=${(_b = cfg.ip_address) !== null && _b !== void 0 ? _b : ""}
          @change=${this._inputChanged("ip_address")}
        ></ha-textfield>
      </div>
      <div class="editor-row">
        <span class="editor-label">Icon</span>
        <ha-icon-picker
          .value=${(_c = cfg.icon) !== null && _c !== void 0 ? _c : ""}
          @value-changed=${(ev) => this._valueChanged("icon", ev.detail.value)}
        ></ha-icon-picker>
      </div>

      <div class="editor-section">Status</div>
      <div class="editor-row">
        <span class="editor-label">Endpoint Status (binary_sensor)</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_d = cfg.status_entity) !== null && _d !== void 0 ? _d : ""}
          .entityFilter=${bsFilter}
          include-domains='["binary_sensor"]'
          @value-changed=${this._entityChanged("status_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Container Counts</div>
      <div class="editor-row">
        <span class="editor-label">Total Containers</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_e = cfg.containers_count_entity) !== null && _e !== void 0 ? _e : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_count_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Running</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_f = cfg.containers_running_entity) !== null && _f !== void 0 ? _f : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_running_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Stopped</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_g = cfg.containers_stopped_entity) !== null && _g !== void 0 ? _g : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("containers_stopped_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">System Info</div>
      <div class="editor-row">
        <span class="editor-label">Docker Version</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_h = cfg.docker_version_entity) !== null && _h !== void 0 ? _h : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("docker_version_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Operating System</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_j = cfg.os_entity) !== null && _j !== void 0 ? _j : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("os_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Total RAM</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_k = cfg.memory_total_entity) !== null && _k !== void 0 ? _k : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("memory_total_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">CPU Count</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_l = cfg.cpu_total_entity) !== null && _l !== void 0 ? _l : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("cpu_total_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Disk Usage</div>
      <div class="editor-row">
        <span class="editor-label">Image Disk Total</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_m = cfg.image_disk_total_entity) !== null && _m !== void 0 ? _m : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("image_disk_total_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Image Disk Reclaimable</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_o = cfg.image_disk_reclaimable_entity) !== null && _o !== void 0 ? _o : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("image_disk_reclaimable_entity")}
        ></ha-entity-picker>
      </div>
      <div class="editor-row">
        <span class="editor-label">Container Disk Total</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_p = cfg.container_disk_total_entity) !== null && _p !== void 0 ? _p : ""}
          .entityFilter=${snFilter}
          include-domains='["sensor"]'
          @value-changed=${this._entityChanged("container_disk_total_entity")}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">Actions</div>
      <div class="editor-row">
        <span class="editor-label">Prune Images Button</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${(_q = cfg.prune_images_button_entity) !== null && _q !== void 0 ? _q : ""}
          .entityFilter=${btnFilter}
          include-domains='["button"]'
          @value-changed=${this._entityChanged("prune_images_button_entity")}
        ></ha-entity-picker>
      </div>
    `;
    }
}
customElements.define("portainer-endpoint-card-editor", PortainerEndpointCardEditor);
// ---------------------------------------------------------------------------
// Register cards with HA card picker
// ---------------------------------------------------------------------------
window.customCards =
    window.customCards || [];
window.customCards.push({
    type: "portainer-stack-card",
    name: "Portainer Stack Card",
    description: "Monitor a Portainer Docker Compose / Swarm stack with auto-discovered container rows",
    preview: true,
}, {
    type: "portainer-container-card",
    name: "Portainer Container Card",
    description: "Monitor a single Portainer container with CPU, memory, and controls",
    preview: true,
}, {
    type: "portainer-endpoint-card",
    name: "Portainer Endpoint Card",
    description: "Monitor a Portainer endpoint (Docker host) with counts, disk, and system info",
    preview: true,
});
