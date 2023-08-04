let processDict = ['overviewProcess','requirementsProcess',,'businessProcess','workflowProcess','searchReusablesProcess','workflowImplementationProcess','policyProcess','runProcess']
let processXml = ['overviewProcessXML','requirementsProcessXml','businessProcessXml','workflowProcessXml','searchReusablesProcessXml','workflowImplementationProcessXml','policyProcessXml','runProcessXml']


/**
 * xml을 화면으로 불러오는 함수
 */
function uploadXML(){
	let xml = localStorage.getItem(processXml[current_process]); // 해당 프로세스의 xml을 불러온다.
	if (processXml[current_process] == 'businessProcess'){
		let reqXml = localStorage.getItem('requirementsProcessXml');
		let businessXml = localStorage.getItem(processXml[current_process]);
	}



	let doc = mxUtils.parseXml(xml);
	let codec = new mxCodec(doc);

	if (universalGraph && universalGraph !== '') {
		codec.decode(doc.documentElement, universalGraph.getModel());
		let elt = doc.documentElement.firstChild;
		let cells = [];
		while (elt != null)
		{
			let cell = codec.decode(elt)
			if(cell != undefined){
				if(cell.id != undefined && cell.parent != undefined && (cell.id == cell.parent)){
					elt = elt.nextSibling;
					continue;
				}
				cells.push(cell);
			}
			elt = elt.nextSibling;
		}
		universalGraph.addCells(cells);
	}

}

/**
 * 민수 메뉴바에 버튼 추가 하는 방식 다른 자바스크립트 로드 속도 때문에 시간차가 필요하다
 */
document.addEventListener("DOMContentLoaded", function() {
	let nowPorcess = localStorage.getItem(processDict[current_process]) // 현재 프로세스 확인

	localStorage.setItem('current_processXml', processXml[current_process]); //현재 작업중인 프로세스 xml저장
	localStorage.setItem('current_processDict', processDict[current_process]); //현재 작업중인 프로세스 dict저장



	// 민수 process 버튼 생성 메뉴 버튼 생성 함수
	function createButton(text, clickFunc) {
		var button = document.createElement("button");
		button.innerHTML = text;
		button.className = "process-button";
		button.addEventListener("click", clickFunc); // 버튼 클릭 이벤트 리스너 추가
		return button;
	}
	function processLoadClick() {
		uploadXML();
	}

	function processSaveClick() {

	}

	// 버튼을 감싸는 div
	var buttonContainer = document.createElement("div");
	buttonContainer.style.float = "right"; // 오른쪽으로 정렬
	buttonContainer.style.marginRight = "10px"; // 오른쪽 여백
	buttonContainer.appendChild(createButton("process-save", processSaveClick)); // process-save 버튼
	buttonContainer.appendChild(createButton("process-load", processLoadClick)); // process-load 버튼

	// 버튼을 추가할 위치의 요소를 선택 (여기서는 "right_sidebar" 클래스를 가진 div)
	var targetElement = document.querySelector(".geMenubar");

	// targetElement가 null일 경우 예외 처리
	if (targetElement !== null) {
		targetElement.appendChild(buttonContainer);
	} else {
		// 일정 시간(예: 0.5초) 이후에 다시 시도
		setTimeout(function() {

			let targetElementRetry = document.querySelector(".geMenubar");// save, load 버튼 생성
			if (targetElementRetry !== null) {
				targetElementRetry.appendChild(buttonContainer);
			}

			let workflowSelectList = []
			if (nowPorcess == 'workflowProcess'){
				workflowSelectList =  getWorkflowObjList(localStorage.getItem(processXml[2]))	// workflow process 일때 Activity 개수 만큼 select box 생성
				createWorkflowSelectBox(workflowSelectList)
			}else {
				// 기존 프로세스 값을 불러오냐 오지 않냐
				let storedXml = localStorage.getItem(processXml[current_process]);
				if (!storedXml || storedXml == '' || storedXml == '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>') {
					console.log('no xml value')
				}else {
					uploadXML();
				}

			}


		}, 250);
	}



});


/**
 * 페이지 이동시 xml, flowdict 저장 하는 함수
 */
function getLatestXml(flowDict,strXml){
	localStorage.setItem(localStorage.getItem('current_processXml'),strXml) // xml 저장
	localStorage.setItem(localStorage.getItem('current_processDict'),flowDict) // dict 저장
}

/**
 * 클래스들의 마지막 숫자를 가져와서 +1을 해준다. flowdict의 중복된 키를 방지하기 위해
 */
function getLastIndexOfShape(shapeName){ //민수 마지막숫자를 가져와서 거기에서 +1 추가하는 방식
	lastIndex = 0
	var number = 0
	var ele = document.getElementsByClassName(shapeName);
	for (let index = 0; index < ele.length; index++) {

		const regex = /[^0-9]/g;
		const result = ele[index].className.baseVal.replace(regex, "");
		const number = parseInt(result);

		if (lastIndex == 0 || lastIndex < number ){
			lastIndex = number
		}

	}

	return lastIndex +1;
};


/**
 * 생성된 다이어그램의 Class Name 생성 기능 카멜 표기법으로 클래스 이름을 생성 해준다.
 */
function convertToCamelCase(input) { // 단어를 클래스로 변경하기 위한 함수 민수
	var keyword = "DiShape";
	var keywordIndex = input.indexOf(keyword);

	if (keywordIndex !== -1) {
		var remainingText = input.slice(keywordIndex + keyword.length).trim();

	}
	var words = remainingText.split(' ');
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (word !== '') {
		words[i] = word.charAt(0).toUpperCase() + word.slice(1);
		}
	}

	return 'Di'+ words.join('');
	}


/**
 *  생성된 오브젝트의 edit의 값을 가져오는 기능
 *
 */
function getObjectPropertyValue(input,id, mxObjId) {
	let htmlTag = input.outerHTML;

	let tempElement = document.createElement('div');
	tempElement.innerHTML = htmlTag;

	let attributes = tempElement.firstChild.attributes;

	let desiredAttributes = [];
	for (let i = 0; i < attributes.length; i++) {
	let attribute = attributes[i];
	if (attribute.name !== 'label') {
		desiredAttributes.push(attribute.name + '="' + attribute.value + '"');
	}
	}
	objValueDict[id +'_'+ mxObjId] = desiredAttributes
	// console.log(desiredAttributes); // 민수 edit property값 출력
	// console.log(objValueDict)
	// return desiredAttributes
}

/**
 *  id , mxobj 로 받을 수 있는지 확인
 *  화살표가 가르키는 곳?
  */
function getWorkflowElement(input, start, end) {
	flowDict[input] = [start, end];
	// console.log(input, start, end)
}

/**
 *  도커 검색하는 기능
 */
var imagename  = {'imagename':'yolov5'}

		function send_data(){
			fetch('/search?keyword=yolov5', { //
				method:'GET',
				mode:'cors',
				headers:{
					'Content-TYPE':'application/json',

				},
				// body: JSON.stringify(imagename),
			})
			.then(function(response){return response.json();})
			.then(function(data){
				console.log(data);
				// if (data.req =='1'){get_pod_data();}
				// if (data.req == '0') { console.log("no data list"); }
			})
		}

function getWorkflowObjList(xml){
	var xmlString = xml;

	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xmlString, "text/xml");

	var roundedObjects = [];

	var mxCells = xmlDoc.getElementsByTagName("mxCell");
	for (var i = 0; i < mxCells.length; i++) {
	  var mxCell = mxCells[i];
	  var style = mxCell.getAttribute("style");
	  if (style && style.includes("rounded=1;")) {
		var id = mxCell.getAttribute("id");
		var value = mxCell.getAttribute("value");
		roundedObjects.push({ id: id, value: value });
	  }
	}

	return roundedObjects

}


function createWorkflowSelectBox(activityCatList){
	let data = activityCatList;
	var selectBox = document.createElement("select");
	selectBox.className = "select-box";

	for (var i = 0; i < data.length; i++) {
		var option = document.createElement("option");
		option.value = data[i].id;
		option.text = data[i].value;
		selectBox.appendChild(option);
	}

	var geMenubar = document.querySelector(".geToolbarContainer");
	geMenubar.style.display = "flex";
	geMenubar.style.justifyContent = "flex-end";
	geMenubar.appendChild(selectBox);

	selectBox.addEventListener("change", function() {
		var selectedValue = selectBox.value;
	});
};
