class MainWinClass {
	constructor(dom) {
		this.subDiv = {};
		this.showSate = true;
		this.dom = dom;
		this.bindEventByClassName("showBtn", () => { this.changeType() });
		this.bindEventByClassName("operWin", null);
		this.bindEventByClassName("aotuWC", () => { fym.operUI.openAotuWCConfUI() });
		this.bindEventByClassName("aotuFB", () => { fym.operUI.openAotuFBConfUI() });
		this.bindEventByClassName("onceKX", () => { fym.operUI.openOnceKXConfUI() });
		this.bindEventByClassName("onceFJ", () => { fym.operUI.openOnceFJConfUI() });
		this.bindEventByClassName("ZZ", () => { fym.operUI.openZZUI() });
	}
	show() {
		this.showSate = true
		this.subDiv.operWin.style.display = "block";
		this.subDiv.showBtn.innerText = "≤";
	}
	hidden() {
		this.showSate = false
		this.subDiv.operWin.style.display = "none";
		this.subDiv.showBtn.innerText = "≥";
	}
	changeType() {
		this.showSate ? this.hidden() : this.show();
	}
	bindEventByClassName(tagClassName, callBack) {
		let div = this.dom.getElementsByClassName(tagClassName)[0];
		div.onclick = callBack;
		this.subDiv[tagClassName] = div;
	}
}

class SubWinClass {
	constructor(dom) {
		this.childrenDom = document.createElement("div");
		this.childrenDom.id = "content";
		dom.innerHTML = `<div><button class="subWinClose">关闭</button></div>`;
		dom.getElementsByClassName('subWinClose')[0].addEventListener('click', e =>
			this.close()
		)
		dom.appendChild(this.childrenDom);
		this.dom = dom;
	}
	alert(obj) {
		this.childrenDom.innerHTML = obj.innerHTML;
		this.show();
	}
	close() {
		this.hidden();
	}
	show() {
		this.dom.style.display = "block";
	}
	hidden() {
		this.dom.style.display = "none";
	}
}
class InitlizationClass {
	static async initMainWin() {
		let dom = document.createElement("div");
		dom.id = 'main';
		// dom.innerHTML = await ToolsClass.uploadHtml("http://127.0.0.1:8888/index.html");
		dom.innerHTML = ToolsClass.tempGetIndexHtmlText()
		dom.style.cssText = "z-index: 99999;position: fixed;top:30%;left:8px;background-color:#67aeff;border-radius: 3px;height: 250px;display: flex;";
		document.body.appendChild(dom);
		ToolsClass.setDivMovable(dom);
		return new MainWinClass(dom);
	}
	static initSubWin() {
		let dom = document.createElement('div');
		dom.id = 'sub';
		dom.style.cssText = `z-index: 99999; background: rgb(121, 168, 169);position: absolute; width: 500px;left: 30%; top: 166px; border-radius: 5px; padding: 10px;max-height:500px;display:none`;
		document.body.appendChild(dom);
		ToolsClass.setDivMovable(dom);
		return new SubWinClass(dom);
	}
	static initOperUI() {
		let operUI = new OperUIClass();
		return operUI;
	}
}
class OperUIClass {
	createAutoWCConfUI() {
		let dom = document.createElement("div");
		dom.innerText = "外城配置（暂时没空弄）";
		return dom;
	}
	createAutoFBConfUI() {
		let dom = document.createElement("div");
		dom.innerText = "副本配置（暂时没空弄）";
		return dom;
	}
	createOnceKXConfUI() {
		let dom = document.createElement("div");
		dom.innerText = "一键开箱（正在测试...）";
		return new OnceKXConfUIClass(dom);
	}
	async createOnceFJConfUI() {
		let dom = document.createElement("div");
		dom.style.cssText = `display: flex;flex-direction: column;`;
		// dom.innerHTML =  await (ToolsClass.uploadHtml("http://127.0.0.1:8888/fj.html"));
		dom.innerHTML = ToolsClass.tempGetFjHtmlText();
		return new OnceFJConfUIClass(dom);
	}
	createZZUI() {
		let dom = document.createElement("div");
		dom.style.cssText = "width: 100%;";
		dom.innerHTML = `<div style="font-size:30px;height:50px;">嘘寒问暖，不如给打笔巨款</div><div style="display: flex;"><img style="width: 250px;display: inline;" id="zfb" src="https://51522tt.github.io/image/jfb.jpg" ><img style="width: 250px;display: inline;" id="wx" src="https://51522tt.github.io/image/wx.jpg" > `
		return dom;
	}
	openAotuWCConfUI() {
		this.autoWCConfUI = this.createAutoWCConfUI();
		fym.subWin.alert(this.autoWCConfUI);
	}
	openAotuFBConfUI() {
		this.autoFBConfUI = this.createAutoFBConfUI();
		fym.subWin.alert(this.autoFBConfUI);
	}
	openOnceKXConfUI() {
		this.onceKXConfUI = this.createOnceKXConfUI();
		// fym.subWin.alert(this.onceKXConfUI.dom);
		OnceKXHandler.kx()
	}
	async openOnceFJConfUI() {
		this.onceFJConfUI = await this.createOnceFJConfUI();
		fym.subWin.alert(this.onceFJConfUI.dom);
		await this.onceFJConfUI.select()
	}
	openZZUI() {
		this.ZZUI = this.createZZUI();
		fym.subWin.alert(this.ZZUI);
	}
}
class OnceFJConfUIClass {
	constructor(dom) {
		this.dom = dom
		this.result = null
	}
	async tips(msg) {
		document.getElementById('fjtips').innerHTML = `<span>${msg}</span>`;
	}
	render(dataDom) {
		document.getElementById('fjrender').innerHTML = ""
		document.getElementById('fjrender').appendChild(dataDom)
	}
	
	async select() {
		this.tips("正在查询...");
		let data = await OnceFJHandler.getZBItems(this.getCondition())
		this.result = data
		let dataDom = this.generateSelectDom(data)
		this.render(dataDom)
		this.tips(`查询结束:${data.length}`);
	}
	getCondition() {
		let pzobjs = document.getElementsByClassName("pzBox");
		let pzcheckVal = [];
		for (let k in pzobjs) {
			if (pzobjs[k].checked) {
				pzcheckVal.push(pzobjs[k].value);
			}
		}
		return pzcheckVal
	}
	generateSelectDom(dataList) {
		let table = document.createElement("table");
		let setup = 8;
		let tr = null;
		for (let i in dataList) {
			if (i % setup == 0) {
				tr = document.createElement("tr");
				table.appendChild(tr)
			}
			let td = document.createElement("td");
			td.innerHTML = `<img src='${dataList[i].imgUrl}'/>`;
			tr.appendChild(td)
		}
		return table
	}

	async fj() {
		let temp = []
		let pccount = 0
		for (let i in this.result) {
			if (this.result[i].fjOperr != null && this.result[i].pz < 6) {
				temp.push(this.result[i])
			} else {
				pccount++
			}
		}
		if (temp == null || temp.length == 0) {
			this.tips("没有可分解装备")
			return
		}
		this.tips(`以下装备已分解:${temp.length},已排除红色、橙色品质:${pccount}`)
		for (let i in temp) {
			await OnceFJHandler.fj(temp[i].fjParam);
		}
	}
}

class OnceFJHandler {
	static async getZBItems(condition) {
		if (condition.length == 0) {
			return [];
		}
		let data = await BKHandler.getItemsByTypeIdAndPage(3, 1)
		let temp = []
		if (condition.length != 0) {
			for (let i in data) {
				if (data[i].pz != null && condition.includes(String(data[i].pz)) && data[i].fjOperr != null) {
					temp.push(data[i])
				}
			}
		}
		return temp
	}

	static async noneUIFj(){
		let data = await OnceFJHandler.getZBItems(['0','1','2','3','4','5'])
		for (let i in data) {
			if (data[i].fjOperr != null && data[i].pz < 6) {
				await this.fj(data[i].fjParam)
			}
		}
	}
	static async getBkTypeList() {
		let text = await Api.getBkItemTextByBkTypeAndPage(0, 1)
		let bkTypeList = Resolver.bkItemText(text)
		return bkTypeList
	}

	static async fj(param) {
		let res = await Api.toFjZb(param['zbId'], param['page'], param['goodType'])
		return res
	}
}
class OnceKXConfUIClass {
	constructor(dom) {
		this.dom = dom
	}
}
class OnceKXHandler {
	static async kx() {
		while(true){
			let data = await this.getKxData()
			if(data.length == 0){
				console.log("箱子莫的了～")
				return
			}
			if(!(await this.checkZb())){
				console.log("格子已满～")
				await OnceFJHandler.noneUIFj()
			}
			await Api.kx(data[0].kcParam.bxId,data[0].kcParam.userId)
		}

	}
	static async checkZb(){
		let max = 200;
		let data = await BKHandler.getItemsByTypeIdAndPage(3, 1)
		console.log(data.length)
		if(data.length < max){
			return true
		}
		return false
	}

	static async getKxData(){
		let data = await BKHandler.getItemsByTypeIdAndPage(5, 1)
		let bxTypeReg = /(.*石宝箱|武器箱|防具箱)/
		let temp = []
		for(let i in data){
			if(data[i].name.match(bxTypeReg) != null && data[i].pz <= 5){
				temp.push(data[i])
			}
		}
		return temp
	}


}
class BKHandler {
	static async getItemsByTypeIdAndPage(typeId, page) {
		let text = await Api.getBkItemTextByBkTypeAndPage(typeId, page)
		let pageObj = Resolver.bkTypePageTexst(text)
		var bkItemDataList = []
		for (let i = 1; i <= pageObj.pageCount; i++) {
			let res = await Api.getBkItemTextByBkTypeAndPage(typeId, i);
			let bkItemTextList = Resolver.bkTypeToZbItemText(res);
			for (let j in bkItemTextList) {
				bkItemDataList.push(Resolver.zbItemDataText(bkItemTextList[j]))
			}
		}
		return bkItemDataList
	}
}

class Resolver {
	static bkTypeToZbItemText(text) {
		const reg1 = /<img src="http:\/\/static\.tc2\.9wee\.com\/.*?\/>/g
		return text.match(reg1)
	}
	static bkTypePageTexst(text) {
		const pageReg = /<span class="page_on">[0-9]*\/[0-9]*<\/span>/
		let a = text.match(pageReg)
		const pageNumReg = /[0-9]*\/[0-9]*/
		let b = a[0].match(pageNumReg)
		let page = b[0].split('/')
		return {
			currentPage: page[0],
			pageCount: page[1]
		}
	}
	static bkItemText(text) {
		let bkTypeReg = /index\.php\?.*<\/li>/g
		var a = text.match(bkTypeReg)
		var temp = []
		for (let i in a) {
			let b = a[i].split("','_my_depot_');\">")
			temp.push({
				uri: b[0],
				title: b[1].split('</a></li>')[0]
			})
		}
		return temp
	}
	static zbItemDataText(text) {
		const reg1 = /itemClass\.tip\(\[.*?\]\)/
		const reg2 = /prop\.im\(\[.*?\]\)/
		let a1 = text.match(reg1)
		let a2 = text.match(reg2)
		var t = a1 != null ? eval(a1[0]) : eval(a2[0]);
		const pzReg = /props_name zb_color[0-9]/
		const nameReg = /props_name zb.*?<\/div>/
		const nameReg1 = />.*?</
		const desReg = /items_des.*?<\/div>/
		const fjOperReg = /itemClass\.doDecomposeItem\(.*?\)/
		const fjParamReg = /[0-9]*,.*,.[0-9]*/
		const kxOperReg = /prop\.use_prop\(.*?\)/
		const kxParamReg = /[0-9]*,.*,.*,.[0-9]*/
		const imgReg = /http:\/\/.*gif/
		let pzr = t.match(pzReg)
		let namer = t.match(nameReg)
		let desr = t.match(desReg)
		let imgr = text.match(imgReg)
		let fjOperrr = text.match(fjOperReg)
		let kxOperr = text.match(kxOperReg)
		let pz = pzr != null ? pzr[0].split('props_name zb_color')[1] : null;
		let name = namer != null ? namer[0] : null;
		let des = desr != null ? desr[0] : null;
		let img = imgr != null ? imgr[0] : null;
		let fjOperr = fjOperrr != null ? fjOperrr[0] : null;
		let kxOper = kxOperr != null ? kxOperr[0] : null;
		let fjParam = null;
		let kxParam = null;
		let name1r = name != null?name.match(nameReg1):null;
		name = name1r != null ? name1r[0].substring(1, name1r[0].length - 1) : null
		if (fjOperr != null) {
			let fjParamStr = fjOperr.match(fjParamReg)[0];
			let fjParams = fjParamStr.split(',');
			fjParam = {
				zbId: fjParams[0].trim(),
				page: fjParams[1].trim(),
				goodType: fjParams[2].trim()
			};
		}
		if (kxOper != null) {
			let kxParamStr = kxOper.match(kxParamReg)[0];
			let kxParams = kxParamStr.split(',');
			kxParam = {
				bxId: kxParams[0].trim(),
				userId: kxParams[2].trim()
			};
		}
		return {
			"name": name,
			"pz": pz,
			"fjParam": fjParam,
			"imgUrl": img,
			"des": des,
			"fjOperr": fjOperr,
			"kxOper": kxOper,
			"kcParam":kxParam,
		};
	}
}
class Api {
	static baseURL = "http://wh35.tc2.9wee.com"
	static async getBkItemTextByBkTypeAndPage(bkType, page) {
		let url = `${this.baseURL}/index.php?mod=depot/depot&op=show&func=my_depot&page=${page}&goods_type=${bkType}&r=0.7008728766759771`
		const req = await fetch(url, {
			mode: "cors",
			method: "GET"
		})
		let res = await req.text()
		return res
	}
	static async toFjZb(zhId, page, goodType) {
		let url = 'http://wh35.tc2.9wee.com/index.php?mod=item/item&op=do&func=decompose_item&r=0.6903758802079241'
		const formData = new FormData();
		formData.append("item_hero_id", zhId)
		formData.append("page", page)
		formData.append("good_type", goodType)
		const req = await fetch(
			url, {
			method: "POST",
			body: formData
		})

		let res = await req.text()
		return res
	}
	static async kx(bxId, userId) {
		let url = `${this.baseURL}?mod=prop/prop&op=do&func=use_prop&p_type=7&prop_id=${bxId}&user_prop_id=${userId}&from=1&call_back=shop.reflash_res_depot(0,1)&r=0.24676192561983523`
		const req = await fetch(
			url, {
			method: "GET"
		})
		let res = await req.text()
		return res
	}
}
class ToolsClass {
	static async uploadHtml(url) {
		let req = await fetch(
			url, {
			method: "GET"
		});
		let res = await req.text();
		return res;
	}
	static tempGetIndexHtmlText() {
		return `
		<span class="operWin" style="padding: 1px;">
    <div><button class="aotuWC" style="width: 100px;">自动外城</button></div>
    <div><button class="aotuFB" style="width: 100px;">自动副本</button></div>
    <div><button class="onceKX" style="width: 100px;">一键开箱</button></div>
    <div><button class="onceFJ" style="width: 100px;">一键分解</button> </div>
    <div> <button class="ZZ" style="font-size:10px">点击这里，有惊喜</button></div>
    <div>
        <span>作者简介:</span>
        <br>
        <div style="font-size: 50px;text-align: center;margin-top:20px">
            帅
        </div>
        <br>
        <br>
        <span>只此一字,贯穿一生</span>
    </div>
    <div style="margin-bottom: 2px;">version:v0.2.0-简陋dev版</div>
</span>
<div class="showBtn" style="cursor: pointer;height: 100%;background-color: #f7882e;border-radius: 0 3px 3px 0;">≤</div>
		`
	}
	static tempGetFjHtmlText() {
		return `<div style="">
		<div style="display:flex">
			<span style="color: #bebebe;"><input name="灰色" class="pzBox" type="checkbox" checked value="1" />灰色</span>&nbsp;&nbsp;
			<span style="color: #ffffff;"><input name="白色" class="pzBox" type="checkbox" checked value="2" />白色</span>&nbsp;&nbsp;
			<span style="color: #3be643;"><input name="绿色" class="pzBox" type="checkbox" checked value="3" />绿色</span>&nbsp;&nbsp;
			<span style="color: #3489f8;"><input name="蓝色" class="pzBox" type="checkbox" checked value="4" />蓝色</span>&nbsp;&nbsp;
			<span style="color: #9f22f1;"><input name="紫色" class="pzBox" type="checkbox" checked value="5" />紫色</span>&nbsp;&nbsp;
			<span style="color: #ee0909;"><input name="红色" class="pzBox" type="checkbox"  value="6" />红色</span>&nbsp;&nbsp;
			<span style="color: #f7882e;"><input name="橙色" class="pzBox" type="checkbox"  value="7" />橙色</span>
		</div>
	</div>
	<div>
		<button class="select" onclick="fym.operUI.onceFJConfUI.select()">查询装备</button>
		<button id="fj" onclick="fym.operUI.onceFJConfUI.fj()">一键分解</button>
	</div>
	<div style='color:red'>注：分解装备是对“查询装备”结果分解，一键分解会排除红色、橙色品质！！！</div>
	<div id="fjtips" class="fjtips" style="color:#04f100"></div>
	<div
		style="border: 1px solid rgb(192, 192, 192);margin-top: 5px;margin-bottom:5px;overflow: hidden;height: 300px;overflow-y:scroll">
		<div id="fjrender" class="fjrender"></div>
	</div>`
	}
	static setDivMovable(div) {
		var x, y;
		div.onmousedown = (e) => {
			var e = e || window.event;
			x = e.clientX - div.offsetLeft;
			y = e.clientY - div.offsetTop;
			document.onmousemove = (e) => {
				var e = e || window.event;
				var moveX = e.clientX - x;
				var moveY = e.clientY - y;
				var maxX = document.documentElement.clientWidth - div.offsetWidth;
				var maxY = document.documentElement.clientHeight - div.offsetHeight;
				moveX = Math.min(maxX, Math.max(0, moveX));
				moveY = Math.min(maxY, Math.max(0, moveY));
				div.style.left = `${moveX}px`;
				div.style.top = `${moveY}px`;
			};
		};
		div.onmouseup = e => {
			document.onmousemove = null;
		}

	}
}
class FymClass {
	constructor() {
		this.mainWin = InitlizationClass.initMainWin();
		this.subWin = InitlizationClass.initSubWin();
		this.operUI = InitlizationClass.initOperUI();
	}
}
// var fym = null;
// window.onload = () => {
// 	fym = fym || new FymClass();
// }
var fym = fym || new FymClass()

