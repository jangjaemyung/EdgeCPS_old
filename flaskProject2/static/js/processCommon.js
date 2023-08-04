let processDict = ['requirementsProcess',,'businessProcess','workflowProcess','searchReusablesProcess','workflowImplementationProcess','policyProcess','runProcess']
let processXml = ['requirementsProcessXml','businessProcessXml','workflowProcessXml','searchReusablesProcessXml','workflowImplementationProcessXml','policyProcessXml','runProcessXml']


/**
 * xml을 화면으로 불러오는 함수
 */
function uploadXML(){
		let xml = localStorage.getItem(processXml[current_process]); // 해당 프로세스의 xml을 불러온다.

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
				localStorage.setItem('current_processXml', processXml[current_process]); //현재 작업중인 프로세스 xml저장

				localStorage.setItem('current_processDict', processDict[current_process]); //현재 작업중인 프로세스 dict저장

				// 기존 프로세스 값을 불러오냐 오지 않냐
				var storedXml = localStorage.getItem('requirementsProcessXml')
				if (storedXml && storedXml !== '' && storedXml !== '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>') {
					uploadXML();
				}

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
					var targetElementRetry = document.querySelector(".geMenubar");
					if (targetElementRetry !== null) {
						targetElementRetry.appendChild(buttonContainer);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////

	// Reads files locally
	function handleFiles(files)
	{
		for (var i = 0; i < files.length; i++)
		{
			(function(file)
			{
				// Small hack to support import
				if (window.parent.openNew)
				{
					window.parent.open(window.parent.location.href);
				}

				var reader = new FileReader();
				reader.onload = function(e)
				{
					window.parent.openFile.setData(e.target.result, file.name); //순우 open
				};
				reader.onerror = function(e)
				{
					console.log(e);
				};
				reader.readAsText(file);
			})(files[i]);
		}
	};

	// Reads files locally 0727 민수
	function processHandleFiles(xml,fileName)
	{

		window.parent.openFile.setData(xml,fileName); //순우 open

	};

	// Handles form-submit by preparing to process response
	function handleSubmit()
	{
		var form = window.openForm || document.getElementById('openForm');

		// Checks for support of the File API for local file access
		// except for files where the parse is on the server
		if (window.parent.Graph.fileSupport && form.upfile.files.length > 0)
		{
			handleFiles(form.upfile.files);

			return false;
		}
		else
		{
			if (/(\.xml)$/i.test(form.upfile.value) || /(\.txt)$/i.test(form.upfile.value) ||
				/(\.mxe)$/i.test(form.upfile.value))
			{
				// Small hack to support import
				if (window.parent.openNew)
				{
					window.parent.open(window.parent.location.href);
				}

				// NOTE: File is loaded via JS injection into the iframe, which in turn sets the
				// file contents in the parent window. The new window asks its opener if any file
				// contents are available or waits for the contents to become available.
				return true;
			}
			else
			{
				window.parent.mxUtils.alert(window.parent.mxResources.get('invalidOrMissingFile'));

				return false;
			}
		}
	};

	// Handles form-submit by preparing to process response 0727 민수 xml 불러오기 생성
	function processHandleSubmit()
	{
		var form = window.openForm || document.getElementById('openForm');

		// 현재 프로세스 가져오기
		var currentProcess = localStorage.getItem('current_process');
		var getProcessXML = localStorage.getItem('')
		if (currentProcess == 'workflowProcess'||currentProcess == 'searchReusableProcess',currentProcess=='workflowImplementationProcess'||currentProcess=='policyProcess'){
			var getActivityDict = localStorage.getItem(localStorage.getItem('last_selected_activity'));
			var file = [getActivityDict,localStorage.getItem('last_selected_activity')]
			processHandleFiles(file);
		}
		else{
			var getProcessDict = localStorage.getItem(currentProcess);
			var file = [getProcessDict,currentProcess]
			processHandleFiles(file);
		}




		// return false;


	};

	// Hides this dialog
	function hideWindow(cancel)
	{
		window.parent.openFile.cancel(cancel);
	}

	function fileChanged()
	{
		var form = window.openForm || document.getElementById('openForm');
		var openButton = document.getElementById('openButton');

		if (form.upfile.value.length > 0)
		{
			openButton.removeAttribute('disabled');
		}
		else
		{
			openButton.setAttribute('disabled', 'disabled');
		}
	}

	function main()
	{
		if (window.parent.Editor.useLocalStorage)
		{
			document.body.innerHTML = '';
			var div = document.createElement('div');
			div.style.fontFamily = 'Arial';

			if (localStorage.length == 0)
			{
				window.parent.mxUtils.write(div, window.parent.mxResources.get('noFiles'));
			}
			else
			{
				var keys = [];

				for (var i = 0; i < localStorage.length; i++)
				{
					keys.push(localStorage.key(i));
				}

				// Sorts the array by filename (key)
				keys.sort(function (a, b)
				{
				    return a.toLowerCase().localeCompare(b.toLowerCase());
				});

				for (var i = 0; i < keys.length; i++)
				{
					var link = document.createElement('a');
					link.style.fontDecoration = 'none';
					link.style.fontSize = '14pt';
					var key = keys[i];
					window.parent.mxUtils.write(link, key);
					link.style.cursor = 'pointer';
					div.appendChild(link);

					var img = document.createElement('span');
					img.className = 'geSprite geSprite-delete';
					img.style.position = 'relative';
					img.style.cursor = 'pointer';
					img.style.display = 'inline-block';
					div.appendChild(img);

					window.parent.mxUtils.br(div);

					window.parent.mxEvent.addListener(img, 'click', (function(k)
					{
						return function()
						{
							if (window.parent.mxUtils.confirm(window.parent.mxResources.get('delete') + ' "' + k + '"?'))
							{
								localStorage.removeItem(k);
								window.location.reload();
							}
						};
					})(key));

					window.parent.mxEvent.addListener(link, 'click', (function(k)
					{
						return function()
						{
							try
							{
								window.parent.open(window.parent.location.href);
								window.parent.openFile.setData(localStorage.getItem(k), k);
							}
							catch (e)
							{
								window.parent.mxUtils.alert(e.message);
							}
						};
					})(key));
				}
			}

			window.parent.mxUtils.br(div);
			window.parent.mxUtils.br(div);

			var cancelBtn = window.parent.mxUtils.button(window.parent.mxResources.get('cancel'), function()
			{
				hideWindow(true);
			});
			cancelBtn.className = 'geBtn';
			div.appendChild(cancelBtn);

			document.body.appendChild(div);
		}
		else
		{
			var editLink = document.getElementById('editLink');
			var openButton = document.getElementById('openButton');
			openButton.value = window.parent.mxResources.get(window.parent.openKey || 'open');
			var cancelButton = document.getElementById('cancelButton');
			cancelButton.value = window.parent.mxResources.get('cancel');
			var supportedText = document.getElementById('openSupported');// 순우 open 다이어그램 cancel 버튼 위에 도움말?
			supportedText.innerHTML = window.parent.mxResources.get('openSupported');
			var form = window.openForm || document.getElementById('openForm');

			form.setAttribute('action', window.parent.OPEN_URL);

			// 순우 open DB에서 불러오는 경우 클릭 할 버튼 생성
			var additionalFileInput = document.createElement('input');
			additionalFileInput.setAttribute('type', 'file');
			additionalFileInput.setAttribute('name', 'additionalFile');
			additionalFileInput.setAttribute('onchange', 'additionalFileChanged()');
			form.appendChild(additionalFileInput);
		}
	};
