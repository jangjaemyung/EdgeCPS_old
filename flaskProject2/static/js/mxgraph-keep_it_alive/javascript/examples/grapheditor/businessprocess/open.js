document.write('<script src = "./js/Editor.js"></script>');
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
	function processHandleFiles(files)
	{
	
		window.openFile.setDataProcess(files[0],files[1]); //순우 open
        // OpenFile.prototype.setDataProcess(files[0],files[1]);
				
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
	function procesHandleSubmit()
	{
		// var form = window.openForm || document.getElementById('openForm');

		// 현재 프로세스 가져오기
		var currentProcess = localStorage.getItem('current_process');
		var getProcessXML = localStorage.getItem('')
		if (currentProcess == 'workflowProcess'||currentProcess == 'searchReusableProcess'|| currentProcess=='workflowImplementationProcess'||currentProcess=='policyProcess'){
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